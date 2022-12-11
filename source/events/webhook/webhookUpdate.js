const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = async (client, channel) => {
    if (client.mode === "start") {
        settingsData(client, channel.guild, module.exports, channel);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), channel.guild.id);
    const channelRef = child(guildRef, "notification/webhookUpdate");
    const channelSnapshot = client.api.guilds[channel.guild.id].notification.webhookUpdate;

    if (typeof channelSnapshot === "boolean") {
        const notification = channel.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const hooks = await channel.fetchWebhooks();
        const webhookUpdate = new EmbedBuilder()
            .setTitle(client.translate.events.webhookUpdate.webhook_notification)
            .setDescription(client.translate.events.webhookUpdate.webhook_update.replace("%s1", hooks.name ? hooks.name : "Webhook").replace("%s2", hooks.sourceGuild.name).replace("%s3", channel.id))
            .setThumbnail(hooks.avatarURL())
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [webhookUpdate] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, channel));
    }
};