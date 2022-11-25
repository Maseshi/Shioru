const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, channel, time) => {
    if (client.mode === "start") {
        settingsData(client, channel.guild, module.exports, (channel, time));
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), channel.guild.id);
    const channelRef = child(guildRef, "notification/channelPinsUpdate");
    const channelSnapshot = client.api.guilds[channel.guild.id].notification.channelPinsUpdate;

    if (typeof channelSnapshot === "boolean") {
        const notification = channel.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const channelPiusUpdateEmbed = new EmbedBuilder()
            .setTitle(client.translate.events.channelPinsUpdate.channel_notification)
            .setDescription(client.translate.events.channelPinsUpdate.member_pins_in_channel.replace("%s1", channel.id).replace("%s2", time))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [channelPiusUpdateEmbed] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, channel, time));
    }
};