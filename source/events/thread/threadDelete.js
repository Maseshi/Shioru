const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, thread) => {
    if (client.mode === "start") {
        settingsData(client, thread.guild, module.exports, thread);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), thread.guild.id);
    const channelRef = child(guildRef, "notification/threadDelete");
    const channelSnapshot = client.api.guilds[thread.guild.id].notification.threadDelete;

    if (typeof channelSnapshot === "boolean") {
        const notification = thread.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const threadDelete = new EmbedBuilder()
            .setTitle(client.translate.events.threadDelete.thread_notification)
            .setDescription(client.translate.events.threadDelete.thread_delete.replace("%s", thread.name))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [threadDelete] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, thread));
    }
};