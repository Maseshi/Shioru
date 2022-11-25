const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, oldRole, newRole) => {
    if (client.mode === "start") {
        settingsData(client, newRole.guild, module.exports, (oldRole, newRole));
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), newRole.guild.id);
    const channelRef = child(guildRef, "notification/roleUpdate");
    const channelSnapshot = client.api.guilds[newRole.guild.id].notification.roleUpdate;

    if (typeof channelSnapshot === "boolean") {
        const notification = newRole.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const roleUpdate = new EmbedBuilder()
            .setTitle(client.translate.events.roleUpdate.role_notification)
            .setDescription(client.translate.events.roleUpdate.role_update.replace("%s1", oldRole.name).replace("%s2", newRole.id))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [roleUpdate] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, oldRole, newRole));
    }
};