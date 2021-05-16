require("dotenv").config();

module.exports = {
    "prefix": "S",
    "mention": [
        "<@!704706906505347183>",
        "shioru#9520",
        "shioru",
        "ชิโอรุ"
    ],
    "owner": "618836889239158785",
    "token": process.env.token || $token,
    "firebase": {
        "apiKey": process.env.apiKey || $apiKey,
        "databaseURL": process.env.databaseURL || $databaseURL,
        "projectId": process.env.projectId || $projectId
    },
    "update": "2021-02-26T20:08:27.467Z",
    "password": process.env.password || $password,
    "youtubeApi": process.env.youtubeApi || $youtubeApi
};