const ytdl = require("ytdl-core-discord");

module.exports = async function (client, message, song) {
    let queue = message.client.queue.get(message.guild.id);

    if (!song) {
        message.client.queue.delete(message.guild.id);
    } else {
        queue.connection.on("disconnect", function () {
            message.client.queue.delete(message.guild.id);
        });

        let stream = await ytdl(song.url, { "highWaterMark": 1 << 25 });
        let type = song.url.includes("youtube.com") ? "opus" : "ogg/opus";

        let dispatcher = queue.connection.play(stream, {
            "type": type,
            "filter": "audioonly"
        });

        dispatcher.on('finish', function () {
            if (queue.loop) {
                let lastSong = queue.songs.shift();
                queue.songs.push(lastSong);
                module.exports(client, message, queue.songs[0]);
            } else {
                queue.songs.shift();
                module.exports(client, message, queue.songs[0]);
            }
        });
        dispatcher.on('error', function (error) {
            console.error(error);
            return message.channel.send("⚠️ เกิดข้อผิดพลาดขณะกำลังเล่นคะ แจ้งมาว่า: " + error);
        });
        dispatcher.setVolumeLogarithmic(queue.volume / 100);

        queue.textChannel.send("🎶 เริ่มเล่นเพลง: `" + song.title + "`\n\n📄__ รายละเอียด__\n• ระยะเวลา: **" + (song.duration || "ไม่ทราบ") + "**\n• ลิงค์เพลง: **" + song.url + "**\n• ไอดีเพลง: **" + song.id + "**");
    }
};