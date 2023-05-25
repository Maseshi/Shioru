const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
	"enable": true,
	"name": "ban",
	"description": "Ban members within the server.",
	"category": "manager",
	"permissions": {
		"user": [PermissionsBitField.Flags.BanMembers],
		"client": [
			PermissionsBitField.Flags.SendMessages,
			PermissionsBitField.Flags.BanMembers
		]
	},
	"usage": "ban <member> [days(Number)] [reason(String)]",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"th": "แบน"
		},
		"description": module.exports.description,
		"description_localizations": {
			"th": "แบนสมาชิกภายในเซิร์ฟเวอร์"
		},
		"options": [
			{
				"type": 6,
				"name": "member",
				"name_localizations": {
					"th": "สมาชิก"
				},
				"description": "Members you want to ban.",
				"description_localizations": {
					"th": "สมาชิกที่คุณต้องการแบน"
				},
				"required": true
			},
			{
				"type": 10,
				"name": "days",
				"name_localizations": {
					"th": "วัน"
				},
				"description": "The amount of days you wish to ban the member for.",
				"description_localizations": {
					"th": "จำนวนวันที่คุณต้องการแบนสมาชิก"
				},
				"required": false,
				"min_value": 0,
				"max_value": 7
			},
			{
				"type": 3,
				"name": "reason",
				"name_localizations": {
					"th": "เหตุผล"
				},
				"description": "The reason for the ban.",
				"description_localizations": {
					"th": "เหตุผลในการแบน"
				},
				"required": false
			}
		]
	},
	async execute(interaction) {
		const inputMember = interaction.options.getMember("member");
		const inputDays = interaction.options.getNumber("days") ?? 0;
		const inputReason = interaction.options.getString("reason") ?? interaction.client.translate.commands.ban.no_reason;

		const member = await interaction.guild.members.fetch(inputMember.id);
		const banned = await interaction.guild.bans.fetch(inputMember.id);

		if (!member) return await interaction.editReply(interaction.client.translate.commands.ban.user_not_found);
		if (!banned) return await interaction.reply(interaction.client.translate.commands.ban.member_has_banned);

		const memberPosition = inputMember.roles.highest.position;
		const authorPosition = interaction.member.roles.highest.position;

		if (authorPosition < memberPosition) return await interaction.reply(interaction.client.translate.commands.ban.members_have_a_higher_role);
		if (!inputMember.bannable) return await interaction.reply(interaction.client.translate.commands.ban.members_have_a_higher_role_than_me);

		const baned = await interaction.guild.bans.create(member, {
			"deleteMessageDays": inputDays,
			"reason": inputReason
		});
		const authorUsername = interaction.user.username;
		const memberAvatar = baned.user.avatarURL();
		const memberUsername = baned.user.username;

		let embedTitle = interaction.client.translate.commands.ban.banned_for_time.replace("%s1", memberUsername).replace("%s2", inputDays);

		if (!inputDays) embedTitle = interaction.client.translate.commands.ban.permanently_banned.replace("%s", memberUsername);

		const banEmbed = new EmbedBuilder()
			.setTitle(embedTitle)
			.setDescription(interaction.client.translate.commands.ban.reason_for_ban.replace("%s1", authorUsername).replace("%s2", inputReason))
			.setColor("Orange")
			.setTimestamp()
			.setThumbnail(memberAvatar);

		await interaction.reply({ "embeds": [banEmbed] });
	}
};