require('dotenv').config();

module.exports = {
    "prefix": "Y",
    "owner": "618836889239158785",
    "token": process.env.token || process.env.TOKEN,
    "firebase": {
        "apiKey": process.env.apiKey || process.env.API_KEY,
        "databaseURL": process.env.databaseURL || process.env.DATABASE_URL,
        "projectId": process.env.projectId || process.env.PROJECT_ID
    },
    "update": "2020-06-23T11:03:44.031Z",
    "password": process.env.password || process.env.PASSWORD,
    "youtubeApi": process.env.youtubeApi || process.env.YOUTUBE_API
};