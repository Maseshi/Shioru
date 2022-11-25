const { EmbedBuilder, StickerFormatType } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, oldSticker, newSticker) => {
    if (client.mode === "start") {
        settingsData(client, newSticker.guild, module.exports, (oldSticker, newSticker));
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), newSticker.guild.id);
    const channelRef = child(guildRef, "notification/stickerUpdate");
    const channelSnapshot = client.api.guilds[newSticker.guild.id].notification.stickerUpdate;

    if (typeof channelSnapshot === "boolean") {
        const notification = newSticker.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const stickerUpdate = new EmbedBuilder()
            .setTitle(client.translate.events.stickerUpdate.sticker_notification)
            .setDescription(client.translate.events.stickerUpdate.sticker_update.replace("%s1", oldSticker.name).replace("%s2", newSticker.id))
            .setThumbnail(newSticker.format !== StickerFormatType.Lottie ? newSticker.url : "")
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [stickerUpdate] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, oldSticker, newSticker));
    }
};