const { database } = require("firebase");
const catchError = require("../../extras/catchError");

module.exports.run = function (client, message, args) {
    let arg = args[0];
    let amount = parseInt(args.slice(1).join(" "));

    if (!arg) return message.reply(client.translate.commands.setEXP.empty);
    if (!amount) return message.reply(client.translate.commands.setEXP.amount_empty);
    
    let member = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
    if (!member) return message.reply(client.translate.commands.setEXP.can_not_find_user);

    let avatar = member.user.avatarURL();
    let username = member.user.username;
    let id = member.user.id;

    let ref = database().ref("Shioru/apps/discord/guilds").child(message.guild.id);

    ref.child("data/users").child(id).child("leveling").update({
        "exp": amount
    }).then(function () {
        ref.child("data/users").child(id).once("value").then(function (snapshot) {
            let exp = snapshot.val().leveling.exp;
            let level = snapshot.val().leveling.level;
            
            ref.child("config").once("value").then(function (dataSnapshot) {
                if (dataSnapshot.exists()) {
                    let notifyId = dataSnapshot.val().notification.alert;

                    if (notifyId) {
                        let notification = message.guild.channels.cache.find(channels => channels.id === notifyId);
                        notification.send({
                            "embeds": [
                                {
                                    "description": client.translate.commands.setEXP.exp_was_changed.replace("%s", username),
                                    "color": 4886754,
                                    "thumbnail": {
                                        "url": avatar
                                    },
                                    "footer": {
                                        "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/pencil_270f.png",
                                        "text": client.translate.commands.setEXP.set_by_staff
                                    },
                                    "fields": [
                                        {
                                            "name": client.translate.commands.setEXP.level,
                                            "value": "```" + level + "```"
                                        },
                                        {
                                            "name": client.translate.commands.setEXP.experience,
                                            "value": "```" + exp + "```"
                                        }
                                    ]
                                }
                            ]
                        }).then(function () {
                            message.channel.send(client.translate.commands.setEXP.notification_complete);
                        }).catch(function (error) {
                            catchError(client, message, module.exports.help.name, error);
                        });
                    } else {
                        message.channel.send(client.translate.commands.setEXP.success);
                    }
                } else {
                    ref.child("config").update({
                        "prefix": "S",
                        "language": "en",
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
                    }).then(function() {
                        module.exports.run(client, message, args);
                    }).catch(function (error) {
                        catchError(client, message, module.exports.help.name, error);
                    });
                }
            }).catch(function (error) {
                catchError(client, message, module.exports.help.name, error);
            });
        }).catch(function (error) {
            catchError(client, message, module.exports.help.name, error);
        });
    }).catch(function (error) {
		catchError(client, message, module.exports.help.name, error);
	});
};

module.exports.help = {
    "name": "setEXP",
    "description": "Set EXP of member",
    "usage": "setEXP <member<id, username, username&tag>> <amount>",
    "category": "leveling",
    "aliases": ["setExp", "setexp", "sExp", "ตั้งค่าEXP", "ตั้งค่าExp"],
    "permissions": ["SEND_MESSAGES", "MANAGE_GUILD"]
};