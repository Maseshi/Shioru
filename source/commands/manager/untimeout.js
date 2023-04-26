const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "untimeout",
    "description": "Set a untimeout for the user.",
    "category": "manager",
    "permissions": {
        "user": [PermissionsBitField.Flags.ModerateMembers],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ModerateMembers
        ]
    },
    "usage": "untimeout",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "description": module.exports.description,
        "description_localizations": {
            "th": "ตั้งให้ผู้ใช้ไม่หมดเวลา"
        },
        "options": [
            {
                "type": 6,
                "name": "user",
                "name_localizations": {
                    "th": "ผู้ใช้"
                },
                "description": "Users who want to set a untimeout.",
                "description_localizations": {
                    "th": "ผู้ใช้ที่ต้องการตั้งให้ไม่หมดเวลา"
                },
                "required": true,
            },
            {
                "type": 3,
                "name": "reason",
                "name_localizations": {
                    "th": "เหตุผล"
                },
                "description": "The reason the user was set to untimeout.",
                "description_localizations": {
                    "th": "เหตุผลที่ตั้งให้ผู้ใช้ไม่หมดเวลา"
                },
            }
        ]
    },
    async execute(interaction) {
        const inputUser = interaction.options.getUser("user");
        const inputReason = interaction.options.getString("reason") ?? interaction.client.translate.commands.untimeout.no_reason;

        const member = await interaction.guild.members.fetch(inputUser.id);

        if (!member) return await interaction.reply(interaction.client.translate.commands.untimeout.member_not_found);
        if (!member.kickable) return await interaction.reply(interaction.client.translate.commands.untimeout.can_not_set_untimeout);
        if (interaction.member.id === member.id) return await interaction.reply(interaction.client.translate.commands.untimeout.can_not_set_for_yourself);
        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply(interaction.client.translate.commands.untimeout.can_not_set_to_admin);

        await member.timeout(null, inputReason);
        await member.send(interaction.client.translate.commands.untimeout.dm_to_user.replace("%s1", interaction.guild.name).replace("%s2", inputReason));
        await interaction.reply(interaction.client.translate.commands.untimeout.success.replace("%s1", member.tag).replace("%s2", inputReason));
    }
}