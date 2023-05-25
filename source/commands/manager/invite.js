const { EmbedBuilder, PermissionsBitField, OAuth2Scopes, PermissionFlagsBits } = require("discord.js");

module.exports = {
	"enable": true,
	"name": "invite",
	"description": "Create and receive invitation links to join the server.",
	"category": "manager",
	"permissions": {
		"user": [PermissionsBitField.Flags.CreateInstantInvite],
		"client": [
			PermissionsBitField.Flags.SendMessages,
			PermissionsBitField.Flags.CreateInstantInvite
		]
	},
	"usage": "invite: guild, me",
	"function": {
		"command": {}
	}
}

module.exports.function.command = {
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"th": "เชิญ"
		},
		"description": module.exports.description,
		"description_localizations": {
			"th": "สร้างและรับลิงค์คำเชิญเพื่อเข้าร่วมเซิร์ฟเวอร์"
		},
		"options": [
			{
				"type": 1,
				"name": "guild",
				"name_localizations": {
					"th": "กิลด์"
				},
				"description": "Create an invitation link for joining this server.",
				"description_localizations": {
					"th": "สร้างลิงค์คำเชิญสำหรับเข้าร่วมเซิร์ฟเวอร์นี้"
				}
			},
			{
				"type": 1,
				"name": "me",
				"name_localizations": {
					"th": "ฉัน"
				},
				"description": "Invite me to other servers.",
				"description_localizations": {
					"th": "เชิญฉันไปยังเซิร์ฟเวอร์อื่นๆ"
				}
			}
		]
	},
	async execute(interaction) {
		const subCommand = interaction.options.getSubcommand();

		switch (subCommand) {
			case "guild": {
				const invite = await interaction.channel.createInvite();
				const guildIcon = interaction.guild.iconURL();
				const inviteEmbed = new EmbedBuilder()
					.setTitle(interaction.client.translate.commands.invite.membership_invitation_card)
					.setDescription("||" + invite.url + "||")
					.setColor("LightGrey")
					.setFooter({ "text": interaction.client.translate.commands.invite.this_product_is_free, "iconURL": guildIcon });

				await interaction.reply({ "embeds": [inviteEmbed] });
				break;
			}
			case "me": {
				try {
					const link = interaction.client.generateInvite({
						"scopes": [
							OAuth2Scopes.ApplicationsCommands,
							OAuth2Scopes.Bot
						],
						"permissions": [PermissionFlagsBits.Administrator]
					});

					await interaction.reply(link);
				} catch (error) {
					await interaction.reply(interaction.client.translate.commands.invite.can_not_create_invite_link);
					console.group();
					console.error(error);
					console.groupEnd();
				}
				break;
			}
		}
	}
}