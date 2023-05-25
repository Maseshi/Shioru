const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.GuildBanAdd,
    "once": false,
    execute(ban) {
        settingsData(ban.client, ban.guild);

        const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(ban.client.user.username)), "guilds"), ban.guild.id);
        const channelRef = child(guildRef, "notification/guildBanAdd");
        const channelSnapshot = ban.client.api.guilds[ban.guild.id].notification.guildBanAdd;

        if (typeof channelSnapshot === "boolean") {
            const notification = ban.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const guildBanAddEmbed = new EmbedBuilder()
                .setTitle(ban.client.translate.events.guildBanAdd.guild_notification)
                .setDescription(ban.client.translate.events.guildBanAdd.member_ban_add.replace("%s1", ban.user.id).replace("%s2", ban.reason))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [guildBanAddEmbed] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(ban));
        }
    }
};