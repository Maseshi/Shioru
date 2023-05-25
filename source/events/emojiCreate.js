const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.GuildEmojiCreate,
    "once": false,
    execute(emoji) {
        settingsData(emoji.client, emoji.guild);

        const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(emoji.client.user.username)), "guilds"), emoji.guild.id);
        const channelRef = child(guildRef, "notification/emojiCreate");
        const channelSnapshot = emoji.client.api.guilds[emoji.guild.id].notification.emojiCreate;

        if (typeof channelSnapshot === "boolean") {
            const notification = emoji.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const emojiCreateEmbed = new EmbedBuilder()
                .setTitle(emoji.client.translate.events.emojiCreate.emoji_notification)
                .setDescription(emoji.client.translate.events.emojiCreate.member_create_emoji.replace("%s", emoji.name))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [emojiCreateEmbed] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(emoji));
        }
    }
};