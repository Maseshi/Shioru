const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");

module.exports = {
    "name": Events.GuildMembersChunk,
    "once": false,
    execute(members, guild, chunk) {
        if (guild.client.mode === "start") {
            settingsData(guild.client, guild);
        }

        const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), guild.id);
        const channelRef = child(guildRef, "notification/guildMembersChunk");
        const channelSnapshot = guild.client.api.guilds[guild.id].notification.guildMembersChunk;

        if (typeof channelSnapshot === "boolean") {
            const notification = guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const guildMembersChunk = new EmbedBuilder()
                .setTitle(guild.client.translate.events.guildMembersChunk.guild_notification)
                .setDescription(guild.client.translate.events.guildMembersChunk.guild_members_chunk.replace("%s", guild.name))
                .setImage(guild.bannerURL())
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [guildMembersChunk] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(members, guild, chunk));
        }
    }
};