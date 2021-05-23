const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    let arg = args.join(" ");
    let avatar;

    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(message.guild.id);
    
    if ([client.user.username, client.user.tag, client.user.id].includes(arg)) {
        if (message.author.id !== client.data.config.data.owner) {
            message.reply(client.data.language.command_information_avatar_if_client_avatar).then(function () {
                return message.reply(client.data.language.command_information_avatar_if_client_avatar_after_timeout, {
                    "timeout": 8000
                });
            });
        } else {
            avatar = client.user.avatarURL();

            return message.channel.send({
                "embed": {
                    "title": client.data.language.command_information_avatar_else_user_avatar_embed_title,
                    "description": avatar,
                    "url": avatar,
                    "color": 14684245,
                    "thumbnail": {
                        "url": avatar
                    }
                }
            });
        }
    }
    
    if (arg) { 
        let members = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
        if (!members) return message.reply(client.data.language.command_information_avatar_if_dont_have_user);
        
        ref.child("data/users").child(members.user.id).child("access").once("value").then(function (snapshot) {
            if (snapshot.exists()) {
                let PMSAvatar = snapshot.val().avatar;

                if (!PMSAvatar) return message.reply(client.data.language.command_information_avatar_not_access);

                avatar = members.user.avatarURL();
                let username = members.user.username;

                return message.channel.send({
                    "embed": {
                        "title": client.data.language.command_information_avatar_else_have_user_embed_title + username,
                        "description": avatar,
                        "url": avatar,
                        "color": 4886754,
                        "thumbnail": {
                            "url": avatar
                        }
                    }
                });
            } else {
                ref.child("data/users").child(members.user.id).update({
                    "access": {
                        "avatar": false,
                        "info": false,
                        "uid": false
                    }
                }).then(function() {
                    return module.exports.run(client, message, args);
                });
            }
        });
    } else {
        avatar = message.author.displayAvatarURL();

        message.channel.send({
            "embed": {
                "title": client.data.language.command_information_avatar_else_this_user_embed_title,
                "description": avatar,
                "url": avatar,
                "color": 4886754,
                "thumbnail": {
                    "url": avatar
                }
            }
        });
    }
};

module.exports.help = {
    "name": "avatar",
    "description": "Get your link and profile.",
    "usage": "avatar (member: id, username, username&tag)",
    "category": "information",
    "aliases": ["profile", "profiles", "at", "รูปประจำตัว", "อวาตาร์"],
    "permissions": ["SEND_MESSAGES"]
};