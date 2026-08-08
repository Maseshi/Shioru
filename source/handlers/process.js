const discord = require("discord.js");
const { webhookSend } = require("../utils/clientUtils");
const packages = require("../../package.json");
const { logMetrics } = require("../utils/metricsUtils");

const createShutdownHandler = (
  client,
  { clearTimer = clearInterval, exit = process.exit.bind(process) } = {},
) => {
  let shuttingDown = false;

  return async (reason) => {
    if (shuttingDown) return;
    shuttingDown = true;

    client.logger.info({ reason }, "Bot is shutting down.");
    logMetrics("shutdown");
    for (const interval of client.temp.intervals) clearTimer(interval);
    client.temp.intervals.clear();
    for (const unsubscribe of client.temp.listeners.values()) unsubscribe();
    client.temp.listeners.clear();
    client.guildSettings.clear();

    try {
      await client.destroy();
    } catch (error) {
      client.logger.error(error, "Failed to destroy the Discord client.");
    } finally {
      exit(0);
    }
  };
};

const registerProcessHandlers = (client) => {
  const systemReports = () => {
    const cpuUsage = `${(process.cpuUsage().user / 1024 / 1024).toFixed(2)}%`;
    const memoryUsage = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%/${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)}%`;

    return {
      usage: {
        cpu: cpuUsage,
        memory: memoryUsage,
      },
      version: {
        package: packages.version,
        discord: discord.version,
        node: process.version,
      },
    };
  };

  const webhookLogEmbed = new discord.EmbedBuilder()
    .setColor(discord.Colors.Red)
    .setTitle("⚠️・Error")
    .setTimestamp();
  const usageEmbedFields = [
    {
      name: "CPU",
      value: systemReports().usage.cpu,
      inline: true,
    },
    {
      name: "Memory",
      value: systemReports().usage.memory,
      inline: true,
    },
  ];
  const versionEmbedFields = [
    {
      name: "Package",
      value: systemReports().version.package,
      inline: true,
    },
    {
      name: "discord.js",
      value: systemReports().version.node,
      inline: true,
    },
    {
      name: "Node.js",
      value: systemReports().version.discord,
      inline: true,
    },
  ];

  // Limit the creation of events in the process.
  process.setMaxListeners(0);
  const shutdown = createShutdownHandler(client);

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
  process.once("SIGUSR1", () => void shutdown("SIGUSR1"));
  process.once("SIGUSR2", () => void shutdown("SIGUSR2"));
  process.once("disconnect", () => void shutdown("IPC channel disconnected"));
  process.on("rejectionHandled", (promise) => {
    webhookLogEmbed.setDescription(`\`\`\`${promise}\`\`\``).setFields([
      {
        name: "Event",
        value: "rejectionHandled",
        inline: true,
      },
      ...usageEmbedFields,
      ...versionEmbedFields,
    ]);
    webhookSend(client.configs.logger.error, {
      embeds: [webhookLogEmbed],
    });
    client.logger.fatal(systemReports(), "Rejection Handled");
    client.logger.fatal(promise);
  });
  process.on("uncaughtException", (err, origin) => {
    webhookLogEmbed
      .setDescription(`Error:\`\`\`${err}\`\`\`\nOrigin:\`\`\`${origin}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: "uncaughtException",
          inline: true,
        },
        ...versionEmbedFields,
      ]);
    webhookSend(client.configs.logger.error, {
      embeds: [webhookLogEmbed],
    });
    client.logger.fatal(systemReports(), "Uncaught Exception");
    client.logger.fatal(err);
    client.logger.fatal(origin);

    if (client.mode === "dev") process.exit(1);
  });
  process.on("uncaughtExceptionMonitor", (err, origin) => {
    webhookLogEmbed
      .setDescription(`Error:\`\`\`${err}\`\`\`\nOrigin:\`\`\`${origin}\`\`\``)
      .setFields([
        {
          name: "Event",
          value: "uncaughtExceptionMonitor",
          inline: true,
        },
        ...versionEmbedFields,
      ]);
    webhookSend(client.configs.logger.error, {
      embeds: [webhookLogEmbed],
    });
    client.logger.fatal(systemReports(), "Uncaught Exception Monitor");
    client.logger.fatal(err);
    client.logger.fatal(origin);
  });
  process.on("unhandledRejection", (reason, promise) => {
    webhookLogEmbed
      .setDescription(
        `Reason:\`\`\`${reason}\`\`\`\nPromise:\`\`\`${promise}\`\`\``,
      )
      .setFields([
        {
          name: "Event",
          value: "unhandledRejection",
          inline: true,
        },
        ...versionEmbedFields,
      ]);
    webhookSend(client.configs.logger.error, {
      embeds: [webhookLogEmbed],
    });
    client.logger.fatal(systemReports(), "Unhandled Rejection");
    client.logger.fatal(reason);
    client.logger.fatal(promise);

    if (client.mode === "dev") process.exit(1);
  });
  process.on("exit", (code) => {
    client.logger.trace(code, "Bot is about to shut down with the code");
  });
};

module.exports = registerProcessHandlers;
module.exports.createShutdownHandler = createShutdownHandler;
