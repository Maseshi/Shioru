module.exports.run = async function (client, message, args) {
    let channel = args[0];
    let text = args.slice(1).join(" ");
    let channelInfo = message.guild.channels.cache.find(channels => (channels.id === channel) || (channels.name === channel));
    
    if (!channelInfo) {
        if (!args.join(" ")) return message.reply(client.data.language.command_messages_say_arg_empty);
        
        message.delete().then(function () {
            return message.channel.send(args.join(" "));
        });
    } else {
        message.delete().then(function () {
            channelInfo.send(text).catch(function (error) {
                message.channel.send(client.data.language.command_messages_say_send_message_error + error);
            });
        });
    }
};

module.exports.help = {
    "name": "say",
    "description": "Let the bot print instead",
    "usage": "say (channel<name, id>) <text>",
    "category": "messages",
    "aliases": ["s", "พูด", "ส่งข้อความ"],
    "permissions": ["SEND_MESSAGES", "MANAGE_MESSAGES"]
};