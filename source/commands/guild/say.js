const catchError = require("../../extras/catchError");

module.exports.run = function (client, message, args) {
    let channel = args[0];
    let text = args.slice(1).join(" ");
    let channelInfo = message.guild.channels.cache.find(channels => (channels.id === channel) || (channels.name === channel));
    
    if (!channelInfo) {
        if (!args.join(" ")) return message.reply(client.translate.commands.say.empty);
        
        message.delete().then(function () {
            message.channel.send(args.join(" "));
        });
    } else {
        message.delete().then(function () {
            channelInfo.send(text).catch(function (error) {
                catchError(client, message, module.exports.help.name, error);
            });
        });
    }
};

module.exports.help = {
    "name": "say",
    "description": "Let the bot print instead",
    "usage": "say (channel<name, id>) <text>",
    "category": "guild",
    "aliases": ["s", "พูด", "ส่งข้อความ"],
    "permissions": ["SEND_MESSAGES", "MANAGE_MESSAGES"]
};