const answer = require("../../structures/answer");
const levelSystem = require("../../structures/levelSystem");
const settingsData = require("../../structures/settingsData");

module.exports = function (client, message) {
    let working = client.data.working;
    let prefix = client.data.config.client.prefix;
    let mentions = client.data.config.client.mention;
    let args = message.content.slice(prefix.length).trim().split(/ +/g);
    let cmd = args.shift().toLowerCase();
    let command, mention;

    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    settingsData(client, message, module.exports)
    if (working !== 1) return;

    levelSystem(client, message);
    
    for (let mt of mentions) {
        if (message.content.startsWith(mt)) {
            mention = mt;
            if (!mention.length) return;
            if (mention) return answer(client, message, args);
        }
    }

    if (message.content.startsWith(prefix)) {
        if (!cmd.length) return;
        if (client.commands.has(cmd)) {
            command = client.commands.get(cmd);
        } else if (client.aliases.has(cmd)) {
            command = client.commands.get(client.aliases.get(cmd));
        }

        if (command) {
            if (command.help.permissions) {
                if (!message.member.hasPermission(command.help.permissions)) {
                    return message.reply(client.data.language.event_client_message_permissions);
                }
            }
            return command.run(client, message, args);
        } else if (!mention) {
            console.log("\u001b[4m" + message.author.username + "\u001b[0m Type an unknown command: \u001b[34m" + cmd + "\u001b[0m");
        }
    }
};