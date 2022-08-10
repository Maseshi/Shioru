const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, get, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");
const { catchError } = require("../../utils/consoleUtils");

module.exports = (client, channel) => {
    if (client.mode === "start") {
        settingsData(client, channel.guild, module.exports, channel);
        if (client.temp.set !== 1) return;
    }

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), channel.guild.id);
    const channelRef = child(childRef, "config/notification/channelDelete");

    get(channelRef).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val();

            if (notifyId) {
                const notification = channel.guild.channels.cache.find(channels => channels.id === notifyId);
                const channelDeleteEmbed = new EmbedBuilder()
                    .setTitle(client.translate.events.channelDelete.system_notification)
                    .setDescription(client.translate.events.channelDelete.member_delete_channel.replace("%s", channel.name))
                    .setTimestamp()
                    .setColor("Yellow");

                if (!notification) return;

                notification.send({ "embeds": [channelDeleteEmbed] });
            }
        } else {
            set(channelRef, false).then(() => {
                module.exports(client, channel);
            });
        }
    }).catch((error) => {
		catchError(client, channel, "channelDelete", error);
	});
};