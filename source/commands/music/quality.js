const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { StreamType } = require("distube");

module.exports = {
    "enable": true,
    "name": "quality",
    "description": "Try this command if you have sound problems or people with poor internet connection.",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "quality <options: 0, 1>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "quality",
            "th": "คุณภาพ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Try this command if you have sound problems or people with poor internet connection.",
            "th": "ลองใช้คำสั่งนี้หากคุณมีปัญหาด้านเสียงหรือผู้ที่มีการเชื่อมต่ออินเทอร์เน็ตไม่ดี"
        },
        "options": [
            {
                "type": 3,
                "name": "option",
                "name_localizations": {
                    "th": "ตัวเลือก"
                },
                "description": "Options for setting sound quality.",
                "description_localizations": {
                    "th": "ตัวเลือกสำหรับตั้งค่าคุณภาพของเสียง"
                },
                "choices": [
                    {
                        "name": "High Quality",
                        "name_localizations": {
                            "th": "คุณภาพสูง"
                        },
                        "value": "0",
                    },
                    {
                        "name": "Low Quality",
                        "name_localizations": {
                            "th": "คุณภาพต่ำ"
                        },
                        "value": "1",
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const inputOption = interaction.options.get("option");

        const quality = interaction.client.music.options.streamType === 0 ? interaction.client.translate.commands.quality.focus_on_high_quality : interaction.client.translate.commands.quality.low_efficiency;
        const adviceEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.quality.advice_embed_title)
            .setDescription(interaction.client.translate.commands.quality.advice_embed_description.replace("%s", quality))
            .setFooter({ "text": interaction.client.translate.commands.quality.advice_embed_footer_text, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/310/light-bulb_1f4a1.png" })
            .setColor("Blue")
            .setTimestamp();

        if (!inputOption) return await interaction.editReply({ "embeds": [adviceEmbed] });

        switch (inputOption) {
            case "0":
                interaction.client.music.options.streamType = StreamType.OPUS;
                await interaction.editReply(interaction.client.translate.commands.quality.opus_mode_selected);
                break;
            case "1":
                interaction.client.music.options.streamType = StreamType.RAW;
                await interaction.editReply(interaction.client.translate.commands.quality.raw_mode_selected);
                break;
            default:
                await interaction.editReply({ "embeds": [adviceEmbed] });
        }
    }
};