const { EmbedBuilder } = require("discord.js");

module.exports = {
	"name": "about",
	"description": "See information about bots.",
	"category": "me",
	"permissions": {
		"client": ["SEND_MESSAGES"]
	}
};

module.exports.command = {
	"enable": true,
	"usage": "about",
	"aliases": ["information", "botinfo", "เกี่ยวกับ", "เกี่ยวกับบอท"],
	async execute(client, message, args) {
		const clientFetch = await client.user.fetch();
		const clientAvatar = client.user.avatarURL();
		const clientUsername = client.user.username;
		const clientColor = clientFetch.accentColor;
		const contentUpdate = client.config.update;
		const aboutEmbed = new EmbedBuilder()
			.setTitle(client.translate.commands.about.my_profile)
			.setDescription(client.translate.commands.about.my_profile_detail.replace("%s", clientUsername))
			.setColor(clientColor)
			.setTimestamp(new Date(contentUpdate))
			.setAuthor({ "name": clientUsername, "iconURL": clientAvatar, "url": "https://shiorus.web.app/" })
			.setFooter({ "text": client.translate.commands.about.update_on, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/fountain-pen_1f58b-fe0f.png" });

		message.channel.send({ "embeds": [aboutEmbed] });
	}
}

module.exports.interaction = {
	"enable": true,
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"en-US": "about",
			"th": "เกี่ยวกับ"
		},
		"description": module.exports.description,
		"description_localizations": {
			"en-US": "See information about bots.",
			"th": "ดูข้อมูลเกี่ยวกับบอท"
		},
	},
	async execute(interaction) {
		const clientFetch = await interaction.client.user.fetch();
		const clientAvatar = interaction.client.user.avatarURL();
		const clientUsername = interaction.client.user.username;
		const clientColor = clientFetch.accentColor;
		const contentUpdate = interaction.client.config.update;
		const aboutEmbed = new EmbedBuilder()
			.setTitle(interaction.client.translate.commands.about.my_profile)
			.setDescription(interaction.client.translate.commands.about.my_profile_detail.replace("%s", clientUsername))
			.setColor(clientColor)
			.setTimestamp(new Date(contentUpdate))
			.setAuthor({ "name": clientUsername, "iconURL": clientAvatar, "url": "https://shiorus.web.app/" })
			.setFooter({ "text": interaction.client.translate.commands.about.update_on, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/fountain-pen_1f58b-fe0f.png" });

		await interaction.editReply({ "embeds": [aboutEmbed] });
	}
};