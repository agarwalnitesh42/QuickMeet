exports.SUCCESS_MESSAGES = {
    // START.JS 
    WELCOME_MESSAGE : 'Welcome to QuickMeet! Let\'s start scheduling with your contacts. Please select the duration of the meeting.',
    ENTER_SUBJECT: 'Enter the subject for the meeting.',
    ENTER_NAME: 'Enter your name.',
    SELECT_PARTICIPANTS: 'Please select participants from the list.',
    SELECT_SLOTS:'Great! Here are the available slots. Please select a time slot.',

    // SCHEDULE.JS
    // edit_meeting
    MEETING_UPDATED:'Meeting has been Updated',
    // cancel_meeting
    MEETING_CANCELLED:'Meeting has been Cancelled',
};

exports.FAILED_MESSAGES = {
    // START.JS
    SESSION_EXPIRED: 'Session expired. Please start again.',

    // SCHEDULE.JS
    // add_meeting
    NO_AVAILABLE_PARTICIPANTS: 'No available participants',
    MEETING_ALREADY_SCHEDULED: 'Meeting already scheduled for the given time slot',

    // edit_meeting
    MEETING_NOT_FOUND: 'Meeting not found',
    MEETING_ALREADY_STARTED:'This meeting has already started and cannot be edited.',
    ERROR_IN_EDIT_MEETING:'Sorry, there was an error editing the meeting. Please try again later.',
    // cancel_meeting
    MEETING_STARTED_CANT_CANCEL: 'This meeting has already started and cannot be canceled.',
};

exports.ERROR_MESSAGES = {
    // START.JS
    sendWhatsappMessageError: 'Error sending WhatsApp message:',

    // SCHEDULE.JS
    invalidMeetingData: 'Invalid meeting data',
    // cancel_meeting
    errorCancellingMeeting: 'Sorry, there was an error canceling the meeting. Please try again later.',
    errorSchedulingMeeting: 'Sorry, there was an error scheduling the meeting. Please try again later.',
}