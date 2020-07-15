const check = require("../../structures/modifyQueue");

module.exports.run = function (client, message, args) {
    let volume = args[0];
    let channel = message.member.voice.channel;
    if (!channel) {
        message.reply("❓ เข้าไปในช่องไหนก็ได้ก่อนสิ");
    } else {
        let serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) {
            message.channel.send("❎ เอ๋...ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ จะไปปรับเสียงอะไรอ่ะ");
        } else {
            if (!check(message.member)) {
                message.channel.send("🚫 อืมม...มีแต่เจ้าของคิวนี้เท่านั้นละนะ ที่จะทำได้");
            } else {
                if (!volume) {
                    message.channel.send("🔈 ปริมาณเสียงปัจจุบันคือ: **" + serverQueue.volume + "**");
                } else {
                    if (volume >= 101) {
                        message.channel.send("🔇 ดังเกินไปแล้ววว...เดี่ยวลำโพงก็แตกซ่ะหรอก");
                    } else {
                        serverQueue.volume = volume;
                        serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 100);
                        message.channel.send("🔊 ปรับเสียงไปที่ระดับ: **" + volume + "**");
                    }
                }
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