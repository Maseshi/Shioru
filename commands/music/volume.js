const check = require("../../util/modifyQueue");

module.exports.run = function (client, message, args) {
    let volume = args[0];
    let channel = message.member.voice.channel;
    if (!channel) {
        message.reply("❓ เข้าไปในช่องไหนก็ได้ก่อนสิ")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    } else {
        let serverQueue = message.client.queue.get(message.guild.id);
        if (!serverQueue) {
            message.reply("❎ เอ๋...ไม่มีเพลงที่ฉันกำลังเล่นอยู่นะคะ จะไปปรับเสียงอะไรอ่ะ")
            .then(function (msg) {
                msg.delete({
                    timeout: 10000
                });
            });
        } else {
            if (!check(message.member)) {
                message.reply("🚫 อืมม...มีแต่เจ้าของคิวนี้เท่านั้นละนะ ที่จะทำได้")
                    .then(function (msg) {
                        msg.delete({
                            timeout: 10000
                        });
                    });
            } else {
                if (!volume) {
                    message.channel.send("🔈 ปริมาณเสียงปัจจุบันคือ: **" + serverQueue.volume + "**");
                } else {
                    if (volume >= 6) {
                        message.reply("🔇 ดังเกินไปแล้ววว...เดี่ยวลำโพงก็แตกซ่ะหรอก")
                        .then(function (msg) {
                            msg.delete({
                                timeout: 10000
                            });
                        });
                    } else {
                        serverQueue.volume = volume;
                        serverQueue.connection.dispatcher.setVolumeLogarithmic(volume / 5);
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