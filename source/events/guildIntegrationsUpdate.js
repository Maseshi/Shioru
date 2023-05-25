const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.GuildIntegrationsUpdate,
    "once": false,
    execute(guild) {
        settingsData(guild.client, guild);

        const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(guild.client.user.username)), "guilds"), guild.id);
        const channelRef = child(guildRef, "notification/guildIntegrationsUpdate");
        const channelSnapshot = guild.client.api.guilds[guild.id].notification.guildIntegrationsUpdate;

        if (typeof channelSnapshot === "boolean") {
            const notification = guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const guildIntegrationsUpdate = new EmbedBuilder()
                .setTitle(guild.client.translate.events.guildIntegrationsUpdate.guild_notification)
                .setDescription(guild.client.translate.events.guildIntegrationsUpdate.guild_integrations_update.replace("%s", guild.name))
                .setImage(guild.bannerURL())
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [guildIntegrationsUpdate] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(guild));
        }
    }
};