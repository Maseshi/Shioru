const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, oldChannel, newChannel) => {
    if (client.mode === "start") {
        settingsData(client, newChannel.guild, module.exports, (oldChannel, newChannel));
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), newChannel.guild.id);
    const channelRef = child(guildRef, "notification/channelUpdate");
    const channelSnapshot = client.api.guilds[newChannel.guild.id].notification.channelUpdate;

    if (typeof channelSnapshot === "boolean") {
        const notification = newChannel.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const channelUpdate = new EmbedBuilder()
            .setTitle(client.translate.events.channelUpdate.channel_notification)
            .setDescription(client.translate.events.channelUpdate.member_update_channel.replace("%s1", oldChannel.name).replace("%s2", newChannel.id))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [channelUpdate] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, oldChannel, newChannel));
    }
};