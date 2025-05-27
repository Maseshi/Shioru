const { Events, EmbedBuilder, Colors } = require("discord.js");
const { webhookSend } = require("../utils/clientUtils");
const { logger } = require("../utils/consoleUtils");
const configs = require("../configs/data");

module.exports = {
  name: Events.Debug,
  once: false,
  execute(info) {
    const webhookLogEmbed = new EmbedBuilder()
      .setTimestamp()
      .setColor(Colors.Yellow)
      .setTitle("📜・Debug")
      .setDescription(`\`\`\`${info}\`\`\``);

    webhookSend(configs.logger.debug, {
      embeds: [webhookLogEmbed],
    });
    logger.debug(info);
  },
};
