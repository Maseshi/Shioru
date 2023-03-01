const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "ping",
    "description": "Check the ping and api latency of the bot.",
    "category": "developer",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "ping",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "ping",
            "th": "ปิง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Check the ping and api latency of the bot.",
            "th": "ตรวจสอบความหน่วงและ API Latency ของเซิร์ฟเวอร์"
        }
    },
    async execute(interaction) {
        const msg = await interaction.editReply(interaction.client.translate.commands.ping.waiting);
        const ping = Math.round((msg.createdTimestamp - interaction.createdTimestamp) - interaction.client.ws.ping);
        const api = Math.round(interaction.client.ws.ping);
        const pingEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.ping.connection)
            .setDescription(interaction.client.translate.commands.ping.info.replace("%s1", ping).replace("%s2", api))

        await interaction.editReply({
            "content": interaction.client.translate.commands.ping.result,
            "embeds": [pingEmbed]
        });
    }
}
