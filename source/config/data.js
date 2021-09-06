const support = require("./languages.json");
require("dotenv").config();

module.exports = {
    "prefix": "S",
    "mention": [
        "<@!704706906505347183>",
        "shioru#9520",
        "shioru",
        "ชิโอรุ"
    ],
    "token": process.env.token || $token,
    "server": {
        "apiKey": process.env.apiKey || $apiKey,
        "authDomain": process.env.authDomain || $authDomain,
        "databaseURL": process.env.databaseURL || $databaseURL,
        "projectId": process.env.projectId || $projectId,
        "storageBucket": process.env.storageBucket || $storageBucket,
        "messagingSenderId": process.env.messagingSenderId || $messagingSenderId,
        "appId": process.env.appId || $appId,
        "measurementId": process.env.measurementId || $measurementId
    },
    "owner": "618836889239158785",
    "update": "2021-02-26T20:08:27.467Z",
    "password": process.env.password || $password,
    "lang": {
        "code": "th",
        "support": support
    }
};