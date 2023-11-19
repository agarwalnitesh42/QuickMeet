const { sendWhatsAppMessage } = require("../util/sendWhatsappMessage");
const { scheduleMeeting } = require("./schedule");
const { FAILED_MESSAGES} = require("../messages/messages");
const { welcome, enterSubject, enterName, selectParticipants, selectAvailableSlots, reviewMeetingPayload, meetingConfirmed} = require("../payloads/payload");
// Map to store user context during the conversation
const userContext = new Map();

// exports.webhook = async (req, res) => {
//   console.log('req is ', req.body);
//   const userId = req.body.userId;
//   if (!userContext.has(userId)) {
//     return this.start(req,res);
//   } else {
//     return this.next(req,res);
//   }
// };

exports.start = async (req, res) => {
  const userId = req.body.userId; // Get the user's ID from the request
  // Initialize user context and prompt for the duration
  userContext.set(userId, { step: 'duration' });
  // Send the response via Gupshup API as clickable buttons
  await sendWhatsAppMessage(userId, welcome);
  res.json({ success: true });
}

exports.next = async (req, res) => {
  // User Id is supposed to be Schedular's Phone Number.
  const userId = req.body.userId;
  const userMessage = req.body.message;
  if (!userContext.has(userId)) {
    return res.json({ message: FAILED_MESSAGES.SESSION_EXPIRED });
  }
  const context = userContext.get(userId);

  if (context.step === 'duration') {
    await handleDuration(userId,userMessage,context);
    res.json({ success: true });
  } else if (context.step === 'subject') {
    await handleSubject(userId,userMessage,context);
    res.json({ success: true });
  } else if (context.step === 'schedulerName') {
    await handleSchedulerName(userId,userMessage,context);
    res.json({ success: true });
  } else if (context.step === 'participants') {
    await handleParticipants(userId,userMessage,context);
    res.json({ success: true });
  } else if (context.step === 'slots') {
    await handleSlots(userId,userMessage,context);
    res.json({ success: true });
  } else if (context.step === 'review') {
    await handleReview(userId,userMessage,context);
    res.json({ success: true });
  }
}

// Handle Duration
const handleDuration =  async (userId, userMessage, context) => {
  context.duration = userMessage;
  context.step = 'subject';
  userContext.set(userId, context);
  // Send the response via Gupshup API as clickable buttons
  await sendWhatsAppMessage(userId, enterSubject);
  return true;
};

// Handle Duration
const handleSubject =  async (userId, userMessage, context) => {
  context.subject = userMessage;
  context.step = 'schedulerName';
  userContext.set(userId, context);
  await sendWhatsAppMessage(userId, enterName);
  return true;
};

// Handle Scheduler Name 
const handleSchedulerName = async (userId, userMessage, context) => {
  context.schedulerName = userMessage;
  context.step = 'participants';
  userContext.set(userId, context);
  await sendWhatsAppMessage(userId, selectParticipants);
  return true;
};

// Handle Participants
const handleParticipants = async (userId, userMessage, context) => {
  // Handle participant selection and store in context
  // Move to the next step - available slots
  // Construct a list of available slots
  // const availableSlots = ['4:15PM', '4:30PM'];- Sample available slots - bring these from firestore db and show them here
  context.selectedParticipants = userMessage;
  context.step = 'slots';
  userContext.set(userId, context);
  await sendWhatsAppMessage(userId, selectAvailableSlots);
  return true;
};

// Review Meeting 
const handleSlots = async (userId, userMessage, context) => {
  context.selectedSlot = userMessage;
  context.step = 'review';
  userContext.set(userId, context);
  // Send the response via Gupshup API as clickable buttons
  // reviewMeetingPayload
  const payload = `
    subject - ${context.subject},
    duration - ${context.duration}, 
    schedulerName - ${context.schedulerName}, 
    selectedParticipants - ${context.selectedParticipants},
    selectedSlot - ${context.selectedSlot},
  `;
  await sendWhatsAppMessage(userId, payload);
  return true;
};

const handleReview = async (userId, userMessage, context) => {
  context.reviewConfirmation = userMessage;
  context.step = 'confirm';
  userContext.set(userId, context);
  // Send the response via Gupshup API as clickable buttons
  await confirmMeeting(userId, context);
  return true;
};

// Confirm Meeting
const confirmMeeting = async (userId, context) => {
  const { duration, subject, schedulerName, participants, startTime } = context;
  // Call your /schedule API here with the gathered information
  await scheduleMeeting(userId, duration, subject, schedulerName, participants, startTime);
  // Clear the user context after the meeting is scheduled
  userContext.delete(userId);
  // Send the confirmation message to the user via Gupshup API
  await sendWhatsAppMessage(userId, meetingConfirmed);
  return true;
};