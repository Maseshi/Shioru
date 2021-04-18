const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_ROLES"])) {
        let arg = args[0];
        let amount = parseInt(args.slice(1).join(" "));
        if (!arg) {
            message.reply(client.lang.command_manager_setEXP_arg_empty);
        } else {
            let user = client.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
            if (!user) {
                message.channel.send(client.lang.command_manager_setEXP_not_found_user);
            } else {
                if (isNaN(amount)) {
                    message.reply(client.lang.command_manager_setEXP_set_exp_error);
                } else {
                    let database = firebase.database();
                    let avatar = user.avatarURL();
                    let username = user.username;
                    let id = user.id;
                    database.ref("Shioru/Discord/Users/" + id + "/Leveling/").update({
                        "EXP": amount
                    }).then(function () {
                        database.ref("Shioru/Discord/Users/" + id + "/Leveling/").once("value")
                            .then(function (snapshot) {
                                if (snapshot.exists()) {
                                    let exp = snapshot.val().EXP;
                                    let level = snapshot.val().Level;
                                    let notifyEnable = snapshot.val().channels.notification.enable;
                                    let notifyId = snapshot.val().channels.notification.id;

                                    if (notifyEnable === true) {
                                        let notification = message.guild.channels.cache.find(ch => ch.id === notifyId);
                                        notification.send({
                                            "embed": {
                                                "description": username + client.lang.command_manager_setEXP_embed_title,
                                                "color": 4886754,
                                                "thumbnail": {
                                                    "url": avatar
                                                },
                                                "footer": {
                                                    "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/pencil_270f.png",
                                                    "text": client.lang.command_manager_setEXP_embed_footer_text
                                                },
                                                "fields": [
                                                    {
                                                        "name": client.lang.command_manager_setEXP_embed_field_0,
                                                        "value": "```" + level + "```"
                                                    },
                                                    {
                                                        "name": client.lang.command_manager_setEXP_embed_field_1,
                                                        "value": "```" + exp + "```"
                                                    }
                                                ]
                                            }
                                        }).then(function () {
                                            message.channel.send(client.lang.command_manager_setEXP_message_then_success);
                                        });
                                    }
                                } else {
                                    message.channel.send(client.lang.command_manager_setEXP_message_catch_error);
                                }
                            }).catch(function (error) {
                                console.log(error);
                                message.channel.send(client.lang.command_manager_setEXP_database_check_error + error);
                            });
                    }).catch(function (error) {
                        console.log(error);
                        message.channel.send(client.lang.command_manager_setEXP_database_update_error + error);
                    });
                }
            }
        }
    } else {
        message.channel.send(client.lang.command_manager_setEXP_dont_have_permission);
    }
};

module.exports.help = {
    "name": "setEXP",
    "description": "Set EXP of member",
    "usage": "setEXP <member<id, username, username&tag>> <amount>",
    "category": "manager",
    "aliases": ["setExp", "setexp", "sExp", "ตั้งค่าEXP", "ตั้งค่าExp"]
};