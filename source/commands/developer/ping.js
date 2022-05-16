module.exports.run = async (client, message, args) => {
    const msg = await message.channel.send(client.translate.commands.ping.waiting);
    const ping = Math.round((msg.createdTimestamp - message.createdTimestamp) - client.ws.ping);
    const api = Math.round(client.ws.ping);

    msg.edit({
        "content": client.translate.commands.ping.result,
        "embeds": [
            {
                "title": client.translate.commands.ping.connection,
                "description": client.translate.commands.ping.info.replace("%s1", ping).replace("%s2", api)
            }
        ]
    });
};

module.exports.help = {
    "name": "ping",
    "description": "Check the ping and api latency of the bot.",
    "usage": "ping",
    "category": "developer",
    "aliases": ["ปิง", "การเชื่อมต่อ"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "ping",
            "th": "ปิง"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Check the ping and api latency of the bot.",
            "th": "ตรวจสอบความหน่วงและ API Latency ของบอท"
        }
    },
    async execute(interaction) {
        await interaction.editReply(interaction.client.translate.commands.ping.waiting);
        
        const ping = Math.round((Date.now() - interaction.createdTimestamp) - interaction.client.ws.ping);
        const api = Math.round(interaction.client.ws.ping);

        await interaction.editReply({
            "content": interaction.client.translate.commands.ping.result,
            "embeds": [
                {
                    "title": interaction.client.translate.commands.ping.connection,
                    "description": interaction.client.translate.commands.ping.info.replace("%s1", ping).replace("%s2", api)
                }
            ]
        });
    }
};
