const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    let arg = args[0];
    let amount = parseInt(args.slice(1).join(" "));

    if (!arg) return  message.reply(client.lang.command_manager_setLevel_arg_empty);
    if (!amount) return message.reply(client.lang.command_manager_setLevel_set_level_error);
    
    let member = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
    if (!member) return message.reply(client.lang.command_manager_setLevel_not_found_user);

    let avatar = member.user.avatarURL();
    let username = member.user.username;
    let id = member.user.id;

    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(message.guild.id);

    ref.child("data/users").child(id).child("leveling").update({
        "level": amount
    }).then(function () {
        ref.child("data/users").child(id).child("leveling").once("value").then(function (snapshot) {
            if (snapshot.exists()) return message.channel.send(client.lang.command_manager_setLevel_message_catch_error);
            
            let exp = snapshot.val().exp;
            let level = snapshot.val().level;
            
            ref.child("config").once("value").then(function (dataSnapshot) {
                if (dataSnapshot.exists()) {
                    let notifyId = dataSnapshot.val().notification.alert;

                    if (notifyId) {
                        let notification = message.guild.channels.cache.find(channels => channels.id === notifyId);
                        notification.send({
                            "embed": {
                                "description": username + client.lang.command_manager_setLevel_embed_title,
                                "color": 4886754,
                                "thumbnail": {
                                    "url": avatar
                                },
                                "footer": {
                                    "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/pencil_270f.png",
                                    "text": client.lang.command_manager_setLevel_embed_footer_text
                                },
                                "fields": [
                                    {
                                        "name": client.lang.command_manager_setLevel_embed_field_0,
                                        "value": "```" + exp + "```"
                                    },
                                    {
                                        "name": client.lang.command_manager_setLevel_embed_field_1,
                                        "value": "```" + level + "```"
                                    }
                                ]
                            }
                        }).then(function () {
                            message.channel.send(client.lang.command_manager_setLevel_message_then_success);
                        });
                    }
                } else {
                    ref.child("config").update({
                        "prefix": "S",
                        "language": "th_TH",
                        "notification": {
                            "alert": 0,
                            "channelCreate": 0,
                            "channelDelete": 0,
                            "channelPinsUpdate": 0,
                            "channelUpdate": 0,
                            "emojiCreate": 0,
                            "guildMemberAdd": 0,
                            "guildMemberRemove": 0
                        }
                    });
                }
            });
        }).catch(function (error) {
            console.log(error);
            message.channel.send(client.lang.command_manager_setLevel_database_check_error + error);
        });
    }).catch(function (error) {
        console.log(error);
        message.channel.send(client.lang.command_manager_setLevel_database_update_error + error);
    });
};

module.exports.help = {
    "name": "setLevel",
    "description": "Set Level of Members",
    "usage": "setLevel <member<id, username, username&tag>> <amount>",
    "category": "manager",
    "aliases": ["sLevel", "setlevel", "ตั้งค่าเลเวล"],
    "permissions": ["SEND_MESSAGES", "MANAGE_GUILD"]
};