require('dotenv').config();

module.exports = {
    "prefix": "Y",
    "owner": "618836889239158785",
    "token": process.env.token || $token,
    "firebase": {
        "apiKey": process.env.apiKey || $apiKey,
        "databaseURL": process.env.databaseURL || $databaseURL,
        "projectId": process.env.projectId || $projectId
    },
    "update": "2020-06-23T11:03:44.031Z",
    "password": process.env.password || $password,
    "youtubeApi": process.env.youtubeApi || $youtubeApi
};