const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "timeout",
    "description": "Set a timeout for the user.",
    "category": "manager",
    "permissions": {
        "user": [PermissionsBitField.Flags.ModerateMembers],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ModerateMembers
        ]
    },
    "usage": "timeout",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "description": module.exports.description,
        "description_localizations": {
            "th": "ตั้งให้ผู้ใช้หมดเวลา"
        },
        "options": [
            {
                "type": 6,
                "name": "user",
                "name_localizations": {
                    "th": "ผู้ใช้"
                },
                "description": "Users who want to set a timeout.",
                "description_localizations": {
                    "th": "ผู้ใช้ที่ต้องการตั้งให้หมดเวลา"
                },
                "required": true,
            },
            {
                "type": 3,
                "name": "duration",
                "name_localizations": {
                    "th": "ระยะเวลา"
                },
                "description": "The length of time the user will be kicked out.",
                "description_localizations": {
                    "th": "ระยะเวลาที่ผู้ใช้จะถูกเตะออก"
                },
                "required": true,
                "choices": [
                    {
                        "name": "60 Seconds",
                        "name_localizations": {
                            "th": "60 วินาที"
                        },
                        "value": "60"
                    },
                    {
                        "name": "2 Minutes",
                        "name_localizations": {
                            "th": "2 นาที"
                        },
                        "value": "120"
                    },
                    {
                        "name": "5 Minutes",
                        "name_localizations": {
                            "th": "5 นาที"
                        },
                        "value": "300"
                    },
                    {
                        "name": "10 Minutes",
                        "name_localizations": {
                            "th": "10 นาที"
                        },
                        "value": "600"
                    },
                    {
                        "name": "15 Minutes",
                        "name_localizations": {
                            "th": "15 นาที"
                        },
                        "value": "900"
                    },
                    {
                        "name": "20 Minutes",
                        "name_localizations": {
                            "th": "20 นาที"
                        },
                        "value": "1200"
                    },
                    {
                        "name": "30 Minutes",
                        "name_localizations": {
                            "th": "30 นาที"
                        },
                        "value": "1800"
                    },
                    {
                        "name": "45 Minutes",
                        "name_localizations": {
                            "th": "45 นาที"
                        },
                        "value": "2700"
                    },
                    {
                        "name": "1 Hour",
                        "name_localizations": {
                            "th": "1 ชั่วโมง"
                        },
                        "value": "3600"
                    },
                    {
                        "name": "2 Hours",
                        "name_localizations": {
                            "th": "2 ชั่วโมง"
                        },
                        "value": "7200"
                    },
                    {
                        "name": "3 Hours",
                        "name_localizations": {
                            "th": "3 ชั่วโมง"
                        },
                        "value": "10800"
                    },
                    {
                        "name": "5 Hours",
                        "name_localizations": {
                            "th": "5 ชั่วโมง"
                        },
                        "value": "18000"
                    },
                    {
                        "name": "10 Hours",
                        "name_localizations": {
                            "th": "10 ชั่วโมง"
                        },
                        "value": "36000"
                    },
                    {
                        "name": "1 Day",
                        "name_localizations": {
                            "th": "1 วัน"
                        },
                        "value": "86400"
                    },
                    {
                        "name": "2 Days",
                        "name_localizations": {
                            "th": "2 วัน"
                        },
                        "value": "172800"
                    },
                    {
                        "name": "3 Days",
                        "name_localizations": {
                            "th": "3 วัน"
                        },
                        "value": "259200"
                    },
                    {
                        "name": "5 Days",
                        "name_localizations": {
                            "th": "5 วัน"
                        },
                        "value": "43200"
                    },
                    {
                        "name": "1 Week",
                        "name_localizations": {
                            "th": "1 สัปดาห์"
                        },
                        "value": "604800"
                    }
                ]
            },
            {
                "type": 3,
                "name": "reason",
                "name_localizations": {
                    "th": "เหตุผล"
                },
                "description": "The reason the user was set to time out.",
                "description_localizations": {
                    "th": "เหตุผลที่ตั้งให้ผู้ใช้หมดเวลา"
                },
            }
        ]
    },
    async execute(interaction) {
        const inputUser = interaction.options.getUser("user");
        const inputDuration = interaction.options.getString("duration");
        const inputReason = interaction.options.getString("reason") ?? interaction.client.translate.commands.timeout.no_reason;

        const member = await interaction.guild.members.fetch(inputUser.id);

        if (!member) return await interaction.reply(interaction.client.translate.commands.timeout.member_not_found);
        if (!member.kickable) return await interaction.reply(interaction.client.translate.commands.timeout.can_not_set_timeout);
        if (interaction.member.id === member.id) return await interaction.reply(interaction.client.translate.commands.timeout.can_not_set_for_yourself);
        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply(interaction.client.translate.commands.timeout.can_not_set_to_admin);

        await member.timeout(inputDuration * 1000, inputReason);
        await member.send(interaction.client.translate.commands.timeout.dm_to_user.replace("%s1", interaction.guild.name).replace("%s2", inputReason));
        await interaction.reply(interaction.client.translate.commands.timeout.success.replace("%s1", member.tag).replace("%s2", (inputDuration / 60)).replace("%s3", inputReason));
    }
}