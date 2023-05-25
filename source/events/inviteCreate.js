const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.InviteCreate,
    "once": false,
    execute(invite) {
        settingsData(invite.client, invite.guild);

        const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(invite.client.user.username)), "guilds"), invite.guild.id);
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