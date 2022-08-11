const config = require('config');
const axios = require('axios');

const url = config.get('services.prabhu.url');
const token = config.get('services.prabhu.token');

module.exports = async (phone, message) => {
  if (!phone) throw new Error('No receipent was specified');
  if (!message) throw new Error('No Message was specified');
  return axios.post(`${url}?token=${token}`, [
    {
      Message: message,
      MobileNumber: phone
    }
  ]);
};
