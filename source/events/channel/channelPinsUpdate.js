const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, get, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");
const { catchError } = require("../../utils/consoleUtils");

module.exports = (client, channel, time) => {
    if (client.mode === "start") {
        settingsData(client, channel.guild, module.exports, (channel, time));
        if (client.temp.set !== 1) return;
    }

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), channel.guild.id);
    const channelRef = child(childRef, "config/notification/channelPinsUpdate");

    get(channelRef).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val();

            if (notifyId) {
                const notification = channel.guild.channels.cache.find(channels => channels.id === notifyId);
                const channelPiusUpdateEmbed = new EmbedBuilder()
                    .setTitle(client.translate.events.channelPinsUpdate.system_notification)
                    .setDescription(client.translate.events.channelPinsUpdate.member_pins_in_channel.replace("%s1", channel.id).replace("%s2", time))
                    .setTimestamp()
                    .setColor("Yellow");

                if (!notification) return;

                notification.send({ "embeds": [channelPiusUpdateEmbed] });
            }
        } else {
            set(channelRef, false).then(() => {
                module.exports(client, channel, time);
            });
        }
    }).catch((error) => {
        catchError(client, channel, "channelPinsUpdate", error);
    });
};