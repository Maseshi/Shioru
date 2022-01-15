module.exports.run = (client, message, args) => {
    const inputAmount = parseInt(args[0]);
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.jump.no_queue);
    if (message.author.id !== queue.songs[0].user.id) return message.reply(client.translate.commands.jump.not_queue_owner);
    if (!inputAmount) return message.reply(client.translate.commands.jump.no_input);
    if (inputAmount <= 0) return message.reply(client.translate.commands.jump.too_low);
    if (inputAmount > queue.songs.length) return message.reply(client.translate.commands.jump.too_much);

    try {
        client.music.jump(message, inputAmount - 1);
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
    "clientPermissions": ["SEND_MESSAGES"]
};