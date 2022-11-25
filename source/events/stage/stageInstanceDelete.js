const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../../utils/databaseUtils");

module.exports = (client, stageInstance) => {
    if (client.mode === "start") {
        settingsData(client, stageInstance.guild, module.exports, stageInstance);
        if (client.temp.set !== 1) return;
    }

    const guildRef = child(ref(getDatabase(), "projects/shioru/guilds"), stageInstance.guild.id);
    const channelRef = child(guildRef, "notification/stageInstanceDelete");
    const channelSnapshot = client.api.guilds[stageInstance.guild.id].notification.stageInstanceDelete;

    if (typeof channelSnapshot === "boolean") {
        const notification = stageInstance.guild.channels.cache.find(channels => channels.id === channelSnapshot);
        const stageInstanceDelete = new EmbedBuilder()
            .setTitle(client.translate.events.stageInstanceDelete.stage_notification)
            .setDescription(client.translate.events.stageInstanceDelete.stage_instance_delete.replace("%s", stageInstance.name))
            .setTimestamp()
            .setColor("Yellow");

        if (!notification) return;

        notification.send({ "embeds": [stageInstanceDelete] });
    } else {
        set(channelRef, channelSnapshot ? true : false).then(() => module.exports(client, stageInstance));
    }
};