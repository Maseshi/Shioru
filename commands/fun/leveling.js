const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    let id = message.author.id;
    let arg = args.join(" ");
    if (arg) {
        let user = message.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
        if (!user) {
            message.channel.send(client.lang.command_fun_leveling_null_user);
        } else {
            avatar = user.avatarURL();
            username = user.username;
            id = user.id;
            getLeveling(avatar, username, id);
        }
    } else {
        getLeveling(avatar, username, id);
    }

    function getLeveling(Savatar, Susername, Sid) {
        let database = firebase.database();
        database.ref("Shioru/Discord/Users/" + Sid + "/Leveling/").once("value")
        .then(function (snapshot) {
            if (snapshot.exists()) {
                let exp = snapshot.val().EXP;
                let level = snapshot.val().Level;

                message.channel.send({
                    "embed": {
                        "description": Susername + client.lang.command_fun_leveling_embed_description,
                        "color": 4886754,
                        "thumbnail": {
                            "url": Savatar
                        },
                        "fields": [
                            {
                                "name": client.lang.command_fun_leveling_function_getLeveling_embed_fields_name,
                                "value": "```" + level + "```"
                            },
                            {
                                "name": client.lang.command_fun_leveling_function_getLeveling_embed_fields_1_name,
                                "value": "```" + exp + "```"
                            }
                        ]
                    }
                });
            } else {
                message.channel.send(client.lang.command_fun_leveling_function_getLeveling_else_not_level);
            }
        }).catch(function (error) {
            console.log(error);
            message.channel.send(client.lang.database_error + error);
        });
    }
};

module.exports.help ={
    "name": "leveling",
    "description": "See your leveling amount",
    "usage": "leveling (Member)",
    "category": "fun",
    "aliases": ["Leveling", "EXP", "exp", "level", "เลเวล", "อีเอ็กพี", "เวล"]
};