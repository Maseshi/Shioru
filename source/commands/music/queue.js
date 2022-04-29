module.exports.run = (client, message, args) => {
    const queue = client.music.getQueue(message);

    if (!queue) return message.reply(client.translate.commands.queue.no_queue);

    const queueList = queue.songs.map((song, id) => id + ". " + song.name + " - `" + song.formattedDuration + "`").slice(1, 10).join("\n");
    const queuePreviousList = queue.previousSongs.map((song, id) => (id + 1) + ". " + song.name + " - `" + song.formattedDuration + "`").slice(0, 10).join("\n")
    const queueCreatedTimestamp = queue.createdTimestamp;
    const queueAuthorUid = queue.songs[0].user.id;
    const queueAuthorUsername = queue.songs[0].user.username;
    const queueAuthorAvatar = queue.songs[0].user.avatar;
    const avatarURL = "https://cdn.discordapp.com/avatars/" + queueAuthorUid + "/" + queueAuthorAvatar + ".webp";

    const musicCurrent = queue.songs[0].name;
    const musicURL = queue.songs[0].url;

    let durationLine;
    const duration = queue.songs[0].duration;
    const durationCurrent = queue.currentTime;
    const durationPercentage = Math.round((durationCurrent / duration) * 100);
    if (durationPercentage >= 0 && durationPercentage <= 5) durationLine = "🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 5 && durationPercentage <= 10) durationLine = "▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 10 && durationPercentage <= 15) durationLine = "▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 15 && durationPercentage <= 20) durationLine = "▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 20 && durationPercentage <= 25) durationLine = "▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 25 && durationPercentage <= 30) durationLine = "▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 30 && durationPercentage <= 35) durationLine = "▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 35 && durationPercentage <= 40) durationLine = "▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 40 && durationPercentage <= 45) durationLine = "▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 45 && durationPercentage <= 50) durationLine = "▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 50 && durationPercentage <= 55) durationLine = "▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 55 && durationPercentage <= 60) durationLine = "▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬";
    if (durationPercentage >= 60 && durationPercentage <= 65) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬";
    if (durationPercentage >= 65 && durationPercentage <= 70) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬";
    if (durationPercentage >= 70 && durationPercentage <= 75) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬";
    if (durationPercentage >= 75 && durationPercentage <= 80) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬";
    if (durationPercentage >= 80 && durationPercentage <= 85) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬";
    if (durationPercentage >= 85 && durationPercentage <= 90) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬";
    if (durationPercentage >= 90 && durationPercentage <= 95) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬";
    if (durationPercentage >= 95 && durationPercentage <= 100) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘";

    const durationFormat = queue.songs[0].formattedDuration;
    const durationCurrentFormat = queue.formattedCurrentTime;
    const durationCount = durationCurrentFormat + " / " + durationFormat + " - " + duration;

    const musicPaused = client.music.paused ? "▶" : "▐▐";
    const musicAction = " ◄◄⠀" + musicPaused + "⠀►► ";

    let musicControl;
    const musicVolume = queue.volume;
    if (musicVolume === 0) musicControl = "🔇 ○───";
    if (musicVolume >= 0 && musicVolume <= 30) musicControl = "🔈 ─○──";
    if (musicVolume >= 30 && musicVolume <= 70) musicControl = "🔉 ──○─";
    if (musicVolume >= 70 && musicVolume <= 100) musicControl = "🔊 ───○";
    
    const musicRepeat = queue.repeatMode === 0 ? "" : queue.repeatMode === 1 ? "🔁" : "🔂";

    const musicAutoplay = queue.autoplay ? "\n" + client.translate.commands.queue.autoplay : "";

    const musicFilter = queue.filter !== "clear" ? "\n" + client.translate.commands.queue.filter.replace("%s", queue.filter) : "";

    const musicDisplay = durationLine + "\n" + durationCount + " " + musicAction + " " + musicControl + " " + musicRepeat + musicAutoplay + musicFilter;

    message.channel.send({
        "embeds": [
            {
                "title": musicCurrent,
                "url": musicURL,
                "description": (queue.songs.length === 1) ? musicDisplay : musicDisplay + "\n\n" + client.translate.commands.queue.waiting_in_queue + "\n" + queueList + ((queue.previousSongs.length === 1) ? "\n\n" + client.translate.commands.queue.previous_queue + "\n" + queuePreviousList : ""),
                "color": 4886754,
                "timestamp": queueCreatedTimestamp,
                "footer": {
                    "iconURL": avatarURL,
                    "text": client.translate.commands.queue.owner_this_queue.replace("%s", queueAuthorUsername)
                }
            }
        ]
    });
};

module.exports.help = {
    "name": "queue",
    "description": "Check songs in the queue",
    "usage": "queue",
    "category": "music",
    "aliases": ["q", "คิว"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "queue",
            "th": "คิว"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Check songs in the queue",
            "th": "ตรวจสอบเพลงในคิว"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.queue.no_queue);

        const queueList = queue.songs.map((song, id) => id + ". " + song.name + " - `" + song.formattedDuration + "`").slice(1, 10).join("\n");
        const queuePreviousList = queue.previousSongs.map((song, id) => (id + 1) + ". " + song.name + " - `" + song.formattedDuration + "`").slice(0, 10).join("\n")
        const queueCreatedTimestamp = queue.createdTimestamp;
        const queueAuthorUid = queue.songs[0].user.id;
        const queueAuthorUsername = queue.songs[0].user.username;
        const queueAuthorAvatar = queue.songs[0].user.avatar;
        const avatarURL = "https://cdn.discordapp.com/avatars/" + queueAuthorUid + "/" + queueAuthorAvatar + ".webp";

        const musicCurrent = queue.songs[0].name;
        const musicURL = queue.songs[0].url;

        let durationLine;
        const duration = queue.songs[0].duration;
        const durationCurrent = queue.currentTime;
        const durationPercentage = Math.round((durationCurrent / duration) * 100);
        if (durationPercentage >= 0 && durationPercentage <= 5) durationLine = "🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
        if (durationPercentage >= 5 && durationPercentage <= 10) durationLine = "▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
        if (durationPercentage >= 10 && durationPercentage <= 15) durationLine = "▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
        if (durationPercentage >= 15 && durationPercentage <= 20) durationLine = "▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
        if (durationPercentage >= 20 && durationPercentage <= 25) durationLine = "▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
        if (durationPercentage >= 25 && durationPercentage <= 30) durationLine = "▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬▬";
        if (durationPercentage >= 30 && durationPercentage <= 35) durationLine = "▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬▬";
        if (durationPercentage >= 35 && durationPercentage <= 40) durationLine = "▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬▬";
        if (durationPercentage >= 40 && durationPercentage <= 45) durationLine = "▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬▬";
        if (durationPercentage >= 45 && durationPercentage <= 50) durationLine = "▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬▬";
        if (durationPercentage >= 50 && durationPercentage <= 55) durationLine = "▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬▬";
        if (durationPercentage >= 55 && durationPercentage <= 60) durationLine = "▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬▬";
        if (durationPercentage >= 60 && durationPercentage <= 65) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬▬";
        if (durationPercentage >= 65 && durationPercentage <= 70) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬▬";
        if (durationPercentage >= 70 && durationPercentage <= 75) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬▬";
        if (durationPercentage >= 75 && durationPercentage <= 80) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬▬";
        if (durationPercentage >= 80 && durationPercentage <= 85) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬▬";
        if (durationPercentage >= 85 && durationPercentage <= 90) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬▬";
        if (durationPercentage >= 90 && durationPercentage <= 95) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘▬";
        if (durationPercentage >= 95 && durationPercentage <= 100) durationLine = "▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬🔘";

        const durationFormat = queue.songs[0].formattedDuration;
        const durationCurrentFormat = queue.formattedCurrentTime;
        const durationCount = durationCurrentFormat + " / " + durationFormat + " - " + duration;

        const musicPaused = interaction.client.music.paused ? "▶" : "▐▐";
        const musicAction = " ◄◄⠀" + musicPaused + "⠀►► ";

        let musicControl;
        const musicVolume = queue.volume;
        if (musicVolume === 0) musicControl = "🔇 ○───";
        if (musicVolume >= 0 && musicVolume <= 30) musicControl = "🔈 ─○──";
        if (musicVolume >= 30 && musicVolume <= 70) musicControl = "🔉 ──○─";
        if (musicVolume >= 70 && musicVolume <= 100) musicControl = "🔊 ───○";

        const musicRepeat = queue.repeatMode === 0 ? "" : queue.repeatMode === 1 ? "🔁" : "🔂";

        const musicAutoplay = queue.autoplay ? "\n" + interaction.client.translate.commands.queue.autoplay : "";

        const musicFilter = queue.filter !== "clear" ? "\n" + interaction.client.translate.commands.queue.filter.replace("%s", queue.filter) : "";

        const musicDisplay = durationLine + "\n" + durationCount + " " + musicAction + " " + musicControl + " " + musicRepeat + musicAutoplay + musicFilter;

        await interaction.editReply({
            "embeds": [
                {
                    "title": musicCurrent,
                    "url": musicURL,
                    "description": (queue.songs.length === 1) ? musicDisplay : musicDisplay + "\n\n" + interaction.client.translate.commands.queue.waiting_in_queue + "\n" + queueList + ((queue.previousSongs.length === 1) ? "\n\n" + interaction.client.translate.commands.queue.previous_queue + "\n" + queuePreviousList : ""),
                    "color": 4886754,
                    "timestamp": queueCreatedTimestamp,
                    "footer": {
                        "iconURL": avatarURL,
                        "text": interaction.client.translate.commands.queue.owner_this_queue.replace("%s", queueAuthorUsername)
                    }
                }
            ]
        });
    }
};