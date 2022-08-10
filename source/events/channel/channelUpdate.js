const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, get, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");
const { catchError } = require("../../utils/consoleUtils");

module.exports = (client, oldChannel, newChannel) => {
    if (client.mode === "start") {
        settingsData(client, newChannel.guild, module.exports, (oldChannel, newChannel));
        if (client.temp.set !== 1) return;
    }

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), newChannel.guild.id);
    const channelRef = child(childRef, "config/notification/channelUpdate");

    get(channelRef).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val();

            if (notifyId) {
                const notification = newChannel.guild.channels.cache.find(channels => channels.id === notifyId);
                const channelUpdate = new EmbedBuilder()
                    .setTitle(client.translate.events.channelUpdate.system_notification)
                    .setDescription(client.translate.events.channelUpdate.member_update_channel.replace("%s1", oldChannel.name).replace("%s2", newChannel.id))
                    .setTimestamp()
                    .setColor("Yellow");

                if (!notification) return;

                notification.send({ "embeds": [channelUpdate] });
            }
        } else {
            set(channelRef, false).then(() => {
                module.exports(client, oldChannel, newChannel);
            });
        }
    }).catch((error) => {
        catchError(client, newChannel, "channelUpdate", error);
    });
};