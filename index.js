const controller = require('./src/controller');

const test = async () => {
  const phone = '9801109670';
  const otp = await controller.getOtp(phone);
  await controller.sendMessage(phone, otp, 530);
};

controller.listen();
