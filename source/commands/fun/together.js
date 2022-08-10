const { ChannelType } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    "name": "together",
    "description": "Run a specific emulator through the audio channel.",
    "category": "fun",
    "permissions": {
        "user": ["START_EMBEDDED_ACTIVITIES"],
        "client": ["SEND_MESSAGES", "START_EMBEDDED_ACTIVITIES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "together <name> (channel: name, id)",
    "aliases": ["tg"],
    async execute(client, message, args) {
        const inputName = args[0];
        const inputChannel = args.slice(1).join(" ");

        const token = client.config.token;
        let voiceChannel = message.member.voice.channel;
        const apps = {
            "youtube": "880218394199220334",
            "youtubedev": "880218832743055411",
            "poker": "755827207812677713",
            "betrayal": "773336526917861400",
            "fishing": "814288819477020702",
            "chess": "832012774040141894",
            "chessdev": "832012586023256104",
            "lettertile": "879863686565621790",
            "wordsnack": "879863976006127627",
            "doodlecrew": "878067389634314250",
            "awkword": "879863881349087252",
            "spellcast": "852509694341283871",
            "checkers": "832013003968348200",
            "puttparty": "763133495793942528",
            "sketchyartist": "879864070101172255",
            "sketchheads": "902271654783242291",
            "ocho": "832025144389533716",
        };
        const list = Object.keys(apps);

        if (!inputName) return message.reply(client.translate.commands.together.empty.replace("%s", list));
        if (!list.includes(inputName.toLowerCase())) return message.reply(client.translate.commands.together.do_not_have.replace("%s1", inputName).replace("%s2", list.length).replace("%s3", list));
        if (!inputChannel) {
            if (!voiceChannel) return message.reply(client.translate.commands.together.user_not_in_channel);
        } else {
            voiceChannel = message.guild.channels.cache.find(channels => (channels.id === inputChannel) || (channels.name === inputChannel));

            if (voiceChannel.type === ChannelType.GuildText) return message.reply(client.translate.commands.together.not_in_text_channel);
            if (!voiceChannel) return message.reply(client.translate.commands.together.voice_channel_not_found);
        }

        fetch("https://discord.com/api/v10/channels/" + voiceChannel.id + "/invites", {
            "method": "POST",
            "body": JSON.stringify({
                "max_age": 86400,
                "max_uses": 0,
                "target_application_id": apps[inputName],
                "target_type": 2,
                "temporary": false,
                "validate": null,
            }),
            "headers": {
                "Authorization": "Bot " + token,
                "Content-Type": "application/json",
            }
        })
            .then((res) => res.json())
            .then((invite) => {
                if (!invite.code) return message.reply(client.translate.commands.together.can_not_open.replace("%s", inputName));

                message.channel.send(client.translate.commands.together.join_via_this_link + invite.code);
            });
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Run a specific emulator through the audio channel.",
            "th": "เรียกใช้อีมูเลเตอร์ Together ผ่านช่องเสียง"
        },
        "options": [
            {
                "type": 3,
                "name": "name",
                "name_localizations": {
                    "th": "ชื่อ"
                },
                "description": "Name of together you want to use.",
                "description_localizations": {
                    "th": "ชื่อของ Together ที่คุณต้องการใช้"
                },
                "required": true,
                "choices": [
                    {
                        "name": "YouTube",
                        "value": "youtube"
                    },
                    {
                        "name": "YouTubeDev",
                        "value": "youtubedev"
                    },
                    {
                        "name": "Poker",
                        "value": "poker"
                    },
                    {
                        "name": "Betrayal",
                        "value": "betrayal"
                    },
                    {
                        "name": "Fishing",
                        "value": "fishing"
                    },
                    {
                        "name": "Chess",
                        "value": "chess"
                    },
                    {
                        "name": "ChessDev",
                        "value": "chessdev"
                    },
                    {
                        "name": "LetterTile",
                        "value": "Lettertile"
                    },
                    {
                        "name": "WordSnack",
                        "value": "wordsnack"
                    },
                    {
                        "name": "DoodleCrew",
                        "value": "doodlecrew"
                    },
                    {
                        "name": "AwkWord",
                        "value": "awkword"
                    },
                    {
                        "name": "SpellCast",
                        "value": "spellcast"
                    },
                    {
                        "name": "Checkers",
                        "value": "checkers"
                    },
                    {
                        "name": "PuttParty",
                        "value": "puttparty"
                    },
                    {
                        "name": "SketchyArtist",
                        "value": "sketchyartist"
                    },
                    {
                        "name": "SketchHeads",
                        "value": "sketchheads"
                    },
                    {
                        "name": "Ocho",
                        "value": "ocho"
                    }
                ]
            },
            {
                "type": 7,
                "name": "channel",
                "name_localizations": {
                    "th": "ช่อง"
                },
                "description": "Voice channel you want to join.",
                "description_localizations": {
                    "th": "ช่องเสียงที่คุณต้องการเข้าร่วม"
                },
                "required": false,
                "channel_types": [
                    2
                ]
            }
        ]
    },
    async execute(interaction) {
        const inputName = interaction.options.get("name").value;
        const inputChannel = interaction.options.get("channel");

        const token = interaction.client.config.token;
        let voiceChannel = interaction.member.voice.channel;
        const apps = {
            "youtube": "880218394199220334",
            "youtubedev": "880218832743055411",
            "poker": "755827207812677713",
            "betrayal": "773336526917861400",
            "fishing": "814288819477020702",
            "chess": "832012774040141894",
            "chessdev": "832012586023256104",
            "lettertile": "879863686565621790",
            "wordsnack": "879863976006127627",
            "doodlecrew": "878067389634314250",
            "awkword": "879863881349087252",
            "spellcast": "852509694341283871",
            "checkers": "832013003968348200",
            "puttparty": "763133495793942528",
            "sketchyartist": "879864070101172255",
            "sketchheads": "902271654783242291",
            "ocho": "832025144389533716",
        };

        if (!inputChannel) {
            if (!voiceChannel) return await interaction.editReply(interaction.client.translate.commands.together.user_not_in_channel);
        } else {
            voiceChannel = interaction.guild.channels.cache.find(channels => (channels.id === inputChannel.value) || (channels.name === inputChannel.value));

            if (!voiceChannel) return await interaction.editReply(interaction.client.translate.commands.together.voice_channel_not_found);
        }

        fetch("https://discord.com/api/v8/channels/" + voiceChannel.id + "/invites", {
            "method": "POST",
            "body": JSON.stringify({
                "max_age": 86400,
                "max_uses": 0,
                "target_application_id": apps[inputName],
                "target_type": 2,
                "temporary": false,
                "validate": null,
            }),
            "headers": {
                "Authorization": "Bot " + token,
                "Content-Type": "application/json",
            }
        })
            .then((res) => res.json())
            .then(async (invite) => {
                if (!invite.code) return await interaction.editReply(interaction.client.translate.commands.together.can_not_open.replace("%s", inputName));

                await interaction.editReply(interaction.client.translate.commands.together.join_via_this_link + invite.code);
            });
    }
};