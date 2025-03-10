const discord = require("discord.js");
const pino = require("pino");
const { getApps } = require("firebase/app");
const { join } = require("node:path");
const { readFileSync } = require("node:fs");
const { webhookSend } = require("./clientUtils");
const packages = require("../../package.json");

/**
 * The startScreen function displays the start screen of the application.
 * It uses the colorize function to apply colors to the text.
 * The function reads ASCII art files and replaces placeholders with package version characters.
 * It then writes the formatted text to the standard output.
 * If the application is running in development mode, it also displays a development mode message.
 * If the application is running in sharding mode, it displays a sharding mode message.
 *
 * @returns {void}
 */
const startScreen = () => {
  const { bright, blue, yellow } = colorize();
  const shioruText = readFileSync("./source/assets/ascii/shioru.txt", "utf-8");
  const devModeText = readFileSync(
    "./source/assets/ascii/development.txt",
    "utf-8",
  );
  const shardingModeText = readFileSync(
    "./source/assets/ascii/sharding.txt",
    "utf-8",
  );

  process.stdout.write(
    blue(
      bright(
        shioruText
          .replace("%char1", packages.version.charAt(0))
          .replace("%char2", packages.version.charAt(2))
          .replace("%char3", packages.version.charAt(4)),
      ),
    ),
  );
  process.stdout.write("\n");
  process.stdout.write(
    "Copyright (C) 2020-2024 Chaiwat Suwannarat. All rights reserved.",
  );
  process.stdout.write("\n");
  process.stdout.write(
    "Website: https://shiorus.web.app/, License: MIT & CC0-1.0",
  );
  process.stdout.write("\n");

  /**
   * Check the work system from the script in packages.json.
   * Example of use in development mode: npm run dev
   * Production mode is "start"
   * Development mode is "dev" or "serve"
   */
  if (process.env?.npm_lifecycle_event === "dev") {
    process.stdout.write("\n");
    process.stdout.write(yellow(devModeText));
    process.stdout.write("\n");
  }
  if (process.env?.npm_lifecycle_event === "serve") {
    process.stdout.write("\n");
    process.stdout.write(yellow(shardingModeText));
    process.stdout.write("\n");
  }
};

/**
 * Handles and logs errors that occur during the execution of a command or function.
 *
 * @param {Object} client - The Discord client object.
 * @param {Object} message - The message object where the error occurred.
 * @param {string} name - The name of the command or function where the error occurred.
 * @param {Error} error - The error object that occurred.
 * @param {boolean} [silent=false] - Flag to determine if the error should be handled silently.
 * @returns {Error} The error object that occurred.
 */
const catchError = async (client, message, name, error, silent = false) => {
  if (!name)
    return client.logger.warn(
      "Please specify the name of the command or function.",
    );
  if (!error)
    return client.logger.warn("Please forward any errors that have occurred.");
  if (message) {
    const roundtrip = Date.now() - message.createdTimestamp;
    const websocket = client.ws.ping;
    const catchErrorEmbed = new discord.EmbedBuilder()
      .setColor(discord.Colors.Red)
      .setTitle(client.i18n.t("utils.consoleUtils.error_occurred"))
      .setDescription(
        client.i18n.t("utils.consoleUtils.error_detail", {
          command_name: name,
          version: packages.version,
          time: new Date(),
          server_status: !getApps().length
            ? client.i18n.t("utils.consoleUtils.server_abnormal")
            : client.i18n.t("utils.consoleUtils.server_normal"),
          roundtrip_latency: roundtrip,
          websocket_latency: websocket,
          error,
          issues_link:
            "https://github.com/Maseshi/Shioru/issues/new?assignees=&labels=bag&projects=&template=bug_report.md&title=",
        }),
      )
      .setTimestamp()
      .setFooter({ text: client.i18n.t("utils.consoleUtils.report_issues") });

    const contents = {
      content: "",
      embeds: [catchErrorEmbed],
      ephemeral: true,
    };

    if (client.configs.logger.error.enable) {
      const errorWebhook = new discord.WebhookClient({
        url: client.configs.logger.error.webhookURL,
      });

      webhookSend(
        errorWebhook,
        client.configs.logger.error.webhookName,
        client.configs.logger.error.webhookAvatarURL,
        "⚠️・error",
        client.i18n.t("utils.consoleUtils.error_detail", {
          command_name: name,
          version: packages.version,
          time: new Date(),
          server_status: !getApps().length
            ? client.i18n.t("utils.consoleUtils.server_abnormal")
            : client.i18n.t("utils.consoleUtils.server_normal"),
          roundtrip_latency: roundtrip,
          websocket_latency: websocket,
          error,
          issues_link:
            "https://github.com/Maseshi/Shioru/issues/new?assignees=&labels=bag&projects=&template=bug_report.md&title=",
        }),
        [],
        "Red",
      );
    }

    // Check type of message is interaction or not and check is should be handled silently
    if (!message.content && !silent) {
      if (message.deferred) {
        await message.editReply(contents);
      } else if (message.replied) {
        await message.followUp(contents);
      } else {
        await message.reply(contents);
      }
    }
  }

  client.logger.error(
    {
      name,
      silent,
      version: {
        package: packages.version,
        discord: discord.version,
        node: process.version,
      },
    },
    "Catch Error",
  );
  client.logger.error(error);
  return error;
};

/**
 * Returns an object with colorization functions for text.
 *
 * @returns {Object} An object with colorization functions.
 *
 * @example
 *
 * const colors = colorize();
 * console.log(colors.red('This is red text'));
 * console.log(colors.bgBlue('This has a blue background'));
 */
const colorize = () => {
  const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",

    bgBlack: "\x1b[40m",
    bgRed: "\x1b[41m",
    bgGreen: "\x1b[42m",
    bgYellow: "\x1b[43m",
    bgBlue: "\x1b[44m",
    bgMagenta: "\x1b[45m",
    bgCyan: "\x1b[46m",
    bgWhite: "\x1b[47m",
  };

  return {
    reset: (text) => colors.reset + text + colors.reset,
    bright: (text) => colors.bright + text + colors.reset,
    dim: (text) => colors.dim + text + colors.reset,
    underscore: (text) => colors.underscore + text + colors.reset,
    blink: (text) => colors.blink + text + colors.reset,
    reverse: (text) => colors.reverse + text + colors.reset,
    hidden: (text) => colors.hidden + text + colors.reset,

    black: (text) => colors.black + text + colors.reset,
    red: (text) => colors.red + text + colors.reset,
    green: (text) => colors.green + text + colors.reset,
    yellow: (text) => colors.yellow + text + colors.reset,
    blue: (text) => colors.blue + text + colors.reset,
    magenta: (text) => colors.magenta + text + colors.reset,
    cyan: (text) => colors.cyan + text + colors.reset,
    white: (text) => colors.white + text + colors.reset,

    bgBlack: (text) => colors.bgBlack + text + colors.reset,
    bgRed: (text) => colors.bgRed + text + colors.reset,
    bgGreen: (text) => colors.bgGreen + text + colors.reset,
    bgYellow: (text) => colors.bgYellow + text + colors.reset,
    bgBlue: (text) => colors.bgBlue + text + colors.reset,
    bgMagenta: (text) => colors.bgMagenta + text + colors.reset,
    bgCyan: (text) => colors.bgCyan + text + colors.reset,
    bgWhite: (text) => colors.bgWhite + text + colors.reset,
  };
};

/**
 * Initializes a logger using the pino library with multiple targets for logging.
 *
 * @returns {Object} The logger object.
 */
const logger = pino({
  name: packages.name,
  level: "trace",
  transport: {
    targets: [
      {
        target: "pino-pretty",
      },
      {
        level: "trace",
        target: "pino-pretty",
        options: {
          colorize: false,
          destination: join(__dirname, "..", "..", "logs", "app.log"),
          mkdir: true,
        },
      },
      {
        level: "fatal",
        target: "pino/file",
        options: {
          destination: join(__dirname, "..", "..", "logs", "fatal.json.log"),
          mkdir: true,
        },
      },
      {
        level: "error",
        target: "pino/file",
        options: {
          destination: join(__dirname, "..", "..", "logs", "error.json.log"),
          mkdir: true,
        },
      },
      {
        level: "warn",
        target: "pino/file",
        options: {
          destination: join(__dirname, "..", "..", "logs", "warn.json.log"),
          mkdir: true,
        },
      },
      {
        level: "info",
        target: "pino/file",
        options: {
          destination: join(__dirname, "..", "..", "logs", "info.json.log"),
          mkdir: true,
        },
      },
      {
        level: "debug",
        target: "pino/file",
        options: {
          destination: join(__dirname, "..", "..", "logs", "debug.json.log"),
          mkdir: true,
        },
      },
      {
        level: "trace",
        target: "pino/file",
        options: {
          destination: join(__dirname, "..", "..", "logs", "trace.json.log"),
          mkdir: true,
        },
      },
    ],
    dedupe: false,
  },
});

module.exports = {
  startScreen,
  catchError,
  colorize,
  logger,
};
