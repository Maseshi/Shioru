const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");

module.exports = {
    "name": Events.ThreadUpdate,
    "once": false,
    execute(oldThread, newThread) {
        if (newThread.client.mode === "start") {
            settingsData(newThread.client, newThread.guild);
        }

        const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), newThread.guild.id);
        const channelRef = child(guildRef, "notification/threadUpdate");
        const channelSnapshot = newThread.client.api.guilds[newThread.guild.id].notification.threadUpdate;

        if (typeof channelSnapshot === "boolean") {
            const notification = newThread.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const threadUpdate = new EmbedBuilder()
                .setTitle(newThread.client.translate.events.threadUpdate.thread_notification)
                .setDescription(newThread.client.translate.events.threadUpdate.thread_update.replace("%s1", oldThread.name).replace("%s2", newThread.id))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [threadUpdate] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(oldThread, newThread));
        }
    }
};