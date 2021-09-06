module.exports.run = function (client, message, args) {
    let username = client.user.username;
    let avatar = client.user.displayAvatarURL();
    let update = client.config.update;
    
    message.channel.send({
        "embeds": [
            {
                "title": client.translate.commands.credits.creator_credit,
                "description": client.translate.commands.credits.creator_credit_description,
                "color": 12390624,
                "timestamp": update,
                "footer": {
                    "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/lower-left-ballpoint-pen_1f58a.png",
                    "text": client.translate.commands.credits.update_on
                },
                "author": {
                    "name": username,
                    "icon_url": avatar
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
    "permissions": ["SEND_MESSAGES"]
};