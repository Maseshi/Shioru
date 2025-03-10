const { Events, EmbedBuilder, Colors } = require("discord.js");
const { webhookSend } = require("../utils/clientUtils");
const { logger } = require("../utils/consoleUtils");
const configs = require("../configs/data");

module.exports = {
	name: Events.Error,
	once: false,
	execute(error) {
		const webhookLogEmbed = new EmbedBuilder()
			.setTimestamp()
			.setColor(Colors.Red)
			.setTitle("⚠️・Error")
			.setDescription(`\`\`\`${error}\`\`\``);

		webhookSend(configs.logger.error, {
			embeds: [webhookLogEmbed],
		});
		logger.error(error);
	},
};
