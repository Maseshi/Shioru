const { database } = require("firebase");
const catchError = require("./catchError");

module.exports = function (client, message) {
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;

    let ref = database().ref("Shioru/apps/discord/guilds").child(message.guild.id);
    
    ref.child("data/users").child(message.author.id).once("value").then(function(snapshot) {
        if (snapshot.exists()) {
            let exp = snapshot.val().leveling.exp;
            let level = snapshot.val().leveling.level;
    
            if (exp >= 1000) {
                ref.child("data/users").child(message.author.id).update({
                    "leveling": {
                        "exp": 0,
                        "level": ++level
                    }
                }, function(error) {
                    if (error) return catchError(client, message, "levelSystem", error);
                    ref.child("config").once("value").then(function(snap) {
                        if (snap.exists()) {
                            let notifyId = snapshot.val().notification.alert;
        
                            if (notifyId && notifyId !== 0) {
                                let channel = message.guild.channels.cache.find(channels => channels.id === notifyId);
            
                                channel.send({
                                    "embeds": [
                                        {
                                            "description": client.translate.events.levelSystem.level_up.replace("%s1", username).replace("%s2", level),
                                            "color": 16312092,
                                            "thumbnail": {
                                                "url": avatar
                                            },
                                            "author": {
                                                "name": client.translate.events.levelSystem.congratulations,
                                                "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/confetti-ball_1f38a.png"
                                            }
                                        }
                                    ]
                                });
                            }
                        } else {
                            ref.child("config/notification").update({
                                "alert": 0,
                                "channelCreate": 0,
                                "channelDelete": 0,
                                "channelPinsUpdate": 0,
                                "channelUpdate": 0,
                                "emojiCreate": 0,
                                "guildMemberAdd": 0,
                                "guildMemberRemove": 0
                            }, function(error) {
                                module.exports(client, message);
                                catchError(client, message, "levelSystem", error);
                            });
                        }
                    }).catch(function (error) {
                        catchError(client, message, "levelSystem", error);
                    });
                });               
            } else {
                ref.child("data/users").child(message.author.id).child("leveling").update({
                    "exp": (exp += 5)
                }, function(error) {
                    if (error) return catchError(client, message, "settingsData", error);
                });
            }
        } else {
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
            }, function(error) {
                if (error) return catchError(client, message, "levelSystem", error);
                module.exports(client, message);
            });
        }
    }).catch(function (error) {
        catchError(client, message, "levelSystem", error);
    });
};