module.exports.run = (client, message, args) => {
    const inputType = args[0];
    const queue = client.music.getQueue(message);
    const filterList = Object.keys(client.music.filters);

    if (!queue) return message.reply(client.translate.commands.filter.no_queue);
    if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.filter.not_queue_owner);
    if (!inputType) return message.reply({
        "content": client.translate.commands.filter.sound_filtering,
        "embeds": [
            {
                "title": client.translate.commands.filter.available_filter,
                "description": client.translate.commands.filter.available_filter_description.replace("%s1", filterList.length).replace("%s2", filterList),
                "color": 14684245
            }
        ]
    });
    if (!filterList.includes(inputType.toLowerCase())) return message.reply(client.translate.commands.filter.unavailable_filter);

    client.music.setFilter(message, inputType.toLowerCase());
    message.channel.send(client.translate.commands.filter.filter_changed.replace("%s", (inputType || client.translate.commands.filter.off)));
};

module.exports.help = {
    "name": "filter",
    "description": "Filter your music to be more powerful.",
    "usage": "filter <option>",
    "category": "music",
	"aliases": ["กรอง", "bass"],
	"clientPermissions": ["SEND_MESSAGES"]
};