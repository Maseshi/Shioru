const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.InviteDelete,
    "once": false,
    execute(invite) {
        settingsData(invite.client, invite.guild);

        const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(invite.client.user.username)), "guilds"), invite.guild.id);
        const channelRef = child(guildRef, "notification/inviteDelete");
        const channelSnapshot = invite.client.api.guilds[invite.guild.id].notification.inviteDelete;

        if (typeof channelSnapshot === "boolean") {
            const notification = invite.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const inviteDelete = new EmbedBuilder()
                .setTitle(invite.client.translate.events.inviteDelete.invite_notification)
                .setDescription(new Date() !== new Date(invite.expiresAt) ? invite.client.translate.events.inviteDelete.invite_code_deleted.replace("%s", invite.code) : invite.client.translate.events.inviteDelete.expires.replace("%s", invite.code))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [inviteDelete] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(invite));
        }
    }
};