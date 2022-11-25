const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, invite) => {
    if (client.mode === "start") {
        settingsData(client, invite.guild, module.exports, invite);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), invite.guild.id);
    const channelRef = child(guildRef, "notification/inviteCreate");
    const channelSnapshot = client.api.guilds[invite.guild.id].notification.inviteCreate;

    if (typeof channelSnapshot === "boolean") {
        const notification = invite.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const inviteCreate = new EmbedBuilder()
            .setTitle(client.translate.events.inviteCreate.invite_notification)
            .setDescription(client.translate.events.inviteCreate.invite_create.replace("%s1", invite.url).replace("%s2", invite.expiresAt).replace("%s3", invite.maxUses).replace("%s4", invite.code))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [inviteCreate] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, invite));
    }
};