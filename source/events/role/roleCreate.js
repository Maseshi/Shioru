const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, role) => {
    if (client.mode === "start") {
        settingsData(client, role.guild, module.exports, role);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), role.guild.id);
    const channelRef = child(guildRef, "notification/roleCreate");
    const channelSnapshot = client.api.guilds[role.guild.id].notification.roleCreate;

    if (typeof channelSnapshot === "boolean") {
        const notification = role.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const roleCreate = new EmbedBuilder()
            .setTitle(client.translate.events.roleCreate.role_notification)
            .setDescription(client.translate.events.roleCreate.role_create.replace("%s", role.id))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [roleCreate] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, role));
    }
};