const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, members, guild, chunk) => {
    if (client.mode === "start") {
        settingsData(client, guild, module.exports, (members, guild, chunk));
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), guild.id);
    const channelRef = child(guildRef, "notification/guildMembersChunk");
    const channelSnapshot = client.api.guilds[guild.id].notification.guildMembersChunk;

    if (typeof channelSnapshot === "boolean") {
        const notification = guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const guildMembersChunk = new EmbedBuilder()
            .setTitle(client.translate.events.guildMembersChunk.guild_notification)
            .setDescription(client.translate.events.guildMembersChunk.guild_members_chunk.replace("%s", guild.name))
            .setImage(guild.bannerURL())
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [guildMembersChunk] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, members, guild, chunk));
    }
};