const ytdl = require("ytdl-core-discord");
const firebase = require("firebase");

module.exports = async function (client, message, metadata, status) {
    let database = firebase.database();
    let ref = database.ref("Shioru/Discord/Guilds/").child(message.guild.id);

    let queue = message.client.data.get(message.guild.id);

    if (!metadata) {
        ref.once("value").then(function (snapshot) {
            if (snapshot.exists()) {
                let notifyEnable = snapshot.val().channels.notification.enable;
                let notifyId = snapshot.val().channels.notification.id;
    
                if (notifyEnable === true) {
                    let notification = message.guild.channels.cache.find(ch => ch.id === notifyId);
                    notification.send({
                        "embed": {
                            "description": "> 🎐 ตอนนี้คิวเพลงของฉันว่างแล้วค้าา...",
                            "timestamp": new Date(),
                            "color": 4886754,
                            "footer": {
                                "text": client.lang.event_guild_channelCreate_embed_footer_text
                            },
                            "author": {
                                "name": "การแจ้งเตือนคิวเพลง",
                                "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/multiple-musical-notes_1f3b6.png"
                            }
                        }
                    });
                }
            } else {
                ref.set({
                    "prefix": "S",
                    "language": "th_TH",
                    "channels": {
                        "notification": {
                            "enable": false,
                            "id": 0
                        }
                    }
                }).then(function () {
                    module.exports(client, message, metadata, status);
                });
            }
        });
        
        setTimeout(function () {
            if (!queue.connection.dispatcher && !message.guild.me.voice.channel) {
                queue.channel.leave();
            }
        }, 500000);

        message.client.data.delete(message.guild.id);
    } else {
        queue.connection.on("disconnect", function () {
            message.client.data.delete(message.guild.id);
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
            if (!status) {
                message.channel.send("⚠️ เกิดข้อผิดพลาดขณะกำลังเล่นคะ: " + error);
            } else {
                status.edit("⚠️ เกิดข้อผิดพลาดขณะกำลังเล่นคะ: " + error);
            }
        });
        dispatcher.setVolumeLogarithmic(queue.volume / 100);

        if (!status) {
            message.channel.send("🎶 กำลังเล่นเพลง: `" + metadata.title + "`");
        } else {
            status.edit("🎶 กำลังเล่นเพลง: `" + metadata.title + "`");
        }
    }
};