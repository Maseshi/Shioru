const answer = require("../../structures/answer");
const levelSystem = require("../../structures/levelSystem");
const settingsData = require("../../structures/settingsData");

module.exports = function (client, message) {
    settingsData(client, message);
    levelSystem(client, message);

    let prefix = client.config.prefix;
    let mentions = client.config.mention;
    let mention = false;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let mts = message.content.slice(mention.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let command;

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    
    for (let thisMention of mentions) {
        if (message.content.startsWith(thisMention)) {
            mention = thisMention;
            if (mention.length === 0) return;
            mts.shift();
            if (mention) answer(client, message, args, mts);
        }
    }

    if (message.content.startsWith(prefix)) {
        if (cmd.length === 0) return;
        if (client.commands.has(cmd)) {
            command = client.commands.get(cmd);
        } else if (client.aliases.has(cmd)) {
            command = client.commands.get(client.aliases.get(cmd));
        }

        if (command) {
            if (command.help.permissions) {
                if (!message.member.hasPermission(command.help.permissions)) {
                    return message.reply(client.lang.event_client_message_permissions);
                }
            }
            command.run(client, message, args);
        } else {
            if (!mention) console.log("\u001b[4m" + message.author.username + "\u001b[0m Type an unknown command: \u001b[34m" + cmd + "\u001b[0m");
        }
    }
};