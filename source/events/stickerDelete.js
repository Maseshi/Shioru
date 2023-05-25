const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.GuildStickerDelete,
    "once": false,
    execute(sticker) {
        settingsData(sticker.client, sticker.guild);

        const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(sticker.client.user.username)), "guilds"), sticker.guild.id);
        const channelRef = child(guildRef, "notification/stickerDelete");
        const channelSnapshot = sticker.client.api.guilds[sticker.guild.id].notification.stickerDelete;

        if (typeof channelSnapshot === "boolean") {
            const notification = sticker.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const stickerDelete = new EmbedBuilder()
                .setTitle(sticker.client.translate.events.stickerDelete.sticker_notification)
                .setDescription(sticker.client.translate.events.stickerDelete.sticker_delete.replace("%s", sticker.name))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [stickerDelete] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(sticker));
        }
    }
};