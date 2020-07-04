const firebase = require("firebase");

module.exports = async (client, message) => {
    let prefix = client.config.prefix;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    
    let command;

    if (message.author.bot) {
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
                    // Collect information when users send unknown commands or aliases
                    let username = message.author.username;
                    let database = firebase.database();

                    database.ref("Discord/Bot/Logs/Commands/").push({
                        command: cmd,
                        date: new Date()
                    }).catch(function () {
                        console.error(error);
                    });
                    return console.log("\u001b[4m" + username + "\u001b[0m Type an unknown command: \u001b[34m" + cmd + "\u001b[0m");
                }

                if (command) {
                    command.run(client, message, args);
                    message.delete();
                }
            }
        }
    }

    // Level system
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    let id = message.author.id;

    let database = firebase.database();
    let ref = database.ref("Discord/Users/" + id + "/Leveling/");
    ref.once("value", function (snapshot) {
        if (snapshot.exists()) {
            let exp = (snapshot.val().EXP);
            let level = (snapshot.val().Level);

            let expPlus = (exp += 5);
            ref.update({
                EXP: expPlus
            }).catch(function (error) {
                console.error(error);
            });

            if (exp === 1000) {
                let levelPlus = ++level;
                ref.update({
                    EXP: 0,
                    Level: levelPlus
                }).then(function () {
                    let levelUp = message.guild.channels.cache.find(ch => ch.name === "│การแจ้งเตือน🔔");

                    const embed = {
                        "description": "ตอนนี้เลเวลของ *" + username + "* ได้อัพเลเวลเป็น ```" + level + "```",
                        "color": 16312092,
                        "thumbnail": {
                            "url": avatar
                        },
                        "author": {
                            "name": "ยินดีด้วย!!",
                            "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/confetti-ball_1f38a.png"
                        }
                    };
                    levelUp.send({ embed });
                }).catch(function (error) {
                    console.error(error);
                });
            }
        } else {
            ref.set({
                EXP: 0,
                Level: 0
            });
        }
    });
};