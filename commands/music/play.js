const ytdl = require('ytdl-core');
const YouTubeAPI = require("simple-youtube-api");

module.exports.run = async function (client, message, args) {
    const youtube = new YouTubeAPI(client.config.youtubeApi);

    let search = args.join(" ");
    let channel = message.member.voice.channel;
    if (channel === undefined) {
        message.reply("❓ เข้าไปในช่องไหนก็ได้ก่อนสิ")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    } else {
        let permissions = channel.permissionsFor(message.client.user);
        if (permissions.has('CONNECT') === undefined) {
            message.reply("🚫 ขอโทษนะคะ แต่ว่าา...คุณไม่มีสิทธิ์ในการเชื่อมต่อกับช่องนี้คะ ลองขอให้เจ้าของที่นี่ให้สิทธิ์กับคุณดูนะคะ")
            .then(function (msg) {
                msg.delete({
                    timeout: 10000
                });
            });
        } else {
            if (permissions.has('SPEAK') === undefined) {
                message.reply("🚫 ขอโทษนะคะ แต่ว่าา...คุณไม่มีสิทธิ์ในการพูดในช่องนี้คะ ลองขอให้เจ้าของที่นี่ให้สิทธิ์กับคุณดูนะคะ")
                .then(function (msg) {
                    msg.delete({
                        timeout: 10000
                    });
                });
            } else {
                if (search === "") {
                    message.reply("❓ อยากได้เพลงอะไรเหรอคะ ลิงค์เลยก็ได้นะ")
                    .then(function (msg) {
                        msg.delete({
                            timeout: 10000
                        });
                    });
                } else {
                    let serverQueue = message.client.queue.get(message.guild.id);
                    let videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
                    let playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
                    let results;
                    let songInfo;
                    let song;

                    // Start the playlist if playlist url was provided
                    if (videoPattern.test(args[0]) === undefined && playlistPattern.test(args[0])) {
                        return message.client.commands.get("playlist").execute(message, args);
                    }
                    
                    try {
                        results = await youtube.searchVideos(search, 1);
                        songInfo = await ytdl.getInfo(results[0].url);

                        let videoId = songInfo.videoDetails.videoId;
                        let videoTitle = songInfo.videoDetails.title;
                        let videoURL = songInfo.videoDetails.video_url;

                        song = {
                            "id": videoId,
                            "title": videoTitle,
                            "url": videoURL
                        }; 
                    } catch (error) {
                        console.error(error);
                        return message.reply("❎ เอิ่มม...ฉันพยายามหาเพลงนี้แล้วอ่ะ แต่หาไม่เจอ")
                        .then(function (msg) {
                            msg.delete({
                                timeout: 10000
                            });
                        });
                    }

                    if (serverQueue) {
                        serverQueue.songs.push(song);
                        message.channel.send("✅ **" + song.title + "** ได้ถูกเพิ่มเข้าไปในคิวแล้วคะ!!");
                    } else {
                        let queueConstruct = {
                            "textChannel": message.channel,
                            "voiceChannel": channel,
                            "connection": null,
                            "songs": [],
                            "volume": 3,
                            "playing": true
                        };
                        message.client.queue.set(message.guild.id, queueConstruct);
                        queueConstruct.songs.push(song);

                        let play = async function (song) {
                            let queue = message.client.queue.get(message.guild.id);
                            if (song === undefined) {
                                queue.voiceChannel.leave();
                                message.client.queue.delete(message.guild.id);
                            } else {
                                let dispatcher = queue.connection.play(ytdl(song.url))
                                    .on('finish', function () {
                                        queue.songs.shift();
                                        play(queue.songs[0]);
                                    }).on('error', function (error) {
                                        console.error(error);
                                        message.channel.send("⚠️ เกิดข้อผิดพลาดขณะกำลังเล่นคะ มันบอกว่า: " + error);
                                    });
                                dispatcher.setVolumeLogarithmic(queue.volume / 5);
                                queue.textChannel.send("🎶 เริ่มเล่นเพลง: **" + song.title + "** " + results[0].url);
                                client.user.setPresence({
                                    //"available", "idle", "dnd", or "invisible"
                                    "status": "available",
                                    "activity": {
                                        "name": "🎶 เพลง: " + song.title,
                                        "type": 'PLAYING'
                                    }
                                });
                            }
                        };

                        try {
                            let connection = await channel.join();
                            queueConstruct.connection = connection;
                            play(queueConstruct.songs[0]);
                        } catch (error) {
                            console.error("I could not join the voice channel: " + error);
                            message.client.queue.delete(message.guild.id);
                            await channel.leave();
                            return message.channel.send("⚠️ เกิดข้อผิดพลาดขณะกำลังจะเข้าไปในช่องคะ มันบอกว่า: " + error);
                        }
                    }
                }
            }
        }
    }
};

module.exports.help = {
    "name": "play",
    "description": "Sing to listen",
    "usage": "Yplay <name>",
    "category": "music",
    "aliases": ["เล่น", "p"]
};