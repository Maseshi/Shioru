const { Events, EmbedBuilder, Colors } = require("discord.js");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");

module.exports = {
  name: Events.SoundboardSounds,
  once: false,
  async execute(soundboardSounds, guild) {
    const guildSoundboardSoundUpdateEmbed = new EmbedBuilder()
      .setTitle(
        soundboardSounds.client.i18n.t(
          "events.soundboardSounds.soundboard_notification",
        ),
      )
      .setDescription(
        soundboardSounds.client.i18n.t(
          "events.soundboardSounds.soundboards_changed",
          {
            count: soundboardSounds.size,
          },
        ),
      )
      .setTimestamp()
      .setColor(Colors.Blue);

    await initializeData(soundboardSounds.client, guild);
    await submitNotification(
      soundboardSounds.client,
      guild,
      module.exports.name,
      guildSoundboardSoundUpdateEmbed,
    );
  },
};
