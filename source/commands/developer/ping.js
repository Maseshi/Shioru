const { EmbedBuilder } = require("discord.js");

module.exports = {
    "name": "ping",
    "description": "Check the ping and api latency of the bot.",
    "category": "developer",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "ping",
    "aliases": ["ปิง", "การเชื่อมต่อ"],
    async execute(client, message, args) {
        const msg = await message.channel.send(client.translate.commands.ping.waiting);
        const ping = Math.round((msg.createdTimestamp - message.createdTimestamp) - client.ws.ping);
        const api = Math.round(client.ws.ping);
        const pingEmbed = new EmbedBuilder()
            .setTitle(client.translate.commands.ping.connection)
            .setDescription(client.translate.commands.ping.info.replace("%s1", ping).replace("%s2", api))

        msg.edit({
            "content": client.translate.commands.ping.result,
            "embeds": [pingEmbed]
        });
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "ping",
            "th": "ปิง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Check the ping and api latency of the bot.",
            "th": "ตรวจสอบความหน่วงและ API Latency ของบอท"
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
