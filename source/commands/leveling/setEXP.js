const { getDatabase, ref, child, get, update } = require("firebase/database");
const catchError = require("../../extras/catchError");

module.exports.run = (client, message, args) => {
    const inputMember = args[0];
    const inputAmount = parseInt(args.slice(1).join(" "));

    if (!inputMember) return message.reply(client.translate.commands.setEXP.empty);
    if (!inputAmount) return message.reply(client.translate.commands.setEXP.amount_empty);
    
    const member = message.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));
    
    if (!member) return message.reply(client.translate.commands.setEXP.can_not_find_user);

    const memberAvatar = member.user.avatarURL();
    const memberUsername = member.user.username;
    const memberID = member.user.id;

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), message.guild.id)
    update(child(child(child(childRef, "data/users"), memberID), "leveling"), {
        "exp": inputAmount
    }).then(() => {
        get(child(child(child(childRef, "data/users"), memberID), "leveling")).then((snapshot) => {
            const exp = snapshot.val().exp;
            const level = snapshot.val().level;
            
            get(child(childRef, "config")).then((dataSnapshot) => {
                if (dataSnapshot.exists()) {
                    const notifyId = dataSnapshot.val().notification.alert;

                    if (notifyId) {
                        const notification = message.guild.channels.cache.find(channels => channels.id === notifyId);
                        
                        notification.send({
                            "embeds": [
                                {
                                    "description": client.translate.commands.setEXP.exp_was_changed.replace("%s", memberUsername),
                                    "color": 4886754,
                                    "thumbnail": {
                                        "url": memberAvatar
                                    },
                                    "footer": {
                                        "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/pencil_270f.png",
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
                        }).then(() => {
                            message.channel.send(client.translate.commands.setEXP.notification_complete);
                        });
                    } else {
                        message.channel.send(client.translate.commands.setEXP.success);
                    }
                } else {
                    update(child(childRef, "config"), {
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
                    }).then(() => {
                        module.exports.run(client, message, args);
                    });
                }
            });
        });
    }).catch((error) => {
		catchError(client, message, module.exports.help.name, error);
	});
};

module.exports.help = {
    "name": "setEXP",
    "description": "Set EXP of member",
    "usage": "setEXP <member<id, username, username&tag>> <amount>",
    "category": "leveling",
    "aliases": ["setExp", "setexp", "sExp", "ตั้งค่าEXP", "ตั้งค่าExp"],
    "userPermission": ["MANAGE_GUILD"],
    "clientPermissions": ["SEND_MESSAGES", "MANAGE_GUILD"]
};