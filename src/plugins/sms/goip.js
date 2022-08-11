const config = require('config');
const axios = require('axios');

const url = config.get('plugins.sms.params.url');

module.exports = async (phone, message) => {
  try {
    const data = {
      phone,
      message
    };

    console.log('SMS via GOIP not implemented');

    // const res = await axios.post(url, data);
    // console.log(res.data);
    return data;
  } catch (e) {
    return e;
  }
};
