const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");

module.exports = {
    "name": Events.ChannelCreate,
    "once": false,
    execute(channel) {
        if (channel.client.mode === "start") {
            settingsData(channel.client, channel.guild);
        }
    
        const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), channel.guild.id);
        const channelRef = child(guildRef, "notification/channelCreate");
        const channelSnapshot = channel.client.api.guilds[channel.guild.id].notification.channelCreate;
    
        if (typeof channelSnapshot === "boolean") {
            const notification = channel.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const channelCreateEmbed = new EmbedBuilder()
                .setTitle(channel.client.translate.events.channelCreate.channel_notification)
                .setDescription(channel.client.translate.events.channelCreate.member_create_channel.replace("%s", channel.id))
                .setTimestamp()
                .setColor("Yellow");
    
            if (!notification) return;
    
            notification.send({ "embeds": [channelCreateEmbed] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(channel));
        }
    }
};