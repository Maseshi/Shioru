const { Events, EmbedBuilder, StickerFormatType } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.GuildStickerUpdate,
    "once": false,
    execute(oldSticker, newSticker) {
        settingsData(newSticker.client, newSticker.guild);

        const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(newSticker.client.user.username)), "guilds"), newSticker.guild.id);
        const channelRef = child(guildRef, "notification/stickerUpdate");
        const channelSnapshot = newSticker.client.api.guilds[newSticker.guild.id].notification.stickerUpdate;

        if (typeof channelSnapshot === "boolean") {
            const notification = newSticker.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const stickerUpdate = new EmbedBuilder()
                .setTitle(newSticker.client.translate.events.stickerUpdate.sticker_notification)
                .setDescription(newSticker.client.translate.events.stickerUpdate.sticker_update.replace("%s1", oldSticker.name).replace("%s2", newSticker.id))
                .setThumbnail(newSticker.format !== StickerFormatType.Lottie ? newSticker.url : "")
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [stickerUpdate] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(oldSticker, newSticker));
        }
    }
};