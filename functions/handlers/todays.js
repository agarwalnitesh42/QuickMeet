const { sendWhatsAppMessage } = require("../util/sendWhatsappMessage");
const { db } = require("../util/admin");

// Function to get today's meetings for a user
exports.getTodayMeetings  = async (userId)  => {
    try {
      // Get the current date
      const today = new Date();
  
      // Query Firestore to find meetings scheduled for today
      const meetingsSnapshot = await db
        .collection('meetings')
        .where('participants', 'array-contains', userId)
        .where('start_time', '>=', today.toISOString())
        .get();
  
      if (meetingsSnapshot.empty) {
        return 'You have no meetings scheduled for today.';
      }
  
      // Prepare a message with today's meetings
      let message = 'Your meetings for today:\n';
      meetingsSnapshot.forEach((doc) => {
        const meetingData = doc.data();
        message += `Subject: ${meetingData.subject}\n`;
        message += `Start Time: ${meetingData.start_time}\n`;
        message += '\n';
      });
  
      // Send the list of today's meetings as an interactive WhatsApp message
      const confirmationButtons = [
        {
          id: 'view_details',
          title: 'View Details',
        },
      ];
      await sendWhatsAppMessage(userId, message);
  
      return 'Today\'s meetings have been sent to your WhatsApp.';
    } catch (error) {
      // Handle errors and return an appropriate response
      console.error(error);
      return 'Sorry, there was an error fetching today\'s meetings. Please try again later.';
    }
  }