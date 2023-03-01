const { PermissionsBitField } = require("discord.js")

module.exports = {
	"enable": true,
	"name": "leave",
	"description": "Exits the current audio channel.",
	"category": "music",
	"permissions": {
		"client": [PermissionsBitField.Flags.SendMessages]
	},
	"usage": "leave",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
	"data": {
		"name": module.exports.name,
		"name_localizations": {
			"en-US": "leave",
			"th": "ออก"
		},
		"description": module.exports.description,
		"description_localizations": {
			"en-US": "Exits the current audio channel.",
			"th": "ออกจากช่องสัญญาณเสียงปัจจุบัน"
		}
	},
	async execute(interaction) {
		const queue = interaction.client.music.getQueue(interaction);

		const meChannel = interaction.guild.members.me.voice.channel;

		if (queue && interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.leave.another_player_is_playing);
		if (!meChannel) return await interaction.editReply(interaction.client.translate.commands.leave.not_in_any_channel);

		const connection = interaction.client.music.voices.get(meChannel.guild);

		connection.leave(meChannel.guild);
		await interaction.editReply(interaction.client.translate.commands.leave.now_leave);
	}
}