const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");

module.exports = {
    "name": Events.GuildEmojiUpdate,
    "once": false,
    execute(oldEmoji, newEmoji) {
        if (newEmoji.client.mode === "start") {
            settingsData(newEmoji.client, newEmoji.guild);
        }

        const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), newEmoji.guild.id);
        const channelRef = child(guildRef, "notification/emojiUpdate");
        const channelSnapshot = newEmoji.client.api.guilds[newEmoji.guild.id].notification.emojiUpdate;

        if (typeof channelSnapshot === "boolean") {
            const notification = newEmoji.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const emojiUpdateEmbed = new EmbedBuilder()
                .setTitle(newEmoji.client.translate.events.emojiUpdate.emoji_notification)
                .setDescription(newEmoji.client.translate.events.emojiUpdate.member_update_emoji.replace("%s1", oldEmoji.name).replace("%s2", newEmoji.name))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [emojiUpdateEmbed] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(oldEmoji, newEmoji));
        }
    }
};