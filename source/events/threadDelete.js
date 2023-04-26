const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");

module.exports = {
    "name": Events.ThreadDelete,
    "once": false,
    execute(thread) {
        if (thread.client.mode === "start") {
            settingsData(thread.client, thread.guild);
        }

        const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), thread.guild.id);
        const channelRef = child(guildRef, "notification/threadDelete");
        const channelSnapshot = thread.client.api.guilds[thread.guild.id].notification.threadDelete;

        if (typeof channelSnapshot === "boolean") {
            const notification = thread.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const threadDelete = new EmbedBuilder()
                .setTitle(thread.client.translate.events.threadDelete.thread_notification)
                .setDescription(thread.client.translate.events.threadDelete.thread_delete.replace("%s", thread.name))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [threadDelete] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(thread));
        }
    }
};