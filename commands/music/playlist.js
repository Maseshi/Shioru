const discord = require("discord.js");
const musicPlayer = require("../../include/musicPlayer");
const YouTubeAPI = require("simple-youtube-api");

module.exports.run = async function (client, message, args) {
    const youtube = new YouTubeAPI(client.config.youtubeApi);

    if (!youtube) {
        message.reply("❌ โควต้าการใช้งานของเซิร์ฟเวอร์หมดแล้วอ๊าาา...")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    } else {
        let search = args.join(" ");
        let channel = message.member.voice.channel;
        if (!channel) {
            message.reply("❓ เข้าไปในช่องไหนก็ได้ก่อนสิ ไม่งั้นอดฟังน้าา...")
                .then(function (msg) {
                    msg.delete({
                        timeout: 10000
                    });
                });
        } else {
            let permissions = channel.permissionsFor(message.client.user);
            if (!permissions.has("CONNECT")) {
                message.reply("🚫 ขอโทษนะคะ แต่ว่าา...คุณไม่มีสิทธิ์ในการเชื่อมต่อกับช่องนี้คะ ลองขอให้เจ้าของที่นี่ให้สิทธิ์กับคุณดูนะคะ")
                    .then(function (msg) {
                        msg.delete({
                            timeout: 10000
                        });
                    });
            } else {
                if (!permissions.has("SPEAK")) {
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
                        let pattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
                        let url = args[0];
                        let urlValid = pattern.test(args[0]);
                        let videos = [];
                        let playlist;
                        let song;

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
                            "volume": 3,
                            "playing": true
                        };

                        let userConstruct = {
                            "avatar": message.author.displayAvatarURL(),
                            "username": message.author.username
                        };

                        if (urlValid) {
                            try {
                                playlist = await youtube.getPlaylist(url, {
                                    "part": "snippet"
                                });

                                videos = await playlist.getVideos(10, {
                                    "part": "snippet"
                                });
                            } catch (error) {
                                console.error(error);
                                return message.reply("❎ ไม่เจอเพลย์ลิสอ่ะ จบละ")
                                .then(function (msg) {
                                    msg.delete({
                                        timeout: 10000
                                    });
                                });
                            }
                        } else {
                            try {
                                let results = await youtube.searchPlaylists(search, {
                                    "part": "snippet"
                                });
                                playlist = results[0];
                                videos = await playlist.getVideos(10, {
                                    "part": "snippet"
                                });
                            } catch (error) {
                                console.error(error);
                                return message.reply("❎ ไม่เจอเพลย์ลิสอ่ะ จบละ")
                                .then(function (msg) {
                                    msg.delete({
                                        timeout: 10000
                                    });
                                });
                            }
                        }

                        videos.forEach(function (video) {
                            song = {
                                "id": video.id,
                                "title": video.title,
                                "url": video.url,
                                "duration": video.duration,
                            };

                            if (serverQueue) {
                                serverQueue.songs.push(song);
                            } else {
                                queueConstruct.songs.push(song);
                            }
                        });

                        if (serverQueue) {
                            message.channel.send("✅ **" + playlist.title + "** ได้ถูกเพิ่มเข้าไปในคิวเพลงแล้ว โดย " + message.author.username);
                        } else {
                            let playlistEmbed = new discord.MessageEmbed()
                                .setTitle(playlist.title)
                                .setURL(playlist.url)
                                .setColor("#F8AA2A")
                                .setTimestamp()
                                .setFooter(message.author.username, message.author.displayAvatarURL());

                            playlistEmbed.setDescription(queueConstruct.songs.map((song, index) => (index + 1) + ". " + song.title));
                            if (playlistEmbed.description.length >= 2048) {
                                playlistEmbed.description = playlistEmbed.description.substr(0, 2007) + "\nอุ้ย...เพลย์ลิสเยอะไป ขอเอาออกบางส่วนนะ";
                            }

                            message.channel.send("📁 เพิ่มเพลงแล้วและกำลังจะเริ่มเล่นเพลงในเพลย์ลิส", playlistEmbed);
                            
                            message.client.queue.set(message.guild.id, queueConstruct, userConstruct);

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
                }
            }
        }
    }
};

module.exports.help = {
    "name": "playlist",
    "description": "Play a playlist from youtube",
    "usage": "Yplaylist <playlist>",
    "category": "music",
    "aliases": ["pl", "เพลย์ลิส"]
};