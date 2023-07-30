/**
 * Configuration
 * This is the entire bot configuration file.
 * Some items need to be configured to work properly.
 * It is recommended to look at the .env or .env.example files
 * to understand these values.
 */

require("dotenv").config();

const constants = require("./constants.json");
const filters = require("./filters.json");
const languages = require("./languages.json");

module.exports = {
    // Check bot updates from Github.
    "check_update": {
        "enable": true,
        "releases_url": "https://api.github.com/repos/Maseshi/Shioru/releases/latest"
    },

    // The default for processing responses in chat.
    "constants": constants,

    // Filters for music.
    "filters": filters,

    // Bot language settings.
    "language": {
        "code": "en-US",
        "support": languages
    },

    // For checking performance.
    // This section is optional and is recommended to be disabled.
    "monitoring": {
        "config": {
            "apiKey": process.env.MONITOR_API_KEY ?? "",
            "metricId": process.env.MONITOR_METRIC_ID ?? "",
            "pageId": process.env.MONITOR_PAGE_ID ?? ""
        },
        "enable": true
    },

    // Setup OpenAI
    "openai": {
        "apiKey": process.env.OPENAI_API_KEY ?? "",
        "basePath": process.env.OPENAI_BASE_PATH ?? ""
    },

    // We use Firebase to deploy databases to the system.
    "server": {
        "apiKey": process.env.API_KEY ?? "",
        "authDomain": process.env.AUTH_DOMAIN ?? "",
        "databaseURL": process.env.DATABASE_URL ?? "",
        "projectId": process.env.PROJECT_ID ?? "",
        "storageBucket": process.env.STORAGE_BUCKET ?? "",
        "messagingSenderId": process.env.MESSAGING_SENDER_ID ?? "",
        "appId": process.env.APP_ID ?? "",
        "measurementId": process.env.MEASUREMENT_ID ?? ""
    },

    // Discord ID of the team.
    "team": {
        // For executing risky orders but does not have the same rights as the owner
        "developer": [],

        // For use in processing suspicious requests.
        "owner": "618836889239158785"
    },

    // For setting application commands in test mode.
    "test": {
        // Useful when reaching the limits of Discord (Works only in test mode).
        "application_commands": false,

        // The id of the guild used for the test.
        "guild": process.env.TEST_GUILD ?? ""
    },

    // The bot token, which can be found on the Discord Developer page.
    // https://discord.com/developers/applications
    "token": process.env.TOKEN ?? "",

    // Setup Top.gg
    "top_gg_token": process.env.TOP_GG_API_KEY ?? "",

    // Last time that personal information was updated
    "update": "2021-02-26T20:08:27.467Z",

    // Setup Weatherbit
    "weatherbit_token": process.env.WEATHERBIT_KEY ?? ""
};