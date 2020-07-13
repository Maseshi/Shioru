module.exports.run = async function(client, message) {
    let msg = await message.channel.send(":ping_pong: Pinging...");
    let ping = Math.round((msg.createdTimestamp - message.createdTimestamp) - client.ws.ping);
    let api = Math.round(client.ws.ping);

    let embed = {
        "footer": {
            "icon_url": "https://lectiondev.web.app/assets/static/favicon.ico",
            "text": "โปรแกรมคำนวณ Ping แบบธรรมดาโดย LectionDev"
        },
        "fields": [
            {
                "name": "การเชื่อมต่อ",
                "value": "Ping คือ " + ping + " วินาที \nAPI Latency คือ " + api + " วินาที"
            }
        ]
    };
    msg.edit(":ping_pong: Pong", { embed });
};

module.exports.help = {
    "name": "ping",
    "description": "Check the ping and api latency of the bot.",
    "usage": "Yping",
    "category": "system",
    "aliases": ["ปิง"]
};