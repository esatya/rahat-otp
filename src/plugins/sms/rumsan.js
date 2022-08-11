const config = require('config');
const axios = require('axios');

const url = config.get('plugins.sms.params.url');

module.exports = async (phone, message) => {
  try {
    const data = {
      app: 'rahat',
      phone,
      message
    };

    const res = await axios.post(url, data);
    console.log(`SMS sent to ${phone}`);
    return res;
  } catch (e) {
    return e;
  }
};
