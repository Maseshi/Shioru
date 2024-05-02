const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} = require('discord.js')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
  ],
  data: new SlashCommandBuilder()
    .setName('donate')
    .setDescription('Donate to support bots and bot developers.')
    .setDescriptionLocalizations({
      th: 'บริจาคเพื่อสนับสนุนบอทและนักพัฒนาบอท',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true),
  async execute(interaction) {
    const github = 'https://github.com/sponsors/Maseshi'
    const patreon = 'https://www.patreon.com/maseshi'
    const bmc = 'https://www.buymeacoffee.com/maseshi'
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setURL(github)
        .setLabel('Github')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL(patreon)
        .setLabel('Patreon')
        .setStyle(ButtonStyle.Link),
      new ButtonBuilder()
        .setURL(bmc)
        .setLabel('Buy me a coffee')
        .setStyle(ButtonStyle.Link)
    )

    await interaction.reply({
      content: interaction.client.i18n.t(
        'commands.donate.thank_you_in_advance_message'
      ),
      components: [row],
    })
  },
}
