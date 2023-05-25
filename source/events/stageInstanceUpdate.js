const { Events, EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { settingsData } = require("../utils/databaseUtils");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.StageInstanceUpdate,
    "once": false,
    execute(oldStageInstance, newStageInstance) {
        settingsData(newStageInstance.client, newStageInstance.guild);

        const guildRef = child(child(child(ref(getDatabase(), "projects"), IDConvertor(newStageInstance.client.user.username)), "guilds"), newStageInstance.guild.id);
        const channelRef = child(guildRef, "notification/stageInstanceUpdate");
        const channelSnapshot = newStageInstance.client.api.guilds[newStageInstance.guild.id].notification.stageInstanceUpdate;

        if (typeof channelSnapshot === "boolean") {
            const notification = newStageInstance.guild.channels.cache.find(channels => channels.id === channelSnapshot);
            const stageInstanceUpdate = new EmbedBuilder()
                .setTitle(newStageInstance.client.translate.events.stageInstanceUpdate.stage_notification)
                .setDescription(newStageInstance.client.translate.events.stageInstanceUpdate.stage_instance_update.replace("%s1", oldStageInstance.name).replace("%s2", newStageInstance.id))
                .setTimestamp()
                .setColor("Yellow");

            if (!notification) return;

            notification.send({ "embeds": [stageInstanceUpdate] });
        } else {
            set(channelRef, channelSnapshot ? true : false).then(() => module.exports.execute(oldStageInstance, newStageInstance));
        }
    }
};