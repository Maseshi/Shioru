const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.ChannelUpdate,
    "once": false,
    execute(oldChannel, newChannel) {
        settingsData(newChannel.client, newChannel.guild);

        const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(newChannel.client.user.username)), "guilds"), newChannel.guild.id);
        const channelRef = child(guildRef, "notification/channelUpdate");
        const channelSnapshot = newChannel.client.api.guilds[newChannel.guild.id].notification.channelUpdate;

        if (typeof channelSnapshot === "boolean") {
            const notification = newChannel.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const channelUpdate = new EmbedBuilder()
                .setTitle(newChannel.client.translate.events.channelUpdate.channel_notification)
                .setDescription(newChannel.client.translate.events.channelUpdate.member_update_channel.replace("%s1", oldChannel.name).replace("%s2", newChannel.id))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [channelUpdate] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(oldChannel, newChannel));
        }
    }
};