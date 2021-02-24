const answer = require("../../structures/answer");
const levelSystem = require("../../structures/levelSystem");
const settingsData = require("../../structures/settingsData");

module.exports = function (client, message, dbPrefix) {
    let prefix = client.config.prefix;
    let methods = client.config.method;
    let method = false;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let mhs = message.content.slice(method.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let command;

    if (message.author.bot) {
        return;
    } else {
        if (message.channel.type === "dm") {
            return;
        } else {
            levelSystem(client, message);
            settingsData(client, message);

            // For talking
            for (const thisMethod of methods) {
                if (message.content.startsWith(thisMethod)) {
                    method = thisMethod;
                    if (method.length === 0) {
                        return;
                    } else {
                        mhs.shift();

                        if (method) {
                            answer(client, message, args, mhs);
                        }
                    }
                }
            }

            // For commands
            if (message.content.startsWith(prefix)) {
                if (cmd.length === 0) {
                    return;
                } else {
                    if (client.commands.has(cmd)) {
                        command = client.commands.get(cmd);
                    } else if (client.aliases.has(cmd)) {
                        command = client.commands.get(client.aliases.get(cmd));
                    }

                    if (command) {
                        command.run(client, message, args);
                    } else {
                        if (!method) {
                            console.log("\u001b[4m" + message.author.username + "\u001b[0m Type an unknown command: \u001b[34m" + cmd + "\u001b[0m");
                        }
                    }
                }
            }
        }
    }
};