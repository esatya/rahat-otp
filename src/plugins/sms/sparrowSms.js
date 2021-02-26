const config = require('config');
const axios = require('axios');

const smsApi = config.get('services.sparrow_sms.url');
const token = config.get('services.sparrow_sms.token');
const from = config.get('services.sparrow_sms.from');
const SmsStatus = config.get('services.sparrow_sms.active');

module.exports = async (phone, message) => {
  if (!phone) throw new Error('No receipent was specified');
  if (!message) throw new Error('No Message was specified');
  if (SmsStatus) {
    try {
      await axios(smsApi, {
        params: {
          token,
          from,
          to: phone,
          text: message,
        },
      });
    } catch (e) {
      throw Error(e);
    }
  }
};
