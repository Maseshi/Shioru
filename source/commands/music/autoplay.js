module.exports.run = function (client, message, args) {
    let queue = client.music.getQueue(message);

    if (!queue) return message.channel.send(client.translate.commands.autoplay.no_queue);
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.autoplay.not_queue_owner);    

    let mode = client.music.toggleAutoplay(message);
    message.channel.send(client.translate.commands.autoplay.auto_playing.replace("%s", (mode ? client.translate.commands.autoplay.on : client.translate.commands.autoplay.off)));
};

module.exports.help = {
    "name": "autoplay",
    "description": "Turn on / off automatic music playing",
    "usage": "autoplay",
    "category": "music",
	"aliases": ["เล่นอัตโนมัติ", "autop", "atplay", "atp"],
	"permissions": ["SEND_MESSAGES", "CONNECT"]
};