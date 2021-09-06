module.exports.run = function (client, message, args) {
    let jump = parseInt(args[0]);
    let queue = client.music.getQueue(message);

    if (!queue) return message.channel.send(client.translate.commands.jump.no_queue);
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.jump.not_queue_owner);
    if (!jump) return message.reply(client.translate.commands.jump.no_input);
    if (jump <= 0) return message.reply(client.translate.commands.jump.too_low);
    if (jump > queue.songs.length) return message.reply(client.translate.commands.jump.too_much);

    try {
        client.music.jump(message, jump - 1);
    } catch (error) {
        message.reply(client.translate.commands.jump.can_not_jump);
    }
};

module.exports.help = {
    "name": "jump",
    "description": "Skip to the selected queue number",
    "usage": "jump <number>",
    "category": "music",
    "aliases": ["skipto", "ข้ามไปที่"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};