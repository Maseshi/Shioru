const ytdl = require("ytdl-core");

module.exports = async function (client, message, song) {
    let queue = message.client.queue.get(message.guild.id);

    // If there is a song ready to play 
    if (song === undefined) {
        message.client.queue.delete(message.guild.id);
    } else {
        let dispatcher = queue.connection.play(ytdl(song.url, {
            "filter": "audioonly",
            "quality": "highestaudio"
        }));

        dispatcher.on('finish', function () {
            queue.songs.shift();
            module.exports(client, message, queue.songs[0]);
        });
        dispatcher.on('error', function (error) {
            console.error(error);
            message.channel.send("⚠️ เกิดข้อผิดพลาดขณะกำลังเล่นคะ บอกว่า: " + error);
        });
        dispatcher.setVolumeLogarithmic(queue.volume / 5);

        queue.textChannel.send("🎶 เริ่มเล่นเพลง: `" + song.title + "`\n\n📄__ รายละเอียด__\n🕒 ระยะเวลา: **" + (song.duration || "ไม่ทราบ") + "**\n🔗 ลิงค์เพลง: **" + song.url + "**\n🆔 ไอดีเพลง: **" + song.id + "**");
        message.reply("LectionDev: คุณสมบัติทดลองเท่านั้น หากพบปัญหาหรือข้อผิดพลาดใดๆ โปรดแจ้งปัญหาที่พบให้กับเราที่ https://github.com/shinosaki/yumeko/issues หรือติดต่อ <@618836889239158785>");
    }
};