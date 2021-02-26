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
        "apiKey": process.env.apiKey || $API_KEY,
        "databaseURL": process.env.databaseURL || $DATABASE_URL,
        "projectId": process.env.projectId || $PROJECT_ID
    },
    "update": "2021-01-01T18:57:20.432Z",
    "password": process.env.password || $PASSWORD,
    "youtubeApi": process.env.youtubeApi || $YOUTUBE_API
};