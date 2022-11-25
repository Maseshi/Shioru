const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, channel) => {
    if (client.mode === "start") {
        settingsData(client, channel.guild, module.exports, channel);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), channel.guild.id);
    const channelRef = child(guildRef, "notification/channelCreate");
    const channelSnapshot = client.api.guilds[channel.guild.id].notification.channelCreate;

    if (typeof channelSnapshot === "boolean") {
        const notification = channel.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const channelCreateEmbed = new EmbedBuilder()
            .setTitle(client.translate.events.channelCreate.channel_notification)
            .setDescription(client.translate.events.channelCreate.member_create_channel.replace("%s", channel.id))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [channelCreateEmbed] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, channel));
    }
};