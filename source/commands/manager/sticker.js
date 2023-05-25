const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "sticker",
    "description": "Manage this server's stickers.",
    "category": "manager",
    "permissions": {
        "user": [
            PermissionsBitField.Flags.ManageEmojisAndStickers,
            PermissionsBitField.Flags.AttachFiles
        ],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ManageEmojisAndStickers,
            PermissionsBitField.Flags.AttachFiles
        ]
    },
    "usage": "sticker: add <file(Blob)> <name(String)> [tags(String)] [description(String)] [reason(String)], delete <sticker(String)> [reason(String)], edit <sticker(String)> <name(String)> [tags(String)] [description(String)] [reason(String)]",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "สติ๊กเกอร์"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "จัดการสติ๊กเกอร์ของเซิร์ฟเวอร์นี้"
        },
        "options": [
            {
                "type": 1,
                "name": "add",
                "name_localizations": {
                    "th": "เพิ่ม"
                },
                "description": "Add stickers on this server.",
                "description_localizations": {
                    "th": "เพิ่มสติ๊กเกอร์บนเซิร์ฟเวอร์นี้"
                },
                "options": [
                    {
                        "type": 11,
                        "name": "file",
                        "name_localizations": {
                            "th": "ไฟล์"
                        },
                        "description": "Sticker image file.",
                        "description_localizations": {
                            "th": "ไฟล์ภาพของสติ๊กเกอร์"
                        },
                        "required": true
                    },
                    {
                        "type": 3,
                        "name": "name",
                        "name_localizations": {
                            "th": "ชื่อ"
                        },
                        "description": "The name for the sticker",
                        "description_localizations": {
                            "th": "ชื่อของสติ๊กเกอร์"
                        },
                        "min_length": 2,
                        "required": true
                    },
                    {
                        "type": 3,
                        "name": "tags",
                        "name_localizations": {
                            "th": "แท็ก"
                        },
                        "description": "The Discord name of a unicode emoji representing the sticker's expression",
                        "description_localizations": {
                            "th": "ชื่อ Discord ของอีโมจิ Unicode ที่แสดงถึงการแสดงออกของสติกเกอร์"
                        },
                        "required": false
                    },
                    {
                        "type": 3,
                        "name": "description",
                        "name_localizations": {
                            "th": "คำอธิบาย"
                        },
                        "description": "The description for the sticker",
                        "description_localizations": {
                            "th": "คำอธิบายของสติ๊กเกอร์"
                        },
                        "required": false
                    },
                    {
                        "type": 3,
                        "name": "reason",
                        "name_localizations": {
                            "th": "เหตุผล"
                        },
                        "description": "Reason for creation.",
                        "description_localizations": {
                            "th": "เหตุผลของการเพิ่ม"
                        },
                        "required": false
                    }
                ]
            },
            {
                "type": 1,
                "name": "delete",
                "name_localizations": {
                    "th": "ลบ"
                },
                "description": "Remove stickers on this server.",
                "description_localizations": {
                    "th": "ลบสติ๊กเกอร์บนเซิร์ฟเวอร์นี้"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "sticker",
                        "name_localizations": {
                            "th": "สติ๊กเกอร์"
                        },
                        "description": "Sticker ID.",
                        "description_localizations": {
                            "th": "รหัสของสติ๊กเกอร์"
                        },
                        "required": true
                    },
                    {
                        "type": 3,
                        "name": "reason",
                        "name_localizations": {
                            "th": "เหตุผล"
                        },
                        "description": "Reason for deletion.",
                        "description_localizations": {
                            "th": "เหตุผลของการลบ"
                        },
                        "required": false
                    }
                ]
            },
            {
                "type": 1,
                "name": "edit",
                "name_localizations": {
                    "th": "แก้ไข"
                },
                "description": "Edit stickers on this server.",
                "description_localizations": {
                    "th": "แก้ไขสติ๊กเกอร์บนเซิร์ฟเวอร์นี้"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "sticker",
                        "name_localizations": {
                            "th": "สติ๊กเกอร์"
                        },
                        "description": "Sticker ID.",
                        "description_localizations": {
                            "th": "รหัสของสติ๊กเกอร์"
                        },
                        "required": true
                    },
                    {
                        "type": 3,
                        "name": "name",
                        "name_localizations": {
                            "th": "ชื่อ"
                        },
                        "description": "The name of the sticker.",
                        "description_localizations": {
                            "th": "ชื่อของสติ๊กเกอร์"
                        },
                        "required": false
                    },
                    {
                        "type": 3,
                        "name": "tags",
                        "name_localizations": {
                            "th": "แท็ก"
                        },
                        "description": "The Discord name of a unicode emoji representing the sticker's expression",
                        "description_localizations": {
                            "th": "ชื่อ Discord ของอีโมจิ Unicode ที่แสดงถึงการแสดงออกของสติกเกอร์"
                        },
                        "required": false
                    },
                    {
                        "type": 3,
                        "name": "description",
                        "name_localizations": {
                            "th": "คำอธิบาย"
                        },
                        "description": "The description for the sticker",
                        "description_localizations": {
                            "th": "คำอธิบายของสติ๊กเกอร์"
                        },
                        "required": false
                    },
                    {
                        "type": 3,
                        "name": "reason",
                        "name_localizations": {
                            "th": "เหตุผล"
                        },
                        "description": "Reason for deletion.",
                        "description_localizations": {
                            "th": "เหตุผลของการลบ"
                        },
                        "required": false
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const inputFile = interaction.options.getAttachment("file") ?? "";
        const inputSticker = interaction.options.getString("sticker") ?? "";
        const inputName = interaction.options.getString("name") ?? "";
        const inputTags = interaction.options.getString("tags") ?? "";
        const inputDescription = interaction.options.getString("description") ?? "";
        const inputReason = interaction.options.getString("reason") ?? "";

        switch (subCommand) {
            case "add":
                if (inputFile.contentType === "image/gif") return await interaction.reply(interaction.client.translate.commands.sticker.does_not_support_gif);

                try {
                    await interaction.reply(interaction.client.translate.commands.sticker.uploading_you_sticker);

                    const addSticker = await interaction.guild.stickers.create({
                        "attachment": inputFile.attachment,
                        "name": inputName,
                        "tags": inputTags,
                        "description": inputDescription,
                        "reason": inputReason
                    });

                    if (!addSticker) return;

                    await interaction.editReply(interaction.client.translate.commands.sticker.you_sticker_is_ready.replace("%s", inputName));
                } catch (error) {
                    await interaction.reply(error.rawError.message);
                }
                break;
            case "delete":
                try {
                    await interaction.guild.stickers.delete({
                        "sticker": inputSticker,
                        "reason": inputReason
                    });
                    await interaction.reply(interaction.client.translate.commands.sticker.deleted_sticker.replace("%s", inputSticker));
                } catch (error) {
                    await interaction.reply(error.rawError.message);
                }
                break;
            case "edit":
                try {
                    const editSticker = await interaction.guild.stickers.edit({
                        "sticker": inputSticker,
                        "name": inputName,
                        "description": inputDescription,
                        "tags": inputTags,
                        "reason": inputReason
                    });

                    await interaction.reply(interaction.client.translate.commands.sticker.edited_sticker.replace("%s", editSticker));
                } catch (error) {
                    await interaction.reply(error.rawError.message);
                }
                break;
        }
    }
}