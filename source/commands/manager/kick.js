const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
	"enable": true,
	"name": "kick",
	"description": "Kick members from the server.",
	"category": "manager",
	"permissions": {
		"user": [PermissionsBitField.Flags.KickMembers],
		"client": [
			PermissionsBitField.Flags.SendMessages,
			PermissionsBitField.Flags.KickMembers
		]
	},
	"usage": "kick <member> [reason(String)]",
	"function": {
		"command": {}
	}
};

module.exports.function.command = {
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"th": "เตะ"
		},
		"description": module.exports.description,
		"description_localizations": {
			"th": "เตะสมาชิกจากออกเซิร์ฟเวอร์"
		},
		"options": [
			{
				"type": 6,
				"name": "member",
				"name_localizations": {
					"th": "สมาชิก"
				},
				"description": "Members who want to kick out of the server.",
				"description_localizations": {
					"th": "สมาชิกที่ต้องการเตะออกจากเซิร์ฟเวอร์"
				},
				"required": true
			},
			{
				"type": 3,
				"name": "reason",
				"name_localizations": {
					"th": "เหตุผล"
				},
				"description": "The reason for kicking the said member from the server.",
				"description_localizations": {
					"th": "เหตุผลในการเตะสมาชิกดังกล่าวออกจากเซิร์ฟเวอร์"
				},
				"required": false
			}
		]
	},
	async execute(interaction) {
		const inputMember = interaction.options.getMember("member");
		const inputReason = interaction.options.getString("reason") ?? interaction.client.translate.commands.kick.no_reason;

		const member = await interaction.guild.members.fetch(inputMember.id);

		if (!member) return await interaction.editReply(interaction.client.translate.commands.kick.can_not_find_user);

		const memberPosition = inputMember.roles.highest.position;
		const authorPosition = interaction.member.roles.highest.position;

		if (authorPosition < memberPosition) return await interaction.reply(interaction.client.translate.commands.kick.members_have_a_higher_role);
		if (!inputMember.kickable) return await interaction.reply(interaction.client.translate.commands.kick.members_have_a_higher_role_than_me);

		const kicked = await inputMember.kick({ "reason": inputReason });
		const authorUsername = interaction.user.username;
		const memberAvatar = kicked.user.avatarURL();
		const memberUsername = kicked.user.username;

		const kickEmbed = new EmbedBuilder()
			.setTitle(interaction.client.translate.commands.kick.kicked_out.replace("%s", memberUsername))
			.setDescription(interaction.client.translate.commands.kick.reason_for_kick.replace("%s1", authorUsername).replace("%s2", inputReason))
			.setColor("Orange")
			.setTimestamp()
			.setThumbnail(memberAvatar);

		await interaction.reply({ "embeds": [kickEmbed] });
	}
};