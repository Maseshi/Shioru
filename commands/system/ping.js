module.exports.run = async function(client, message) {
    let msg = await message.channel.send(":ping_pong: Pinging...");
    let ping = Math.round((msg.createdTimestamp - message.createdTimestamp) - client.ws.ping);
    let api = Math.round(client.ws.ping);

    let embed = {
        "title": "📡 การเชื่อมต่อ",
        "description": "Ping คือ " + ping + " วินาที \nAPI Latency คือ " + api + " วินาที"
    };
    msg.edit(":ping_pong: Pong", { embed });
};

module.exports.help = {
    "name": "ping",
    "description": "Check the ping and api latency of the bot.",
    "usage": "ping",
    "category": "system",
    "aliases": ["ปิง", "การเชื่อมต่อ"]
};
