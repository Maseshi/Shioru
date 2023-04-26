const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");

module.exports = {
    "name": Events.ChannelPinsUpdate,
    "once": false,
    execute(channel, time) {
        if (channel.client.mode === "start") {
            settingsData(channel.client, channel.guild);
        }

        const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), channel.guild.id);
        const channelRef = child(guildRef, "notification/channelPinsUpdate");
        const channelSnapshot = channel.client.api.guilds[channel.guild.id].notification.channelPinsUpdate;

        if (typeof channelSnapshot === "boolean") {
            const notification = channel.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const channelPiusUpdateEmbed = new EmbedBuilder()
                .setTitle(channel.client.translate.events.channelPinsUpdate.channel_notification)
                .setDescription(channel.client.translate.events.channelPinsUpdate.member_pins_in_channel.replace("%s1", channel.id).replace("%s2", time))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [channelPiusUpdateEmbed] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(channel, time));
        }
    }
};