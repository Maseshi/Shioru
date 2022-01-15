module.exports.run = (client, message, args) => {
    const clientUsername = client.user.username;
    const clientAvatar = client.user.displayAvatarURL();
    const update = client.config.update;
    
    message.channel.send({
        "embeds": [
            {
                "title": client.translate.commands.credits.creator_credit,
                "description": client.translate.commands.credits.creator_credit_description,
                "color": 12390624,
                "timestamp": update,
                "footer": {
                    "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/lower-left-ballpoint-pen_1f58a.png",
                    "text": client.translate.commands.credits.update_on
                },
                "author": {
                    "name": clientUsername,
                    "iconURL": clientAvatar
                },
                "fields": [
                    {
                        "name": "1. 夏月 まりな (NATSUKI MARINA)",
                        "value": client.translate.commands.credits.natsuki_marina_credit
                    }
                ]
            }
        ]
    });
};

module.exports.help = {
    "name": "credits",
    "description": "Credit of other creators",
    "usage": "credits",
    "category": "me",
    "aliases": ["เครดิต", "creator"],
    "clientPermissions": ["SEND_MESSAGES"]
};