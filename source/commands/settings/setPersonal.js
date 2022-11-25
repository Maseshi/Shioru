const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");

module.exports = {
    "name": "setPersonal",
    "description": "Set up about your information.",
    "category": "settings",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "setPersonal [type: avatar, info, uid] <boolean>",
    "aliases": ["setpersonal", "pers", "ส่วนตัว", "ข้อมูลส่วนตัว"],
    async execute(client, message, args) {
        const input = args.join(" ");
        const inputType = args[0] ? args[0].toLowerCase() : "";
        const inputBoolean = args[1] ? args[1].toLowerCase() : "";

        const authorID = message.author.id;
        const prefix = client.config.prefix;
        const type = ["avatar", "info", "uid"]
        const accessRef = child(child(ref(getDatabase(), "projects/shioru/users"), authorID), "access");
        const accessSnapshot = client.api.users[authorID].access;

        if (accessSnapshot) {
            const avatar = accessSnapshot.avatar;
            const info = accessSnapshot.info;
            const uid = accessSnapshot.uid;

            if (!input) {
                const clientFetch = await client.user.fetch();
                const clientColor = clientFetch.accentColor;
                const noInputEmbed = new EmbedBuilder()
                    .setTitle(client.translate.commands.setPersonal.title)
                    .setDescription(
                        client.translate.commands.setPersonal.description
                            .replace("%s1", (avatar ? client.translate.commands.setPersonal.yes : client.translate.commands.setPersonal.no))
                            .replace("%s2", (info ? client.translate.commands.setPersonal.yes : client.translate.commands.setPersonal.no))
                            .replace("%s3", (uid ? client.translate.commands.setPersonal.yes : client.translate.commands.setPersonal.no))
                            .replace("%s4", (prefix + module.exports.command.usage))
                            .replace("%s5", ("/" + module.exports.command.usage))
                    )
                    .setColor(clientColor)
                    .setTimestamp()
                    .setFooter({ "text": client.translate.commands.setPersonal.data_at });

                return message.channel.send({
                    "embeds": [noInputEmbed]
                });
            }
            if (!inputType) return message.reply(client.translate.commands.setPersonal.empty_type.replace("%s", type.join(", ")));
            if (!type.includes(inputType)) return message.reply(client.translate.commands.setPersonal.type_not_found.replace("%s", type.join(", ")));
            if (!inputBoolean) return message.reply(client.translate.commands.setPersonal.empty_value);

            switch (inputBoolean) {
                case "true":
                    set(child(accessRef, inputType), true).then(() => {
                        message.channel.send(client.translate.commands.setPersonal.true_success.replace("%s", inputType));
                    });
                    break;
                case "false":
                    set(child(accessRef, inputType), false).then(() => {
                        message.channel.send(client.translate.commands.setPersonal.false_success.replace("%s", inputType));
                    });
                    break;
                default:
                    return message.reply(client.translate.commands.setPersonal.invalid_value);
            }
        } else {
            set(accessRef, {
                "avatar": false,
                "info": false,
                "uid": false
            }).then(() => {
                module.exports.run(client, message, args);
            });
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

        const authorID = interaction.author.id;
        const prefix = interaction.client.config.prefix;
        const accessRef = child(child(ref(getDatabase(), "projects/shioru/users"), authorID), "access");
        const accessSnapshot = interaction.client.api.users[authorID].access;

        if (accessSnapshot) {
            const avatar = accessSnapshot.avatar;
            const info = accessSnapshot.info;
            const uid = accessSnapshot.uid;

            if (subCommand === "current") {
                const clientFetch = await interaction.client.user.fetch();
                const clientColor = clientFetch.accentColor;
                const noInputEmbed = new EmbedBuilder()
                    .setTitle(interaction.client.translate.commands.setPersonal.title)
                    .setDescription(
                        interaction.client.translate.commands.setPersonal.description
                            .replace("%s1", (avatar ? interaction.client.translate.commands.setPersonal.yes : interaction.client.translate.commands.setPersonal.no))
                            .replace("%s2", (info ? interaction.client.translate.commands.setPersonal.yes : interaction.client.translate.commands.setPersonal.no))
                            .replace("%s3", (uid ? interaction.client.translate.commands.setPersonal.yes : interaction.client.translate.commands.setPersonal.no))
                            .replace("%s4", (prefix + module.exports.command.usage))
                            .replace("%s5", ("/" + module.exports.command.usage))
                    )
                    .setColor(clientColor)
                    .setTimestamp()
                    .setFooter({ "text": interaction.client.translate.commands.setPersonal.data_at });

                return await interaction.editReply({
                    "embeds": [noInputEmbed]
                });
            }

            if (subCommand === "set") {
                switch (inputBoolean) {
                    case true:
                        await set(child(accessRef, inputType), true);
                        await interaction.editReply(interaction.client.translate.commands.setPersonal.true_success.replace("%s", inputType));
                        break;
                    case false:
                        await set(child(accessRef, inputType), false);
                        await interaction.editReply(interaction.client.translate.commands.setPersonal.false_success.replace("%s", inputType));
                        break;
                }
            }
        } else {
            set(accessRef, {
                "avatar": false,
                "info": false,
                "uid": false
            }).then(() => {
                module.exports.interaction.execute(interaction);
            });
        }
    }
};