require("dotenv").config();

module.exports = {
    "server": {
        "apiKey": process.env.apiKey || $apiKey,
        "databaseURL": process.env.databaseURL || $databaseURL,
        "projectId": process.env.projectId || $projectId
    },
    "owner": "618836889239158785",
    "update": "2021-02-26T20:08:27.467Z",
    "password": process.env.password || $password
};