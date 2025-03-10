const {
	Events,
	PermissionFlagsBits,
	EmbedBuilder,
	AttachmentBuilder,
	ChannelType,
} = require("discord.js");
const { getDatabase, ref, child, update } = require("firebase/database");
const { registeringCommands } = require("../utils/clientUtils");
const { initializeData, fetchStatistics } = require("../utils/databaseUtils");

module.exports = {
	name: Events.GuildCreate,
	once: false,
	async execute(guild) {
		await initializeData(guild.client, guild);
		registeringCommands(guild.client, true);
		fetchStatistics("POST", "size", guild.client);
	},
};
