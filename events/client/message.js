const firebase = require("firebase");

module.exports = function (client, message) {
    let prefix = client.config.prefix;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let command;

    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    let id = message.author.id;

    if (message.author.bot) {
        return;
    } else {
        if (message.channel.type === "dm") {
            return;
        } else {
            if (message.content.startsWith(prefix)) {
                if (cmd.length === 0) {
                    return;
                } else {
                    if (client.commands.has(cmd)) {
                        command = client.commands.get(cmd);
                    } else if (client.aliases.has(cmd)) {
                        command = client.commands.get(client.aliases.get(cmd));
                    } else {
                        console.log("\u001b[4m" + username + "\u001b[0m Type an unknown command: \u001b[34m" + cmd + "\u001b[0m");
                    }

                    if (command) {
                        command.run(client, message, args);
                    }
                }
            }
        }
        
    }

    // Level system
    let database = firebase.database();
    let ref = database.ref("Discord/Users/" + id + "/Leveling/");
    ref.once("value").then(function (snapshot) {
        if (snapshot.exists()) {
            let exp = snapshot.val().EXP;
            let level = snapshot.val().Level;

            let expPlus = (exp += 5);
            ref.update({
                "EXP": expPlus
            }).catch(function (error) {
                console.log(error);
            });

            if (exp === 1000) {
                let levelPlus = ++level;
                ref.update({
                    "EXP": 0,
                    "Level": levelPlus
                }).then(function () {
                    let levelUp = message.guild.channels.cache.find(ch => ch.name === "│การแจ้งเตือน🔔");

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
                }).catch(function (error) {
                    console.log(error);
                });
            }
        } else {
            ref.set({
                "EXP": 0,
                "Level": 0
            }).catch(function (error) {
                console.log(error);
            });
        }
    });
};