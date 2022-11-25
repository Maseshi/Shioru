const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, role) => {
    if (client.mode === "start") {
        settingsData(client, role.guild, module.exports, role);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), role.guild.id);
    const channelRef = child(guildRef, "notification/roleDelete");
    const channelSnapshot = client.api.guilds[role.guild.id].notification.roleDelete;

    if (typeof channelSnapshot === "boolean") {
        const notification = role.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const roleDelete = new EmbedBuilder()
            .setTitle(client.translate.events.roleDelete.role_notification)
            .setDescription(client.translate.events.roleDelete.role_delete.replace("%s", role.name))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [roleDelete] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, role));
    }
};