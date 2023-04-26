const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");

module.exports = {
    "enable": true,
    "name": "set-personal",
    "description": "Set up about your information.",
    "category": "settings",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "set-personal: get, set <type> <boolean>",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ตั้งค่าข้อมูลส่วนตัว"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ตั้งค่าเกี่ยวกับข้อมูลของคุณ"
        },
        "options": [
            {
                "type": 1,
                "name": "get",
                "name_localizations": {
                    "th": "รับ"
                },
                "description": "See your current settings.",
                "description_localizations": {
                    "th": "ดูการตั้งค่าปัจจุบันของคุณ"
                }
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

        const authorID = interaction.author.id;
        const accessRef = child(child(ref(getDatabase(), "projects/shioru/users"), authorID), "access");
        const accessSnapshot = interaction.client.api.users[authorID].access;

        if (accessSnapshot) {
            const avatar = accessSnapshot.avatar;
            const info = accessSnapshot.info;
            const uid = accessSnapshot.uid;

            switch (subCommand) {
                case "current":
                    const clientFetch = await interaction.client.user.fetch();
                    const clientColor = clientFetch.accentColor;
                    const noInputEmbed = new EmbedBuilder()
                        .setTitle(interaction.client.translate.commands.set_personal.title)
                        .setDescription(
                            interaction.client.translate.commands.set_personal.description
                                .replace("%s1", (avatar ? interaction.client.translate.commands.set_personal.yes : interaction.client.translate.commands.set_personal.no))
                                .replace("%s2", (info ? interaction.client.translate.commands.set_personal.yes : interaction.client.translate.commands.set_personal.no))
                                .replace("%s3", (uid ? interaction.client.translate.commands.set_personal.yes : interaction.client.translate.commands.set_personal.no))
                                .replace("%s4", ("/" + module.exports.usage))
                        )
                        .setColor(clientColor)
                        .setTimestamp()
                        .setFooter({ "text": interaction.client.translate.commands.set_personal.data_at });

                    await interaction.reply({ "embeds": [noInputEmbed] });
                    break;
                case "set":
                    const inputType = interaction.options.getString("type");
                    const inputBoolean = interaction.options.getBoolean("boolean");

                    if (inputBoolean) {
                        await set(child(accessRef, inputType), true);
                        await interaction.reply(interaction.client.translate.commands.set_personal.true_success.replace("%s", inputType));
                    } else {
                        await set(child(accessRef, inputType), false);
                        await interaction.reply(interaction.client.translate.commands.set_personal.false_success.replace("%s", inputType));
                    }
                    break;
            }
        } else {
            set(accessRef, {
                "avatar": true,
                "info": true,
                "uid": true
            }).then(() => {
                module.exports.function.command.execute(interaction);
            });
        }
    }
};