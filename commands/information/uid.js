const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    let arg = args.join(" ");
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    let id = message.author.id;

    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(message.guild.id);

    if (arg) {
        let members = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
        if (!members) return message.reply(client.lang.command_information_uid_no_args);

        avatar = members.user.avatarURL();
        username = members.user.username;
        id = members.user.id;

        ref.child("data/users").child(id).child("access").once("value", function(snapshot) {
            if (snapshot.exists()) {
                let PMSuid = snapshot.val().uid;

                if (!PMSuid) return message.reply(client.lang.command_information_uid_not_access);

                return userID(avatar, username, id);
            } else {
                ref.child("data/users").child(id).update({
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
        return userID(avatar, username, id);
    }

    function userID(avatar, username, id) {
        message.channel.send({
            "embed": {
                "title": client.lang.command_information_uid_function_userID_embed_title + username,
                "description": "```" + id + "```" + client.lang.command_information_uid_function_userID_embed_description,
                "color": 4886754,
                "thumbnail": {
                    "url": avatar
                }
            }
        });
    }
};

module.exports.help = {
    "name": "uid",
    "description": "Get your user id",
    "usage": "uid (member: id, username, username&tag)",
    "category": "information",
    "aliases": ["myid", "myId", "UID", "รหัส", "ไอดี", "รหัสบัญชี"],
    "permissions": ["SEND_MESSAGES"]
};