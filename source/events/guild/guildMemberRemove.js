const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, get, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");
const { catchError } = require("../../utils/consoleUtils");

module.exports = (client, member) => {
    if (member.user.bot) return;
    if (client.mode === "start") {
        settingsData(client, member.guild, module.exports, member);
        if (client.temp.set !== 1) return;
    }

	const db = getDatabase();
	const childRef = child(ref(db, "Shioru/apps/discord/guilds"), member.guild.id);
    const channelRef = child(childRef, "config/notification/guildMemberRemove");

	get(channelRef).then(async snapshot => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val();

            if (notifyId) {
				const notification = member.guild.channels.cache.find(channels => channels.id === notifyId);
                const memberFetch = await member.user.fetch();
                const memberColor = memberFetch.accentColor;
                const memberTag = member.user.tag;
                const memberAvatar = member.user.displayAvatarURL();
                const guildMemberRemoveEmbed = new EmbedBuilder()
                    .setTitle(memberTag)
                    .setDescription(client.translate.events.guildMemberRemove.user_has_exited)
                    .setTimestamp()
                    .setColor(memberColor)
                    .setThumbnail(memberAvatar);

                if (!notification) return;

				notification.send({ "embeds": [guildMemberRemoveEmbed] });
            }
        } else {
            set(channelRef, false).then(() => {
                module.exports(client, member);
            });
        }
    }).catch((error) => {
        catchError(client, member.guild.systemChannel, "guildMemberRemove", error);
    });
};