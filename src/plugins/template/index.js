const config = require('config');

const msg = config.get('msg');

function createMessage(otp, amount) {
  if (!msg) {
    return false;
  }
  let message = msg;
  if (msg.includes('${amount}')) message = message.replace('${amount}', amount);
  if (msg.includes('${otp}')) message = message.replace('${otp}', otp);

  return message;
}

module.exports = { createMessage };
