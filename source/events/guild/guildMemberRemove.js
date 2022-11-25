const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = async (client, member) => {
    if (member.user.bot) return;
    if (client.mode === "start") {
        settingsData(client, member.guild, module.exports, member);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), member.guild.id);
    const channelRef = child(guildRef, "notification/guildMemberRemove");
    const channelSnapshot = client.api.guilds[member.guild.id].notification.guildMemberRemove;

    if (typeof channelSnapshot === "boolean") {
        const notification = member.guild.channels.cache.find(channels => channels.id === channelSnapshot);
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
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, member));
    }
};