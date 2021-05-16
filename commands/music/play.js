const discord = require("discord.js");
const YouTubeAPI = require("simple-youtube-api");
const yts = require("yt-search");
const musicPlayer = require("../../structures/musicPlayer");

module.exports.run = async function (client, message, args) {
    const youtube = new YouTubeAPI(client.config.youtubeApi);
    
    let channel = message.member.voice.channel;
    let status = await message.channel.send(client.lang.command_music_play_status_check);

    if (!channel) {
        status.delete();
        return message.reply(client.lang.command_music_play_user_not_in_channel);
    }

    if (!args.length) {
        status.delete();
        return message.reply(client.lang.command_music_play_arg_empty);
    }

    channel.join().then(async function (connection) {
        status.edit(client.lang.command_music_play_status_create_data);
        let videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
        let playlistPattern = /^.*(list=)([^#\&\?]*).*/gi;
        let videoPlaylistPattern = /^.*(youtu.be\/|list=)([^#\&\?]*).*/gi;
        let serverQueue = message.client.data.get(message.guild.id);
        let search = args.join(" ");
        let url = args[0];
        let videos = [];
        let playlist;
        let metadata;
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

        if (!videoPattern.test(url) && playlistPattern.test(url)) {
            if (!youtube) {
                status.delete();
                return message.reply(client.lang.command_music_play_youtube_api_expire);
            }

            status.edit(client.lang.command_music_play_status_search_playlists);
            if (videoPlaylistPattern.test(url)) {
                try {
                    playlist = await youtube.getPlaylist(url, { "part": "snippet" });
                    videos = await playlist.getVideos(10, { "part": "snippet" });
                } catch (error) {
                    console.log(error);
                    status.delete();
                    return message.channel.send(client.lang.command_music_play_not_found_in_playlists);
                }
            } else {
                try {
                    let results = await youtube.searchPlaylists(search, { "part": "snippet" });
                    playlist = results[0];
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
                    "thumbnail": result.thumbnails.default.url,
                    "duration": result.durationSeconds,
                    "publishedAt": result.publishedAt,
                    "channel": {
                        "url": "https://www.youtube.com/channel/" + result.channel.id
                    }
                };

                if (serverQueue) {
                    if (queueConstruct.require.username === message.author.username) {
                        status.edit(client.lang.command_music_play_status_update_all_music_in_playlists);
                        return serverQueue.songs.push(metadata);
                    }
                }
                
                status.edit(client.lang.command_music_play_status_add_all_music_in_playlists);
                return queueConstruct.songs.push(metadata);
            });

            let playlistEmbed = new discord.MessageEmbed()
                .setTitle(playlist.title)
                .setURL(playlist.url)
                .setColor("#F8AA2A")
                .setTimestamp()
                .setFooter(message.author.username, message.author.displayAvatarURL());

            playlistEmbed.setDescription(queueConstruct.songs.map((songs, index) => (index + 1) + ". " + songs.title));
            if (playlistEmbed.description.length >= 2048) playlistEmbed.description = playlistEmbed.description.substr(0, 2007) + client.lang.command_music_play_embed_playlistEmbed_description_over;

            if (serverQueue) {
                if (queueConstruct.require.username !== message.author.username) {
                    status.delete();
                    return message.channel.send(client.lang.command_music_play_check_not_owner_in_playlists);
                }

                status.delete();
                return message.channel.send(client.lang.command_music_play_status_add_new_music_in_playlists, playlistEmbed);
            }
            
            message.channel.send(client.lang.command_music_play_status_add_all_music_success_in_playlists, playlistEmbed);
            message.client.data.set(message.guild.id, queueConstruct);

            queueConstruct.connection = connection;
            status.edit(client.lang.command_music_play_status_disable_headphones_in_playlists);
            await queueConstruct.connection.voice.setSelfDeaf(true);
            await queueConstruct.connection.voice.setSelfMute(false);
            status.edit(client.lang.command_music_play_status_opening_music_player_in_playlists);
            return musicPlayer(client, message, queueConstruct.songs[0], status);
        }

        status.edit(client.lang.command_music_play_status_search_music_in_single);
        yts(search, async function (error, result) {
            if (error) {
                console.log(error);
                return status.edit(client.lang.command_music_play_not_found_in_single);
            }

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
                if (queueConstruct.require.username !== message.author.username) {
                    status.delete();
                    return message.channel.send(client.lang.command_music_play_check_not_owner_in_single);
                }

                serverQueue.songs.push(metadata);
                status.delete();
                return message.channel.send(client.lang.command_music_play_status_add_music_success_in_single.replace("%title", metadata.title));
            }
            
            queueConstruct.songs.push(metadata);
            message.client.data.set(message.guild.id, queueConstruct);

            queueConstruct.connection = connection;
            status.edit(client.lang.command_music_play_status_disable_headphones_in_single);
            await queueConstruct.connection.voice.setSelfDeaf(true);
            await queueConstruct.connection.voice.setSelfMute(false);
            status.edit(client.lang.command_music_play_status_opening_music_player_in_single);
            return musicPlayer(client, message, queueConstruct.songs[0], status);
        });
    }).catch(async function (err) {
        console.log(err);
        message.client.data.delete(message.guild.id);
        await channel.leave();
        message.channel.send(client.lang.command_music_play_cant_join_channel + err);
    });
};

module.exports.help = {
    "name": "play",
    "description": "Sing to listen",
    "usage": "play <title: name, id, link>",
    "category": "music",
    "aliases": ["เล่น", "p", "เพลง"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};