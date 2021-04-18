module.exports.run = async function (client, message, args) {
    let arg = args.join(" ");
    if (arg === client.user.username || arg === client.user.tag || arg === client.user.id) {
        if (message.author.id !== client.config.owner) {
            message.channel.send(client.lang.command_information_avatar_if_client_avatar)
                .then(function () {
                    message.channel.send(client.lang.command_information_avatar_if_client_avatar_after_timeout, {
                        "timeout": 8000
                    });
                });
        } else {
            let avatar = client.user.avatarURL();
            message.channel.send({
                "embed": {
                    "title": client.lang.command_information_avatar_else_user_avatar_embed_title,
                    "description": avatar,
                    "url": avatar,
                    "color": 14684245,
                    "thumbnail": {
                        "url": avatar
                    }
                }
            });
        }
    } else {
        if (arg) {
            let user = client.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
            if (!user) {
                message.channel.send(client.lang.command_information_avatar_if_dont_have_user);
            } else {
                let avatar = user.avatarURL();
                let username = user.username;
                message.channel.send({
                    "embed": {
                        "title": client.lang.command_information_avatar_else_have_user_embed_title + username,
                        "description": avatar,
                        "url": avatar,
                        "color": 4886754,
                        "thumbnail": {
                            "url": avatar
                        }
                    }
                });
            }
        } else {
            let avatar = message.author.displayAvatarURL();
            message.channel.send({
                "embed": {
                    "title": client.lang.command_information_avatar_else_this_user_embed_title,
                    "description": avatar,
                    "url": avatar,
                    "color": 4886754,
                    "thumbnail": {
                        "url": avatar
                    }
                }
            });
        }
    }
};

module.exports.help = {
    "name": "avatar",
    "description": "Get your link and profile.",
    "usage": "avatar (member<id, username, username&tag>)",
    "category": "information",
    "aliases": ["profile", "profiles", "at", "รูปของฉัน", "อวาตาร์"]
};