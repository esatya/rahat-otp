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
        "url": "https://office.rumsan.net/api/v1/misc/sms"
      }
    }
  }
}
```

Step 3:

    yarn install

Step 4:

    yarn start
