const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    "name": "anime",
    "description": "Search for anime or manga available on Kitsu.",
    "category": "information",
    "permissions": {
        "client": ["SEND_MESSAGES", "EMBED_LINKS"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "anime <title: anime, manga>",
    "aliases": ["an", "cartoon", "kitsu", "อนิเมะ", "มังงะ", "การ์ดตูน"],
    async execute(client, message, args) {
        const inputTitle = args.join(" ");

        const titles = (data) => {
            const numTitle = [];

            for (let i = 0; i < data.length; i++) {
                const japanTitle = data[i].attributes.titles.en_jp ? data[i].attributes.titles.en_jp : "";
                const englishTitle = data[i].attributes.titles.en ? " / " + data[i].attributes.titles.en : "";
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

        const baseURL = "https://kitsu.io/api/edge";
        const anime = "/anime?page[limit]=5&filter[text]=" + inputTitle;
        const manga = "/manga?page[limit]=5&filter[text]=" + inputTitle;
        const response = await fetch(
            baseURL + anime || manga,
            {
                "headers": {
                    "Accept": "application/vnd.api+json",
                    "Content-Type": "application/vnd.api+json"
                }
            }
        );
        const json = await response.json();

        if (!json) return message.channel.send(client.translate.commands.anime.data_not_found);

        const clientAvatarURL = client.user.avatarURL();
        const infoEmbed = new EmbedBuilder()
            .setTitle("```" + inputTitle + "```")
            .setDescription(client.translate.commands.anime.similar_stories)
            .setColor(16083235)
            .setFooter({ "text": client.translate.commands.anime.auto_cancel, "iconURL": clientAvatarURL })
            .setAuthor({ "name": "Kitsu", "url": "https://kitsu.io/", "iconURL": "https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png" })
            .addFields([
                {
                    "name": client.translate.commands.anime.choose_now,
                    "value": titles(json.data)
                }
            ]);
        const msg = await message.channel.send({ "embeds": [infoEmbed] });

        const collection = await message.channel.awaitMessages({
            filter,
            "max": 1,
            "time": 60000,
            "errors": ["time"]
        });
        const returnMessage = collection.first();
        const index = parseInt(returnMessage.content) - 1;

        const attributes = json.data[index].attributes;
        const trimmedSynopsis = attributes.synopsis.length >= 1015 ? attributes.synopsis.substring(0, 1015) + "..." : attributes.synopsis;

        infoEmbed.setColor(12601856)
            .setFooter({ "text": client.translate.commands.anime.short_information, "iconURL": clientAvatarURL })
            .setFields(
                [
                    {
                        "name": client.translate.commands.anime.japan_name,
                        "value": attributes.titles.en_jp || client.translate.commands.anime.undefined
                    },
                    {
                        "name": client.translate.commands.anime.english_name,
                        "value": attributes.titles.en || client.translate.commands.anime.undefined
                    },
                    {
                        "name": client.translate.commands.anime.start_date,
                        "value": attributes.startDate,
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.anime.end_date,
                        "value": attributes.endDate || client.translate.commands.anime.in_progress,
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.anime.popularity_rank,
                        "value": attributes.popularityRank.toString(),
                        "inline": true
                    },
                    {
                        "name": client.translate.commands.anime.link,
                        "value": "<https://kitsu.io/" + attributes.type + "/" + json.data[index].id + ">"
                    },
                    {
                        "name": client.translate.commands.anime.synopsis,
                        "value": "```" + trimmedSynopsis + "```"
                    }
                ]
            );
        await msg.edit({ "embeds": [infoEmbed] });
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "anime",
            "th": "อนิเมะ"
        },
        "description": module.exports.description,
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

        const titles = (data) => {
            const numTitle = [];

            for (let i = 0; i < data.length; i++) {
                const japanTitle = data[i].attributes.titles.en_jp ? data[i].attributes.titles.en_jp : "";
                const englishTitle = data[i].attributes.titles.en ? " / " + data[i].attributes.titles.en : "";
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

        const baseURL = "https://kitsu.io/api/edge";
        const anime = "/anime?page[limit]=5&filter[text]=" + inputTitle;
        const manga = "/manga?page[limit]=5&filter[text]=" + inputTitle;
        const response = await fetch(
            baseURL + anime || manga,
            {
                "headers": {
                    "Accept": "application/vnd.api+json",
                    "Content-Type": "application/vnd.api+json"
                }
            }
        );
        const json = await response.json();

        if (!json) return await interaction.editReply(interaction.client.translate.commands.anime.data_not_found);

        const clientAvatarURL = interaction.client.user.avatarURL();
        const infoEmbed = new EmbedBuilder()
            .setTitle("```" + inputTitle + "```")
            .setDescription(interaction.client.translate.commands.anime.similar_stories)
            .setColor(16083235)
            .setFooter({ "text": interaction.client.translate.commands.anime.auto_cancel, "iconURL": clientAvatarURL })
            .setAuthor({ "name": "Kitsu", "url": "https://kitsu.io/", "iconURL": "https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png" })
            .addFields([
                {
                    "name": interaction.client.translate.commands.anime.choose_now,
                    "value": titles(json.data)
                }
            ]);

        await interaction.editReply({ "embeds": [infoEmbed] });

        const collection = await interaction.channel.awaitMessages({
            filter,
            "max": 1,
            "time": 60000,
            "errors": ["time"]
        });
        const returnMessage = collection.first();
        const index = parseInt(returnMessage.content) - 1;

        const attributes = json.data[index].attributes;
        const trimmedSynopsis = attributes.synopsis.length >= 1015 ? attributes.synopsis.substring(0, 1015) + "..." : attributes.synopsis;

        infoEmbed.setColor(12601856)
            .setFooter({ "text": interaction.client.translate.commands.anime.short_information, "iconURL": clientAvatarURL })
            .setFields(
                [
                    {
                        "name": interaction.client.translate.commands.anime.japan_name,
                        "value": attributes.titles.en_jp || interaction.client.translate.commands.anime.undefined
                    },
                    {
                        "name": interaction.client.translate.commands.anime.english_name,
                        "value": attributes.titles.en || interaction.client.translate.commands.anime.undefined
                    },
                    {
                        "name": interaction.client.translate.commands.anime.start_date,
                        "value": attributes.startDate,
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.anime.end_date,
                        "value": attributes.endDate || interaction.client.translate.commands.anime.in_progress,
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.anime.popularity_rank,
                        "value": attributes.popularityRank.toString(),
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.anime.link,
                        "value": "<https://kitsu.io/" + attributes.type + "/" + json.data[index].id + ">"
                    },
                    {
                        "name": interaction.client.translate.commands.anime.synopsis,
                        "value": "```" + trimmedSynopsis + "```"
                    }
                ]
            );
        await interaction.editReply({ "embeds": [infoEmbed] });
    }
}