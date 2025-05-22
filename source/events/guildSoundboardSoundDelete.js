const { Events, EmbedBuilder, Colors } = require("discord.js");
const {
  submitNotification,
  initializeData,
} = require("../utils/databaseUtils");

module.exports = {
  name: Events.GuildSoundboardSoundDelete,
  once: false,
  async execute(soundboardSound) {
    const guildSoundboardSoundDeleteEmbed = new EmbedBuilder()
      .setTitle(
        soundboardSound.client.i18n.t(
          "events.guildSoundboardSoundDelete.soundboard_notification",
        ),
      )
      .setDescription(
        soundboardSound.client.i18n.t(
          "events.guildSoundboardSoundDelete.soundboard_disappear",
          {
            soundboard_name: soundboardSound.name,
          },
        ),
      )
      .setTimestamp()
      .setColor(Colors.Red);

    await initializeData(soundboardSound.client, soundboardSound.guild);
    await submitNotification(
      soundboardSound.client,
      soundboardSound.guild,
      module.exports.name,
      guildSoundboardSoundDeleteEmbed,
    );
  },
};
