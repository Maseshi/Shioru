const { getDatabase, ref, child, update } = require("firebase/database");

module.exports.run = (client, message, args) => {
    const input = args.join(" ");
    const inputOption = args[0] ? args[0].toLowerCase() : "";
    const inputValue = args[1] ? args[1].toLowerCase() : "";

    const guildID = message.guild.id;
    const prefix = client.config.prefix;
    const lang = client.config.lang.code;
    const support = client.config.lang.support;
    const dbRef = child(child(ref(getDatabase(), "Shioru/apps/discord/guilds"), guildID), "config");

    if (!input) {
        return message.channel.send({
            "embeds": [
                {
                    "title": client.translate.commands.language.title,
                    "description": client.translate.commands.language.description
                        .replace("%s1", support[lang])
                        .replace("%s2", (prefix + module.exports.help.usage))
                        .replace("%s3", ("/" + module.exports.help.usage)),
                    "color": 14684245,
                    "timestamp": new Date(),
                    "footer": {
                        "text": client.translate.commands.language.data_at
                    }
                }
            ]
        });
    }

    switch (inputOption) {
        case "set":
            if (!inputValue) return message.reply(client.translate.commands.language.empty_value);
            if (inputValue === lang) return message.reply(client.translate.commands.language.already_set.replace("%s", support[inputValue]));
            if (!Array.from(Object.keys(support)).includes(inputValue)) return message.reply(client.translate.commands.language.language_not_support.replace("%s1", inputValue).replace("%s2", Object.keys(support)));

            client.config.lang.code = inputValue;
            client.translate = require("../../languages/" + inputValue + ".json");

            update(dbRef, {
                "language": inputValue
            }).then(() => {
                message.channel.send(client.translate.commands.language.set_success.replace("%s", support[inputValue]));
            });
            break;
        default:
            return message.reply(client.translate.commands.language.invalid_options.replace("%s", inputOption));
    }
}

module.exports.help = {
    "name": "language",
    "description": "Sets language for the bot.",
    "usage": "language [option: set] <value>",
    "category": "settings",
    "aliases": ["lang", "ภาษา"],
    "userPermissions": ["MANAGE_GUILD"],
    "clientPermissions": ["SEND_MESSAGES"]
}

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
			"en-US": "language",
			"th": "ภาษา"
		},
        "description": module.exports.help.description,
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
        const lang = interaction.client.config.lang.code;
        const support = interaction.client.config.lang.support;
        const dbRef = child(child(ref(getDatabase(), "Shioru/apps/discord/guilds"), guildID), "config");

        if (subCommand === "current") {
            await interaction.editReply({
                "embeds": [
                    {
                        "title": interaction.client.translate.commands.language.title,
                        "description": interaction.client.translate.commands.language.description
                            .replace("%s1", support[lang])
                            .replace("%s2", (prefix + module.exports.help.usage))
                            .replace("%s3", ("/" + module.exports.help.usage)),
                        "color": 14684245,
                        "timestamp": new Date(),
                        "footer": {
                            "text": interaction.client.translate.commands.language.data_at
                        }
                    }
                ]
            });
        }

        if (subCommand === "set") {
            if (inputValue.value === lang) return await interaction.editReply(interaction.client.translate.commands.language.already_set.replace("%s", support[inputValue]));

            interaction.client.config.lang.code = inputValue.value;
            interaction.client.translate = require("../../languages/" + inputValue.value + ".json");

            update(dbRef, {
                "language": inputValue.value
            }).then(async () => {
                await interaction.editReply(interaction.client.translate.commands.language.set_success.replace("%s", support[inputValue.value]));
            });
        }
    }
};