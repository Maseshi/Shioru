module.exports.run = async function (client, message, args) {
    let arg = args.join(" ");
    if (arg === client.user.username || arg === client.user.tag || arg === client.user.id) {
        if (message.author.id !== client.config.owner) {
            message.channel.send(client.lang.command_information_avatar_if_client-avatar)
                .then(function () {
                    message.channel.send(client.lang.command_information_avatar_if_client-avatar_after_timeout, {
                        "timeout": 8000
                    });
                });
        } else {
            let avatar = client.user.avatarURL();
            let embed = {
                "title": client.lang.command_information_avatar_else_user-avatar_embed_title,
                "description": avatar,
                "url": avatar,
                "color": 14684245,
                "thumbnail": {
                    "url": avatar
                }
            };
            message.channel.send({
                embed
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
                let embed = {
                    "title": client.lang.command_information_avatar_else_have_user_embed_title + username,
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
        } else {
            let avatar = message.author.displayAvatarURL();
            let embed = {
                "title": client.lang.command_information_avatar_else_this_user_embed_title,
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
    }
};

module.exports.help = {
    "name": "avatar",
    "description": "Get your link and profile.",
    "usage": "avatar (name)",
    "category": "information",
    "aliases": ["profile", "profiles", "at", "รูปของฉัน", "อวาตาร์"]
};
