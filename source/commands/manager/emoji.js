const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "emoji",
    "description": "Manage this server's emojis.",
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
    "usage": "emoji: add <emoji(Blob)> <name(String)> [reason(String)], delete <emoji(String)> [reason(String)], edit <emoji(String)> [name(String)] [reason(String)]",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "อีโมจิ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "จัดการอีโมจิของเซิร์ฟเวอร์นี้"
        },
        "options": [
            {
                "type": 1,
                "name": "add",
                "name_localizations": {
                    "th": "เพิ่ม"
                },
                "description": "Add emojis on this server.",
                "description_localizations": {
                    "th": "เพิ่มอีโมจิบนเซิร์ฟเวอร์นี้"
                },
                "options": [
                    {
                        "type": 11,
                        "name": "emoji",
                        "name_localizations": {
                            "th": "อีโมจิ"
                        },
                        "description": "Emoji images.",
                        "description_localizations": {
                            "th": "ภาพของอีโมจิ"
                        },
                        "required": true
                    },
                    {
                        "type": 3,
                        "name": "name",
                        "name_localizations": {
                            "th": "ชื่อ"
                        },
                        "description": "The name of the emoji.",
                        "description_localizations": {
                            "th": "ชื่อของอีโมจิ"
                        },
                        "required": true
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
                "description": "Remove emojis on this server.",
                "description_localizations": {
                    "th": "ลบอีโมจิบนเซิร์ฟเวอร์นี้"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "emoji",
                        "name_localizations": {
                            "th": "อีโมจิ"
                        },
                        "description": "Emoji ID.",
                        "description_localizations": {
                            "th": "รหัสของอีโมจิ"
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
                "description": "Edit emojis on this server.",
                "description_localizations": {
                    "th": "แก้ไขอีโมจิบนเซิร์ฟเวอร์นี้"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "emoji",
                        "name_localizations": {
                            "th": "อีโมจิ"
                        },
                        "description": "Emoji ID.",
                        "description_localizations": {
                            "th": "รหัสของอีโมจิ"
                        },
                        "required": true
                    },
                    {
                        "type": 3,
                        "name": "name",
                        "name_localizations": {
                            "th": "ชื่อ"
                        },
                        "description": "The name of the emoji.",
                        "description_localizations": {
                            "th": "ชื่อของอีโมจิ"
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

        switch (subCommand) {
            case "add":
                const inputAddEmoji = interaction.options.getAttachment("emoji");
                const inputAddName = interaction.options.getString("name");
                const inputAddReason = interaction.options.getString("reason") ?? "";

                try {
                    await interaction.reply(interaction.client.translate.commands.emoji.uploading_you_emoji);

                    const addEmoji = await interaction.guild.emojis.create({
                        "attachment": inputAddEmoji.attachment,
                        "name": inputAddName,
                        "reason": inputAddReason
                    });

                    if (!addEmoji) return;

                    await interaction.editReply(interaction.client.translate.commands.emoji.you_emoji_is_ready.replace("%s", addEmoji));
                } catch (error) {
                    await interaction.reply(error.rawError.message);
                }
                break;
            case "delete":
                const inputDeleteEmoji = interaction.options.getString("emoji");
                const inputDeleteReason = interaction.options.getString("reason") ?? "";

                try {
                    await interaction.guild.emojis.delete({
                        "emoji": inputDeleteEmoji,
                        "reason": inputDeleteReason
                    });
                    await interaction.reply(interaction.client.translate.commands.emoji.deleted_emoji.replace("%s", inputDeleteEmoji));
                } catch (error) {
                    await interaction.reply(error.rawError.message);
                }
                break;
            case "edit":
                const inputEditEmoji = interaction.options.getString("emoji");
                const inputEditName = interaction.options.getString("name") ?? "";
                const inputEditReason = interaction.options.getString("reason") ?? "";

                try {
                    const editEmoji = await interaction.guild.emojis.edit({
                        "emoji": inputEditEmoji,
                        "name": inputEditName,
                        "reason": inputEditReason
                    });

                    await interaction.reply(interaction.client.translate.commands.emoji.edited_emoji.replace("%s", editEmoji));
                } catch (error) {
                    await interaction.reply(error.rawError.message);
                }
                break;
        }
    }
}