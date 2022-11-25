const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, update } = require("firebase/database");

module.exports = {
    "name": "setLanguage",
    "description": "Sets language for the bot.",
    "category": "settings",
    "permissions": {
        "user": [PermissionsBitField.Flags.ManageGuild],
        "client": [PermissionsBitField.Flags.SendMessages]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "setLanguage [option: set] <value>",
    "aliases": ["setlanguage", "lang", "ภาษา"],
    async execute(client, message, args) {
        const input = args.join(" ");
        const inputOption = args[0] ? args[0].toLowerCase() : "";
        const inputValue = args[1] ? args[1].toLowerCase() : "";
    
        const guildID = message.guild.id;
        const prefix = client.config.prefix;
        const lang = client.config.language.code;
        const support = client.config.language.support;
        const languageRef = child(child(ref(getDatabase(), "projects/shioru/guilds"), guildID), "language");
    
        if (!input) {
            const clientFetch = await client.user.fetch();
            const clientColor = clientFetch.accentColor;
            const noInputEmbed = new EmbedBuilder()
                .setTitle(client.translate.commands.setLanguage.title)
                .setDescription(
                    client.translate.commands.setLanguage.description
                        .replace("%s1", support[lang])
                        .replace("%s2", (prefix + module.exports.command.usage))
                        .replace("%s3", ("/" + module.exports.command.usage))
                )
                .setColor(clientColor)
                .setTimestamp()
                .setFooter({ "text": client.translate.commands.setLanguage.data_at })
    
            return message.channel.send({ "embeds": [noInputEmbed] });
        }
    
        switch (inputOption) {
            case "set":
                if (!inputValue) return message.reply(client.translate.commands.setLanguage.empty_value);
                if (inputValue === lang) return message.reply(client.translate.commands.setLanguage.already_set.replace("%s", support[inputValue]));
                if (!Array.from(Object.keys(support)).includes(inputValue)) return message.reply(client.translate.commands.setLanguage.language_not_support.replace("%s1", inputValue).replace("%s2", Object.keys(support)));
    
                client.config.language.code = inputValue;
                client.translate = require("../../languages/" + inputValue + ".json");
    
                set(languageRef, inputValue).then(() => {
                    message.channel.send(client.translate.commands.setLanguage.set_success.replace("%s", support[inputValue]));
                });
                break;
            default:
                return message.reply(client.translate.commands.setLanguage.invalid_options.replace("%s", inputOption));
        }
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
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
        const prefix = interaction.client.config.prefix;
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
                        .replace("%s2", (prefix + module.exports.command.usage))
                        .replace("%s3", ("/" + module.exports.command.usage))
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