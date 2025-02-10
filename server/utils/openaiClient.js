const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Function processEmail(emailContent)
 * Sends the email content to ChatGPT via OpenAI API.
 * Returns a parsed JSON with keys: promoCode, discountDetails, expirationDate, descriptionTerms.
 * If no valid promo is found, returns {}.
 */
async function processEmail(emailContent) {
  const prompt = `
Extract promotional details from the following email content. 
If a valid promo is found, return a JSON response with the keys:
"promoCode", "discountDetails", "expirationDate", "descriptionTerms". 
If no valid promo code or details are found, return an empty JSON object {}.

Email Content:
""" 
${emailContent}
"""
`;
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant that extracts promotional details from emails.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0,
    });
    const responseText = completion.data.choices[0].message.content;
    let parsedResponse = {};
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (err) {
      console.error('Error parsing ChatGPT response:', err);
    }
    return parsedResponse;
  } catch (err) {
    console.error('Error calling ChatGPT API:', err);
    return {};
  }
}

module.exports = { processEmail }; 