module.exports.run = function (client, message, args) {
    let filter = args[0];
    let queue = client.music.getQueue(message);
    let filterList = Object.keys(client.music.filters);

    if (!queue) return message.channel.send(client.translate.commands.filter.no_queue);
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.filter.not_queue_owner);
    if (!filter) return message.reply({
        "content": client.translate.commands.filter.sound_filtering,
        "embeds": [
            {
                "title": client.translate.commands.filter.available_filter,
                "description": client.translate.commands.filter.available_filter_description.replace("%s1", filterList.length).replace("%s2", filterList),
                "color": 14684245
            }
        ]
    });
    if (!filterList.includes(filter.toLowerCase())) return message.reply(client.translate.commands.filter.unavailable_filter);

    client.music.setFilter(message, filter.toLowerCase());
    message.channel.send(client.translate.commands.filter_changed.replace("%s", (filter || client.translate.commands.off)));
};

module.exports.help = {
    "name": "filter",
    "description": "Filter your music to be more powerful.",
    "usage": "filter <option>",
    "category": "music",
	"aliases": ["กรอง", "bass"],
	"permissions": ["SEND_MESSAGES", "CONNECT"]
};