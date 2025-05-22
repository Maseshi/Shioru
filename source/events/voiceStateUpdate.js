const { Events, EmbedBuilder } = require("discord.js");
const { isVoiceChannelEmpty } = require("distube");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");

module.exports = {
  name: Events.VoiceStateUpdate,
  once: false,
  async execute(oldState, newState) {
    const voiceStateUpdateEmbed = new EmbedBuilder()
      .setTitle(
        newState.client.i18n.t("events.voiceStateUpdate.voice_notification"),
      )
      .setDescription(
        newState.client.i18n.t("events.voiceStateUpdate.voice_update", {
          oldState: oldState.name,
          newState: newState.id,
        }),
      )
      .setTimestamp()
      .setColor("Yellow");

    await initializeData(newState.client, newState.guild);
    await submitNotification(
      newState.client,
      newState.guild,
      Events.VoiceStateUpdate,
      voiceStateUpdateEmbed,
    );

    if (oldState?.channel) {
      const voice = newState.client.player.voices.get(oldState);
      const queue = newState.client.player.queues.get(oldState);

      // Leave the voice channel if there is no user in it
      if (voice && isVoiceChannelEmpty(oldState)) {
        voice.leave();
        if (queue) {
          queue.textChannel.send(
            newState.client.i18n.t(
              "events.voiceStateUpdate.no_user_in_channel",
            ),
          );
        } else {
          voice.channel.send(
            newState.client.i18n.t(
              "events.voiceStateUpdate.no_user_in_channel",
            ),
          );
        }
      }

      // Pause the queue if there is no user in the voice channel and resume it if there is
      if (queue) {
        if (isVoiceChannelEmpty(oldState)) {
          queue.pause();
        } else if (queue.paused) {
          queue.resume();
        }
      }
    }
  },
};
