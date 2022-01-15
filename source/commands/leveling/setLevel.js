const { getDatabase, ref, child, get, update } = require("firebase/database");
const catchError = require("../../extras/catchError");

module.exports.run = (client, message, args) => {
    const inputMember = args[0];
    const inputAmount = parseInt(args.slice(1).join(" "));

    if (!inputMember) return message.reply(client.translate.commands.setLevel.empty);
    if (!inputAmount) return message.reply(client.translate.commands.setLevel.amount_empty);
    
    const member = message.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));
    
    if (!member) return message.reply(client.translate.commands.setLevel.can_not_find_user);

    const memberAvatar = member.user.avatarURL();
    const memberUsername = member.user.username;
    const memberID = member.user.id;

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), message.guild.id)
    update(child(child(child(childRef, "data/users"), memberID), "leveling"), {
        "level": inputAmount
    }).then(() => {
        update(child(child(child(childRef, "data/users"), memberID), "leveling")).then((snapshot) => {
            const exp = snapshot.val().exp;
            const level = snapshot.val().level;
            
            get(child(childRef, "config")).then((dataSnapshot) => {
                if (dataSnapshot.exists()) {
                    let notifyId = dataSnapshot.val().notification.alert;

                    if (notifyId) {
                        const notification = message.guild.channels.cache.find(channels => channels.id === notifyId);
                        
                        notification.send({
                            "embeds": [
                                {
                                    "description": client.translate.commands.setLevel.level_was_changed.replace("%s", memberUsername),
                                    "color": 4886754,
                                    "thumbnail": {
                                        "url": memberAvatar
                                    },
                                    "footer": {
                                        "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/pencil_270f.png",
                                        "text": client.translate.commands.setLevel.set_by_staff
                                    },
                                    "fields": [
                                        {
                                            "name": client.translate.commands.setLevel.level,
                                            "value": "```" + exp + "```"
                                        },
                                        {
                                            "name": client.translate.commands.setLevel.experience,
                                            "value": "```" + level + "```"
                                        }
                                    ]
                                }
                            ]
                        }).then(() => {
                            message.channel.send(client.translate.commands.setLevel.notification_complete);
                        });
                    } else {
                        message.channel.send(client.translate.commands.setLevel.success);
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
    "name": "setLevel",
    "description": "Set Level of Members",
    "usage": "setLevel <member<id, username, username&tag>> <amount>",
    "category": "leveling",
    "aliases": ["sLevel", "setlevel", "ตั้งค่าเลเวล"],
    "userPermission": ["MANAGE_GUILD"],
    "clientPermissions": ["SEND_MESSAGES", "MANAGE_GUILD"]
};