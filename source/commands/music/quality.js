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
    "usage": "quality <options>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "คุณภาพ"
        },
        "description": module.exports.description,
        "description_localizations": {
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
                        "value": "high",
                    },
                    {
                        "name": "Low Quality",
                        "name_localizations": {
                            "th": "คุณภาพต่ำ"
                        },
                        "value": "low",
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const inputOption = interaction.options.getString("option") ?? "";

        const quality = interaction.client.music.options.streamType === 0 ? interaction.client.translate.commands.quality.focus_on_high_quality : interaction.client.translate.commands.quality.low_efficiency;
        const adviceEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.quality.advice_embed_title)
            .setDescription(interaction.client.translate.commands.quality.advice_embed_description.replace("%s", quality))
            .setFooter({ "text": interaction.client.translate.commands.quality.advice_embed_footer_text })
            .setColor("Blue")
            .setTimestamp();

        if (!inputOption) return await interaction.reply({ "embeds": [adviceEmbed] });

        switch (inputOption) {
            case "high":
                interaction.client.music.options.streamType = StreamType.OPUS;
                await interaction.reply(interaction.client.translate.commands.quality.opus_mode_selected);
                break;
            case "low":
                interaction.client.music.options.streamType = StreamType.RAW;
                await interaction.reply(interaction.client.translate.commands.quality.raw_mode_selected);
                break;
            default:
                await interaction.reply({ "embeds": [adviceEmbed] });
        }
    }
};