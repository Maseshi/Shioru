module.exports.run = async function(client, message, args) {
    let msg = await message.channel.send(client.translate.commands.ping.waiting);
    let ping = Math.round((msg.createdTimestamp - message.createdTimestamp) - client.ws.ping);
    let api = Math.round(client.ws.ping);

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
    "permissions": "SEND_MESSAGES"
};
