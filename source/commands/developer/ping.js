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
