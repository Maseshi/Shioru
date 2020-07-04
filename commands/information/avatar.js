module.exports.run = async function (client, message, args) {
    if (args.length > 0) {
        let id = args[0];
        client.users.fetch(id)
            .then(function (user) {
                let avatar = user.avatarURL();
                let username = user.username;
                let embed = {
                    "title": "นี่คือลิงค์รูปของ " + username,
                    "description": avatar,
                    "url": avatar,
                    "color": 4886754,
                    "thumbnail": {
                        "url": avatar
                    }
                };
                message.channel.send({
                    embed
                });
            });
    } else {
        let avatar = message.author.displayAvatarURL();
        let embed = {
            "title": "นี่คือลิงค์รูปของคุณคะ",
            "description": avatar,
            "url": avatar,
            "color": 4886754,
            "thumbnail": {
                "url": avatar
            }
        };
        message.channel.send({
            embed
        });
    }
};

module.exports.help = {
    "name": "avatar",
    "description": "Get your link and profile.",
    "usage": "Yavatar (name)",
    "category": "information",
    "aliases": ["profile", "profiles", "at", "รูปของฉัน", "อวาตาร์"]
};
