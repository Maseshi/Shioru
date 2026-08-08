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
  ShardingManager,
  ShardEvents,
  EmbedBuilder,
  Colors,
} = require("discord.js");
const { webhookSend } = require("./utils/clientUtils");
const { startScreen } = require("./utils/consoleUtils");
const { logger } = require("./utils/logUtils");
const {
  updateChecker,
  systemMetricsSubmitter,
  statisticsSubmitter,
  healthCheckSubmitter,
} = require("./utils/servicesUtils");
const configs = require("./configs/data");

const child = logger.child({}, { msgPrefix: "[Shard] " });
const mode = process.env.npm_lifecycle_event || "start";
const manager = new ShardingManager("./source/main.js", {
  respawn: true,
  shardList: "auto",
  token: configs.token,
  totalShards: "auto",
});

const sendShardWebhook = (message) => {
  try {
    const request = webhookSend(configs.logger.shard, message);
    if (!request) return;

    Promise.resolve(request).catch((error) =>
      child.warn(error, "Unable to send shard lifecycle webhook."),
    );
  } catch (error) {
    child.warn(error, "Unable to create shard lifecycle webhook request.");
  }
};

const bootstrap = async () => {
  startScreen();

  if (mode !== "dev") await updateChecker();
  if (mode === "start") systemMetricsSubmitter();
  if (mode === "start") healthCheckSubmitter();
};

manager.on("shardCreate", (shard) => {
  const shardID = shard.id;
  const shardAt = shardID + 1;
  const shardTotal = manager.totalShards;
  const launchEmbed = new EmbedBuilder().setTimestamp();

  launchEmbed
    .setColor(Colors.Blue)
    .setTitle("🆙・Launching Shard")
    .setDescription("A shard has just been launched")
    .setFields([
      {
        name: "🆔 ID",
        value: shardID.toString(),
        inline: true,
      },
      {
        name: "🏷️ Total Shards",
        value: `${shardAt}/${shardTotal}`,
        inline: true,
      },
      {
        name: "📃 State",
        value: "Starting Up...",
        inline: true,
      },
    ]);
  sendShardWebhook({ embeds: [launchEmbed] });
  child.info(`Launched shard id ${shardID} [${shardAt}/${shardTotal}]`);

  shard.on(ShardEvents.Death, (shardProcess) => {
    const logEmbed = new EmbedBuilder().setTimestamp();
    logEmbed
      .setColor(Colors.Red)
      .setTitle("⚠️・Shard Death")
      .setDescription("A shard has been closing unexpectedly")
      .setFields([
        {
          name: "🆔 ID",
          value: shardID.toString(),
          inline: true,
        },
        {
          name: "🏷️ Total Shards",
          value: `${shardAt}/${shardTotal}`,
          inline: true,
        },
        {
          name: "📃 State",
          value: "Death",
          inline: true,
        },
      ]);
    sendShardWebhook({ embeds: [logEmbed] });
    child.error(
      {
        exitCode: shardProcess.exitCode,
        pid: shardProcess.pid,
        signalCode: shardProcess.signalCode,
      },
      `Closing shard id ${shardID} unexpectedly`,
    );

    if (shardProcess.exitCode === null) {
      const nullEmbed = new EmbedBuilder().setTimestamp();
      nullEmbed
        .setColor(Colors.Red)
        .setTitle("⚠️・Shard Death")
        .setDescription("A shard exited with NULL error code!")
        .setFields([
          {
            name: "🆔 ID",
            value: shardID.toString(),
            inline: true,
          },
          {
            name: "🏷️ Total Shards",
            value: `${shardAt}/${shardTotal}`,
            inline: true,
          },
          {
            name: "📃 State",
            value: "Death",
            inline: true,
          },
          {
            name: "PID",
            value: String(shardProcess.pid),
            inline: true,
          },
          {
            name: "Exit Code",
            value: String(shardProcess.exitCode),
            inline: true,
          },
        ]);
      sendShardWebhook({ embeds: [nullEmbed] });
      child.error(
        {
          pid: shardProcess.pid,
          signalCode: shardProcess.signalCode,
        },
        `Shard id ${shardID} exited with NULL error code!`,
      );
    }
  });
  shard.on(ShardEvents.Disconnect, () => {
    const logEmbed = new EmbedBuilder().setTimestamp();
    logEmbed
      .setColor(Colors.Default)
      .setTitle("🔌・Shard Disconnect")
      .setDescription("A shard has disconnected from the event.")
      .setFields([
        {
          name: "🆔 ID",
          value: shardID.toString(),
          inline: true,
        },
        {
          name: "🏷️ Total Shards",
          value: `${shardAt}/${shardTotal}`,
          inline: true,
        },
        {
          name: "📃 State",
          value: "Disconnect",
          inline: true,
        },
      ]);
    sendShardWebhook({ embeds: [logEmbed] });
    child.warn(`Shard id ${shardID} has disconnected from the event.`);
  });
  shard.on(ShardEvents.Error, (error) => {
    const logEmbed = new EmbedBuilder().setTimestamp();
    logEmbed
      .setColor(Colors.Red)
      .setTitle("⚠️・Shard Error")
      .setDescription("A shard is having problems.")
      .setFields([
        {
          name: "🆔 ID",
          value: shardID.toString(),
          inline: true,
        },
        {
          name: "🏷️ Total Shards",
          value: `${shardAt}/${shardTotal}`,
          inline: true,
        },
        {
          name: "📃 State",
          value: "Error",
          inline: true,
        },
      ]);
    sendShardWebhook({ embeds: [logEmbed] });
    child.fatal(error, `Shard id ${shardID} is having problems.`);
  });
  shard.on(ShardEvents.Ready, () => {
    const logEmbed = new EmbedBuilder().setTimestamp();
    logEmbed
      .setColor(Colors.Green)
      .setTitle("✅・Shard Ready")
      .setDescription("A shard is ready")
      .setFields([
        {
          name: "🆔 ID",
          value: shardID.toString(),
          inline: true,
        },
        {
          name: "🏷️ Total Shards",
          value: `${shardAt}/${shardTotal}`,
          inline: true,
        },
        {
          name: "📃 State",
          value: "Ready",
          inline: true,
        },
      ]);
    sendShardWebhook({ embeds: [logEmbed] });
    child.info(`Shard ${shardID} is ready [${shardAt}/${shardTotal}]`);
  });
  shard.on(ShardEvents.Reconnecting, () => {
    const logEmbed = new EmbedBuilder().setTimestamp();
    logEmbed
      .setColor(Colors.Blue)
      .setTitle("⌛・Shard Reconnecting")
      .setDescription("Reconnecting shard")
      .setFields([
        {
          name: "🆔 ID",
          value: shardID.toString(),
          inline: true,
        },
        {
          name: "🏷️ Total Shards",
          value: `${shardAt}/${shardTotal}`,
          inline: true,
        },
        {
          name: "📃 State",
          value: "Reconnecting",
          inline: true,
        },
      ]);
    sendShardWebhook({ embeds: [logEmbed] });
    child.info(`Reconnecting shard id ${shardID}`);
  });
  shard.on(ShardEvents.Resume, () => {
    const logEmbed = new EmbedBuilder().setTimestamp();
    logEmbed
      .setColor(Colors.Blue)
      .setTitle("▶️・Shard Resume")
      .setDescription("Shard is resuming.")
      .setFields([
        {
          name: "🆔 ID",
          value: shardID.toString(),
          inline: true,
        },
        {
          name: "🏷️ Total Shards",
          value: `${shardAt}/${shardTotal}`,
          inline: true,
        },
        {
          name: "📃 State",
          value: "Resume",
          inline: true,
        },
      ]);
    sendShardWebhook({ embeds: [logEmbed] });
    child.info(`Shard id ${shardID} is resuming`);
  });
  shard.on(ShardEvents.Spawn, (shardProcess) => {
    const logEmbed = new EmbedBuilder().setTimestamp();
    logEmbed
      .setColor(Colors.Red)
      .setTitle("🥚・Shard Spawn")
      .setDescription("The shard is starting to work.")
      .setFields([
        {
          name: "🆔 ID",
          value: shardID.toString(),
          inline: true,
        },
        {
          name: "🏷️ Total Shards",
          value: `${shardAt}/${shardTotal}`,
          inline: true,
        },
        {
          name: "📃 State",
          value: "Spawn",
          inline: true,
        },
      ]);
    sendShardWebhook({ embeds: [logEmbed] });
    child.info(
      { pid: shardProcess.pid },
      `Spawning shard id ${shardID} [${shardAt}/${shardTotal}]`,
    );
  });
});

bootstrap()
  .then(() => manager.spawn())
  .then(() => {
    if (mode === "start") statisticsSubmitter(manager);
  })
  .catch((error) => {
    child.fatal(error, "Failed to bootstrap the shard manager.");
    process.exitCode = 1;
  });
