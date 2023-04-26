const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { levelSystem } = require("../../utils/databaseUtils");

module.exports = {
    "enable": true,
    "name": "exp",
    "description": "Manage experience within the server.",
    "category": "manager",
    "permissions": {
        "user": [PermissionsBitField.Flags.ManageGuild],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ManageGuild
        ]
    },
    "usage": "exp: set <member> <amount(Number)>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ค่าประสบการณ์"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "จัดการค่าประสบการณ์ภายในเซิร์ฟเวอร์"
        },
        "options": [
            {
                "type": 1,
                "name": "set",
                "name_localizations": {
                    "th": "ตั้งค่า"
                },
                "description": "Set the members' experience.",
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
                        "description": "The name of the member who wants to set the experience value.",
                        "description_localizations": {
                            "th": "ชื่อของสมาชิกที่ต้องการกำหนดค่าประสบการณ์"
                        },
                        "required": true
                    },
                    {
                        "type": 10,
                        "name": "amount",
                        "name_localizations": {
                            "th": "จำนวน"
                        },
                        "description": "The amount of experience that you want to set.",
                        "description_localizations": {
                            "th": "จำนวนค่าประสบการณ์ที่คุณต้องการตั้งค่า"
                        },
                        "required": true,
                        "min_value": 0
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case "set":
                const inputSetMember = interaction.options.getMember("member");
                const inputSetAmount = interaction.options.getNumber("amount");

                const memberAvatar = inputSetMember.avatarURL();
                const memberUsername = inputSetMember.username;

                const data = await levelSystem(interaction.client, interaction, "PUT", { "member": inputSetMember, "amount": inputSetAmount, "type": "exp" });

                const exp = data.exp;
                const level = data.level;
                const notify = data.notify;
                const status = data.status;

                if (status === "error") return await interaction.reply(interaction.client.translate.commands.exp.error);
                if (notify) {
                    const setEXPEmbed = new EmbedBuilder()
                        .setDescription(interaction.client.translate.commands.exp.exp_was_changed.replace("%s", memberUsername))
                        .setColor("Blue")
                        .setThumbnail(memberAvatar)
                        .setFooter({ "text": interaction.client.translate.commands.exp.set_by_staff })
                        .addFields(
                            [
                                {
                                    "name": interaction.client.translate.commands.exp.level,
                                    "value": "```" + level + "```"
                                },
                                {
                                    "name": interaction.client.translate.commands.exp.experience,
                                    "value": "```" + exp + "```"
                                }
                            ]
                        );

                    await notify.send({ "embeds": [setEXPEmbed] });
                    await interaction.reply(interaction.client.translate.commands.exp.notification_complete);
                } else {
                    await interaction.reply(interaction.client.translate.commands.exp.success);
                }
                break;
        }
    }
};