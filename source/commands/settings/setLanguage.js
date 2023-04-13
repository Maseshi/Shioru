const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, update } = require("firebase/database");

module.exports = {
    "enable": true,
    "name": "setLanguage",
    "description": "Sets language for the bot.",
    "category": "settings",
    "permissions": {
        "user": [PermissionsBitField.Flags.ManageGuild],
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "setLanguage [option: set] <value>",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name.toLowerCase(),
        "name_localizations": {
            "en-US": "language",
            "th": "ภาษา"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Sets language for the bot.",
            "th": "ตั้งค่าภาษาสำหรับบอท"
        },
        "options": [
            {
                "type": 1,
                "name": "current",
                "name_localizations": {
                    "th": "ปัจจุบัน"
                },
                "description": "See the language that is currently being used.",
                "description_localizations": {
                    "th": "ดูภาษาที่กำลังใช้งานอยู่"
                },
                "required": false
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
                "required": false,
                "options": [
                    {
                        "type": 3,
                        "name": "value",
                        "name_localizations": {
                            "th": "ค่า"
                        },
                        "description": "The language code.",
                        "description_localizations": {
                            "th": "รหัสภาษา"
                        },
                        "required": true,
                        "choices": [
                            {
                                "name": "English",
                                "value": "en"
                            },
                            {
                                "name": "日本",
                                "value": "ja"
                            },
                            {
                                "name": "ไทย",
                                "value": "th"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const inputValue = interaction.options.get("value");

        const guildID = interaction.guild.id;
        const lang = interaction.client.config.language.code;
        const support = interaction.client.config.language.support;
        const languageRef = child(child(ref(getDatabase(), "projects/shioru/guilds"), guildID), "language");

        if (subCommand === "current") {
            const clientFetch = await interaction.client.user.fetch();
            const clientColor = clientFetch.accentColor;
            const noInputEmbed = new EmbedBuilder()
                .setTitle(interaction.client.translate.commands.setLanguage.title)
                .setDescription(
                    interaction.client.translate.commands.setLanguage.description
                        .replace("%s1", support[lang])
                        .replace("%s2", ("/" + module.exports.usage))
                )
                .setColor(clientColor)
                .setTimestamp()
                .setFooter({ "text": interaction.client.translate.commands.setLanguage.data_at })

            await interaction.editReply({
                "embeds": [noInputEmbed]
            });
        }
        if (subCommand === "set") {
            if (inputValue.value === lang) return await interaction.editReply(interaction.client.translate.commands.setLanguage.already_set.replace("%s", support[inputValue]));

            interaction.client.config.language.code = inputValue.value;
            interaction.client.translate = require("../../languages/" + inputValue.value + ".json");

            update(languageRef, inputValue.value).then(async () => {
                await interaction.editReply(interaction.client.translate.commands.setLanguage.set_success.replace("%s", support[inputValue.value]));
            });
        }
    }
};