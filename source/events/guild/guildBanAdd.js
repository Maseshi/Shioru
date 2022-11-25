const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, ban) => {
    if (client.mode === "start") {
        settingsData(client, ban.guild, module.exports, ban);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), ban.guild.id);
    const channelRef = child(guildRef, "notification/guildBanAdd");
    const channelSnapshot = client.api.guilds[ban.guild.id].notification.guildBanAdd;

    if (typeof channelSnapshot === "boolean") {
        const notification = ban.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const guildBanAddEmbed = new EmbedBuilder()
            .setTitle(client.translate.events.guildBanAdd.guild_notification)
            .setDescription(client.translate.events.guildBanAdd.member_ban_add.replace("%s1", ban.user.id).replace("%s2", ban.reason))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [guildBanAddEmbed] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, ban));
    }
};