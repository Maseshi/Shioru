const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, update } = require("firebase/database");

module.exports = {
    "enable": true,
    "name": "set-language",
    "description": "Sets language for the bot.",
    "category": "settings",
    "permissions": {
        "user": [PermissionsBitField.Flags.ManageGuild],
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "set-language: get, set <value>",
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
                },
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

        const guildID = interaction.guild.id;
        const lang = interaction.client.config.language.code;
        const support = interaction.client.config.language.support;
        const languageRef = child(child(ref(getDatabase(), "projects/shioru/guilds"), guildID), "language");

        switch (subCommand) {
            case "current":
                const clientFetch = await interaction.client.user.fetch();
                const clientColor = clientFetch.accentColor;
                const noInputEmbed = new EmbedBuilder()
                    .setTitle(interaction.client.translate.commands.set_language.title)
                    .setDescription(
                        interaction.client.translate.commands.set_language.description
                            .replace("%s1", support[lang])
                            .replace("%s2", ("/" + module.exports.usage))
                    )
                    .setColor(clientColor)
                    .setTimestamp()
                    .setFooter({ "text": interaction.client.translate.commands.set_language.data_at })

                await interaction.reply({ "embeds": [noInputEmbed] });
                break;
            case "set":
                const inputValue = interaction.options.getString("value");

                if (inputValue === lang) return await interaction.reply(interaction.client.translate.commands.set_language.already_set.replace("%s", support[inputValue]));

                interaction.client.config.language.code = inputValue;
                interaction.client.translate = require("../../languages/" + inputValue + ".json");

                update(languageRef, inputValue).then(async () => {
                    await interaction.reply(interaction.client.translate.commands.set_language.set_success.replace("%s", support[inputValue]));
                });
                break;
        }
    }
};