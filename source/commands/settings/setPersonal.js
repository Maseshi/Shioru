const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");

module.exports = {
    "enable": true,
    "name": "setPersonal",
    "description": "Set up about your information.",
    "category": "settings",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "setPersonal [type: avatar, info, uid] <boolean>",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
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
                            .replace("%s4", ("/" + module.exports.command.usage))
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
                "avatar": true,
                "info": true,
                "uid": true
            }).then(() => {
                module.exports.interaction.execute(interaction);
            });
        }
    }
};