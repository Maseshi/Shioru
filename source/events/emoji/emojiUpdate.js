const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, oldEmoji, newEmoji) => {
    if (client.mode === "start") {
        settingsData(client, newEmoji.guild, module.exports, (oldEmoji, newEmoji));
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), newEmoji.guild.id);
    const channelRef = child(guildRef, "notification/emojiUpdate");
    const channelSnapshot = client.api.guilds[newEmoji.guild.id].notification.emojiUpdate;

    if (typeof channelSnapshot === "boolean") {
        const notification = newEmoji.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const emojiUpdateEmbed = new EmbedBuilder()
            .setTitle(client.translate.events.emojiUpdate.emoji_notification)
            .setDescription(client.translate.events.emojiUpdate.member_update_emoji.replace("%s1", oldEmoji.name).replace("%s2", newEmoji.name))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [emojiUpdateEmbed] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, oldEmoji, newEmoji));
    }
};