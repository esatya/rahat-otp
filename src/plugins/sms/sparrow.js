const config = require('config');
const axios = require('axios');

const smsApi = config.get('services.sparrow.url');
const token = config.get('services.sparrow.token');
const from = config.get('services.sparrow.from');

module.exports = async (phone, message) => {
  if (!phone) throw new Error('No receipent was specified');
  if (!message) throw new Error('No Message was specified');
  await axios(smsApi, {
    params: {
      token,
      from,
      to: phone,
      text: message
    }
  });
};
