module.exports.run = function (client, message, args) {
    if (!client.music.options.searchSongs) {
        client.music.options.searchSongs = true;
        return module.exports.run(client, message, args);
    }

    let search = args.join(" ");
    if (!search) return message.reply(client.lang.command_music_search_arg_empty);

    client.music.play(message, search);
};

module.exports.help = {
    "name": "search",
    "description": "Search and select videos to play",
    "usage": "search <song>",
    "category": "music",
    "aliases": ["ค้นหา", "sch"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};