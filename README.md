# Device Police Backend

This is the brain of the DevicePolice app. This app lets you set a timer to remind you to get off your device via SMS and makes a recommendation for something else you can do!

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

MongoDB

https://docs.mongodb.com/manual/installation/

NodeJS

https://nodejs.org/en/download/package-manager/

Twilio-CLI

https://www.twilio.com/docs/twilio-cli/quickstart

### Installing

Make sure you have a copy of the repo before proceeding.

1. Run

```
npm install
```

to install the dependencies needed to run this app

2. create a .env file that will stored some important tokens and keys

```
touch .env
```

The `.env` will contain the following keys:

- SECRET_KEY=ARBITRARY_KEY_FOR_CREATING_JSONWEBTOKEN
- TWILIO_ACC_SID=YOUR_TWILIO_ACC_SID
- TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
- TWILIO_PHONE=YOUR_TWILIO_PHONE_NUMBER

3. start the mongodb server

mac

```
brew services start mongodb-community
```

ubuntu

```
sudo service mongod start
```

window

Go to start-> services. Find MongoDB Server. right click on it and click start service. make sure you stop the service when you are done.

4.  start the node server

```
node index.js
```

if you are using nodemon

```
nodemon index.js
```

5. Run the Twilio server for accepting incoming SMS and triggering our webhook

in a separate terminal run

```
 twilio phone-numbers:update YOUR_TWILIO_PHONE_NUMBER --sms-url http://localhost:3000/twilio/receive
```

### Testing It Out

try to send a sms to your Twilio phone number and see if you get a response.

## Built With

- NodeJS - The server runtime that supports JS
- ExpressJS - web framework
- Mongoose - ODM that makes working with MongoDB easier
- Twilio SMS - programmatically send/receive SMS
- Bored API - getting a random activity for ya to do

## What's Next?

check out the repo for the frontend of this app: [device-police-frontend](https://github.com/htnguy/device-police-frontend)
## Author

**Hieu Nguyen** - [get to know me](https://www.devsurvival.com/about-me/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

- Hat tip to anyone whose code was used
- Twilio For sponsoring this hackathon
- Devto for giving great visibility to new comers like myself.
- My mom - for raising me and making this possible.

Made with :heart:
