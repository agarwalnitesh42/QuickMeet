const { db } = require("../util/admin");
const {
    SUCCESS_MESSAGES,
    FAILED_MESSAGES,
    ERROR_MESSAGES 
} = require("../messages/messages");

// Function to schedule a meeting
exports.scheduleMeeting = async (duration, subject, purpose, participants, startTime) => {
    try {
        // Check if the meeting is valid
        if (!duration || !subject || !participants || !startTime) {
            return { message: ERROR_MESSAGES.invalidMeetingData };
        }
    
        // Check if the participants are available
        const availableParticipants = await getAvailableParticipants(participants);
    
        // If there are no available participants, return an error
        if (!availableParticipants.length) {
            return { message: FAILED_MESSAGES.NO_AVAILABLE_PARTICIPANTS };
        }
    
        // Check if the meeting is already scheduled for the given time slot
        const existingMeeting = await db.collection('meetings').where('start_time', '==', startTime).where('participants', '==', availableParticipants).get();
        if (!existingMeeting.empty) {
            return { message: FAILED_MESSAGES.MEETING_ALREADY_SCHEDULED };
        }
    
        // Create a new meeting
        const meeting = {
            duration,
            subject,
            purpose,
            participants: availableParticipants,
            start_time: startTime,
        };
    
        // Save the meeting to Firestore
        var newDocRef = db.collection("meetings").doc();
        await newDocRef.set({...meeting, meetingId: newDocRef.id});
    
        // Generate a unique click event ID for each participant
        const clickEventIds = availableParticipants.map((participant) => generateClickEventId(participant));
    
        // Send a WhatsApp message to each participant with a confirmation button
        const confirmationMessages = availableParticipants.map((participant, index) => {
        return `Hi ${participant},
    
    You have been invited to a meeting with ${meeting.subject} on ${meeting.start_time}. Please confirm your attendance by clicking on the following link:
    
    [CONFIRMATION_LINK]
    
    If you are unable to attend, please reply to this message and let us know.
    
    Thanks,
    The QuickMeet Team`;
        });
    
        await Promise.all(confirmationMessages.map((message, index) => sendWhatsAppMessage(availableParticipants[index], message, [
            {
                id: clickEventIds[index],
                title: 'Confirm',
            },
            {
                id: 'decline',
                title: 'Decline',
            },
        ], [], 'interactive')));
    
        // Respond with the meeting details
    } catch (error) {
        // Handle errors and return an appropriate response
        console.error(error);
        return ERROR_MESSAGES.errorSchedulingMeeting;
    }
    return { meeting };
  }
  
// Function to get available participants
exports.getAvailableParticipants = async (participants) => {
    const availableParticipants = [];
    for (const participant of participants) {
      const meeting = await db.collection('meetings').where('participants', 'array-contains', participant).where('start_time', '>', new Date().toISOString()).get();
      if (meeting.empty) {
        availableParticipants.push(participant);
      }
    }
    return availableParticipants;
}
  
// Function to edit a scheduled meeting
exports.editMeeting = async (userId, meetingId, newDuration, newSubject, newStartTime) => {
    try {
      // Check if the meeting can be edited (e.g., not started yet)
      const meetingRef = db.collection('meetings').doc(meetingId);
      const meetingDoc = await meetingRef.get();
  
      if (!meetingDoc.exists) {
        return FAILED_MESSAGES.MEETING_NOT_FOUND;
      }
  
      const meetingData = meetingDoc.data();
  
      // Check if the meeting has already started (you may use a threshold like 15 minutes)
      const meetingStartTime = new Date(meetingData.start_time);
      const currentTime = new Date();
  
      if (meetingStartTime <= currentTime) {
        return FAILED_MESSAGES.MEETING_ALREADY_STARTED;
      }
  
      // Update the meeting details in Firestore
      await meetingRef.update({
        duration: newDuration,
        subject: newSubject,
        start_time: newStartTime,
      });
      await sendWhatsAppMessage(userId, SUCCESS_MESSAGES.MEETING_UPDATED);
      // Return a confirmation message to the user
      return SUCCESS_MESSAGES.MEETING_UPDATED;
    } catch (error) {
      // Handle errors and return an appropriate response
      console.error(error);
      return FAILED_MESSAGES.ERROR_IN_EDIT_MEETING;
    }
}
  
// Function to cancel a scheduled meeting
exports.cancelMeeting = async (userId, meetingId) => {
    try {
      // Check if the meeting can be canceled (e.g., not started yet)
      const meetingRef = db.collection('meetings').doc(meetingId);
      const meetingDoc = await meetingRef.get();
  
      if (!meetingDoc.exists) {
        return FAILED_MESSAGES.MEETING_NOT_FOUND;
      }
  
      const meetingData = meetingDoc.data();
  
      // Check if the meeting has already started (you may use a threshold like 15 minutes)
      const meetingStartTime = new Date(meetingData.start_time);
      const currentTime = new Date();
  
      if (meetingStartTime <= currentTime) {
        return FAILED_MESSAGES.MEETING_STARTED_CANT_CANCEL;
      }
  
      // Delete the meeting document from Firestore
      await meetingRef.delete();
      await sendWhatsAppMessage(userId, SUCCESS_MESSAGES.MEETING_CANCELLED);
      // Return a confirmation message to the user
      return SUCCESS_MESSAGES.MEETING_CANCELLED;
    } catch (error) {
      // Handle errors and return an appropriate response
      console.error(error);
      return ERROR_MESSAGES.errorCancellingMeeting;
    }
}