const discord = require("discord.js");
const musicPlayer = require("../../structures/musicPlayer");
const yts = require("yt-search");
const YouTubeAPI = require("simple-youtube-api");
const check = require("../../structures/modifyQueue");

module.exports.run = async function (client, message, args) {
    const youtube = new YouTubeAPI(client.config.youtubeApi);

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
                    channel.join().then(async function (connection) {
                        let serverQueue = message.client.queue.get(message.guild.id);
                        let videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
                        let playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
                        let videoPlaylistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
                        let search = args.join(" ");
                        let url = args[0];
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
                            "volume": 100,
                            "playing": true
                        };
                        
                        // Start the playlist if playlist url was provided
                        if (!videoPattern.test(url) && playlistPattern.test(url)) {
                            if (!youtube) {
                                message.reply("❌ โควต้าการใช้งานของเซิร์ฟเวอร์หมดแล้วอ๊าาา...โปรดรอในวันพรุ่งนี้แทนนะคะ ขอโทษจริงๆ คะ T~T");
                            } else {
                                if (videoPlaylistPattern.test(url)) {
                                    try {
                                        playlist = await youtube.getPlaylist(url, { "part": "snippet" });
                                        videos = await playlist.getVideos(10, { "part": "snippet" });
                                    } catch (error) {
                                        console.log(error);
                                        return message.channel.send("❎ หาเพลย์ลิสไม่เจออ่ะ จบละ");
                                    }
                                } else {
                                    try {
                                        let results = await youtube.searchPlaylists(search, { "part": "snippet" });
                                        playlist = results[0];
                                        videos = await playlist.getVideos(10, { "part": "snippet" });
                                    } catch (error) {
                                        console.log(error);
                                        return message.channel.send("❎ ดูเหมือนจะไม่มีเพลย์ลิสนี้นะ: " + error.message);
                                    }
                                }
        
                                videos.forEach(function (result) {
                                    song = {
                                        "type": result.type,
                                        "id": result.id,
                                        "url": "https://www.youtube.com/watch?v=" + result.id,
                                        "title": result.title,
                                        "description": result.description,
                                        "thumbnail": result.thumbnails.default.url,
                                        "duration": result.durationSeconds,
                                        "publishedAt": result.publishedAt,
                                        "channel": {
                                            "url": "https://www.youtube.com/channel/" + result.channel.id
                                        }
                                    };

                                    // Add a list of all songs.
                                    if (serverQueue) {
                                        if (check(message.member)) {
                                            serverQueue.songs.push(song);
                                        }
                                    } else {
                                        queueConstruct.songs.push(song);
                                    }
                                });

                                let playlistEmbed = new discord.MessageEmbed()
                                    .setTitle(playlist.title)
                                    .setURL(playlist.url)
                                    .setColor("#F8AA2A")
                                    .setTimestamp()
                                    .setFooter(message.author.username, message.author.displayAvatarURL());
            
                                playlistEmbed.setDescription(queueConstruct.songs.map((songs, index) => (index + 1) + ". " + songs.title));
                                if (playlistEmbed.description.length >= 2048) {
                                    playlistEmbed.description = playlistEmbed.description.substr(0, 2007) + "\nอุ้ย...เพลย์ลิสเยอะไป ขอเอาออกบางส่วนนะ";
                                }
    
                                if (serverQueue) {
                                    if (!check(message.member)) {
                                        message.channel.send("🚫 เฉพาะเจ้าของคิวนี้เท่านั้นที่จะเพิ่มเพลงได้");
                                    } else {
                                        message.channel.send("📂 เพิ่มรายการเพลงใหม่เข้าเพลย์ลิสนี้เรียบร้อยแล้ว", playlistEmbed);
                                    }
                                } else {
                                    message.channel.send("📁 เพิ่มเพลงแล้วและกำลังจะเริ่มเล่นเพลงในเพลย์ลิส", playlistEmbed);
                                    
                                    message.client.queue.set(message.guild.id, queueConstruct);
        
                                    queueConstruct.connection = connection;
                                    await queueConstruct.connection.voice.setSelfDeaf(true);
                                    musicPlayer(client, channel, message, queueConstruct.songs[0]);
                                }
                            }
                        } else {
                            yts(search, async function (error, result) {
                                if (error) {
                                    console.log("I can't find the song: " + error);
                                    return message.channel.send("❎ อืมม...ดูเหมือนจะไม่เจอเพลงนี้เลยนะ");
                                } else {
                                    videos = result.videos;
                                    song = {
                                        "type": videos[0].type,
                                        "id": videos[0].videoId,
                                        "url": videos[0].url,
                                        "title": videos[0].title,
                                        "description": videos[0].description,
                                        "image": videos[0].image,
                                        "thumbnail": videos[0].thumbnail,
                                        "seconds": videos[0].seconds,
                                        "timestamp": videos[0].timestamp,
                                        "duration": videos[0].duration,
                                        "ago": videos[0].ago,
                                        "views": videos[0].views,
                                        "author": {
                                            "name": videos[0].author.name,
                                            "url": videos[0].author.url
                                        }
                                    };
    
                                    if (serverQueue) {
                                        if (!check(message.member)) {
                                            message.channel.send("🚫 เฉพาะเจ้าของคิวนี้เท่านั้นที่จะเพิ่มเพลงได้");
                                        } else {
                                            serverQueue.songs.push(song);
                                            message.channel.send("✅ **" + song.title + "** ได้ถูกเพิ่มเข้าไปในคิวแล้วคะ!!");
                                        }
                                    } else {
                                        message.client.queue.set(message.guild.id, queueConstruct);
                                        queueConstruct.songs.push(song);
    
                                        queueConstruct.connection = connection;
                                        await queueConstruct.connection.voice.setSelfDeaf(true);
                                        musicPlayer(client, channel, message, queueConstruct.songs[0]);
                                    }
                                }
                            });
                        }
                    }).catch(async function (err) {
                        console.log("I could not join the voice channel: " + err);
                        message.client.queue.delete(message.guild.id);
                        await channel.leave();
                        message.channel.send("⚠️ เกิดข้อผิดพลาดขณะกำลังจะเข้าไปในช่องเสียงคะ: " + err);
                    });
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
    "aliases": ["เล่น", "p", "เพลง"]
};