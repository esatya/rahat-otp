const config = require('config');
const axios = require('axios');
const ethers = require('ethers');
const { createMessage } = require('./plugins/template');

const rahatServer = config.get('rahat_server');
const websocketProvider = config.get('blockchain.webSocketProvider');
const privateKey = config.get('private_key');
// const msg = config.get('msg');

const provider = new ethers.providers.WebSocketProvider(websocketProvider);
const wallet = new ethers.Wallet(privateKey, provider);
let test;
try {
  test = config.get('otp.test');
} catch (e) {
  test = false;
}

const OTPManager = {
  /**
   * Get contract information from Rahat server
   */
  async getContract() {
    let res = await axios(`${rahatServer}/api/v1/app/contracts/Rahat`);
    const { abi } = res.data;
    res = await axios(`${rahatServer}/api/v1/app/settings`);
    const contractAddress = res.data.agency.contracts.rahat;
    return new ethers.Contract(contractAddress, abi, wallet);
  },

  /**
   * Create SHA3 hash of OTP.
   * @param {string} payload data to create hash
   */
  generateHash(payload) {
    return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(payload));
  },

  /**
   * Call contract function to store OTP hash in blockchain.
   * @param {string} payload data to create hash
   */
  async setHashToChain(contract, vendor, phone, otp) {
    const timeToLive = 900;
    const otpHash = this.generateHash(otp);
    return contract.approveClaim(vendor, phone, otpHash, timeToLive);
  },

  /**
   * Listen to blockchain events
   */
  async listen() {
    const contract = await this.getContract();
    contract.on('Claimed', async (vendor, phone, amount) => {
      let otp;
      try {
        otp = Math.floor(1000 + Math.random() * 9000);
        if (test) {
          otp = config.get('otp.otp');
        }
        await this.setHashToChain(contract, vendor, phone.toString(), otp.toString());
        const message = createMessage(otp, amount) || `A vendor is requesting ${amount} token from your account. If you agree, please provide this OTP to vendor: ${otp}`;
        // eslint-disable-next-line global-require
        const sms = require(`./plugins/sms/${config.get('plugins.sms.service')}`);
        // call SMS function from plugins to send SMS to beneficiary
        sms(phone.toString(), message);
      } catch (e) {
        console.log(e);
      }
    });
    console.log('--- Listening to Blockchain Events ----');
  },
};

OTPManager.listen();
