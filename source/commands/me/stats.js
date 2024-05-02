const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
} = require('discord.js')
const { catchError } = require('../../utils/consoleUtils')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Review the statistics of the bots.')
    .setDescriptionLocalizations({
      th: 'ตรวจดูข้อมูลสถิติของบอท',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true),
  async execute(interaction) {
    const clientAvatar = interaction.client.user.displayAvatarURL()
    const clientUsername = interaction.client.user.username
    const statsEmbed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setAuthor({ iconURL: clientAvatar, name: clientUsername })
      .setThumbnail()

    if (interaction.client.shard && interaction.client.shard.count) {
      const promises = [
        interaction.client.shard.fetchClientValues('guilds.cache.size'),
        interaction.client.shard.broadcastEval((c) =>
          c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
        ),
      ]

      return Promise.all(promises)
        .then(async (results) => {
          const totalGuilds = results[0].reduce(
            (acc, guildCount) => acc + guildCount,
            0
          )
          const totalMembers = results[1].reduce(
            (acc, memberCount) => acc + memberCount,
            0
          )

          statsEmbed.setFields([
            {
              name: interaction.client.i18n.t('commands.stats.server_count'),
              value: totalGuilds.toString(),
              inline: true,
            },
            {
              name: interaction.client.i18n.t('commands.stats.member_count'),
              value: totalMembers.toString(),
              inline: true,
            },
          ])

          return await interaction.reply({ embeds: [statsEmbed] })
        })
        .catch((error) => {
          catchError(
            interaction.client,
            interaction,
            module.exports.data.name,
            error
          )
        })
    } else {
      const totalGuilds = interaction.client.guilds.cache.size
      const totalMembers = interaction.client.users.cache.size

      statsEmbed.setFields([
        {
          name: interaction.client.i18n.t('commands.stats.server_count'),
          value: totalGuilds.toString(),
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.stats.member_count'),
          value: totalMembers.toString(),
          inline: true,
        },
      ])

      await interaction.reply({ embeds: [statsEmbed] })
    }
  },
}
