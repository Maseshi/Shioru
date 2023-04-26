const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");

module.exports = {
    "name": Events.InviteCreate,
    "once": false,
    execute(invite) {
        if (invite.client.mode === "start") {
            settingsData(invite.client, invite.guild);
        }

        const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), invite.guild.id);
        const channelRef = child(guildRef, "notification/inviteCreate");
        const channelSnapshot = invite.client.api.guilds[invite.guild.id].notification.inviteCreate;

        if (typeof channelSnapshot === "boolean") {
            const notification = invite.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const inviteCreate = new EmbedBuilder()
                .setTitle(invite.client.translate.events.inviteCreate.invite_notification)
                .setDescription(invite.client.translate.events.inviteCreate.invite_create.replace("%s1", invite.url).replace("%s2", invite.expiresAt).replace("%s3", invite.maxUses).replace("%s4", invite.code))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [inviteCreate] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(invite));
        }
    }
};