const { readdirSync } = require("fs");
const path = require("path");

module.exports.run = (client, message, args) => {
    const inputCommand = args[0];
    
    if (!inputCommand) return message.reply(client.translate.commands.reload.command_required);
    
    const commandName = inputCommand.toLowerCase();
    const commands = message.client.commands.get(commandName);
    const aliases = message.client.commands.get(client.aliases.get(commandName));
    const command = commands || aliases;
    
    if (!command) return message.reply(client.translate.commands.reload.invalid_command);
    
    readdirSync(path.join(__dirname, "..")).forEach(async (dirs) => {
        const files = readdirSync(path.join(__dirname, "..", dirs));
        
        if (files.includes(commandName + ".js")) {
            const file = "../" + dirs + "/" + commandName + ".js";
            
            try {
                delete require.cache[require.resolve(file)];
                client.commands.delete(commandName);
                
                const pull = require(file);
                
                client.commands.set(commandName, pull);
                message.channel.send(client.translate.commands.reload.reloaded.replace("%s", commandName));
            } catch (error) {
                message.channel.send(client.translate.commands.reload.reload_error.replace("%s", inputCommand.toUpperCase()));
                console.log(error.stack || error);
            }
        }
    });
};

module.exports.help = {
    "name": "reload",
    "description": "Reload the command that doesn't work.",
    "usage": "reload <command: name, aliases>",
    "category": "developer",
    "aliases": ["recommand", "รีโหลด", "โหลดซ้ำ"],
    "clientPermissions": ["SEND_MESSAGES"]
};