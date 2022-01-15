const catchError = require("../../extras/catchError");

module.exports.run = (client, message, args) => {
    const inputMessage = args[0];
    const inputText = args.slice(1).join(" ");
    const channel = message.guild.channels.cache.find(channels => (channels.id === inputMessage) || (channels.name === inputMessage));
    
    if (!channel) {
        if (!args.join(" ")) return message.reply(client.translate.commands.say.empty);
        
        message.delete().then(() => {
            message.channel.send(args.join(" "));
        });
    } else {
        if (!inputText) return message.reply(client.translate.commands.say.empty);

        message.delete().then(() => {
            channel.send(inputText).catch((error) => {
                catchError(client, message, module.exports.help.name, error);
            });
        });
    }
};

module.exports.help = {
    "name": "say",
    "description": "Let the bot print instead",
    "usage": "say (channel: name, id) <text>",
    "category": "guild",
    "aliases": ["s", "พูด", "ส่งข้อความ"],
    "userPermission": ["MANAGE_MESSAGES"],
    "clientPermissions": ["SEND_MESSAGES"]
};