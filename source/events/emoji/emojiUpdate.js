const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, get, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");
const { catchError } = require("../../utils/consoleUtils");

module.exports = (client, oldEmoji, newEmoji) => {
    if (client.mode === "start") {
        settingsData(client, newEmoji.guild, module.exports, (oldEmoji, newEmoji));
        if (client.temp.set !== 1) return;
    }

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), emoji.guild.id);
    const channelRef = child(childRef, "config/notification/emojiUpdate");

    get(channelRef).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val();

            if (notifyId) {
                const notification = newEmoji.guild.channels.cache.find(channels => channels.id === notifyId);
                const emojiUpdateEmbed = new EmbedBuilder()
                    .setTitle(client.translate.events.emojiUpdate.system_notification)
                    .setDescription(client.translate.events.emojiUpdate.member_update_emoji.replace("%s1", oldEmoji.name).replace("%s2", newEmoji.name))
                    .setTimestamp()
                    .setColor("Yellow");

                if (!notification) return;

                notification.send({ "embeds": [emojiUpdateEmbed] });
            }
        } else {
            set(channelRef, false).then(() => {
                module.exports(client, oldEmoji, newEmoji);
            });
        }
    }).catch((error) => {
        catchError(client, newEmoji.guild.systemChannel, "emojiUpdate", error);
    });
};