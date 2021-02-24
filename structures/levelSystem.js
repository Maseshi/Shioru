const firebase = require("firebase");
const messages = require("../events/client/message");

module.exports = async function (client, message) {
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    let id = message.author.id;

    let database = firebase.database();
    let ref = database.ref("Shioru/Discord/Users/" + id + "/Leveling/");
    ref.once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let exp = snapshot.val().EXP;
            let level = snapshot.val().Level;
            let notifyEnable = snapshot.val().channels.notification.enable;
            let notifyId = snapshot.val().channels.notification.id;

            ref.update({
                "EXP": (exp += 5)
            }).catch(function (error) {
                console.log(error);
            });

            if (exp === 1000) {
                ref.update({
                    "EXP": 0,
                    "Level": ++level
                }).then(function () {
                    if (notifyEnable === true) {
                        let levelUp = message.guild.channels.cache.find(ch => ch.id === notifyId);

                        let embed = {
                            "description": client.lang.event_client_message_embed_description.replace('%username', username).replace('%level', level),
                            "color": 16312092,
                            "thumbnail": {
                                "url": avatar
                            },
                            "author": {
                                "name": client.lang.event_client_message_embed_author_name,
                                "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/confetti-ball_1f38a.png"
                            }
                        };
                        levelUp.send({ embed });
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            }
        } else {
            ref.set({
                "EXP": 0,
                "Level": 0
            }).then(function () {
                messages(client, message);
            }).catch(function (error) {
                console.log(error);
            });
        }
    });
};