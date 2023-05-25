const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.GuildBanRemove,
    "once": false,
    execute(ban) {
        settingsData(ban.client, ban.guild);

        const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(ban.client.user.username)), "guilds"), ban.guild.id);
        const channelRef = child(guildRef, "notification/guildBanRemove");
        const channelSnapshot = ban.client.api.guilds[ban.guild.id].notification.guildBanRemove;

        if (typeof channelSnapshot === "boolean") {
            const notification = ban.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const guildBanRemoveEmbed = new EmbedBuilder()
                .setTitle(ban.client.translate.events.guildBanRemove.guild_notification)
                .setDescription(ban.client.translate.events.guildBanRemove.member_ban_remove.replace("%s1", ban.user.id).replace("%s2", ban.reason))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [guildBanRemoveEmbed] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(ban));
        }
    }
};