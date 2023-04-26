const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");

module.exports = {
    "name": Events.GuildUnavailable,
    "once": false,
    execute(guild) {
        if (guild.client.mode === "start") {
            settingsData(guild.client, guild);
        }

        const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), guild.id);
        const channelRef = child(guildRef, "notification/guildUnavailable");
        const channelSnapshot = guild.client.api.guilds[guild.id].notification.guildUnavailable;

        if (typeof channelSnapshot === "boolean") {
            const notification = guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const guildUnavailable = new EmbedBuilder()
                .setTitle(guild.client.translate.events.guildUnavailable.guild_notification)
                .setDescription(guild.client.translate.events.guildMembersChunk.guild_unavailable)
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [guildUnavailable] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(guild));
        }
    }
};