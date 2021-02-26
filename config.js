require('dotenv').config();

module.exports = {
    "prefix": "S",
    "method": [
        "<@!704706906505347183>",
        "Shioru",
        "ชิโอรุ"
    ],
    "owner": "618836889239158785",
    "token": process.env.token || $TOKEN,
    "firebase": {
        "apiKey": process.env.apiKey || $APIKEY,
        "databaseURL": process.env.databaseURL || $DATABASEURL,
        "projectId": process.env.projectId || $PROJECTID
    },
    "update": "2021-01-01T18:57:20.432Z",
    "password": process.env.password || $PASSWORD,
    "youtubeApi": process.env.youtubeApi || $YOUTUBEAPI
};