module.exports.run = function (client, message, args) {
    let queue = client.music.getQueue(message);

    if (!queue) return message.channel.send(client.translate.commands.nowPlaying.no_queue);

    let queueName = queue.songs[0].name;
    
    let duration = queue.songs[0].duration;
    let durationCurrent = Math.floor(queue.currentTime / 1000);
    let durationPercentage = Math.round((durationCurrent / duration) * 100);
    let durationLine;
    if (durationPercentage >= 0 && durationPercentage <= 5) durationLine = "⚪▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 5 && durationPercentage <= 10) durationLine = "▬⚪▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 10 && durationPercentage <= 15) durationLine = "▬▬⚪▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 15 && durationPercentage <= 20) durationLine = "▬▬▬⚪▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 20 && durationPercentage <= 25) durationLine = "▬▬▬▬⚪▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 25 && durationPercentage <= 30) durationLine = "▬▬▬▬▬⚪▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 30 && durationPercentage <= 35) durationLine = "▬▬▬▬▬▬⚪▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 35 && durationPercentage <= 40) durationLine = "▬▬▬▬▬▬▬⚪▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 40 && durationPercentage <= 45) durationLine = "▬▬▬▬▬▬▬▬⚪▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 45 && durationPercentage <= 50) durationLine = "▬▬▬▬▬▬▬▬▬⚪▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 50 && durationPercentage <= 55) durationLine = "▬▬▬▬▬▬▬▬▬▬⚪▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 55 && durationPercentage <= 60) durationLine = "▬▬▬▬▬▬▬▬▬▬▬⚪▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 60 && durationPercentage <= 65) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬⚪▬▬▬▬▬▬▬";
    if (durationPercentage >= 65 && durationPercentage <= 70) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬⚪▬▬▬▬▬▬";
    if (durationPercentage >= 70 && durationPercentage <= 75) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬⚪▬▬▬▬▬";
    if (durationPercentage >= 75 && durationPercentage <= 80) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬⚪▬▬▬▬";
    if (durationPercentage >= 80 && durationPercentage <= 85) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬⚪▬▬▬";
    if (durationPercentage >= 85 && durationPercentage <= 90) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬⚪▬▬";
    if (durationPercentage >= 90 && durationPercentage <= 95) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬⚪▬";
    if (durationPercentage >= 95 && durationPercentage <= 100) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬⚪";
    
    let durationFormat = queue.songs[0].formattedDuration;
    let durationCurrentFormat = queue.formattedCurrentTime;
    let durationCount = durationCurrentFormat + " / " + durationFormat;

    let musicPaused = client.music.paused ? "▶" : "▐▐";
    let musicAction = "◄◄⠀" + musicPaused + "⠀►►";

    let musicControl;
    let musicVolume = queue.volume;
    if (musicVolume === 0) musicControl = "○─── 🔇";
    if (musicVolume >= 0 && musicVolume <= 30) musicControl = "─○── 🔈";
    if (musicVolume >= 30 && musicVolume <= 70) musicControl = "──○─ 🔉";
    if (musicVolume >= 70 && musicVolume <= 100) musicControl = "───○ 🔊";

    let musicRepeat = queue.repeatMode ? queue.repeatMode === 2 ? "🔂" : "🔁" : "";

    let musicAutoplay = queue.autoplay ? "\n" + client.translate.commands.nowPlaying.autoplay : "";

    let musicFilter = queue.filter !== "clear" ? "\n" + client.translate.commands.nowPlaying.filter.replace("%s", queue.filter) : "";

    let musicDisplay = durationLine + "\n" + durationCount + " " + musicAction + " " + musicControl + " " + musicRepeat + musicAutoplay + musicFilter;

    message.channel.send({
        "embeds": [
            {
                "title": queueName,
                "description": musicDisplay,
                "color": 4886754,
                "timestamp": queue.CreatedTimestamp,
                "footer": {
                    "icon_url": avatarURL,
                    "text": client.translate.commands.nowPlaying.owner_this_queue.replace("%s", queueAuthorUsername)
                }
            }
        ]
    });
};

module.exports.help = {
    "name": "nowPlaying",
    "description": "Check the music that is currently playing.",
    "usage": "nowPlaying",
    "category": "music",
    "aliases": ["nowplaying", "np", "กำลังเล่น"],
    "permissions": ["SEND_MESSAGES", "CONNECT"]
};