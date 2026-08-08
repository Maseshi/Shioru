const { Events, EmbedBuilder, Colors } = require("discord.js");
const { submitNotification } = require("../utils/databaseUtils");

module.exports = {
  name: Events.GuildSoundboardSoundCreate,
  once: false,
  async execute(soundboardSound) {
    const guildSoundboardSoundCreateEmbed = new EmbedBuilder()
      .setTitle(
        soundboardSound.client.i18n.t(
          "events.guildSoundboardSoundCreate.soundboard_notification",
        ),
      )
      .setDescription(
        soundboardSound.client.i18n.t(
          "events.guildSoundboardSoundCreate.new_soundboard",
          {
            emoji_identifier: soundboardSound.emoji.identifier,
            soundboard_name: soundboardSound.name,
          },
        ),
      )
      .setTimestamp()
      .setColor(Colors.Green);

    await submitNotification(
      soundboardSound.client,
      soundboardSound.guild,
      module.exports.name,
      guildSoundboardSoundCreateEmbed,
    );
  },
};
