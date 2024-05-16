/**
 * Configuration
 * This is the entire bot configuration file.
 * Some items need to be configured to work properly.
 * It is recommended to look at the .env or .env.example files
 * to understand these values.
 */
const constants = require('./constants.json')
const emulators = require('./emulators.json')
const filters = require('./filters.json')
const logger = require('./logger.json')
const notification = require('./notification')
const translation = require('./translation')

module.exports = {
  // Check bot updates from Github.
  check_update: {
    enable: true,
    releases_url: 'https://api.github.com/repos/Maseshi/Shioru/releases/latest',
  },

  // The default for processing responses in chat.
  constants: constants,

  // Music director.
  djs: {
    enable: false,
    only: false,
    roles: [],
    users: [],
  },

  // Firebase emulator suite
  /// This configuration should match the file. firebase.json in the emulators section
  /// if you don't have it yet. firebase.json, use "npm install -g firebase-tools",
  /// run "firebase init", then set up emulators.
  /// https://firebase.google.com/docs/emulator-suite
  emulators: emulators,

  // Filters for music.
  filters: filters,

  // Setup webhook logger
  logger: logger,

  // For checking performance.
  monitoring: {
    apiKey: process.env.MONITOR_API_KEY ?? '',
    metricId: process.env.MONITOR_METRIC_ID ?? '',
    pageId: process.env.MONITOR_PAGE_ID ?? '',
  },

  // Support notification alert
  notification: notification,

  // We use Firebase to deploy databases to the system.
  server: {
    apiKey: process.env.API_KEY ?? '',
    authDomain: process.env.AUTH_DOMAIN ?? '',
    databaseURL: process.env.DATABASE_URL ?? '',
    projectId: process.env.PROJECT_ID ?? '',
    storageBucket: process.env.STORAGE_BUCKET ?? '',
    messagingSenderId: process.env.MESSAGING_SENDER_ID ?? '',
    appId: process.env.APP_ID ?? '',
    measurementId: process.env.MEASUREMENT_ID ?? '',
  },

  // Discord ID of the team.
  team: {
    // For executing risky commands but does not have the same rights as the owner
    developer: [
      // '123456789101112131'
      // '131121110987654321'
    ],

    // For use in processing suspicious requests.
    owner: '618836889239158785',
  },

  // For setting application commands in test mode.
  test_guild: '1041689622897508372',

  // The bot token, which can be found on the Discord Developer page.
  token: process.env.TOKEN ?? '',

  // Setup Top.gg
  top_gg_token: process.env.TOP_GG_TOKEN ?? '',

  // Translation support locales
  translation: translation,

  // Last time that personal information was updated
  update: '2021-02-26T20:08:27.467Z',

  // Setup Open Weather
  open_weather_token: process.env.OPEN_WEATHER_TOKEN ?? '',
}
