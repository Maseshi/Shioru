require('dotenv').config();

module.exports = {
    "prefix": "Y",
    "owner": "618836889239158785",
    "token": process.env.token || secret.TOKEN,
    "firebase": {
        "apiKey": process.env.apiKey || secret.API_KEY,
        "databaseURL": process.env.databaseURL || secret.DATABASE_URL,
        "projectId": process.env.projectId || secret.PROJECT_ID
    },
    "update": "2020-06-23T11:03:44.031Z",
    "password": process.env.password || secret.PASSWORD,
    "youtubeApi": process.env.youtubeApi || secret.YOUTUBE_API
};