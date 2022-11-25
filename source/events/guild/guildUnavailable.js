const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, guild) => {
    if (client.mode === "start") {
        settingsData(client, guild, module.exports, guild);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), guild.id);
    const channelRef = child(guildRef, "notification/guildUnavailable");
    const channelSnapshot = client.api.guilds[guild.id].notification.guildUnavailable;

    if (typeof channelSnapshot === "boolean") {
        const notification = guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const guildUnavailable = new EmbedBuilder()
            .setTitle(client.translate.events.guildUnavailable.guild_notification)
            .setDescription(client.translate.events.guildMembersChunk.guild_unavailable)
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [guildUnavailable] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, guild));
    }
};