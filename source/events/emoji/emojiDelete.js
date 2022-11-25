const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, emoji) => {
    if (client.mode === "start") {
        settingsData(client, emoji.guild, module.exports, emoji);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), emoji.guild.id);
    const channelRef = child(guildRef, "notification/emojiDelete");
    const channelSnapshot = client.api.guilds[emoji.guild.id].notification.emojiDelete;

    if (typeof channelSnapshot === "boolean") {
        const notification = emoji.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const emojiDeleteEmbed = new EmbedBuilder()
            .setTitle(client.translate.events.emojiDelete.emoji_notification)
            .setDescription(client.translate.events.emojiDelete.member_delete_emoji.replace("%s", emoji.name))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [emojiDeleteEmbed] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, emoji));
    }
};