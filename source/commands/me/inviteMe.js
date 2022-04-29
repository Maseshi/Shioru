module.exports.run = (client, message, args) => {
    try {
        const link = client.generateInvite({
            "scope": [
                "applications.commands",
                "bot"
            ],
            "permissions": [
                "ADMINISTRATOR"
            ]
        });

        message.channel.send(link);
    } catch(error) {
        message.reply(client.translate.commands.inviteMe.can_not_create_invite_link);
        console.group();
            console.error(error);
        console.groupEnd();
    }
};

module.exports.help = {
    "name": "inviteMe",
    "description": "Invite the bot to your server.",
    "usage": "inviteMe",
    "category": "me",
	"aliases": ["inviteme", "ime"],
	"clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name.toLowerCase(),
        "name_localizations": {
            "en-US": "inviteme",
            "th": "เชิญฉัน"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Invite the bot to your server.",
            "th": "เชิญบอทไปที่เซิร์ฟเวอร์ของคุณ"
        },
    },
    async execute(interaction) {
        try {
            const link = interaction.client.generateInvite({
                "scope": [
                    "applications.commands",
                    "bot"
                ],
                "permissions": [
                    "ADMINISTRATOR"
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