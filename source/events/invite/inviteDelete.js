const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, invite) => {
    if (client.mode === "start") {
        settingsData(client, invite.guild, module.exports, invite);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), invite.guild.id);
    const channelRef = child(guildRef, "notification/inviteDelete");
    const channelSnapshot = client.api.guilds[invite.guild.id].notification.inviteDelete;

    if (typeof channelSnapshot === "boolean") {
        const notification = invite.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const inviteDelete = new EmbedBuilder()
            .setTitle(client.translate.events.inviteDelete.invite_notification)
            .setDescription(new Date() !== new Date(invite.expiresAt) ? client.translate.events.inviteDelete.invite_code_deleted.replace("%s", invite.code) : client.translate.events.inviteDelete.expires.replace("%s", invite.code))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [inviteDelete] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, invite));
    }
};