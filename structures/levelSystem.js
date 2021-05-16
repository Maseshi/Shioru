const firebase = require("firebase");
const msgEvent = require("../events/client/message");

module.exports = async function (client, message) {
    if (message.author.bot) return;
    
    let guildId = message.guild.id;
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    let uid = message.author.id;

    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(guildId);
    
    ref.child("data/users").child(uid).once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let exp = snapshot.val().leveling.exp;
            let level = snapshot.val().leveling.level;

            ref.child("data/users").child(uid).child("leveling").update({
                "exp": (exp += 5)
            }).catch(function (error) {
                console.log(error);
            });

            if (exp === 1000) {
                ref.child("data/users").child(uid).child("leveling").update({
                    "exp": 0,
                    "level": ++level
                }).then(function () {
                    ref.child("config/notification").once("value").then(function (dataSnapshot) {
                        if (dataSnapshot.exists()) {
                            let notifyId = dataSnapshot.val().alert;

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
                        } else {
                            ref.child("config/notification").update({
                                "alert": 0
                            }).then(function () {
                                module.exports(client, message);
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }
                    });
                }).catch(function (error) {
                    console.log(error);
                });
            }
        } else {
            ref.child("data/users").child(uid).set({
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
                return msgEvent(client, message);
            }).catch(function (error) {
                console.log(error);
            });
        }
    });
};