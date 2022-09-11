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
    const channelRef = child(childRef, "config/notification/guildMemberAdd");

	get(channelRef).then(async snapshot => {
        if (snapshot.exists()) {
            const notifyId = snapshot.val();

            if (notifyId) {
				const notification = member.guild.channels.cache.find(channels => channels.id === notifyId);
                const memberFetch = await member.user.fetch();
                const memberColor = memberFetch.accentColor;
                const memberTag = member.user.tag;
                const memberAvatar = member.user.displayAvatarURL();
                const guildMemberAddEmbed = new EmbedBuilder()
                    .setTitle(memberTag)
                    .setDescription(client.translate.events.guildMemberAdd.greet)
                    .setTimestamp()
                    .setColor(memberColor)
                    .setThumbnail(memberAvatar)
                    .setAuthor({ "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/video-game_1f3ae.png", "name": client.translate.events.guildMemberAdd.welcome });

                if (!notification) return;

                notification.send({ "embeds": [guildMemberAddEmbed] });
            }
        } else {
            set(channelRef, false).then(() => {
                module.exports(client, member);
            });
        }
    }).catch((error) => {
        catchError(client, member.guild.systemChannel, "guildMemberAdd", error);
    });
};