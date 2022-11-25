const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, guild) => {
    if (client.mode === "start") {
        settingsData(client, guild, module.exports, guild);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), guild.id);
    const channelRef = child(guildRef, "notification/guildIntegrationsUpdate");
    const channelSnapshot = client.api.guilds[guild.id].notification.guildIntegrationsUpdate;

    if (typeof channelSnapshot === "boolean") {
        const notification = guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const guildIntegrationsUpdate = new EmbedBuilder()
            .setTitle(client.translate.events.guildIntegrationsUpdate.guild_notification)
            .setDescription(client.translate.events.guildIntegrationsUpdate.guild_integrations_update.replace("%s", guild.name))
            .setImage(guild.bannerURL())
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [guildIntegrationsUpdate] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, guild));
    }
};