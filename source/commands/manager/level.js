const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { levelSystem } = require("../../utils/databaseUtils");

module.exports = {
    "enable": true,
    "name": "level",
    "description": "Manage levels within the server.",
    "category": "manager",
    "permissions": {
        "user": [PermissionsBitField.Flags.ManageGuild],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ManageGuild
        ]
    },
    "usage": "level: set <member> <amount(Number)>, delete <member>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "เลเวล"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "จัดการเลเวลภายในเซิร์ฟเวอร์"
        },
        "options": [
            {
                "type": 1,
                "name": "set",
                "name_localizations": {
                    "th": "ตั้งค่า"
                },
                "description": "Set Level of Members",
                "description_localizations": {
                    "th": "ตั้งค่าค่าประสบการณ์ของสมาชิก"
                },
                "options": [
                    {
                        "type": 6,
                        "name": "member",
                        "name_localizations": {
                            "th": "สมาชิก"
                        },
                        "description": "The name of the member who wants to set the level value.",
                        "description_localizations": {
                            "th": "ชื่อของสมาชิกที่ต้องการกำหนดค่าเลเวล"
                        },
                        "required": true
                    },
                    {
                        "type": 10,
                        "name": "amount",
                        "name_localizations": {
                            "th": "จำนวน"
                        },
                        "description": "The amount of level that you want to set.",
                        "description_localizations": {
                            "th": "จำนวนเลเวลที่คุณต้องการตั้งค่า"
                        },
                        "required": true,
                        "min_value": 0
                    }
                ]
            },
            {
                "type": 1,
                "name": "delete",
                "name_localizations": {
                    "th": "ลบ"
                },
                "description": "Removing EXP and Level of members",
                "description_localizations": {
                    "th": "ลบ exp และเลเวลของสมาชิก"
                },
                "options": [
                    {
                        "type": 6,
                        "name": "member",
                        "name_localizations": {
                            "th": "สมาชิก"
                        },
                        "description": "Members you want to delete levels.",
                        "description_localizations": {
                            "th": "สมาชิกที่คุณต้องการลบระดับ"
                        },
                        "required": true
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const inputMember = interaction.options.getMember("member") ?? "";
        const inputAmount = interaction.options.getNumber("amount") ?? 0;

        switch (subCommand) {
            case "set": {
                const memberAvatar = inputMember.avatarURL();
                const memberUsername = inputMember.username;

                const snapshotSet = levelSystem(interaction.client, interaction, "PUT", { "member": inputMember, "amount": inputAmount, "type": "level" });

                const exp = snapshotSet.exp;
                const level = snapshotSet.level;
                const notify = snapshotSet.notify;
                const status = snapshotSet.status;

                if (status === "error") return await interaction.reply(interaction.client.translate.commands.level.set_error);
                if (notify) {
                    const levelEmbed = new EmbedBuilder()
                        .setDescription(interaction.client.translate.commands.level.level_was_changed.replace("%s", memberUsername))
                        .setColor("Blue")
                        .setThumbnail(memberAvatar)
                        .setFooter({ "text": interaction.client.translate.commands.level.set_by_staff })
                        .addFields(
                            [
                                {
                                    "name": interaction.client.translate.commands.level.level,
                                    "value": "```" + exp + "```"
                                },
                                {
                                    "name": interaction.client.translate.commands.level.experience,
                                    "value": "```" + level + "```"
                                }
                            ]
                        );

                    await notify.send({ "embeds": [levelEmbed] });
                    await interaction.reply(interaction.client.translate.commands.level.notification_complete);
                } else {
                    await interaction.reply(interaction.client.translate.commands.level.set_success);
                }
                break;
            }
            case "delete": {
                await interaction.reply(interaction.client.translate.commands.level.deleting);

                const snapshotDelete = await levelSystem(interaction.client, interaction, "DELETE", { "member": inputMember });

                if (snapshotDelete === "missing") return await interaction.editReply(interaction.client.translate.commands.level.user_current_no_level);
                if (snapshotDelete === "success") return await interaction.editReply(interaction.client.translate.commands.level.delete_success);
                if (snapshotDelete === "error") return await interaction.editReply(interaction.client.translate.commands.level.delete_error);
                break;
            }
        }
    }
};