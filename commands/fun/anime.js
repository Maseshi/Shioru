const kitsu = require("kitsu");
const api = new kitsu();

module.exports.run = async function (client, message, args) {
    let arg = args.join(" ");
    if (!arg) return message.reply(client.data.language.command_fun_anime_no_args);

    let msg = await message.channel.send(client.data.language.command_fun_anime_finding_anime_title.replace("%title", arg));

    api.fetch("anime" || "manga", {
        "params": {
            "filter": {
                "text": arg
            }
        }
    }).then(async function (info) {
        if (info.data.length < 1) return msg.edit(client.data.language.command_fun_anime_no_info_anime_title);
        
        msg = await msg.edit("", {
            "embed": {
                "title": "```" + arg + "```",
                "description": client.data.language.command_fun_anime_embed_anime_description,
                "color": 16083235,
                "footer": {
                    "icon_url": client.user.avatarURL(),
                    "text": client.data.language.command_fun_anime_embed_anime_footer_text
                },
                "author": {
                    "name": "Kitsu",
                    "url": "https://kitsu.io",
                    "icon_url": "https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png"
                },
                "fields": [
                    {
                        "name": client.data.language.command_fun_anime_embed_anime_fields_name,
                        "value": titles(info.data)
                    }
                ]
            }
        });

        message.channel.awaitMessages(filter, {
            "max": 20,
            "maxProcessed": 1,
            "time": 60000,
            "errors": ["time"]
        }).then(async function (collected) {
            let returnMessage = collected.first();
            let index = parseInt(returnMessage.content) - 1;
            await msg.edit({
                "embed": {
                    "color": 12601856,
                    "footer": {
                        "icon_url": client.user.avatarURL(),
                        "text": client.data.language.command_fun_anime_embed_conclude_footer_text
                    },
                    "author": {
                        "name": "Kitsu",
                        "url": "https://kitsu.io",
                        "icon_url": "https://kitsu.io/android-chrome-192x192-6b1404d91a423ea12340f41fc320c149.png"
                    },
                    "fields": [
                        {
                            "name": client.data.language.command_fun_anime_embed_conclude_fields_0_name,
                            "value": info.data[index].titles.en_jp || client.data.language.command_fun_anime_embed_conclude_fields_0_value
                        },
                        {
                            "name": client.data.language.command_fun_anime_embed_conclude_fields_1_name,
                            "value": info.data[index].titles.en || client.data.language.command_fun_anime_embed_conclude_fields_1_value
                        },
                        {
                            "name": client.data.language.command_fun_anime_embed_conclude_fields_2_name,
                            "value": info.data[index].subtype
                        },
                        {
                            "name": client.data.language.command_fun_anime_embed_conclude_fields_3_name,
                            "value": info.data[index].startDate,
                            "inline": true
                        },
                        {
                            "name": client.data.language.command_fun_anime_embed_conclude_fields_4_name,
                            "value": info.data[index].endDate || client.data.language.command_fun_anime_embed_conclude_fields_4_value,
                            "inline": true
                        },
                        {
                            "name": client.data.language.command_fun_anime_embed_conclude_fields_5_name,
                            "value": info.data[index].popularityRank,
                            "inline": true
                        },
                        {
                            "name": client.data.language.command_fun_anime_embed_conclude_fields_6_name,
                            "value": "<https://kitsu.io/anime/" + info.data[index].id + ">"
                        },
                        {
                            "name": client.data.language.command_fun_anime_embed_conclude_fields_7_name,
                            "value": "```" + info.data[index].synopsis + "```"
                        }
                    ]
                }
            });
        });
    }).catch(function(err) {
        msg.edit(client.data.language.command_fun_anime_finding_anime_error + err);
        return console.log(err);
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
    "category": "fun",
    "aliases": ["an", "cartoon", "อนิเมะ", "การ์ดตูน"],
    "permissions": ["SEND_MESSAGES"]
};