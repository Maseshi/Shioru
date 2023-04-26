const { PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "impersonate",
    "description": "Summons a fake user to reply.",
    "category": "fun",
    "permissions": {
        "user": [PermissionsBitField.Flags.ManageWebhooks],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ManageWebhooks
        ]
    },
    "usage": "impersonate <user> <message(String)>",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "เลียนแบบ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "เสกผู้ใช้ปลอมขึ้นมาตอบกลับ"
        },
        "options": [
            {
                "type": 6,
                "name": "user",
                "name_localizations": {
                    "th": "ผู้ใช้"
                },
                "description": "Users who want to imitate.",
                "description_localizations": {
                    "th": "ผู้ใช้ที่ต้องการจะเลียนแบบ"
                },
                "required": true
            },
            {
                "type": 3,
                "name": "message",
                "name_localizations": {
                    "th": "ข้อความ"
                },
                "description": "The message you want to emulate.",
                "description_localizations": {
                    "th": "ข้อความที่ต้องการจะเลียนแบบ"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        await interaction.deferReply({ "ephemeral": true });

        const inputUser = interaction.options.getUser("user");
        const inputMessage = interaction.options.getString("message");

        const member = await interaction.guild.members.fetch(inputUser.id);

        if (!member) return await interaction.reply(interaction.client.translate.commands.impersonate.member_not_found);

        const impersonateWebhook = await interaction.channel.createWebhook({
            "name": inputUser.username,
            "avatar": inputUser.displayAvatarURL({ "dynamic": true })
        });

        await impersonateWebhook.send(inputMessage);
        await impersonateWebhook.delete()
        await interaction.editReply(interaction.client.translate.commands.impersonate.success.replace("%s", inputUser.id));
    }
}