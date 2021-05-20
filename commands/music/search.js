const discord = require("discord.js");
const yts = require("yt-search");

module.exports.run = async function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel) return message.reply(client.lang.command_music_search_user_not_join_channel);
    if (message.channel.activeCollector) return message.reply(client.lang.command_music_search_collector_exist);
    if (!args.length) return message.reply(client.lang.command_music_search_arg_empty);

    let search = args.join(" ");
    let resultsEmbed = new discord.MessageEmbed()
    .setTitle(client.lang.command_music_search_embed_title)
    .setDescription(client.lang.command_music_search_embed_description.replace("%search", search))
    .setColor("#F8AA2A")
    .setFooter(message.author.username, message.author.displayAvatarURL())
    .setTimestamp();

    yts(search, async function (error, result) {
        if (error) {
            console.error(error);
            return message.channel.send(client.lang.command_music_search_not_found);
        } else {
            let videos = result.videos;
            videos.map(function (video, index) {
                if (index >= 10) return;
                resultsEmbed.addField((index + 1) + ". " + video.title, video.url);
            });
    
            message.channel.send(resultsEmbed).then(async function (resultsMessage) {
                message.channel.activeCollector = true;
                let response = await message.channel.awaitMessages(filter, {
                    "max": 1,
                    "maxProcessed": 1,
                    "time": 60000,
                    "errors": ["time"]
                });
                let choice = resultsEmbed.fields[parseInt(response.first()) - 1].name;
    
                message.channel.activeCollector = false;
                message.client.commands.get("play").run(client, message, [choice]);
                resultsMessage.delete();
            }).catch(function (err) {
                console.error(err);
                message.channel.activeCollector = false;
            });
        }
    });

    function filter(msg) {
        if (msg.author.id !== message.author.id) return;
        return ["1", "2", "3", "5", "6", "7", "8", "9", "10"].includes(msg.content);
    }
};

module.exports.help = {
    "name": "search",
    "description": "Search and select videos to play",
    "usage": "search <title>",
    "category": "music",
    "aliases": ["ค้นหา", "sch"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};