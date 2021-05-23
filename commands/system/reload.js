const fs = require("fs");
const path = require("path");

module.exports.run = (client, message, args) => {
    let arg = args[0];
    if (!arg) return message.reply(client.data.language.command_system_reload_arg_empty);
    
    let commandName = arg.toLowerCase();
    let commands = message.client.commands.get(commandName);
    let aliases = message.client.commands.get(client.aliases.get(commandName));
    let command = commands || aliases;
    
    if (!command) return message.reply(client.data.language.command_system_reload_command_not_found);
    
    fs.readdirSync(path.join(__dirname, "..")).forEach(function (dirs) {
        let files = fs.readdirSync(path.join(__dirname, "..", dirs));
        if (files.includes(commandName + ".js")) {
            let file = "../" + dirs + "/" + commandName + ".js";
            try {
                delete require.cache[require.resolve(file)];
                client.commands.delete(commandName);
                const pull = require(file);
                client.commands.set(commandName, pull);
                return message.channel.send(client.data.language.command_system_reload_reloaded.replace("%name", commandName));
            } catch (err) {
                message.channel.send(client.data.language.command_system_reload_cant_reload + arg.toUpperCase());
                return console.log(err.stack || err);
            }
        }
    });
};

module.exports.help = {
    "name": "reload",
    "description": "Reload the command that doesn't work.",
    "usage": "reload <command>",
    "category": "system",
    "aliases": ["recommand", "รีโหลด", "โหลดซ้ำ"],
    "permissions": "SEND_MESSAGES"
};