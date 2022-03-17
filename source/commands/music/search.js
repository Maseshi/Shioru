const { joinVoiceChannel, getVoiceConnection } = require("@discordjs/voice");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const catchError = require("../../extras/catchError");

module.exports.run = async (client, message, args) => {
    const limit = 10;
    const from = ["youtube", "soundcloud"];
    const types = ["track", "playlist"];
    const voiceChannel = message.member.voice.channel;

    const filter = (content) => {
        const index = [];
        if (!content.content) return;
        if (content.author.id !== message.author.id) return;
        for (let i = 0; i < limit; i++) index.push((i + 1).toString());
        return index.includes(content.content) || !index.includes(content.content);
    }

    const searcher = async (platform, results) => {
        let index = 0;
        const data = results.map((song) => {
            const name = song.name;
            const uploaderName = song.uploader ? song.uploader.name ? " : **" + song.uploader.name + "**" : "" : "";
            const formattedDuration = song.formattedDuration ? "`" + song.formattedDuration + "`" : "";
            return "**" + (++index) + "**" + ". " + name + " " + formattedDuration + uploaderName;
        }).join("\n");

        message.channel.send({
            "embeds": [
                {
                    "title": client.translate.commands.search.searching.replace("%s", results[0].type === "video" || results[0].type === "track" ? client.translate.commands.search.song_type : client.translate.commands.search.playlist_type),
                    "description": client.translate.commands.search.timer_choose.replace("%s", results[0].type === "video" || results[0].type === "track" ? client.translate.commands.search.song_type : client.translate.commands.search.playlist_type),
                    "color": platform === "youtube" ? 13632027 : 16296490,
                    "timestamp": new Date(),
                    "author": {
                        "name": platform === "youtube" ? "YouTube" : "SoundCloud",
                        "url": platform === "youtube" ? "https://www.youtube.com/" : "https://soundcloud.com/",
                        "iconURL": platform === "youtube" ? "https://www.youtube.com/s/desktop/6007d895/img/favicon_144x144.png" : "https://a-v2.sndcdn.com/assets/images/sc-icons/ios-a62dfc8fe7.png"
                    },
                    "footer": {
                        "icon_url": message.author.displayAvatarURL(),
                        "text": message.author.username
                    },
                    "fields": [
                        {
                            "name": client.translate.commands.search.title_results.replace("%s", results[0].type === "video" || results[0].type === "track" ? client.translate.commands.search.song_type : client.translate.commands.search.playlist_type),
                            "value": data
                        }
                    ]
                }
            ]
        });

        let collection;

        try {
            collection = await message.channel.awaitMessages({
                filter,
                "max": 1,
                "time": 60000,
                "errors": ["time"]
            });
        } catch (error) {
            message.reply(client.translate.commands.search.search_cancelled);
        }

        if (!collection) return;

        const returnMessage = collection.first();
        const contentNumber = parseInt(returnMessage.content);
        const contentIndex = parseInt(returnMessage.content) - 1;

        if (!contentNumber || (!contentNumber && contentNumber < index || contentNumber > index)) return message.channel.send("🔴 ยกเลิกการค้นหาล่าสุดแล้ว คุณสามารถค้นหาใหม่ได้อีกครั้งโดยการพิมพ์คำสั่งเดิม");

        message.channel.send(client.translate.commands.search.get_list_of_songs);
        try {
            joinVoiceChannel({
                "channelId": voiceChannel.id,
                "guildId": message.guild.id,
                "adapterCreator": message.guild.voiceAdapterCreator
            });
            client.music.play(voiceChannel, results[contentIndex], {
                "member": message.member,
                "textChannel": message.channel,
                message
            });
        } catch (error) {
            const connection = getVoiceConnection(voiceChannel.guild.id);
                
            connection.destroy();
            catchError(client, message, module.exports.help.name, error);
        }
    }

    if (!args[0]) return message.reply(client.translate.commands.search.no_search_input);
    if (!voiceChannel) return message.reply(client.translate.commands.search.user_not_in_channel);
    if (from.includes(args[0].toLowerCase())) {
        switch (args[0].toLowerCase()) {
            case "youtube":
                if (args[2] && types.includes(args[1].toLowerCase())) {
                    if (args[1].toLowerCase() === "video") args[1] = "track";
                    if (!types.includes(args[1].toLowerCase())) return message.reply(client.translate.commands.search.type_of_list.replace("%s", args[1]));
                    if (args[1] === "track") args[1] = "video";

                    try {
                        const results = await client.music.search(args.slice(2).join(" "), {
                            "limit": limit,
                            "type": args[1].toLowerCase(),
                            "safeSearch": true
                        });
            
                        searcher(args[0].toLowerCase(), results);
                    } catch {
                        message.channel.send(client.translate.commands.search.no_results);
                    }
                } else {
                    try {
                        const results = await client.music.search(args.slice(1).join(" "), {
                            "limit": limit,
                            "safeSearch": true
                        });
            
                        searcher(args[0].toLowerCase(), results);
                    } catch {
                        message.channel.send(client.translate.commands.search.no_results);
                    }
                }
            break;
            case "soundcloud":
                if (args[2] && types.includes(args[1].toLowerCase())) {
                    if (!types.includes(args[1].toLowerCase())) return message.reply(client.translate.commands.search.type_of_list.replace("%s", args[1]));

                    try {
                        const results = await SoundCloudPlugin.search(args.slice(2).join(" "), args[1].toLowerCase());

                        searcher(args[0].toLowerCase(), results);
                    } catch {
                        message.channel.send(client.translate.commands.search.no_results);
                    }
                } else {
                    try {
                        const results = await SoundCloudPlugin.search(args.slice(1).join(" "));

                        searcher(args[0].toLowerCase(), results);
                    } catch {
                        message.channel.send(client.translate.commands.search.no_results);
                    }
                }
            break;
            default: message.reply(client.translate.commands.search.platform_not_supported);
        }
    } else if (types.includes(args[0].toLowerCase())) {
        if (args[0].toLowerCase() === "video") args[0] = "track";
        if (!types.includes(args[0].toLowerCase())) return message.reply(client.translate.commands.search.type_of_list.replace("%s", args[1]));
        if (args[0] === "track") args[0] = "video";

        try {
            const results = await client.music.search(args.slice(1).join(" "), {
                "limit": limit,
                "type": args[0].toLowerCase(),
                "safeSearch": true
            });

            searcher("youtube", results);
        } catch {
            message.channel.send(client.translate.commands.search.no_results);
        }
    } else {
        try {
            const results = await client.music.search(args.join(" "), {
                "limit": limit,
                "safeSearch": true
            });

            searcher("youtube", results);
        } catch {
            message.channel.send(client.translate.commands.search.no_results);
        }
    }
};

module.exports.help = {
    "name": "search",
    "description": "Search for the song or playlist you want.",
    "usage": "search [platform: youtube, soundcloud] [type: track, playlist] <song>",
    "category": "music",
    "aliases": ["ค้นหา", "sh"],
    "clientPermissions": ["SEND_MESSAGES"]
};