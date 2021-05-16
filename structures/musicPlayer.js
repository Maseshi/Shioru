const ytdl = require("ytdl-core-discord");
const firebase = require("firebase");

module.exports = async function (client, message, metadata, status) {
    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guild").child(message.guild.id);

    let queue = message.client.data.get(message.guild.id);

    if (!metadata) {
        ref.child("config/notification").once("value").then(function (snapshot) {
            if (snapshot.exists()) {
                let notifyId = snapshot.val().alert;
    
                if (notifyId === true) {
                    let notification = message.guild.channels.cache.find(channels => channels.id === notifyId);
                    notification.send({
                        "embed": {
                            "description": client.lang.structures_musicPlayer_notification_clear,
                            "timestamp": new Date(),
                            "color": 4886754,
                            "footer": {
                                "text": client.lang.event_guild_channelCreate_embed_footer_text
                            },
                            "author": {
                                "name": client.lang.structures_musicPlayer_notification_name,
                                "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/multiple-musical-notes_1f3b6.png"
                            }
                        }
                    });
                }
            } else {
                ref.child("config/notification").set({
                    "alert": 0
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
                message.channel.send(client.lang.structures_musicPlayer_dispatcher_error + error);
            } else {
                status.edit(client.lang.structures_musicPlayer_dispatcher_status_error + error);
            }
        });
        
        dispatcher.setVolumeLogarithmic(queue.volume / 100);

        if (!status) {
            message.channel.send(client.lang.structures_musicPlayer_playing.replace("%title", metadata.title));
        } else {
            status.edit(client.lang.structures_musicPlayer_status_playing.replace("%title", metadata.title));
        }
    }
};