const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, update } = require("firebase/database");
const { IDConvertor } = require("../../utils/miscUtils");

module.exports = {
    "enable": true,
    "name": "set-language",
    "description": "Sets language for the bot.",
    "category": "settings",
    "permissions": {
        "user": [PermissionsBitField.Flags.ManageGuild],
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "set-language: get, support, set <value>",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ตั้งค่าภาษา"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ตั้งค่าภาษาสำหรับบอท"
        },
        "options": [
            {
                "type": 1,
                "name": "get",
                "name_localizations": {
                    "th": "รับ"
                },
                "description": "See the language that is currently being used.",
                "description_localizations": {
                    "th": "ดูภาษาที่กำลังใช้งานอยู่"
                }
            },
            {
                "type": 1,
                "name": "support",
                "name_localizations": {
                    "th": "รองรับ"
                },
                "description": "Explore supported languages",
                "description_localizations": {
                    "th": "สำรวจภาษาที่ระบบรองรับ"
                }
            },
            {
                "type": 1,
                "name": "set",
                "name_localizations": {
                    "th": "ตั้งค่า"
                },
                "description": "Sets language for the bot.",
                "description_localizations": {
                    "th": "ตั้งค่าภาษาสำหรับบอท"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "value",
                        "name_localizations": {
                            "th": "ค่า"
                        },
                        "description": "Language locale code (e.g. en-US)",
                        "description_localizations": {
                            "th": "รหัสสถานที่ของภาษา (ตัวอย่าง th-TH)"
                        },
                        "required": true
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        const guildID = interaction.guild.id;
        const locale = interaction.client.config.language.code;
        const support = interaction.client.config.language.support;
        const clientFetch = await interaction.client.user.fetch();
        const clientColor = clientFetch.accentColor;
        const languageRef = child(child(child(child(ref(getDatabase(), "projects"), IDConvertor(interaction.client.user.username)), "guilds"), guildID), "language");

        switch (subCommand) {
            case "get": {
                const noInputEmbed = new EmbedBuilder()
                    .setTitle(interaction.client.translate.commands.set_language.title)
                    .setDescription(
                        interaction.client.translate.commands.set_language.description
                            .replace("%s1", support[locale])
                            .replace("%s2", ("/" + module.exports.usage))
                    )
                    .setColor(clientColor)
                    .setTimestamp()
                    .setFooter({ "text": interaction.client.translate.commands.set_language.data_at })

                await interaction.reply({ "embeds": [noInputEmbed] });
                break;
            }
            case "support": {
                const supportEmbed = new EmbedBuilder()
                    .setTitle(interaction.client.translate.commands.set_language.title)
                    .setDescription(
                        interaction.client.translate.commands.set_language.support
                            .replace("%s1", Object.keys(support).join(", "))
                            .replace("%s2", ("/" + module.exports.usage))
                    )
                    .setColor(clientColor)
                    .setTimestamp()
                    .setFooter({ "text": interaction.client.translate.commands.set_language.data_at })

                await interaction.reply({ "embeds": [supportEmbed] });
                break;
            }
            case "set": {
                const inputValue = interaction.options.getString("value");

                if (!support.includes(inputValue)) return await interaction.reply(interaction.client.translate.commands.set_language.language_not_found.replace("%s", support[locale]));
                if (inputValue === locale) return await interaction.reply(interaction.client.translate.commands.set_language.already_set.replace("%s", support[locale]));

                interaction.client.config.language.code = inputValue;
                interaction.client.translate = require("../../languages/" + inputValue + ".json");

                update(languageRef, inputValue).then(async () => {
                    await interaction.reply(interaction.client.translate.commands.set_language.set_success.replace("%s", support[locale]));
                });
                break;
            }
        }
    }
};