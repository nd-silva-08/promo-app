const express = require('express');
const router = express.Router();
const gmailClient = require('../utils/gmailClient');
const openaiClient = require('../utils/openaiClient');
const Promo = require('../models/Promo');

// Middleware to ensure the user is authenticated.
function ensureAuth(req, res, next) {
  if (req.isAuthenticated() && req.user && req.user.accessToken) {
    return next();
  }
  res.status(401).json({ error: 'User not authenticated' });
}

// POST /emails/process : Fetch promotional emails and process them.
router.post('/process', ensureAuth, async (req, res) => {
  try {
    const accessToken = req.user.accessToken;
    const gmail = gmailClient(accessToken);

    // Search query for promotional emails (adjust keywords as needed).
    const query =
      'promo OR "promo code" OR discount OR sale OR promotion OR deal OR offer';

    // List messages that match the query.
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
    });

    const messages = response.data.messages || [];
    let processedCount = 0;

    for (const msg of messages) {
      const msgDetail = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'full',
      });

      // Extract email details.
      const payload = msgDetail.data.payload;
      let emailData = {
        sender: '',
        date: '',
        subject: '',
        snippet: msgDetail.data.snippet,
        content: '',
      };

      if (payload.headers) {
        payload.headers.forEach((header) => {
          if (header.name.toLowerCase() === 'from') {
            emailData.sender = header.value;
          }
          if (header.name.toLowerCase() === 'date') {
            emailData.date = header.value;
          }
          if (header.name.toLowerCase() === 'subject') {
            emailData.subject = header.value;
          }
        });
      }

      // Decode email body (handle parts if available).
      let parts = payload.parts || [];
      if (parts.length) {
        parts.forEach((part) => {
          if (part.mimeType === 'text/plain') {
            emailData.content += part.body.data
              ? Buffer.from(part.body.data, 'base64').toString('utf8')
              : '';
          }
        });
      } else {
        emailData.content = payload.body.data
          ? Buffer.from(payload.body.data, 'base64').toString('utf8')
          : '';
      }

      // Process email content with ChatGPT if available.
      if (emailData.content) {
        const promoResult = await openaiClient.processEmail(emailData.content);
        // Check if a valid promoCode was returned.
        if (promoResult && promoResult.promoCode) {
          // Upsert promo record (avoiding duplicates).
          await Promo.findOneAndUpdate(
            { promoCode: promoResult.promoCode },
            {
              promoCode: promoResult.promoCode,
              discountDetails: promoResult.discountDetails,
              expirationDate: promoResult.expirationDate,
              descriptionTerms: promoResult.descriptionTerms,
              sourceEmail: {
                sender: emailData.sender,
                subject: emailData.subject,
                date: emailData.date,
              },
              status:
                new Date(promoResult.expirationDate) > new Date()
                  ? 'active'
                  : 'expired',
            },
            { upsert: true, new: true }
          );
          processedCount++;
        }
      }
    }
    res.json({ message: 'Emails processed', processedEmails: processedCount });
  } catch (err) {
    console.error('Error processing emails: ', err);
    res.status(500).json({ error: 'Error processing emails' });
  }
});

module.exports = router; 