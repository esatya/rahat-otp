const config = require('config');
const { MailService } = require('@rumsan/core/services');

module.exports = async (phone, message) => {
  if (!config.get('enabled')) {
    console.log('ERROR: SMS service is disabled.');
    MailService.send({
      to: config.get('adminEmail'),
      subject: 'Rahat Alert: OTP Server Disabled',
      html: 'Rahat OTP server has been disabled. Please check.'
    }).then(e => {
      console.log('Alert email sent.');
    });
    return;
  }
  console.log('SMS:', phone);
  const sms = require(`./${config.get('sms_service')}`);
  return sms(phone.toString(), message);
};
