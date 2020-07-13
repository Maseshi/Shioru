const ytdl = require("ytdl-core-discord");

module.exports = async function (client, message, song) {
    let queue = message.client.queue.get(message.guild.id);

    // If there is a song ready to play 
    if (song === undefined) {
        message.client.queue.delete(message.guild.id);
    } else {
        let stream = await ytdl(song.url, { "highWaterMark": 1 << 25 });
        let type = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

        let dispatcher = queue.connection.play(stream, {
            "type": type,
            "filter": "audioonly"
        });

        dispatcher.on('finish', function () {
            queue.songs.shift();
            module.exports(client, message, queue.songs[0]);
        });
        dispatcher.on('error', function (error) {
            console.error(error);
            return message.channel.send("⚠️ เกิดข้อผิดพลาดขณะกำลังเล่นคะ บอกว่า: " + error);
        });
        dispatcher.setVolumeLogarithmic(queue.volume / 5);

        queue.textChannel.send("🎶 เริ่มเล่นเพลง: `" + song.title + "`\n\n📄__ รายละเอียด__\n🕒 ระยะเวลา: **" + (song.duration || "ไม่ทราบ") + "**\n🔗 ลิงค์เพลง: **" + song.url + "**\n🆔 ไอดีเพลง: **" + song.id + "**");
        message.reply("LectionDev: คุณสมบัติทดลองเท่านั้น หากพบปัญหาหรือข้อผิดพลาดใดๆ โปรดแจ้งปัญหาที่พบให้กับเราที่ https://github.com/shinosaki/yumeko/issues หรือติดต่อ <@618836889239158785>");
    }
};