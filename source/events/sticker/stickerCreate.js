const { EmbedBuilder, StickerFormatType } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, sticker) => {
    if (client.mode === "start") {
        settingsData(client, sticker.guild, module.exports, sticker);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), sticker.guild.id);
    const channelRef = child(guildRef, "notification/stickerCreate");
    const channelSnapshot = client.api.guilds[sticker.guild.id].notification.stickerCreate;

    if (typeof channelSnapshot === "boolean") {
        const notification = sticker.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const stickerCreate = new EmbedBuilder()
            .setTitle(client.translate.events.stickerCreate.sticker_notification)
            .setDescription(client.translate.events.stickerCreate.sticker_create.replace("%s", sticker.name))
            .setThumbnail(sticker.format !== StickerFormatType.Lottie ? sticker.url : "")
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [stickerCreate] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, sticker));
    }
};