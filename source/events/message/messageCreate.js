const catchError = require("../../extras/catchError");
const levelSystem = require("../../extras/levelSystem");
const settingsData = require("../../extras/settingsData");

module.exports = function (client, message) {
    let prefix = client.config.prefix;
    let mentions = client.config.mention;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let command;

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    settingsData(client, message, module.exports);
    if (client.config.worker !== 1) return;

    levelSystem(client, message);

    if (message.content.startsWith(prefix)) {
        if (!cmd.length) return;
        if (client.commands.has(cmd)) {
            command = client.commands.get(cmd);
        } else if (client.aliases.has(cmd)) {
            command = client.commands.get(client.aliases.get(cmd));
        } else {
            console.log("\u001b[4m" + message.author.username + "\u001b[0m Type an unknown command: \u001b[34m" + cmd + "\u001b[0m")
        }

        if (!command) return;
        message.channel.sendTyping();
        if (command.help.permissions) {
            if (!message.member.permissions.has(command.help.permissions)) {
                return message.reply(client.translate.events.messageCreate.not_allowed);
            }
        }
        command.run(client, message, args);
    }

    if (mentions.includes(message.content)) {
        for (let mention of mentions) {
            let arg = message.content.slice(mention.length).trim();
                
            if (arg) {
                ref.child("words/messages").child(arg).on("value", function(snap) {
                    if (snap.exists()) {
                        let answer = snap.val().answer;
                        let commands = snap.val().cmd;
    
                        if (!answer && commands) {
                            message.channel.sendTyping();
                            return client.commands.get(commands).run(client, message, args);
                        } else if (answer) {
                            message.channel.sendTyping();
                            let randomWords = Math.floor(Math.random() * answer.length);
                            return message.channel.send(answer[randomWords]);
                        }
                    } else {
                        ref.child("words/messages").set({
                            "hi": {
                                "status": 1,
                                "answer": "Hello"
                            },
                            "How to use commands": {
                                "status": 0,
                                "cmd": "help"
                            }
                        }, function (error) {
                            if (error) return catchError(client, message, "messageCreate", error);
                            module.exports(client, message);
                        });
                    }
                });
            }
    
            if (mention === message.content) {
                ref.child("words").on("value", function (snapshot) {
                    if (snapshot.exists()) {
                        let tags = snapshot.val().tags;
    
                        message.channel.sendTyping();
                        let randomWords = Math.floor(Math.random() * tags.length);
                        return message.channel.send(tags[randomWords]);
                    } else {
                        ref.child("words").set({
                            "messages": {
                                "hi": {
                                    "status": 1,
                                    "answer": "Hello"
                                },
                                "How to use commands": {
                                    "status": 0,
                                    "cmd": "help"
                                }
                            },
                            "tags": [
                                "What's wrong?"
                            ]
                        }, function (error) {
                            if (error) return catchError(client, message, "messageCreate", error);
                            module.exports(client, message);
                        });
                    }
                });
            }
        }
    }
};