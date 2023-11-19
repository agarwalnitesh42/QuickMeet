const axios = require('axios');
const querystring = require('querystring');
const {ERROR_MESSAGES} = require("../messages/messages");

// Define the Gupshup Media API URL
const GUPSHUP_MEDIA_API_URL = 'https://api.gupshup.io/wa/api/v1/msg';

// Define the Gupshup Media API authentication credentials
const GUPSHUP_MEDIA_API_KEY = '40zmdn0xftfo8krlsmtcol35avbmw4sk';
// Define the Gupshup Media API send message endpoint
const GUPSHUP_MEDIA_API_SEND_MESSAGE_ENDPOINT = `${GUPSHUP_MEDIA_API_URL}`;

// Function to send a WhatsApp message using the Gupshup Media API
exports.sendWhatsAppMessage= async (phoneNumber, message) => {
    const messageObject = {
      channel: 'whatsapp',
      source: 919887413949,
      destination: `91${phoneNumber}`,
      message: message,
      'src.name':'quickmeet'
    };
  
    // Define the Axios config
    const config = {
      method: 'post',
      url: GUPSHUP_MEDIA_API_SEND_MESSAGE_ENDPOINT, // Replace with your API endpoint
      headers: {
        'apikey': GUPSHUP_MEDIA_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: querystring.stringify(messageObject),
    };
    // Send the WhatsApp message
    // Send the response via Gupshup API as clickable buttons
    console.log('config is ', config);
    try {
        await axios(config);
    } catch (error) {
        console.error(ERROR_MESSAGES.sendWhatsappMessageError, error);
        res.status(500).json({ success: false, error: ERROR_MESSAGES.sendWhatsappMessageError });
    }
}
  