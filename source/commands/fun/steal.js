const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  parseEmoji,
  InteractionContextType,
} = require('discord.js')
const { catchError } = require('../../utils/consoleUtils')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ManageGuildExpressions,
  ],
  data: new SlashCommandBuilder()
    .setName('steal')
    .setDescription('Steal emojis from members')
    .setDescriptionLocalizations({ th: 'ขโมยอีโมจิจากสมาชิก' })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions)
    .setContexts([InteractionContextType.Guild])
    .addStringOption((option) =>
      option
        .setName('emoji')
        .setDescription('Emojis that want to be stolen')
        .setDescriptionLocalizations({ th: 'อีโมจิที่ต้องการขโมย' })
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputEmoji = interaction.options.getString('emoji') ?? ''

    const parsedEmoji = parseEmoji(inputEmoji)

    if (parsedEmoji.id) {
      const fileType = inputEmoji.animated ? 'gif' : 'png'
      const emojiURL = `https://cdn.discordapp.com/emojis/${parsedEmoji.id}.${fileType}`
      const emojiName = parsedEmoji.name

      try {
        const emoji = await interaction.guild.emojis.create({
          attachment: emojiURL,
          name: emojiName,
        })

        await interaction.reply(
          interaction.client.i18n.t('commands.steal.emoji_has_stolen', {
            emoji: emoji,
            name: emojiName,
          })
        )
      } catch (error) {
        catchError(
          interaction.client,
          interaction,
          module.exports.data.name,
          error,
          true
        )
      }
    } else {
      await interaction.reply(
        interaction.client.i18n.t('commands.steal.not_emoji_or_is_build_in')
      )
    }
  },
}
