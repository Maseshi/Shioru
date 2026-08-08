const { Events, EmbedBuilder, Colors } = require("discord.js");
const { webhookSend } = require("../utils/clientUtils");
const { logger } = require("../utils/logUtils");
const configs = require("../configs/data");

module.exports = {
  name: Events.Warn,
  once: false,
  execute(info) {
    const webhookLogEmbed = new EmbedBuilder()
      .setTimestamp()
      .setColor(Colors.Orange)
      .setTitle("📜・Warn")
      .setDescription(`\`\`\`${info}\`\`\``);

    webhookSend(configs.logger.warn, {
      embeds: [webhookLogEmbed],
    });
    logger.warn(info);
  },
};
