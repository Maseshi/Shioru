const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, get, set } = require("firebase/database");

module.exports = {
    "name": "setPersonal",
    "description": "Set up about your information.",
    "category": "settings",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "setPersonal [type: avatar, info, uid] <boolean>",
    "aliases": ["pers", "ส่วนตัว", "ข้อมูลส่วนตัว"],
    async execute(client, message, args) {
        const input = args.join(" ");
        const inputType = args[0] ? args[0].toLowerCase() : "";
        const inputBoolean = args[1] ? args[1].toLowerCase() : "";
    
        const guildID = message.guild.id;
        const authorID = message.author.id;
        const prefix = client.config.prefix;
        const type = ["avatar", "info", "uid"]
        const dbRef = child(child(child(child(ref(getDatabase(), "Shioru/apps/discord/guilds"), guildID), "data/users"), authorID), "access");
    
        get(dbRef).then(async snapshot => {
            if (snapshot.exists()) {
                const avatar = snapshot.val().avatar;
                const info = snapshot.val().info;
                const uid = snapshot.val().uid;
    
                if (!input) {
                    const clientFetch = await client.user.fetch();
                    const clientColor = clientFetch.accentColor;
                    const noInputEmbed = new EmbedBuilder()
                        .setTitle(client.translate.commands.personal.title)
                        .setDescription(
                            client.translate.commands.personal.description
                                .replace("%s1", (avatar ? client.translate.commands.personal.yes : client.translate.commands.personal.no))
                                .replace("%s2", (info ? client.translate.commands.personal.yes : client.translate.commands.personal.no))
                                .replace("%s3", (uid ? client.translate.commands.personal.yes : client.translate.commands.personal.no))
                                .replace("%s4", (prefix + module.exports.command.usage))
                                .replace("%s5", ("/" + module.exports.command.usage))
                        )
                        .setColor(clientColor)
                        .setTimestamp()
                        .setFooter({ "text": client.translate.commands.personal.data_at });
    
                    return message.channel.send({
                        "embeds": [noInputEmbed]
                    });
                }
                if (!inputType) return message.reply(client.translate.commands.personal.empty_type.replace("%s", type.join(", ")));
                if (!type.includes(inputType)) return message.reply(client.translate.commands.personal.type_not_found.replace("%s", type.join(", ")));
                if (!inputBoolean) return message.reply(client.translate.commands.personal.empty_value);
    
                switch (inputBoolean) {
                    case "true":
                        set(child(dbRef, inputType), true).then(() => {
                            message.channel.send(client.translate.commands.personal.true_success.replace("%s", inputType));
                        });
                        break;
                    case "false":
                        set(child(dbRef, inputType), false).then(() => {
                            message.channel.send(client.translate.commands.personal.false_success.replace("%s", inputType));
                        });
                        break;
                    default:
                        return message.reply(client.translate.commands.personal.invalid_value);
                }
            } else {
                set(dbRef, {
                    "avatar": false,
                    "info": false,
                    "uid": false
                }).then(() => {
                    module.exports.run(client, message, args);
                });
            }
        });
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name.toLowerCase(),
        "name_localizations": {
            "en-US": "personal",
            "th": "ข้อมูลส่วนตัว"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Set up about your information.",
            "th": "ตั้งค่าเกี่ยวกับข้อมูลของคุณ"
        },
        "options": [
            {
                "type": 1,
                "name": "current",
                "name_localizations": {
                    "th": "ปัจจุบัน"
                },
                "description": "See your current settings.",
                "description_localizations": {
                    "th": "ดูการตั้งค่าปัจจุบันของคุณ"
                },
                "required": false,
            },
            {
                "type": 1,
                "name": "set",
                "name_localizations": {
                    "th": "ตั้งค่า"
                },
                "description": "Set your permission to see your personal. (Specific to Shioru)",
                "description_localizations": {
                    "th": "ตั้งค่าการอนุญาตของคุณเพื่อดูส่วนบุคคลของคุณ (เฉพาะ Shioru)"
                },
                "required": false,
                "options": [
                    {
                        "type": 3,
                        "name": "type",
                        "name_localizations": {
                            "th": "ประเภท"
                        },
                        "description": "The type of personal you want to set.",
                        "description_localizations": {
                            "th": "ประเภทส่วนบุคคลที่คุณต้องการตั้งค่า"
                        },
                        "required": true,
                        "choices": [
                            {
                                "name": "Avatar",
                                "name_localizations": {
                                    "th": "รูปภาพประจำตัว"
                                },
                                "value": "avatar"
                            },
                            {
                                "name": "Information",
                                "name_localizations": {
                                    "th": "ข้อมูล"
                                },
                                "value": "info"
                            },
                            {
                                "name": "User ID",
                                "name_localizations": {
                                    "th": "ID ผู้ใช้"
                                },
                                "value": "uid"
                            }
                        ]
                    },
                    {
                        "type": 5,
                        "name": "boolean",
                        "name_localizations": {
                            "th": "ตรรกะ"
                        },
                        "description": "True means allow and False means not allowed.",
                        "description_localizations": {
                            "th": "True หมายถึงอนุญาตและ Flase หมายถึงไม่อนุญาต"
                        },
                        "required": true
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const inputType = interaction.options.get("type").value;
        const inputBoolean = interaction.options.get("boolean").value;

        const guildID = interaction.guild.id;
        const authorID = interaction.user.id;
        const prefix = interaction.client.config.prefix;
        const dbRef = child(child(child(child(ref(getDatabase(), "Shioru/apps/discord/guilds"), guildID), "data/users"), authorID), "access");

        get(dbRef).then(async snapshot => {
            if (snapshot.exists()) {
                const avatar = snapshot.val().avatar;
                const info = snapshot.val().info;
                const uid = snapshot.val().uid;

                if (subCommand === "current") {
                    const clientFetch = await interaction.client.user.fetch();
                    const clientColor = clientFetch.accentColor;
                    const noInputEmbed = new EmbedBuilder()
                        .setTitle(interaction.client.translate.commands.personal.title)
                        .setDescription(
                            interaction.client.translate.commands.personal.description
                                .replace("%s1", (avatar ? interaction.client.translate.commands.personal.yes : interaction.client.translate.commands.personal.no))
                                .replace("%s2", (info ? interaction.client.translate.commands.personal.yes : interaction.client.translate.commands.personal.no))
                                .replace("%s3", (uid ? interaction.client.translate.commands.personal.yes : interaction.client.translate.commands.personal.no))
                                .replace("%s4", (prefix + module.exports.command.usage))
                                .replace("%s5", ("/" + module.exports.command.usage))
                        )
                        .setColor(clientColor)
                        .setTimestamp()
                        .setFooter({ "text": interaction.client.translate.commands.personal.data_at });

                    return await interaction.editReply({
                        "embeds": [noInputEmbed]
                    });
                }

                if (subCommand === "set") {
                    switch (inputBoolean) {
                        case true:
                            await set(child(dbRef, inputType), true);
                            await interaction.editReply(interaction.client.translate.commands.personal.true_success.replace("%s", inputType));
                            break;
                        case false:
                            await set(child(dbRef, inputType), false);
                            await interaction.editReply(interaction.client.translate.commands.personal.false_success.replace("%s", inputType));
                            break;
                    }
                }
            } else {
                set(dbRef, {
                    "avatar": false,
                    "info": false,
                    "uid": false
                }).then(() => {
                    module.exports.interaction.execute(interaction);
                });
            }
        });
    }
};