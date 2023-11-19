const express = require('express');
const config = require("./quickMeet.config");
const firebase = require("firebase");
const functions = require("firebase-functions");

const {
  getTodayMeetings
} = require("./handlers/todays");

const {
  scheduleMeeting,
  editMeeting,
  cancelMeeting
} = require("./handlers/schedule");

const {
  // webhook,
  start, 
  next
} = require('./handlers/start');

firebase.initializeApp(config);
const app = express();
const cors = require("cors");
app.use(cors());

// webhook
// app.post('/webhook', webhook);

// Start Intro Process
app.post('/start', start);

// Next Process
app.post('/next', next);

// // Schedule a meeting
app.post("/schedule", scheduleMeeting);

// // Cancel a meeting
app.delete('/cancel/:meetingId', cancelMeeting);

// // Get today's meetings
app.get('/today', getTodayMeetings);

// // Edit a meeting
app.put('/edit/:meetingId', editMeeting);

// // // Catch-all route
app.get('*', (req, res) => {
  res.status(404).send('Not Found');
});

// Export the app
exports.api = functions.region("asia-south1").https.onRequest(app);
