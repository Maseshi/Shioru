const musicPlayer = require("../../structures/musicPlayer");
const yts = require("yt-search");

module.exports.run = async function (client, message, args) {
    let channel = message.member.voice.channel;
    if (!channel) {
        message.reply("❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...");
    } else {
        let permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT")) {
            message.reply("🚫 ขอโทษนะคะ แต่ว่าา...คุณไม่มีสิทธิ์ในการเชื่อมต่อกับช่องนี้คะ ลองขอให้เจ้าของที่นี่ให้สิทธิ์กับคุณดูนะคะ");
        } else {
            if (!permissions.has("SPEAK")) {
                message.reply("🚫 ขอโทษนะคะ แต่ว่าา...คุณไม่มีสิทธิ์ในการพูดในช่องนี้คะ ลองขอให้เจ้าของที่นี่ให้สิทธิ์กับคุณดูนะคะ");
            } else {
                if (!args.length) {
                    message.reply("❓ อยากได้เพลงอะไรเหรอคะ ลิงค์เลยก็ได้นะ");
                } else {
                    let serverQueue = message.client.queue.get(message.guild.id);
                    let videoPattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
                    let playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
                    let search = args.join(" ");
                    let url = args[0];

                    let queueConstruct = {
                        "textChannel": message.channel,
                        "voiceChannel": channel,
                        "connection": null,
                        "require": {
                            "avatar": message.author.displayAvatarURL(),
                            "username": message.author.username,
                            "timestamp": new Date()
                        },
                        "songs": [],
                        "loop": false,
                        "volume": 60,
                        "playing": true
                    };

                    // Start the playlist if playlist url was provided
                    if (videoPattern.test(url) && playlistPattern.test(url)) {
                        message.client.commands.get("playlist").run(client, message, args);
                    } else {
                        yts(search, function (error, result) {
                            if (error) {
                                console.error(error);
                                return message.channel.send("❎ อืมม...ดูเหมือนจะไม่เจอเพลงนี้เลยนะ");
                            } else {
                                let videos = result.videos;
                                let song = {
                                    "id": videos[0].videoId,
                                    "title": videos[0].title,
                                    "url": videos[0].url,
                                    "duration": videos[0].timestamp
                                };

                                if (serverQueue) {
                                    serverQueue.songs.push(song);
                                    message.channel.send("✅ **" + song.title + "** ได้ถูกเพิ่มเข้าไปในคิวแล้วคะ!!");
                                } else {
                                    message.client.queue.set(message.guild.id, queueConstruct);
                                    queueConstruct.songs.push(song);

                                    channel.join()
                                        .then(function (connection) {
                                            queueConstruct.connection = connection;
                                            musicPlayer(client, message, queueConstruct.songs[0]);
                                        }).catch(function (error) {
                                            console.error("I could not join the voice channel: " + error);
                                            message.client.queue.delete(message.guild.id);
                                            channel.leave();
                                            message.channel.send("⚠️ เกิดข้อผิดพลาดขณะกำลังจะเข้าไปในช่องคะ: " + error);
                                        });
                                }
                            }
                        });
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