module.exports.run = async function (client, message, args) {
    let username = client.user.username;
    let avatar = client.user.displayAvatarURL();
    let update = client.data.config.data.update;
    
    message.channel.send({
        "embed": {
            "title": client.data.language.command_information_credits_embed_title,
            "description": client.data.language.command_information_credits_embed_description,
            "color": 12390624,
            "timestamp": update,
            "footer": {
                "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/lower-left-ballpoint-pen_1f58a.png",
                "text": client.data.language.command_information_credits_embed_footer_text
            },
            "author": {
                "name": username,
                "icon_url": avatar
            },
            "fields": [
                {
                    "name": client.data.language.command_information_credits_embed_field_0,
                    "value": client.data.language.command_information_credits_embed_field_0_value
                }
            ]
        }
    });
};

module.exports.help = {
    "name": "credits",
    "description": "Credit of other creators",
    "usage": "credits",
    "category": "information",
    "aliases": ["เครดิต", "creator"],
    "permissions": ["SEND_MESSAGES"]
};