const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluate the Javascript code for testing.')
    .setDescriptionLocalizations({
      th: 'ประเมินรหัส JavaScript สำหรับทดสอบผลการทำงาน',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('script')
        .setDescription('The Javascript code to be evaluated.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputScript = interaction.options.getString('script')

    const resultEmbed = new EmbedBuilder().setTitle('🔭 ผลการทำงาน')
    const secureEval = (obj) => eval?.(`"use strict";(${obj})`)

    try {
      resultEmbed
        .setDescription(`\`\`\`JavaScript\n${secureEval(inputScript)}\n\`\`\``)
        .setColor(Colors.Green)
    } catch (error) {
      resultEmbed
        .setDescription(`\`\`\`JavaScript\n${error.toString()}\n\`\`\``)
        .setColor(Colors.Red)
    }

    await interaction.reply({ embeds: [resultEmbed] })
  },
}
