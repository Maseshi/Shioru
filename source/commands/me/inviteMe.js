const { OAuth2Scopes, PermissionsBitField, PermissionFlagsBits } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "inviteMe",
    "description": "Invite the bot to your server.",
    "category": "me",
	"permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "inviteMe",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name.toLowerCase(),
        "name_localizations": {
            "en-US": "inviteme",
            "th": "เชิญฉัน"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Invite the bot to your server.",
            "th": "เชิญบอทไปที่เซิร์ฟเวอร์ของคุณ"
        },
    },
    async execute(interaction) {
        try {
            const link = interaction.client.generateInvite({
                "scopes": [
                    OAuth2Scopes.ApplicationsCommands,
                    OAuth2Scopes.Bot
                ],
                "permissions": [
                    PermissionFlagsBits.Administrator
                ]
            });
    
            await interaction.editReply(link);
        } catch(error) {
            await interaction.editReply(interaction.client.translate.commands.inviteMe.can_not_create_invite_link);
            console.group();
                console.error(error);
            console.groupEnd();
        }
    }
};