const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.WebhooksUpdate,
    "once": false,
    async execute(channel) {
        settingsData(channel.client, channel.guild);

        const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(channel.client.user.username)), "guilds"), channel.guild.id);
        const channelRef = child(guildRef, "notification/webhookUpdate");
        const channelSnapshot = channel.client.api.guilds[channel.guild.id].notification.webhookUpdate;

        if (typeof channelSnapshot === "boolean") {
            const notification = channel.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const hooks = await channel.fetchWebhooks();
            const webhookUpdate = new EmbedBuilder()
                .setTitle(channel.client.translate.events.webhookUpdate.webhook_notification)
                .setDescription(channel.client.translate.events.webhookUpdate.webhook_update.replace("%s1", hooks ? hooks.name : "Webhook").replace("%s2", hooks ? hooks.sourceGuild.name : "").replace("%s3", channel.id))
                .setThumbnail(hooks ? hooks.avatarURL() : "")
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [webhookUpdate] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(channel));
        }
    }
};