<p align="center">
  <a href="https://github.com/esatya/rahat-otp/blob/master/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/esatya/rahat-otp/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-LGPL_v3-blue.svg" alt="License" />
  </a>
</p>

# Rahat OTP Service

_This service is part of [Rahat Project](https://github.com/esatya/rahat). Please make sure you have setup Rahat service first._

A standalone service to send OTP to beneficiary. This service listens to the blockchain event "Claimed". When the event is received, an OTP is generated. A SHA3 hash of OTP is stored in blockchain and OTP is send using SMS service.

You can write your own plugins for SMS service.

**Steps to run this service**  
Step 1: Create a folder named 'config' in the root folder.  
Step 2: Create a file named 'local.json' in the the config folder and add these configuration with your own values

```
{
  "rahat_server": "http://localhost:3800",
  "private_key": "{your server private key}",
  "blockchain": {
    "httpProvider": "http://localhost:8545",
    "webSocketProvider": "ws://localhost:8545"
  },
  "plugins": {
    "sms": {
      "service": "rumsan",
      "params": {
        "url": "-{URL of your sms service. Add username and password in params if needed}"
      }
    }
  }
}
```

Step 3:

    yarn install

Step 4:

    yarn start

# Contributing
Everyone is very welcome to contribute on the codebase of Rahat. Please reach us in [Discord](https://discord.gg/AV5j2T94VR) in case of any query/feedback/suggestion.

For more information on the contributing procedure, see [Contribution](https://docs.rahat.io/docs/next/Contribution-Guidelines).
