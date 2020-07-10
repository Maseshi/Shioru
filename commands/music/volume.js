module.exports.run = function (client, message, args) {
    let channel = message.member.voice.channel;
    if (channel === undefined) {
        message.reply("❓ เข้าไปในช่องไหนก็ได้ก่อนสิ")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    } else {
        let serverQueue = message.client.queue.get(message.guild.id);
        if (serverQueue === undefined) {
            message.reply("❎ เอ๋...ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ จะไปปรับเสียงอะไรอ่ะ")
            .then(function (msg) {
                msg.delete({
                    timeout: 10000
                });
            });
        } else {
            if (args[0] === undefined) {
                message.channel.send("🔈 ปริมาณเสียงปัจจุบันคือ: **" + serverQueue.volume + "**");
            } else {
                serverQueue.volume = args[0];
                serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 5);
                message.channel.send("🔊 ปรับเสียงไปที่ระดับ: **" + args[0] + "**");
            }
        }
    }
};

module.exports.help = {
    "name": "volume",
    "description": "Adjust the music volume",
    "usage": "Yvolume <number>",
    "category": "music",
    "aliases": ["vl", "ระดับเสียง", "ระดับเพลง", "ปรับเสียง"]
};