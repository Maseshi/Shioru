const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, thread, newlyCreated) => {
    if (client.mode === "start") {
        settingsData(client, thread.guild, module.exports, (thread, newlyCreated));
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), thread.guild.id);
    const channelRef = child(guildRef, "notification/threadCreate");
    const channelSnapshot = client.api.guilds[thread.guild.id].notification.threadCreate;

    if (typeof channelSnapshot === "boolean") {
        const notification = thread.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const threadCreate = new EmbedBuilder()
            .setTitle(client.translate.events.threadCreate.thread_notification)
            .setDescription(client.translate.events.threadCreate.thread_create.replace("%s", thread.id))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;
        if (newlyCreated) notification.send({ "embeds": [threadCreate] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, thread, newlyCreated));
    }
};