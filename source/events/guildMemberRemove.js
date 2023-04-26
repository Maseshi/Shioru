const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");

module.exports = {
    "name": Events.GuildMemberRemove,
    "once": false,
    async execute(member) {
        if (member.user.bot) return;
        if (member.client.mode === "start") {
            settingsData(member.client, member.guild);
        }

        const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), member.guild.id);
        const channelRef = child(guildRef, "notification/guildMemberRemove");
        const channelSnapshot = member.client.api.guilds[member.guild.id].notification.guildMemberRemove;

        if (typeof channelSnapshot === "boolean") {
            const notification = member.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const memberFetch = await member.user.fetch();
            const memberColor = memberFetch.accentColor;
            const memberTag = member.user.tag;
            const memberAvatar = member.user.displayAvatarURL();
            const guildMemberRemoveEmbed = new EmbedBuilder()
                .setTitle(memberTag)
                .setDescription(member.client.translate.events.guildMemberRemove.user_has_exited)
                .setTimestamp()
                .setColor(memberColor)
                .setThumbnail(memberAvatar);

            if (!notification) return;

            notification.send({ "embeds": [guildMemberRemoveEmbed] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(member));
        }
    }
};