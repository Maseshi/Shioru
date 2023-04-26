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
            "th": "ปิง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ตรวจสอบความหน่วงและ API Latency ของเซิร์ฟเวอร์"
        }
    },
    async execute(interaction) {
        const message = await interaction.reply({ "content": interaction.client.translate.commands.ping.waiting, "fetchReply": true });
        const roundtrip = message.createdTimestamp - interaction.createdTimestamp;
        const websocket = interaction.client.ws.ping;
        
        const pingEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.ping.connection)
            .setDescription(interaction.client.translate.commands.ping.info.replace("%s1", roundtrip).replace("%s2", websocket));

        await interaction.editReply({
            "content": interaction.client.translate.commands.ping.result,
            "embeds": [pingEmbed]
        });
    }
}
