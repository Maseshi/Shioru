const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    let arg = args[0];
    let amount = parseInt(args.slice(1).join(" "));

    if (!arg) return message.reply(client.data.language.command_manager_setEXP_arg_empty);
    if (!amount) return message.reply(client.data.language.command_manager_setEXP_set_exp_error);
    
    let member = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
    if (!member) return message.reply(client.data.language.command_manager_setEXP_not_found_user);

    let avatar = member.user.avatarURL();
    let username = member.user.username;
    let id = member.user.id;

    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(message.guild.id);

    ref.child("data/users").child(id).child("leveling").update({
        "exp": amount
    }).then(function () {
        ref.child("data/users").child(id).once("value").then(function (snapshot) {
            if (snapshot.exists()) return message.reply(client.data.language.command_manager_setEXP_message_catch_error);
            
            let exp = snapshot.val().leveling.exp;
            let level = snapshot.val().leveling.level;
            
            ref.child("config").once("value").then(function (dataSnapshot) {
                if (dataSnapshot.exists()) {
                    let notifyId = dataSnapshot.val().notification.alert;

                    if (notifyId) {
                        let notification = message.guild.channels.cache.find(channels => channels.id === notifyId);
                        notification.send({
                            "embed": {
                                "description": username + client.data.language.command_manager_setEXP_embed_title,
                                "color": 4886754,
                                "thumbnail": {
                                    "url": avatar
                                },
                                "footer": {
                                    "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/pencil_270f.png",
                                    "text": client.data.language.command_manager_setEXP_embed_footer_text
                                },
                                "fields": [
                                    {
                                        "name": client.data.language.command_manager_setEXP_embed_field_0,
                                        "value": "```" + level + "```"
                                    },
                                    {
                                        "name": client.data.language.command_manager_setEXP_embed_field_1,
                                        "value": "```" + exp + "```"
                                    }
                                ]
                            }
                        }).then(function () {
                            message.channel.send(client.data.language.command_manager_setEXP_message_then_success);
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
            message.channel.send(client.data.language.command_manager_setEXP_database_check_error + error);
        });
    }).catch(function (error) {
        console.log(error);
        message.channel.send(client.data.language.command_manager_setEXP_database_update_error + error);
    });
};

module.exports.help = {
    "name": "setEXP",
    "description": "Set EXP of member",
    "usage": "setEXP <member<id, username, username&tag>> <amount>",
    "category": "manager",
    "aliases": ["setExp", "setexp", "sExp", "ตั้งค่าEXP", "ตั้งค่าExp"],
    "permissions": ["SEND_MESSAGES", "MANAGE_GUILD"]
};