require('dotenv').config();

module.exports = {
    "prefix": "Y",
    "owner": "618836889239158785",
    "token": process.env.token || process.jobs.build.steps.env.TOKEN,
    "firebase": {
        "apiKey": process.env.apiKey || process.jobs.build.steps.env.API_KEY,
        "databaseURL": process.env.databaseURL || process.jobs.build.steps.env.DATABASE_URL,
        "projectId": process.env.projectId || process.jobs.build.steps.env.PROJECT_ID
    },
    "update": "2020-06-23T11:03:44.031Z",
    "password": process.env.password || process.jobs.build.steps.env.PASSWORD,
    "youtubeApi": process.env.youtubeApi || process.jobs.build.steps.env.YOUTUBE_API
};