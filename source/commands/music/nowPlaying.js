module.exports.run = (client, message, args) => {
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.nowPlaying.no_queue);

    const queueName = queue.songs[0].name;
    
    let durationLine;
    const duration = queue.songs[0].duration;
    const durationCurrent = Math.floor(queue.currentTime / 1000);
    const durationPercentage = Math.round((durationCurrent / duration) * 100);
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
    
    const durationFormat = queue.songs[0].formattedDuration;
    const durationCurrentFormat = queue.formattedCurrentTime;
    const durationCount = durationCurrentFormat + " / " + durationFormat;

    const musicPaused = client.music.paused ? "▶" : "▐▐";
    const musicAction = "◄◄⠀" + musicPaused + "⠀►►";

    let musicControl;
    const musicVolume = queue.volume;
    if (musicVolume === 0) musicControl = "○─── 🔇";
    if (musicVolume >= 0 && musicVolume <= 30) musicControl = "─○── 🔈";
    if (musicVolume >= 30 && musicVolume <= 70) musicControl = "──○─ 🔉";
    if (musicVolume >= 70 && musicVolume <= 100) musicControl = "───○ 🔊";

    const musicRepeat = queue.repeatMode ? queue.repeatMode === 2 ? "🔂" : "🔁" : "";

    const musicAutoplay = queue.autoplay ? "\n" + client.translate.commands.nowPlaying.autoplay : "";

    const musicFilter = queue.filter !== "clear" ? "\n" + client.translate.commands.nowPlaying.filter.replace("%s", queue.filter) : "";

    const musicDisplay = durationLine + "\n" + durationCount + " " + musicAction + " " + musicControl + " " + musicRepeat + musicAutoplay + musicFilter;

    message.channel.send({
        "embeds": [
            {
                "title": queueName,
                "description": musicDisplay,
                "color": 4886754,
                "timestamp": queue.CreatedTimestamp,
                "footer": {
                    "iconURL": avatarURL,
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
    "clientPermissions": ["SEND_MESSAGES"]
};