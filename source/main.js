/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Chaiwat Suwannarat
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const {
  Client,
  GatewayIntentBits,
  Partials,
  PresenceUpdateStatus,
  ActivityType,
} = require("discord.js");
const { join } = require("node:path");
const { readdirSync, lstatSync } = require("node:fs");
const { DisTube } = require("distube");
const { DeezerPlugin } = require("@distube/deezer");
const { SpotifyPlugin } = require("@distube/spotify");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { initializeApp } = require("firebase/app");
const { getDatabase, connectDatabaseEmulator } = require("firebase/database");
const { startScreen, logger } = require("./utils/consoleUtils");
const { updateChecker } = require("./utils/servicesUtils");
const i18next = require("i18next");
const Backend = require("i18next-fs-backend");
const configs = require("./configs/data");

// Start detecting working time
const startTime = new Date().getTime();

// Show start screen if in dev mode
if (
  process.env.npm_lifecycle_event &&
  process.env.npm_lifecycle_event === "dev"
)
  startScreen();

// Check configuration variables
logger.info("Checking configuration variables...");

if (configs.check_update.enable && !configs.check_update.releases_url)
  logger.warn(
    "CONF: The check_update.releases_url was not found in the configuration file.",
  );

for (const eventName in configs.logger) {
  const event = configs.logger[eventName];

  if (event.enable && !event.webhookURL)
    logger.warn(
      `CONF: The logger.${eventName}.webhookURL was not found in the configuration file.`,
    );
}

if (
  configs.monitoring.apiKey ||
  configs.monitoring.metricId ||
  configs.monitoring.pageId
) {
  if (!configs.monitoring.apiKey)
    logger.warn(
      "CONF: The monitoring.apiKey was not found in the environment.",
    );
  if (!configs.monitoring.metricId)
    logger.warn(
      "CONF: The monitoring.metricId was not found in the environment.",
    );
  if (!configs.monitoring.pageId)
    logger.warn(
      "CONF: The monitoring.pageId was not found in the environment.",
    );
}
if (!configs.openai.apiKey)
  logger.warn("CONF: The openai.apiKey was not found in the environment.");
if (!configs.open_weather_token)
  logger.warn("CONF: The open_weather_token was not found in the environment.");
if (!configs.test_guild)
  logger.warn("CONF: The test_guild was not found in the configuration file.");
if (!configs.translation.baseURL)
  logger.warn(
    "CONF: The translation.baseURL was not found in the environment.",
  );

try {
  if (!configs.server.apiKey)
    throw new Error("CONF: API_KEY It needs to be set up in the environment.");
  if (!configs.server.authDomain)
    throw new Error(
      "CONF: AUTH_DOMAIN It needs to be set up in the environment.",
    );
  if (!configs.server.databaseURL)
    throw new Error(
      "CONF: DATABASE_URL It needs to be set up in the environment.",
    );
  if (!configs.server.projectId)
    throw new Error(
      "CONF: PROJECT_ID It needs to be set up in the environment.",
    );
  if (!configs.server.storageBucket)
    throw new Error(
      "CONF: STORAGE_BUCKET It needs to be set up in the environment.",
    );
  if (!configs.server.messagingSenderId)
    throw new Error(
      "CONF: MESSAGING_SENDER_ID It needs to be set up in the environment.",
    );
  if (!configs.server.appId)
    throw new Error("CONF: APP_ID It needs to be set up in the environment.");
  if (!configs.server.measurementId)
    throw new Error(
      "CONF: MEASUREMENT_ID It needs to be set up in the environment.",
    );
  if (!configs.token)
    throw new Error("CONF: TOKEN It needs to be set up in the environment.");
} catch (error) {
  logger.error(
    error,
    "An error was encountered while verifying the configuration.",
  );
}

// Client setup
logger.info("Setting up the main system...");

const client = new Client({
  partials: [
    Partials.User,
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.GuildScheduledEvent,
    Partials.ThreadMember,
  ],
  presence: {
    status: PresenceUpdateStatus.Idle,
    afk: true,
    activities: [{ name: "America Ya :D", type: ActivityType.Custom }],
  },
  intents: [
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.AutoModerationExecution,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildExpressions,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
});

// Initialize i18next
logger.info("Loading language modules...");

try {
  i18next.use(Backend).init({
    debug: false,
    initImmediate: false,
    fallbackLng: "th",
    lng: "en-US",
    preload: readdirSync(join(__dirname, "locales")).filter((fileName) => {
      const joinedPath = join(join(__dirname, "locales"), fileName);
      const isDirectory = lstatSync(joinedPath).isDirectory();
      return isDirectory;
    }),
    backend: {
      loadPath: join(__dirname, "locales", "{{lng}}", "{{ns}}.json"),
    },
  });
} catch (error) {
  logger.error(error, "Error initializing i18next");
}

// Configure in client
logger.info("Adding data and handlers to the main system...");

client.mode = process.env.npm_lifecycle_event || "start";
client.configs = configs;
client.logger = logger;
client.i18n = i18next;
client.temp = {
  startup: {
    start: startTime,
    end: 0,
  },
};
client.player = new DisTube(client, {
  plugins: [
    new DeezerPlugin(),
    new SpotifyPlugin(),
    new SoundCloudPlugin(),
    new YtDlpPlugin({ update: false }),
  ],
  customFilters: client.configs.filters,
});

// Read the content file in the handlers.
client.logger.info("Loading all commands and events...");

const handlersPath = join(__dirname, "handlers");
const handlerFiles = readdirSync(handlersPath);

for (const handler of handlerFiles) {
  require(`${handlersPath}/${handler}`)(client);
}

// Checking for update from Github if in dev mode
if (client.mode === "dev") updateChecker();

// Start connecting to the server.
client.logger.info("Connecting to the backend and logging in...");

initializeApp(client.configs.server);

if (client.mode !== "start") {
  connectDatabaseEmulator(
    getDatabase(),
    client.configs.emulators.database.host,
    client.configs.emulators.database.port,
  );
}

// Start logging in and working
client.login(client.configs.token);
