const { ChannelType } = require("discord.js");
const { getDatabase, ref, update, get } = require("firebase/database");
const { permissions } = require("../../utils/clientUtils");
const { chatSystem, levelSystem, settingsData } = require("../../utils/databaseUtils");
const { catchError, ansiColor } = require("../../utils/consoleUtils");

module.exports = (client, message) => {
    let command = "";
    const defaultPrefix = "S";
    const round = client.config.recursive;
    const prefix = client.config.prefix;
    const mentioned = message.content.startsWith("<@!" + client.user.id + ">") || message.content.startsWith("<@" + client.user.id + ">");
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    const clearStyle = ansiColor(0, "sgr");
    const underlineStyle = ansiColor(4, "sgr");
    const blueBrightColor = ansiColor(33, "foreground");

    if (message.author.bot) return;
    if (message.channel.type === ChannelType.DM) return;
    if (client.mode === "start") {
        settingsData(client, message.guild, module.exports, message);
        if (client.temp.set !== 1) return;

        levelSystem(client, message, "POST", 123);
    }
    if (mentioned) chatSystem(client, message, mentioned, args);

    // When the members forget the prefix, inform the prefix.
    if (message.content.startsWith(defaultPrefix)) {
        if (cmd.length) {
            if (client.commands.has(cmd)) command = client.commands.get(cmd);
            if (client.aliases.has(cmd)) command = client.commands.get(client.aliases.get(cmd));
            if (command) {
                if (!client.temp.round) client.temp.round = 0;
                if (defaultPrefix !== prefix) {
                    client.temp.round += 1;

                    // If the correct order is printed, each prefix is incorrect, 3 times, immediately alert.
                    if (client.temp.round >= round) {
                        client.temp.round = 0;
                        message.reply(client.translate.events.messageCreate.forgot_the_prefix.replace("%s1", prefix).replace("%s2", prefix));
                    }
                }
            }
        }
    }

    if (message.content.startsWith(prefix)) {
        if (!cmd.length) return;
        if (client.commands.has(cmd)) command = client.commands.get(cmd);
        if (client.aliases.has(cmd)) command = client.commands.get(client.aliases.get(cmd));
        if (!command) return console.log(underlineStyle + message.author.username + clearStyle + " Type an unknown command: " + blueBrightColor + cmd + clearStyle);
        if (!client.temp.round) client.temp.round = 0;

        // If the members remember the prefix, then start counting again.
        client.temp.round = 0;

        message.channel.sendTyping();

        if (command.permissions) {
            // Check the permissions of the command for the user.
            if (command.permissions.user) {
                if (!message.member.permissions.has(command.permissions.user)) {
                    return message.reply(client.translate.events.messageCreate.user_is_not_allowed).replace("%s", command.permissions.user.map(permission => permissions[permission]).join(", "));
                }
            }

            // Check the permissions of the command for the bot.
            if (command.permissions.client) {
                if (!message.guild.members.me.permissions.has(command.permissions.client)) {
                    return message.reply(client.translate.events.messageCreate.client_is_not_allowed).replace("%s", command.permissions.client.map(permission => permissions[permission]).join(", "));
                }
            }
        }
        if (!command.command.enable) return message.reply(client.translate.events.messageCreate.command_is_disabled);

        try {
            command.command.execute(client, message, args);

            // Stores information when the bot is working properly.
            if (client.mode === "start") {
                get(ref(getDatabase(), "Shioru/data/survey")).then((snapshot) => {
                    if (snapshot.exists()) {
                        let working = snapshot.val().working;

                        update(ref(getDatabase(), "Shioru/data/survey"), {
                            "working": (working + 1)
                        });
                    } else {
                        update(ref(getDatabase(), "Shioru/data/survey"), {
                            "working": 1
                        });
                    }
                });
            }
        } catch (error) {
            catchError(client, message, command.name, error);
        }
    }
};