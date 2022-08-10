const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, get, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");
const { catchError } = require("../../utils/consoleUtils");

module.exports = (client, ban) => {
    if (client.mode === "start") {
        settingsData(client, ban.guild, module.exports, ban);
        if (client.temp.set !== 1) return;
    }

	const db = getDatabase();
	const childRef = child(ref(db, "Shioru/apps/discord/guilds"), ban.guild.id);
    const channelRef = child(childRef, "config/notification/guildBanAdd");

	get(channelRef).then((snapshot) => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val();

            if (notifyId) {
				const notification = ban.guild.channels.cache.find(channels => channels.id === notifyId);
                const guildBanAddEmbed = new EmbedBuilder()
                    .setTitle(client.translate.events.guildBanAdd.system_notification)
                    .setDescription(client.translate.events.guildBanAdd.member_ban_add.replace("%s1", ban.user.id).replace("%s2", ban.reason))
                    .setTimestamp()
                    .setColor("Yellow");

                if (!notification) return;

				notification.send({ "embeds": [guildBanAddEmbed] });
            }
        } else {
            set(channelRef, false).then(() => {
                module.exports(client, ban);
            });
        }
    }).catch((error) => {
        catchError(client, ban.guild.systemChannel, "guildBanAdd", error);
    });
};