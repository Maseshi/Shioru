module.exports.run = async function (client, message, args) {
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    let id = message.author.id;
    let arg = args.join(" ");
    if (arg) {
        let user = client.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
        if (!user) {
            message.channel.send(client.lang.command_information_uid_no_args);
        } else {
            avatar = user.avatarURL();
            username = user.username;
            id = user.id;
            userID(avatar, username, id);
        }
    } else {
        userID(avatar, username, id);
    }

    function userID(Savatar, Susername, Sid) {
        message.channel.send({
            "embed": {
                "title": client.lang.command_information_uid_function_userID_embed_title + Susername,
                "description": "```" + Sid + "```" + client.lang.command_information_uid_function_userID_embed_description,
                "color": 4886754,
                "thumbnail": {
                    "url": Savatar
                }
            }
        });
    }
};

module.exports.help = {
    "name": "uid",
    "description": "Get your user id",
    "usage": "uid (Member)",
    "category": "information",
    "aliases": ["myid", "myId", "UID", "รหัส", "ไอดี", "รหัสบัญชี"]
};