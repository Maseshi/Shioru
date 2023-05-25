const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.StageInstanceCreate,
    "once": false,
    execute(stageInstance) {
        settingsData(stageInstance.client, stageInstance.guild);

        const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(stageInstance.client.user.username)), "guilds"), stageInstance.guild.id);
        const channelRef = child(guildRef, "notification/stageInstanceCreate");
        const channelSnapshot = stageInstance.client.api.guilds[stageInstance.guild.id].notification.stageInstanceCreate;

        if (typeof channelSnapshot === "boolean") {
            const notification = stageInstance.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const stageInstanceCreate = new EmbedBuilder()
                .setTitle(stageInstance.client.translate.events.stageInstanceCreate.stage_notification)
                .setDescription(stageInstance.client.translate.events.stageInstanceCreate.stage_instance_create.replace("%s", stageInstance.id))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [stageInstanceCreate] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(stageInstance));
        }
    }
};