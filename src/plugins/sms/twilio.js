const config = require('config');
const twilio = require('twilio');

// Make sure you add these parameters to "plugins.sms.params" in local.json file
const { accountId, authToken, twilioNumber } = config.get('plugins.sms.params');

module.exports = (phone, message) => {
  const client = twilio(accountId, authToken);
  return client.messages.create({
    body: message,
    from: twilioNumber,
    to: phone
  });
};
