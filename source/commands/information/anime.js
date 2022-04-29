const Kitsu = require("kitsu");

module.exports.run = async (client, message, args) => {
    const inputTitle = args.join(" ");

    const api = new Kitsu();

    const titles = (data) => {
        const numTitle = [];

        for (let i = 0; i < data.length; i++) {
            const japanTitle = data[i].titles.en_jp ? data[i].titles.en_jp : "";
            const englishTitle = data[i].titles.en ? " / " + data[i].titles.en : "";
            const title = japanTitle + englishTitle;

            numTitle.push("\n" + (i + 1) + ". " + title);
        }

        return numTitle.join(" ");
    }
    const filter = (content) => {
        if (!content.content) return;
        if (content.author.id !== message.author.id) return;
        return ["1", "2", "3", "4", "5"].includes(content.content);
    }

    if (!inputTitle) return message.reply(client.translate.commands.anime.empty);

    const info = await api.fetch("anime" || "manga", {
        "params": {
            "page": {
                "limit": 5
            },
            "filter": {
                "text": inputTitle
            }
        }
    });

    if (info.data.length < 1) return message.channel.send(client.translate.commands.anime.data_not_found);

    const msg = await message.channel.send({
        "embeds": [
            {
                "title": "```" + inputTitle + "```",
                "description": client.translate.commands.anime.similar_stories,
                "color": 16083235,
                "footer": {
                    "iconURL": client.user.avatarURL(),
                    "text": client.translate.commands.anime.auto_cancel
                },
                "author": {
                    "name": "Kitsu",
                    "url": "https://kitsu.io",
                    "iconURL": "https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png"
                },
                "fields": [
                    {
                        "name": client.translate.commands.anime.choose_now,
                        "value": titles(info.data)
                    }
                ]
            }
        ]
    });
    const collection = await message.channel.awaitMessages({
        filter,
        "max": 1,
        "time": 60000,
        "errors": ["time"]
    });
    const returnMessage = collection.first();
    const index = parseInt(returnMessage.content) - 1;
    const trimmedSynopsis = info.data[index].synopsis.length >= 1015 ? info.data[index].synopsis.substring(0, 1015) + "..." : info.data[index].synopsis;

    await msg.edit({
        "embeds": [
            {
                "color": 12601856,
                "footer": {
                    "iconURL": client.user.avatarURL(),
                    "text": client.translate.commands.anime.short_information
                },
                "author": {
                    "name": "Kitsu",
                    "url": "https://kitsu.io",
                    "iconURL": "https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png"
                },
                "fields": [{
                    "name": client.translate.commands.anime.japan_name,
                    "value": info.data[index].titles.en_jp || client.translate.commands.anime.undefined
                },
                {
                    "name": client.translate.commands.anime.english_name,
                    "value": info.data[index].titles.en || client.translate.commands.anime.undefined
                },
                {
                    "name": client.translate.commands.anime.start_date,
                    "value": info.data[index].startDate,
                    "inline": true
                },
                {
                    "name": client.translate.commands.anime.end_date,
                    "value": info.data[index].endDate || client.translate.commands.anime.in_progress,
                    "inline": true
                },
                {
                    "name": client.translate.commands.anime.popularity_rank,
                    "value": info.data[index].popularityRank.toString(),
                    "inline": true
                },
                {
                    "name": client.translate.commands.anime.link,
                    "value": "<https://kitsu.io/" + info.data[index].type + "/" + info.data[index].id + ">"
                },
                {
                    "name": client.translate.commands.anime.synopsis,
                    "value": "```" + trimmedSynopsis + "```"
                }
                ]
            }]
    });
};

module.exports.help = {
    "name": "anime",
    "description": "Search for anime or manga available on Kitsu.",
    "usage": "anime <title: anime, manga>",
    "category": "information",
    "aliases": ["an", "cartoon", "kitsu", "อนิเมะ", "มังงะ", "การ์ดตูน"],
    "clientPermissions": ["SEND_MESSAGES", "EMBED_LINKS"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "anime",
            "th": "อนิเมะ"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Search for anime or manga available on Kitsu.",
            "th": "ค้นหาอะนิเมะหรือมังงะที่มีอยู่ใน Kitsu"
        },
        "options": [
            {
                "type": 3,
                "name": "title",
                "name_localizations": {
                    "th": "เรื่อง"
                },
                "description": "The title of the anime or manga.",
                "description_localizations": {
                    "th": "ชื่อเรื่องของอนิเมะหรือมังงะ"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        const inputTitle = interaction.options.get("title").value;

        const api = new Kitsu();

        const titles = (data) => {
            const numTitle = [];

            for (let i = 0; i < data.length; i++) {
                const japanTitle = data[i].titles.en_jp ? data[i].titles.en_jp : "";
                const englishTitle = data[i].titles.en ? " / " + data[i].titles.en : "";
                const title = japanTitle + englishTitle;

                numTitle.push("\n" + (i + 1) + ". " + title);
            }

            return numTitle.join(" ");
        }
        const filter = (content) => {
            if (!content.content) return;
            if (content.author.id !== interaction.user.id) return;
            return ["1", "2", "3", "4", "5"].includes(content.content);
        }

        if (!inputTitle) return await interaction.editReply(interaction.client.translate.commands.anime.empty);

        const info = await api.fetch("anime" || "manga", {
            "params": {
                "page": {
                    "limit": 5
                },
                "filter": {
                    "text": inputTitle
                }
            }
        });

        if (info.data.length < 1) return await interaction.editReply(interaction.client.translate.commands.anime.data_not_found);

        await interaction.editReply({
            "embeds": [
                {
                    "title": "```" + inputTitle + "```",
                    "description": interaction.client.translate.commands.anime.similar_stories,
                    "color": 16083235,
                    "footer": {
                        "iconURL": interaction.client.user.avatarURL(),
                        "text": interaction.client.translate.commands.anime.auto_cancel
                    },
                    "author": {
                        "name": "Kitsu",
                        "url": "https://kitsu.io",
                        "iconURL": "https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png"
                    },
                    "fields": [
                        {
                            "name": interaction.client.translate.commands.anime.choose_now,
                            "value": titles(info.data)
                        }
                    ]
                }
            ]
        });

        const collection = await interaction.channel.awaitMessages({
            filter,
            "max": 1,
            "time": 60000,
            "errors": ["time"]
        });
        const returnMessage = collection.first();
        const index = parseInt(returnMessage.content) - 1;
        const trimmedSynopsis = info.data[index].synopsis.length >= 1015 ? info.data[index].synopsis.substring(0, 1015) + "..." : info.data[index].synopsis;

        await interaction.editReply({
            "embeds": [
                {
                    "color": 12601856,
                    "footer": {
                        "iconURL": interaction.client.user.avatarURL(),
                        "text": interaction.client.translate.commands.anime.short_information
                    },
                    "author": {
                        "name": "Kitsu",
                        "url": "https://kitsu.io",
                        "iconURL": "https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png"
                    },
                    "fields": [
                        {
                            "name": interaction.client.translate.commands.anime.japan_name,
                            "value": info.data[index].titles.en_jp || interaction.client.translate.commands.anime.undefined
                        },
                        {
                            "name": interaction.client.translate.commands.anime.english_name,
                            "value": info.data[index].titles.en || interaction.client.translate.commands.anime.undefined
                        },
                        {
                            "name": interaction.client.translate.commands.anime.start_date,
                            "value": info.data[index].startDate,
                            "inline": true
                        },
                        {
                            "name": interaction.client.translate.commands.anime.end_date,
                            "value": info.data[index].endDate || interaction.client.translate.commands.anime.in_progress,
                            "inline": true
                        },
                        {
                            "name": interaction.client.translate.commands.anime.popularity_rank,
                            "value": info.data[index].popularityRank.toString(),
                            "inline": true
                        },
                        {
                            "name": interaction.client.translate.commands.anime.link,
                            "value": "<https://kitsu.io/" + info.data[index].type + "/" + info.data[index].id + ">"
                        },
                        {
                            "name": interaction.client.translate.commands.anime.synopsis,
                            "value": "```" + trimmedSynopsis + "```"
                        }
                    ]
                }
            ]
        });
    }
}