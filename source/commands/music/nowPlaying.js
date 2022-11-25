const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "name": "nowPlaying",
    "description": "Check the music that is currently playing.",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "nowPlaying",
    "aliases": ["nowplaying", "np", "กำลังเล่น"],
    async execute(client, message, args) {
        const queue = client.music.getQueue(message);

        if (!queue) return message.reply(client.translate.commands.nowPlaying.no_queue);

        const queueName = queue.songs[0].name;
        const queueAuthorUid = queue.songs[0].user.id;
        const queueAuthorUsername = queue.songs[0].user.username;
        const queueAuthorAvatar = queue.songs[0].user.avatar;
        const queueCreatedTimestamp = queue.createdTimestamp;
        const avatarURL = "https://cdn.discordapp.com/avatars/" + queueAuthorUid + "/" + queueAuthorAvatar + ".webp";

        const musicURL = queue.songs[0].url;
        const musicThumbnail = queue.songs[0].thumbnail;

        let durationLine;
        const duration = queue.songs[0].duration;
        const durationCurrent = Math.floor(queue.currentTime / 1000);
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
        const musicAction = "◄◄⠀" + musicPaused + "⠀►►";

        let musicControl;
        const musicVolume = queue.volume;
        if (musicVolume === 0) musicControl = "🔇 ○───";
        if (musicVolume >= 0 && musicVolume <= 30) musicControl = "🔈 ─○──";
        if (musicVolume >= 30 && musicVolume <= 70) musicControl = "🔉 ──○─";
        if (musicVolume >= 70 && musicVolume <= 100) musicControl = "🔊 ───○";

        const musicRepeat = queue.repeatMode ? queue.repeatMode === 2 ? "🔂" : "🔁" : "";

        const musicAutoplay = queue.autoplay ? "\n" + client.translate.commands.nowPlaying.autoplay : "";

        const musicFilter = queue.filters.names.length > 0 ? "\n" + client.translate.commands.nowPlaying.filter.replace("%s", queue.filters.names.join(", ")) : "";

        const musicDisplay = durationLine + "\n" + durationCount + " " + musicAction + " " + musicControl + " " + musicRepeat + musicAutoplay + musicFilter;

        const nowPlayingEmbed = new EmbedBuilder()
            .setTitle(queueName)
            .setURL(musicURL)
            .setDescription(musicDisplay)
            .setThumbnail(musicThumbnail)
            .setColor("Blue")
            .setTimestamp(queueCreatedTimestamp)
            .setFooter({ "text": client.translate.commands.nowPlaying.owner_this_queue.replace("%s", queueAuthorUsername), "iconURL": avatarURL });

        message.channel.send({
            "embeds": [nowPlayingEmbed]
        });
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
    "data": {
        "name": module.exports.name.toLowerCase(),
        "name_localizations": {
            "en-US": "nowplaying",
            "th": "กำลังเล่น"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Check the music that is currently playing.",
            "th": "ตรวจสอบเพลงที่กำลังเล่นอยู่"
        }
    },
    async execute(interaction) {
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.nowPlaying.no_queue);

        const queueName = queue.songs[0].name;
        const queueAuthorUid = queue.songs[0].user.id;
        const queueAuthorUsername = queue.songs[0].user.username;
        const queueAuthorAvatar = queue.songs[0].user.avatar;
        const queueCreatedTimestamp = queue.createdTimestamp;
        const avatarURL = "https://cdn.discordapp.com/avatars/" + queueAuthorUid + "/" + queueAuthorAvatar + ".webp";

        const musicURL = queue.songs[0].url;
        const musicThumbnail = queue.songs[0].thumbnail;

        let durationLine;
        const duration = queue.songs[0].duration;
        const durationCurrent = Math.floor(queue.currentTime / 1000);
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
        const musicAction = "◄◄⠀" + musicPaused + "⠀►►";

        let musicControl;
        const musicVolume = queue.volume;
        if (musicVolume === 0) musicControl = "🔇 ○───";
        if (musicVolume >= 0 && musicVolume <= 30) musicControl = "🔈 ─○──";
        if (musicVolume >= 30 && musicVolume <= 70) musicControl = "🔉 ──○─";
        if (musicVolume >= 70 && musicVolume <= 100) musicControl = "🔊 ───○";

        const musicRepeat = queue.repeatMode ? queue.repeatMode === 2 ? "🔂" : "🔁" : "";

        const musicAutoplay = queue.autoplay ? "\n" + interaction.client.translate.commands.nowPlaying.autoplay : "";

        const musicFilter = queue.filters.names.length > 0 ? "\n" + interaction.client.translate.commands.nowPlaying.filter.replace("%s", queue.filters.names.join(", ")) : "";

        const musicDisplay = durationLine + "\n" + durationCount + " " + musicAction + " " + musicControl + " " + musicRepeat + musicAutoplay + musicFilter;

        const nowPlayingEmbed = new EmbedBuilder()
            .setTitle(queueName)
            .setURL(musicURL)
            .setDescription(musicDisplay)
            .setThumbnail(musicThumbnail)
            .setColor("Blue")
            .setTimestamp(queueCreatedTimestamp)
            .setFooter({ "text": interaction.client.translate.commands.nowPlaying.owner_this_queue.replace("%s", queueAuthorUsername), "iconURL": avatarURL });

        await interaction.editReply({
            "embeds": [nowPlayingEmbed]
        });
    }
};