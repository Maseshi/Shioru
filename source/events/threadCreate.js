const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");

module.exports = {
    "name": Events.ThreadCreate,
    "once": false,
    execute(thread, newlyCreated) {
        if (thread.client.mode === "start") {
            settingsData(thread.client, thread.guild, module.exports);
        }

        const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), thread.guild.id);
        const channelRef = child(guildRef, "notification/threadCreate");
        const channelSnapshot = thread.client.api.guilds[thread.guild.id].notification.threadCreate;

        if (typeof channelSnapshot === "boolean") {
            const notification = thread.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const threadCreate = new EmbedBuilder()
                .setTitle(thread.client.translate.events.threadCreate.thread_notification)
                .setDescription(thread.client.translate.events.threadCreate.thread_create.replace("%s", thread.id))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;
            if (newlyCreated) notification.send({ "embeds": [threadCreate] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(thread, newlyCreated));
        }
    }
};