module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_MESSAGES"])) {
        let channel = args[0];
        let text = args.slice(1).join(" ");
        let channelInfo = message.guild.channels.cache.find(channels => (channels.id === channel) || (channels.name === channel));
        if (!channelInfo) {
            if (args.join(" ") === "") {
                message.reply(client.lang.command_messages_say_arg_empty);
            } else {
                message.delete()
                    .then(function () {
                        message.channel.send(args.join(" "));
                    });
            }
        } else {
            message.delete()
                .then(function () {
                    channelInfo.send(text)
                        .catch(function (error) {
                            message.channel.send(client.lang.command_messages_say_send_message_error + error);
                        });
                });
        }
    } else {
        message.channel.send(client.lang.command_messages_say_dont_have_permission);
    }
};

module.exports.help = {
    "name": "say",
    "description": "Let the bot print instead",
    "usage": "say (channel) <text>",
    "category": "messages",
    "aliases": ["s", "พูด", "ส่งข้อความ"]
};