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

      // Start a 60-second countdown to leave the voice channel if it is empty
      const leaveTimeoutKey = `leave_timeout_${oldState.channel.id}`;

      if (voice && isVoiceChannelEmpty(oldState)) {
        // Prevent multiple timeouts for the same channel
        if (!oldState.client.temp[leaveTimeoutKey]) {
          oldState.client.temp[leaveTimeoutKey] = setTimeout(() => {
            // Double-check if the channel is still empty after 60 seconds
            if (isVoiceChannelEmpty(oldState)) {
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
            delete oldState.client.temp[leaveTimeoutKey];
          }, 60000);
        }
      } else if (voice && oldState.client.temp[leaveTimeoutKey]) {
        // If someone joins back, clear the timeout
        clearTimeout(oldState.client.temp[leaveTimeoutKey]);
        delete oldState.client.temp[leaveTimeoutKey];
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
