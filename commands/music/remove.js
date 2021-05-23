module.exports.run = async function (client, message, args) {
    if (client.music.isPlaying(message)) {
        let remove = parseInt(args[0]);
        let queue = client.music.getQueue(message);

        if (message.author.id !== queue.initMessage.author.id) return message.reply("🚫 เฉพาะเจ้าของคิวเท่านั้นที่จะเปลี่ยนแปลงได้คะ");
        if (!remove) return message.reply(client.data.language.command_music_remove_arg_empty);
        if (remove <= 0) return message.reply("❎ ไม่มีคิวที่ต่ำกว่านั้นนะ");
        if (remove >= queue.songs.length) return message.reply("❎ ไม่มีคิวดังกล่าวคะ ลองตรวจสอบใหม่ดูอีกครั้งนะคะ");
        
        if (remove === 1) {
            client.music.skip(message);
            message.channel.send("⏭ งั้นขอข้ามไปเลยละกันนะคะ เพราะลบไปแล้วก็เล่นต่อไม่ได้นะสิ");
        } else {
            let song = queue.songs.splice(remove - 1, 1);
            message.channel.send(client.data.language.command_music_remove_delete_success.replace("%title", (song[0].name)));
        }
    } else {
        message.reply(client.data.language.command_music_remove_no_queue);
    }
};

module.exports.help = {
    "name": "remove",
    "description": "Remove song from the queue",
    "usage": "remove <number>",
    "category": "music",
    "aliases": ["rm", "rq", "ลบ", "ลบคิว"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};