const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, channel) => {
    if (client.mode === "start") {
        settingsData(client, channel.guild, module.exports, channel);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), channel.guild.id);
    const channelRef = child(guildRef, "notification/channelDelete");
    const channelSnapshot = client.api.guilds[channel.guild.id].notification.channelDelete;

    if (typeof channelSnapshot === "boolean") {
        const notification = channel.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const channelDeleteEmbed = new EmbedBuilder()
            .setTitle(client.translate.events.channelDelete.channel_notification)
            .setDescription(client.translate.events.channelDelete.member_delete_channel.replace("%s", channel.name))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [channelDeleteEmbed] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, channel));
    }
};