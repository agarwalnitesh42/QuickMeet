exports.welcome = `{
  "type":"list",
  "body":"Select Duration",
  "title":"Welcome to QuickMeet !",
  "globalButtons":[{"type":"text","title":"Select Duration"}],
  "items":[
    {
      "title":"first Section",
      "subtitle":"first Subtitle",
      "options":[
        {
          "type":"text",
          "title":"15 Mins"
        },
        {
          "type":"text",
          "title":"30 Mins"
        },
        {
          "type":"text",
          "title":"45 Mins"
        },
        {
          "type":"text",
          "title":"60 Mins"
        }
      ]
    }
  ]
}`;

exports.enterSubject = `{"type":"text","text":"Enter the subject for the meeting"}`

exports.enterName = `{"type":"text","text":"Enter Your Name"}`

exports.selectParticipants = `{"type":"text","text":"Please select participants by typing @"}`

exports.selectAvailableSlots = `{
  "type":"list",
  "body":"Available slots",
  "title":"Available slots",
  "globalButtons":[{"type":"text","title":"Select time slot"}],
  "items":[
    {
      "title":"first Section",
      "subtitle":"first Subtitle",
      "options":[
        {
          "type":"text",
          "title":"4:15PM"
        },
        {
          "type":"text",
          "title":"4:30PM"
        },
        {
          "type":"text",
          "title":"4:45PM"
        },
        {
          "type":"text",
          "title":"4:00PM"
        }
      ]
    }
  ]
}`;

exports.reviewMeetingPayload = (text) => `{"type":"text","text":"${text}"}`;

exports.meetingConfirmed = `{"type":"text","text":"Your Meeting has been confirmed"}`;
