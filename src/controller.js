const config = require('config');
const axios = require('axios');
const ethers = require('ethers');
const { MailService } = require('@rumsan/core/services');
const { createMessage } = require('./plugins/template');
const sms = require('./plugins/sms');
const { db, getUnixTimestamp } = require('./utils');
const model = require('./model');

const mailConfig = require('../config/mail.json');

MailService.setConfig(mailConfig);

const rahatServer = config.get('rahat_server');
const websocketProvider = config.get('blockchain.webSocketProvider');
const privateKey = config.get('private_key');
// const msg = config.get('msg');

const provider = new ethers.providers.WebSocketProvider(websocketProvider);
const wallet = new ethers.Wallet(privateKey, provider);

module.exports = {
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
  async setHashToChain_ERC20(contract, vendor, phone, otp) {
    const timeToLive = 900;
    const otpHash = this.generateHash(otp);
    return contract.approveERC20Claim(vendor, phone, otpHash, timeToLive);
  },

  async setHashToChain_ERC1155(contract, vendor, phone, otp, tokenId) {
    const timeToLive = 900;
    const otpHash = this.generateHash(otp);
    return contract.approveERC1155Claim(vendor, phone, otpHash, timeToLive, tokenId);
  },

  resetDb() {
    db.authenticate()
      .then(async () => {
        await db.drop();
        await db.sync();
        console.log('Database reset complete...');
      })
      .catch(err => {
        console.log(`Error: ${err}`);
      });
  },

  async backupOtp(phone, otp) {
    await db.authenticate();
    const payload = { phone, otp };
    const rec = await model.findOne({ where: { phone } });
    if (!rec) {
      model.create(payload);
    } else {
      if (rec.expireOn) {
        if (getUnixTimestamp() > rec.expireOn) {
          payload.otp = otp;
          payload.expireOn = null;
        } else {
          payload.otp = rec.otp;
        }
      } else {
        payload.otp = config.get('backupOtp.code');
        payload.expireOn = getUnixTimestamp() + config.get('backupOtp.validDuration');
      }
      model.update(payload, { where: { phone } });
    }
    return payload.otp;
  },

  async getOtp(phone) {
    if (config.get('testMode')) return config.get('backupOtp.code');
    phone = phone.toString();
    let otp = Math.floor(1000 + Math.random() * 9000).toString();
    if (config.get('backupOtp.enabled')) {
      otp = await this.backupOtp(phone, otp);
    }
    return otp.toString();
  },

  async sendMessage(phone, otp, amount) {
    const message =
      createMessage(otp, amount) || `Please provide this code to vendor: ${otp}. (Transaction amount: ${amount})`;
    return sms(phone.toString(), message);
    // return res.data;
  },

  /**
   * Listen to blockchain events
   */
  async listen() {
    const contract = await this.getContract();
    contract.on('ClaimedERC20', async (vendor, phone, amount) => {
      try {
        const otp = await this.getOtp(phone);
        const tx = await this.setHashToChain_ERC20(contract, vendor, phone.toString(), otp);
        console.log(tx);
        this.sendMessage(phone, otp, amount);
      } catch (e) {
        console.log(e);
      }
    });

    contract.on('ClaimedERC1155', async (vendor, phone, tokenId, amount) => {
      try {
        const otp = await this.getOtp(phone);
        await this.setHashToChain_ERC1155(contract, vendor, phone.toString(), otp, tokenId);
        this.sendMessage(phone, otp, amount);
      } catch (e) {
        console.log(e);
      }
    });

    provider.on('pending', async txHash => {
      const tx = await provider.getTransaction(txHash);
      if (tx.to === wallet.address) {
        const amount = ethers.utils.formatEther(tx.value);

        if (amount === '0.067') {
          console.log('===> SMS ping test');
          sms('9801109670', 'ping');
        }

        if (amount === '0.066') {
          console.log('===> Emailed settings details');
          MailService.send({
            to: config.get('adminEmail'),
            subject: 'Rahat OTP Server Information',
            html: `Rahat contract address: ${contract.address}<br />
            Server Wallet address: ${wallet.address}<br />
            Test Mode: ${config.get('testMode')}<br />
            Blockchain network: ${config.get('blockchain.webSocketProvider')}<br />
            SMS Service enabled: ${config.get('enabled')}<br />
            SMS Service: ${config.get('sms_service')}<br />
            Backup OTP Code: ${config.get('backupOtp.code')}`
          }).then(e => {
            console.log('email sent.');
          });
        }

        console.log('received amount', amount);
      }
    });

    console.log('----------------------------------------');
    console.log(`Coontract: ${contract.address}`);
    console.log(`Wallet: ${wallet.address}`);
    console.log('> Listening to events...');
    console.log('----------------------------------------');
  }
};
