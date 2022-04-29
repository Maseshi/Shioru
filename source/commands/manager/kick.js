module.exports.run = async (client, message, args) => {
	const inputMember = args[0];
	let inputReason = args.slice(1).join(" ");

	if (!inputMember) return message.reply(client.translate.commands.kick.empty);

	const member = message.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));

	if (!member) return message.reply(client.translate.commands.kick.can_not_find_user);

	const memberPosition = member.roles.highest.position;
	const authorPosition = message.member.roles.highest.position;

	if (authorPosition < memberPosition) return message.reply(client.translate.commands.kick.members_have_a_higher_role);
	if (!member.kickable) return message.reply(client.translate.commands.kick.members_have_a_higher_role_than_me);
	if (!inputReason) inputReason = "";

	const kicked = await member.kick({
		"reason": inputReason
	});
	const authorUsername = message.author.username;
	const memberAvatar = kicked.user.avatarURL();
	const memberUsername = kicked.user.username;
	const time = new Date();

	if (!inputReason) inputReason = client.translate.commands.kick.no_reason;

	message.channel.send({
		"embeds": [
			{
				"title": client.translate.commands.kick.kicked_out.replace("%s", memberUsername),
				"description": client.translate.commands.kick.reason_for_kick.replace("%s1", authorUsername).replace("%s2", inputReason),
				"color": 16098851,
				"timestamp": time,
				"thumbnail": {
					"url": memberAvatar
				}
			}
		]
	});
};

module.exports.help = {
	"name": "kick",
	"description": "Kick members from the server.",
	"usage": "kick <member: id, username, tag> (reason)",
	"category": "manager",
	"aliases": ["k", "เตะ"],
	"userPermissions": ["KICK_MEMBERS"],
	"clientPermissions": ["SEND_MESSAGES", "KICK_MEMBERS"]
};

module.exports.interaction = {
	"data": {
		"name": module.exports.help.name,
		"name_localizations": {
            "en-US": "kick",
            "th": "เตะ"
        },
		"description": module.exports.help.description,
		"description_localizations": {
            "en-US": "Kick members from the server.",
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
		const inputMember = interaction.options.get("member").value;
		let inputReason = interaction.options.get("reason");

		const member = interaction.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));

		if (!member) return await interaction.editReply(interaction.client.translate.commands.kick.can_not_find_user);

		const memberPosition = member.roles.highest.position;
		const authorPosition = interaction.member.roles.highest.position;

		if (authorPosition < memberPosition) return await interaction.editReply(interaction.client.translate.commands.kick.members_have_a_higher_role);
		if (!member.kickable) return await interaction.editReply(interaction.client.translate.commands.kick.members_have_a_higher_role_than_me);
		if (!inputReason) inputReason = "";

		const kicked = await member.kick({
			"reason": inputReason
		});
		const authorUsername = interaction.user.username;
		const memberAvatar = kicked.user.avatarURL();
		const memberUsername = kicked.user.username;
		const time = new Date();

		if (!inputReason) inputReason = interaction.client.translate.commands.kick.no_reason;

		await interaction.editReply({
			"embeds": [
				{
					"title": interaction.client.translate.commands.kick.kicked_out.replace("%s", memberUsername),
					"description": interaction.client.translate.commands.kick.reason_for_kick.replace("%s1", authorUsername).replace("%s2", inputReason),
					"color": 16098851,
					"timestamp": time,
					"thumbnail": {
						"url": memberAvatar
					}
				}
			]
		});
	}
};