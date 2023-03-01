const { PermissionsBitField } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    "enable": true,
    "name": "together",
    "description": "Run a specific emulator through the audio channel.",
    "category": "games",
    "permissions": {
        "user": [PermissionsBitField.Flags.UseEmbeddedActivities],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.UseEmbeddedActivities
        ]
    },
    "usage": "together <name> (channel: name, id)",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
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
                        "name": "Watch Together",
                        "value": "youtube"
                    },
                    {
                        "name": "Watch Together Dev",
                        "value": "youtubedev"
                    },
                    {
                        "name": "Poker Night",
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
                        "name": "Chess In The Park",
                        "value": "chess"
                    },
                    {
                        "name": "Chess In The Park Dev",
                        "value": "chessdev"
                    },
                    {
                        "name": "Letter League",
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
                        "name": "Checkers In The Park",
                        "value": "checkers"
                    },
                    {
                        "name": "Putt Party",
                        "value": "puttparty"
                    },
                    {
                        "name": "Sketch Heads",
                        "value": "sketchheads"
                    },
                    {
                        "name": "Blazing 8s",
                        "value": "blazing8s"
                    },
                    {
                        "name": "Putt Party QA",
                        "value": "puttpartyqa"
                    },
                    {
                        "name": "SketchyArtist",
                        "value": "sketchyartist"
                    },
                    {
                        "name": "Land-io",
                        "value": "land"
                    },
                    {
                        "name": "Meme",
                        "value": "meme"
                    },
                    {
                        "name": "Askaway",
                        "value": "askaway"
                    },
                    {
                        "name": "Bobble League",
                        "value": "bobble"
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
            "sketchheads": "902271654783242291",
            "blazing8s": "832025144389533716",
            "puttpartyqa": "945748195256979606",
            "sketchyartist": "879864070101172255",
            "land": "903769130790969345",
            "meme": "950505761862189096",
            "askaway": "976052223358406656",
            "bobble": "947957217959759964"
        };

        if (!inputChannel) {
            if (!voiceChannel) return await interaction.editReply(interaction.client.translate.commands.together.user_not_in_channel);
        } else {
            voiceChannel = interaction.guild.channels.cache.find(channels => (channels.id === inputChannel.value) || (channels.name === inputChannel.value));

            if (!voiceChannel) return await interaction.editReply(interaction.client.translate.commands.together.voice_channel_not_found);
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
            .then(async (invite) => {
                if (invite.error || !invite.code) return await interaction.editReply(interaction.client.translate.commands.together.can_not_open.replace("%s", inputName));
                if (Number(invite.code) === 50013) return await interaction.editReply(interaction.client.translate.commands.together.do_not_have_permission);

                await interaction.editReply(interaction.client.translate.commands.together.join_via_this_link + invite.code);
            });
    }
}