const ytdl = require("ytdl-core-discord");

module.exports = async function (client, message, metadata) {
    let queue = message.client.queue.get(message.guild.id);

    if (!metadata) {
        setTimeout(function () {
            if (!queue.connection.dispatcher && !message.guild.me.voice.channel) {
                queue.channel.leave();
            }
        }, 500000);
        queue.textChannel.send("🎐 ตอนนี้คิวเพลงว่างแล้วค้าา...");
        message.client.queue.delete(message.guild.id);
    } else {
        queue.connection.on("disconnect", function () {
            message.client.queue.delete(message.guild.id);
        });

        let stream = await ytdl(metadata.url, {
            "filter": "audioonly",
            "highWaterMark": 1 << 25,
            "opusEncoded": true,
            "quality": "highestaudio"
        });
        let streamType = metadata.url.includes("youtube.com") ? "opus" : "ogg/opus";
        let dispatcher = queue.connection.play(stream, {
            "type": streamType
        });

        dispatcher.on("finish", function () {
            if (queue.loop) {
                let lastSong = queue.songs.shift();
                queue.songs.push(lastSong);
                module.exports(client, message, queue.songs[0]);
            } else {
                queue.songs.shift();
                module.exports(client, message, queue.songs[0]);
            }
        });
        dispatcher.on("error", function (error) {
            console.log(error);
            queue.songs.shift();
            message.channel.send("⚠️ เกิดข้อผิดพลาดขณะกำลังเล่นคะ: " + error);
        });
        dispatcher.setVolumeLogarithmic(queue.volume / 100);

        queue.textChannel.send("🎶 กำลังเล่นเพลง: `" + metadata.title + "`");
    }
};