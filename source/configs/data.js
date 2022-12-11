require("dotenv").config();

const constants = require("./constants.json");
const filters = require("./filters.json");
const languages = require("./languages.json");

module.exports = {
    "constants": constants,
    "filters": filters,
    "language": {
        "code": "en",
        "support": languages
    },
    "monitoring": {
        "config": {
            "apiKey": process.env.MONITOR_API_KEY || $MONITOR_API_KEY,
            "metricId": process.env.MONITOR_METRIC_ID || $MONITOR_METRIC_ID,
            "pageId": process.env.MONITOR_PAGE_ID || $MONITOR_PAGE_ID
        },
        "enable": true
    },
    "owner": "618836889239158785",
    "prefix": "S",
    "recursive": 3,
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
    "testGuild": process.env.TEST_GUILD || $TEST_GUILD,
    "token": process.env.TOKEN || $TOKEN,
    "update": "2021-02-26T20:08:27.467Z"
};