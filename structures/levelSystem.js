const firebase = require("firebase");
const msgEvent = require("../events/client/message");

module.exports = function (client, message) {
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;

    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(message.guild.id);
    
    ref.child("data/users").child(message.author.id).once("value").then(function (snapshot) {
        if (!snapshot.exists()) {
            ref.child("data/users").child(message.author.id).set({
                "access": {
                    "avatar": false,
                    "info": false,
                    "uid": false
                },
                "leveling": {
                    "exp": 0,
                    "level": 0
                }
            }).then(function () {
                return module.exports(client, message);
            });
        } else {
            let exp = snapshot.val().leveling.exp;
            let level = snapshot.val().leveling.level;
    
            if (exp === 1000) {
                ref.child("data/users").child(message.author.id).child("leveling").update({
                    "exp": 0,
                    "level": ++level
                }).then(function () {
                    ref.child("config").once("value").then(function (snapshot) {
                        if (!snapshot.exists()) {
                            ref.child("config/notification").update({
                                "alert": 0,
                                "channelCreate": 0,
                                "channelDelete": 0,
                                "channelPinsUpdate": 0,
                                "channelUpdate": 0,
                                "emojiCreate": 0,
                                "guildMemberAdd": 0,
                                "guildMemberRemove": 0
                            }).then(function () {
                                return module.exports(client, message);
                            });
                        } else {
                            let notifyId = snapshot.val().notification.alert;
        
                            if (notifyId) {
                                let levelUp = message.guild.channels.cache.find(channels => channels.id === notifyId);
            
                                levelUp.send({
                                    "embed": {
                                        "description": client.lang.structures_levelSystem_embed_description.replace('%username', username).replace('%level', level),
                                        "color": 16312092,
                                        "thumbnail": {
                                            "url": avatar
                                        },
                                        "author": {
                                            "name": client.lang.structures_levelSystem_embed_author_name,
                                            "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/confetti-ball_1f38a.png"
                                        }
                                    }
                                });
                            }
                        }
                    });
                });
            } else {
                ref.child("data/users").child(message.author.id).child("leveling").update({
                    "exp": (exp += 5)
                });
            }
        }
    });
};