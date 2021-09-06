const catchError = require("../../extras/catchError");
const kitsu = require("kitsu");

module.exports.run = function (client, message, args) {
    let arg = args.join(" ");
    if (!arg) return message.reply(client.translate.commands.anime.empty);

    new kitsu().fetch("anime" || "manga", {
        "params": {
            "filter": {
                "text": arg
            }
        }
    }).then(async function (info) {
        if (info.data.length < 1) return message.channel.send(client.translate.commands.anime.data_not_found);
        
        let msg = await message.channel.send({
            "embeds": [
                {
                    "title": "```" + arg + "```",
                    "description": client.translate.commands.anime.similar_stories,
                    "color": 16083235,
                    "footer": {
                        "icon_url": client.user.avatarURL(),
                        "text": client.translate.commands.anime.auto_cancel
                    },
                    "author": {
                        "name": "Kitsu",
                        "url": "https://kitsu.io",
                        "icon_url": "https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png"
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

        message.channel.awaitMessages({
            filter,
            "max": 1,
            "time": 60000,
            "errors": ["time"]
        }).then(async function (collection) {
            let returnMessage = collection.first();
            let index = parseInt(returnMessage.content) - 1;
            await msg.edit({
                "embeds": [
                    {
                        "color": 12601856,
                        "footer": {
                            "icon_url": client.user.avatarURL(),
                            "text": client.translate.commands.anime.short_information
                        },
                        "author": {
                            "name": "Kitsu",
                            "url": "https://kitsu.io",
                            "icon_url": "https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png"
                        },
                        "fields": [
                            {
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
                                "value": "```" + info.data[index].synopsis + "```"
                            }
                        ]
                    }
                ]
            });
        }).catch(function(error) {
            catchError(client, msg, module.exports.help.name, error);
        });
    }).catch(function(error) {
        catchError(client, message, module.exports.help.name, error);
    });

    function titles(data) {
        let numTitle = [];
        for (let i = 0; i < 5; i++) {
            numTitle.push("\n" + (i + 1) + ". " + title(i, data));
        }
        return numTitle.join(" ");
    }

    function title(index, data) {
        let line1 = data[index].titles.en_jp ? data[index].titles.en_jp : "";
        let line2 = data[index].titles.en ? " / " + data[index].titles.en : "";
        return line1 + line2;
    }

    function filter(msg) {
        if (!msg.content) return;
        if (msg.author.id !== message.author.id) return;
        return ["1", "2", "3", "4", "5"].includes(msg.content);
    }
};

module.exports.help = {
    "name": "anime",
    "description": "Search for anime available on Kitsu.",
    "usage": "anime <title>",
    "category": "information",
    "aliases": ["an", "cartoon", "อนิเมะ", "การ์ดตูน"],
    "permissions": ["SEND_MESSAGES"]
};