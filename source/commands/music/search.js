const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
    "enable": true,
    "name": "search",
    "description": "Search for the song or playlist you want.",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "search <song(String)> [platform] [type]",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ค้นหา"
        },
        "description": module.exports.description,
        "description_localizations": {
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
        await interaction.deferReply();

        const inputSong = interaction.options.getString("song");
        const inputPlatform = interaction.options.getString("platform") ?? "";
        let inputType = interaction.options.getString("type") ?? "";

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

            const authorUsername = message.author.username;
            const authorAvatar = message.author.displayAvatarURL();
            const searchEmbed = new EmbedBuilder()
                .setTitle(interaction.client.translate.commands.search.searching.replace("%s", results[0].type === "video" || results[0].type === "track" ? interaction.client.translate.commands.search.song_type : interaction.client.translate.commands.search.playlist_type))
                .setDescription(interaction.client.translate.commands.search.timer_choose.replace("%s", results[0].type === "video" || results[0].type === "track" ? interaction.client.translate.commands.search.song_type : interaction.client.translate.commands.search.playlist_type))
                .setColor(platform === "youtube" ? 13632027 : 16296490)
                .setTimestamp()
                .setAuthor({ "name": platform === "youtube" ? "YouTube" : "SoundCloud", "url": platform === "youtube" ? "https://www.youtube.com/" : "https://soundcloud.com/", "iconURL": platform === "youtube" ? "https://www.youtube.com/s/desktop/6007d895/img/favicon_144x144.png" : "https://a-v2.sndcdn.com/assets/images/sc-icons/ios-a62dfc8fe7.png" })
                .setFooter({ "text": authorUsername, "iconURL": authorAvatar })
                .addFields(
                    [
                        {
                            "name": interaction.client.translate.commands.search.title_results.replace("%s", results[0].type === "video" || results[0].type === "track" ? interaction.client.translate.commands.search.song_type : interaction.client.translate.commands.search.playlist_type),
                            "value": data
                        }
                    ]
                );

            await interaction.editReply({
                "embeds": [searchEmbed]
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
                await interaction.client.music.play(voiceChannel, results[contentIndex], {
                    "member": interaction.member,
                    "textChannel": interaction.channel,
                    interaction
                });
                await interaction.deleteReply();
            } catch (error) {
                const connection = interaction.client.music.voices.get(voiceChannel.guild);

                connection.leave(voiceChannel.guild);
                catchError(interaction.client, interaction, module.exports.name, error);
            }
        }

        if (!voiceChannel) return await interaction.editReply(interaction.client.translate.commands.search.user_not_in_channel);
        if (inputPlatform) {
            switch (inputPlatform) {
                case "youtube":
                    if (inputType) {
                        if (inputType === "track") inputType = "video";

                        try {
                            const results = await interaction.client.music.search(inputSong, {
                                "limit": limit,
                                "type": inputType,
                                "safeSearch": true
                            });

                            searcher(inputPlatform, results);
                        } catch {
                            await interaction.editReply(interaction.client.translate.commands.search.no_results);
                        }
                    } else {
                        try {
                            const results = await interaction.client.music.search(inputSong, {
                                "limit": limit,
                                "safeSearch": true
                            });

                            searcher(inputPlatform, results);
                        } catch {
                            await interaction.editReply(interaction.client.translate.commands.search.no_results);
                        }
                    }
                    break;
                case "soundcloud":
                    if (inputType) {
                        try {
                            const results = await SoundCloudPlugin.search(inputSong, inputType);

                            searcher(inputPlatform, results);
                        } catch {
                            await interaction.editReply(interaction.client.translate.commands.search.no_results);
                        }
                    } else {
                        try {
                            const results = await SoundCloudPlugin.search(inputSong);

                            searcher(inputPlatform, results);
                        } catch {
                            await interaction.editReply(interaction.client.translate.commands.search.no_results);
                        }
                    }
                    break;
            }
        } else {
            if (inputType) {
                if (inputType === "track") inputType = "video";

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