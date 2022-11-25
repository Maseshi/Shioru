const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, emoji) => {
    if (client.mode === "start") {
        settingsData(client, emoji.guild, module.exports, emoji);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), emoji.guild.id);
    const channelRef = child(guildRef, "notification/emojiCreate");
    const channelSnapshot = client.api.guilds[emoji.guild.id].notification.emojiCreate;

    if (typeof channelSnapshot === "boolean") {
        const notification = emoji.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const emojiCreateEmbed = new EmbedBuilder()
            .setTitle(client.translate.events.emojiCreate.emoji_notification)
            .setDescription(client.translate.events.emojiCreate.member_create_emoji.replace("%s", emoji.name))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [emojiCreateEmbed] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, emoji));
    }
};