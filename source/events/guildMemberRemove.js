const { Events, EmbedBuilder } = require("discord.js");
const {
	submitNotification,
	initializeData,
} = require("../utils/databaseUtils");

module.exports = {
	name: Events.GuildMemberRemove,
	once: false,
	async execute(member) {
		if (member.user.bot) return;

		const memberFetch = await member.user.fetch();
		const memberColor = memberFetch.accentColor;
		const memberTag = member.user.tag;
		const memberAvatar = member.user.displayAvatarURL();
		const guildMemberRemoveEmbed = new EmbedBuilder()
			.setTitle(memberTag)
			.setDescription(
				member.client.i18n.t("events.guildMemberRemove.user_has_exited"),
			)
			.setTimestamp()
			.setColor(memberColor)
			.setThumbnail(memberAvatar);

		await initializeData(member.client, member.guild);
		await submitNotification(
			member.client,
			member.guild,
			Events.GuildMemberRemove,
			guildMemberRemoveEmbed,
		);
	},
};
