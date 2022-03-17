const support = require("./languages.json");
require("dotenv").config();

module.exports = {
    "guild": process.env.GUILD || $GUILD,
    "lang": {
        "code": "en",
        "support": support
    },
    // Available: [production, development]
    // If in development mode Some features will not work.
    "mode": "development",
    "owner": "618836889239158785",
    "prefix": "S",
    "server": {
        "apiKey": process.env.API_KEY || $API_KEY,
        "authDomain": process.env.AUTH_DOMAIN || $AUTH_DOMAIN,
        "databaseURL": process.env.DATABASE_URL || $DATABASE_URL,
        "projectId": process.env.PROJECT_ID || $PROJECT_ID,
        "storageBucket": process.env.STORAGE_BUCKET || $STORAGE_BUCKET,
        "messagingSenderId": process.env.MESSAGING_SENDER_ID || $MESSAGING_SENDER_ID,
        "appId": process.env.APP_ID || $APP_ID,
        "measurementId": process.env.MEASUREMENT_ID || $MEASUREMENT_ID
    },
    "token": process.env.TOKEN || $TOKEN,
    "update": "2021-02-26T20:08:27.467Z"
};