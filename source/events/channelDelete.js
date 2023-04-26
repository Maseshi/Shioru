const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");

module.exports = {
    "name": Events.ChannelDelete,
    "once": false,
    execute(channel) {
        if (channel.client.mode === "start") {
            settingsData(channel.client, channel.guild);
        }

        const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), channel.guild.id);
        const channelRef = child(guildRef, "notification/channelDelete");
        const channelSnapshot = channel.client.api.guilds[channel.guild.id].notification.channelDelete;

        if (typeof channelSnapshot === "boolean") {
            const notification = channel.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const channelDeleteEmbed = new EmbedBuilder()
                .setTitle(channel.client.translate.events.channelDelete.channel_notification)
                .setDescription(channel.client.translate.events.channelDelete.member_delete_channel.replace("%s", channel.name))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [channelDeleteEmbed] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(channel));
        }
    }
};