const { getDatabase, ref, child, get, set } = require("firebase/database");
const catchError = require("../../extras/catchError");
const levelSystem = require("../../extras/levelSystem");
const settingsData = require("../../extras/settingsData");

module.exports = (client, message) => {
    let command;
    const mentions = [
        client.user.id,
        client.user.username,
        client.user.username.toLowerCase(),
        client.user.tag,
        client.user.tag.toLowerCase(),
        "<@!" + client.user.id + ">"
    ];
    const prefix = client.config.prefix;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (client.config.mode === "production") {
        settingsData(client, message, module.exports);
        if (client.config.worker !== 1) return;

        levelSystem(client, message);
    }

    if (message.content.startsWith(prefix)) {
        if (!cmd.length) return;
        if (client.commands.has(cmd)) command = client.commands.get(cmd);
        if (client.aliases.has(cmd)) command = client.commands.get(client.aliases.get(cmd));
        if (!command) return console.log("\u001b[4m" + message.author.username + "\u001b[0m Type an unknown command: \u001b[34m" + cmd + "\u001b[0m");
        
        message.channel.sendTyping();
        
        // Check the permissions of the command for the user.
        if (command.help.userPermissions) {
            if (!message.member.permissions.has(command.help.userPermissions)) {
                return message.reply(client.translate.events.messageCreate.user_is_not_allowed).replace("%s", command.help.userPermissions.join());
            }
        }

        // Check the permissions of the command for the bots.
        if (command.help.clientPermissions) {
            if (!message.guild.me.permissions.has(command.help.clientPermissions)) {
                return message.reply(client.translate.events.messageCreate.client_is_not_allowed).replace("%s", command.help.clientPermissions.join());
            }
        }

        command.run(client, message, args);
    } else if (mentions.includes(message.content)) {
        const db = getDatabase();
        const childRef = ref(db, "Shioru/data")
        const mention = mentions.filter(string => string.includes(message.content)).join();
        const arg = message.content.slice(mention.length).trim();
        
        // When a bot is tagged and asked a question
        if (arg) {
            get(child(child(childRef, "words/messages"), arg)).then((snapshot) => {
                if (snapshot.exists()) {
                    const answer = snapshot.val().answer;
                    const commands = snapshot.val().cmd;

                    if (!answer && commands) {
                        message.channel.sendTyping();
                        return client.commands.get(commands).run(client, message, args);
                    } else if (answer) {
                        message.channel.sendTyping();
                        const randomWords = Math.floor(Math.random() * answer.length);

                        return message.channel.send(answer[randomWords]);
                    }
                } else {
                    set(child(childRef, "words/messages"), {
                        "hi": {
                            "status": 1,
                            "answer": "Hello"
                        },
                        "How to use commands": {
                            "status": 0,
                            "cmd": "help"
                        }
                    }).then(() => {
                        module.exports(client, message);
                    });
                }
            }).catch((error) => {
                catchError(client, message, "messageCreate", error);
            })
        }

        // When the bot is tagged
        if (mention === message.content) {
            get(child(childRef, "words/tags")).then((snapshot) => {
                if (snapshot.exists()) {
                    const tags = snapshot.val();

                    message.channel.sendTyping();
                    const randomWords = Math.floor(Math.random() * tags.length);
                    
                    return message.channel.send(tags[randomWords]);
                } else {
                    set(child(childRef, "words/tags"), [
                        "What's wrong?"
                    ]).then(() => {
                        module.exports(client, message);
                    });
                }
            }).catch((error) => {
                catchError(client, message, "messageCreate", error);
            });
        }
    }
};