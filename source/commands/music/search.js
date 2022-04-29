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

        if (!contentNumber || (!contentNumber && contentNumber < index || contentNumber > index)) return message.channel.send(client.translate.commands.search.invalid_number);

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

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "search",
            "th": "ค้นหา"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Search for the song or playlist you want.",
            "th": "ค้นหาเพลงหรือเพลย์ลิสต์ที่คุณต้องการ"
        },
        "options": [
            {
                "type": 3,
                "name": "song",
                "name_localizations": {
                    "th": "เพลง"
                },
                "description": "The name of the song or link of the song you want to search.",
                "description_localizations": {
                    "th": "ชื่อเพลงหรือลิงค์ของเพลงที่คุณต้องการค้นหา"
                },
                "required": true
            },
            {
                "type": 3,
                "name": "platform",
                "name_localizations": {
                    "th": "แพลตฟอร์ม"
                },
                "description": "What platform would you like to use to find music?",
                "description_localizations": {
                    "th": "คุณต้องการใช้แพลตฟอร์มใดเพื่อค้นหาเพลง?"
                },
                "required": false,
                "choices": [
                    {
                        "name": "YouTube",
                        "value": "youtube"
                    },
                    {
                        "name": "SoundCloud",
                        "value": "soundcloud"
                    }
                ]
            },
            {
                "type": 3,
                "name": "type",
                "name_localizations": {
                    "th": "ประเภท"
                },
                "description": "The type of list you want to search for.",
                "description_localizations": {
                    "th": "ประเภทของรายการที่คุณต้องการค้นหา?"
                },
                "required": false,
                "choices": [
                    {
                        "name": "Track / Video",
                        "name_localizations": {
                            "th": "แทร็ค หรือ วิดีโอ"
                        },
                        "value": "track"
                    },
                    {
                        "name": "Playlist",
                        "name_localizations": {
                            "th": "เพลย์ลิสต์"
                        },
                        "value": "playlist"
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const inputSong = interaction.options.get("song").value;
        const inputPlatform = interaction.options.get("platform");
        let inputType = interaction.options.get("type");

        const limit = 10;
        const voiceChannel = interaction.member.voice.channel;

        const filter = (content) => {
            const index = [];
            if (!content.content) return;
            if (content.author.id !== interaction.user.id) return;
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

            await interaction.editReply({
                "embeds": [
                    {
                        "title": interaction.client.translate.commands.search.searching.replace("%s", results[0].type === "video" || results[0].type === "track" ? interaction.client.translate.commands.search.song_type : interaction.client.translate.commands.search.playlist_type),
                        "description": interaction.client.translate.commands.search.timer_choose.replace("%s", results[0].type === "video" || results[0].type === "track" ? interaction.client.translate.commands.search.song_type : interaction.client.translate.commands.search.playlist_type),
                        "color": platform === "youtube" ? 13632027 : 16296490,
                        "timestamp": new Date(),
                        "author": {
                            "name": platform === "youtube" ? "YouTube" : "SoundCloud",
                            "url": platform === "youtube" ? "https://www.youtube.com/" : "https://soundcloud.com/",
                            "iconURL": platform === "youtube" ? "https://www.youtube.com/s/desktop/6007d895/img/favicon_144x144.png" : "https://a-v2.sndcdn.com/assets/images/sc-icons/ios-a62dfc8fe7.png"
                        },
                        "footer": {
                            "icon_url": interaction.user.displayAvatarURL(),
                            "text": interaction.user.username
                        },
                        "fields": [
                            {
                                "name": interaction.client.translate.commands.search.title_results.replace("%s", results[0].type === "video" || results[0].type === "track" ? interaction.client.translate.commands.search.song_type : interaction.client.translate.commands.search.playlist_type),
                                "value": data
                            }
                        ]
                    }
                ]
            });

            let collection;

            try {
                collection = await interaction.channel.awaitMessages({
                    filter,
                    "max": 1,
                    "time": 60000,
                    "errors": ["time"]
                });
            } catch (error) {
                await interaction.editReply({
                    "content": interaction.client.translate.commands.search.search_cancelled,
                    "embeds": []
                });
            }

            if (!collection) return;

            const returnMessage = collection.first();
            const contentNumber = parseInt(returnMessage.content);
            const contentIndex = parseInt(returnMessage.content) - 1;

            if (!contentNumber || (!contentNumber && contentNumber < index || contentNumber > index)) return await interaction.editReply({
                "content": interaction.client.translate.commands.search.invalid_number,
                "embeds": []
            });

            await interaction.editReply({
                "content": interaction.client.translate.commands.search.get_list_of_songs,
                "embeds": []
            });
            try {
                joinVoiceChannel({
                    "channelId": voiceChannel.id,
                    "guildId": interaction.guild.id,
                    "adapterCreator": interaction.guild.voiceAdapterCreator
                });
                interaction.client.music.play(voiceChannel, results[contentIndex], {
                    "member": interaction.member,
                    "textChannel": interaction.channel,
                    interaction
                });
            } catch (error) {
                const connection = getVoiceConnection(voiceChannel.guild.id);

                connection.destroy();
                catchError(interaction.client, interaction, module.exports.help.name, error);
            }
        }

        if (!voiceChannel) return interaction.editReply(interaction.client.translate.commands.search.user_not_in_channel);
        if (inputPlatform) {
            switch (inputPlatform.value) {
                case "youtube":
                    if (inputType) {
                        if (inputType.value === "track") inputType = "video";

                        try {
                            const results = await interaction.client.music.search(inputSong, {
                                "limit": limit,
                                "type": inputType,
                                "safeSearch": true
                            });

                            searcher(inputPlatform.value, results);
                        } catch {
                            await interaction.editReply(interaction.client.translate.commands.search.no_results);
                        }
                    } else {
                        try {
                            const results = await interaction.client.music.search(inputSong, {
                                "limit": limit,
                                "safeSearch": true
                            });

                            searcher(inputPlatform.value, results);
                        } catch {
                            await interaction.editReply(interaction.client.translate.commands.search.no_results);
                        }
                    }
                    break;
                case "soundcloud":
                    if (inputType) {
                        try {
                            const results = await SoundCloudPlugin.search(inputSong, inputType.value);

                            searcher(inputPlatform.value, results);
                        } catch {
                            await interaction.editReply(interaction.client.translate.commands.search.no_results);
                        }
                    } else {
                        try {
                            const results = await SoundCloudPlugin.search(inputSong);

                            searcher(inputPlatform.value, results);
                        } catch {
                            await interaction.editReply(interaction.client.translate.commands.search.no_results);
                        }
                    }
                    break;
            }
        } else {
            if (inputType) {
                if (inputType.value === "track") inputType = "video";

                try {
                    const results = await interaction.client.music.search(inputSong, {
                        "limit": limit,
                        "type": inputType,
                        "safeSearch": true
                    });

                    searcher("youtube", results);
                } catch {
                    await interaction.editReply(interaction.client.translate.commands.search.no_results);
                }
            } else {
                try {
                    const results = await interaction.client.music.search(inputSong, {
                        "limit": limit,
                        "safeSearch": true
                    });

                    searcher("youtube", results);
                } catch {
                    await interaction.editReply(interaction.client.translate.commands.search.no_results);
                }
            }
        }
    }
};