module.exports.run = (client, message, args) => {
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.autoplay.no_queue);
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.autoplay.not_queue_owner);

    const mode = client.music.toggleAutoplay(message);
    
    message.channel.send(client.translate.commands.autoplay.auto_playing.replace("%s", (mode ? client.translate.commands.autoplay.on : client.translate.commands.autoplay.off)));
};

module.exports.help = {
    "name": "autoplay",
    "description": "Turn on / off automatic music playing",
    "usage": "autoplay",
    "category": "music",
	"aliases": ["เล่นอัตโนมัติ", "autop", "atplay", "atp"],
	"clientPermissions": ["SEND_MESSAGES"]
};