const discord = require("discord.js");
const youtube = require("simple-youtube-api");
const yts = require("yt-search");
const musicPlayer = require("../../structures/musicPlayer");

module.exports.run = async function (client, message, args) {
    const api = new youtube(client.config.youtubeApi);
    
    let playlist, metadata, connection;
    let channel = message.member.voice.channel;
    let search = args.join(" ");

    let videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
    videoPattern.test(search);

    let playlistPattern = /[^.*](list=)([^#\&\?]*).*/gi;
    let resumePattern = /[^.*](t=)([^#\&\?]*).*/gi;
    let videoPlaylistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;

    let status = await message.channel.send(client.lang.command_music_play_status_check);

    if (!channel) {
        status.delete();
        return message.reply(client.lang.command_music_play_user_not_in_channel);
    }

    if (!search) {
        status.delete();
        return message.reply(client.lang.command_music_play_arg_empty);
    }

    await channel.join().then(channel => (connection = channel));

    status.edit(client.lang.command_music_play_status_create_data);

    let videos = [];
    let serverQueue = message.client.data.get(message.guild.id);
    let queueConstruct = {
        "textChannel": message.channel,
        "voiceChannel": channel,
        "connection": connection,
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

    try {
        if (!videoPattern.test(search) && playlistPattern.test(search)) {
            if (!api) {
                status.delete();
                return message.reply(client.lang.command_music_play_youtube_api_expire);
            } else {
                status.edit(client.lang.command_music_play_status_search_playlists);
                if (videoPlaylistPattern.test(search)) {
                    try {
                        playlist = await api.getPlaylist(search, { "part": "snippet" });
                        videos = await playlist.getVideos(10, { "part": "snippet" });
                    } catch (error) {
                        console.log(error);
                        status.delete();
                        return message.channel.send(client.lang.command_music_play_not_found_in_playlists);
                    }
                } else {
                    try {
                        playlist = await api.searchPlaylists(search, 1, { "part": "snippet" })[0];
                        videos = await playlist.getVideos(10, { "part": "snippet" });
                    } catch (error) {
                        console.log(error);
                        status.delete();
                        return message.channel.send(client.lang.command_music_play_try_catch_error + error.message);
                    }
                }

                videos.forEach(function (result) {
                    metadata = {
                        "type": result.type,
                        "id": result.id,
                        "url": "https://www.youtube.com/watch?v=" + result.id,
                        "title": result.title,
                        "description": result.description,
                        "image": result.thumbnails.standard.url,
                        "thumbnail": result.thumbnails.default.url,
                        "duration": result.durationSeconds,
                        "publishedAt": result.publishedAt,
                        "channel": {
                            "name": result.channel.raw.snippet.videoOwnerChannelTitle,
                            "url": "https://www.youtube.com/channel/" + result.channel.raw.snippet.videoOwnerChannelId
                        }
                    };

                    if (serverQueue) {
                        if (message.author.username === queueConstruct.require.username) {
                            status.edit(client.lang.command_music_play_status_update_all_music_in_playlists);
                            return serverQueue.songs.push(metadata);
                        }
                    } else {
                        status.edit(client.lang.command_music_play_status_add_all_music_in_playlists);
                        return queueConstruct.songs.push(metadata);
                    }
                });

                let playlistEmbed = new discord.MessageEmbed()
                .setTitle(playlist.title)
                .setDescription(queueConstruct.songs.map((songs, index) => (index + 1) + ". " + songs.title))
                .setURL(playlist.url)
                .setColor("#F8AA2A")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL());

                if (playlistEmbed.description.length >= 2048) {
                    playlistEmbed.description = playlistEmbed.description.substr(0, 2007) + "...";
                }

                if (serverQueue) {
                    if (message.author.username !== queueConstruct.require.username) {
                        status.delete();
                        return message.channel.send(client.lang.command_music_play_check_not_owner_in_playlists);
                    } else {
                        status.delete();
                        return message.channel.send(client.lang.command_music_play_status_add_new_music_in_playlists, playlistEmbed);
                    }
                } else {
                    status.edit(client.lang.command_music_play_status_add_all_music_success_in_playlists, playlistEmbed);
                    message.client.data.set(message.guild.id, queueConstruct);
    
                    queueConstruct.connection = connection;
                    status.edit(client.lang.command_music_play_status_opening_music_player_in_playlists);
                    return musicPlayer(client, message, queueConstruct.songs[0], status);   
                }
            }
        } else {
            status.edit(client.lang.command_music_play_status_search_music_in_single);
            if (resumePattern.test(search)) search = args.join(" ").replace(resumePattern, "");
            yts(search, async function (error, result) {
                if (error) {
                    console.log(error);
                    return status.edit(client.lang.command_music_play_not_found_in_single);
                } else {
                    videos = result.videos;
                    metadata = {
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
                        if (message.author.username !== queueConstruct.require.username) {
                            status.delete();
                            return message.channel.send(client.lang.command_music_play_check_not_owner_in_single);
                        } else {
                            status.delete();
                            serverQueue.songs.push(metadata);
                            return message.channel.send(client.lang.command_music_play_status_add_music_success_in_single.replace("%title", metadata.title));
                        }
                    } else {
                        queueConstruct.songs.push(metadata);
                        message.client.data.set(message.guild.id, queueConstruct);
    
                        queueConstruct.connection = connection;
                        status.edit(client.lang.command_music_play_status_opening_music_player_in_single);
                        return musicPlayer(client, message, queueConstruct.songs[0], status);
                    }
                }
            });
        }
    } catch (error) {
        console.log(error);
        message.client.data.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(client.lang.command_music_play_cant_join_channel + error);
    }
};

module.exports.help = {
    "name": "play",
    "description": "Sing to listen",
    "usage": "play <title: name, id, link>",
    "category": "music",
    "aliases": ["เล่น", "p", "เพลง"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};