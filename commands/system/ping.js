module.exports.run = async function(client, message) {
    let msg = await message.channel.send(":ping_pong: Pinging...");
    let ping = Math.round((msg.createdTimestamp - message.createdTimestamp) - client.ws.ping);
    let api = Math.round(client.ws.ping);

    msg.edit(":ping_pong: Pong", {
        "embed": {
            "title": client.lang.commands_system_ping_embed_title,
            "description": client.lang.commands_system_ping_embed_description.replace("%ping", ping).replace("%api", api)
        }
    });
};

module.exports.help = {
    "name": "ping",
    "description": "Check the ping and api latency of the bot.",
    "usage": "ping",
    "category": "system",
    "aliases": ["ปิง", "การเชื่อมต่อ"]
};
