const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
} = require('discord.js')
const { join } = require('node:path')
const { catchError } = require('../../utils/consoleUtils')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reload the modified command.')
    .setDescriptionLocalizations({
      th: 'โหลดคำสั่งใหม่ที่ได้รับการแก้ไขอีกครั้ง',
    })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('Name of the command to reload.')
        .setDescriptionLocalizations({ th: 'ชื่อของคำสั่งที่ต้องการโหลดใหม่' })
        .setMinLength(3)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName('context')
        .setDescription('Name of the context to reload.')
        .setDescriptionLocalizations({ th: 'ชื่อของบริบทที่ต้องการโหลดใหม่' })
        .setMinLength(3)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true)
    const inputCommand = interaction.options.getString('command') ?? ''
    const inputContext = interaction.options.getString('context') ?? ''

    let choices = []

    if (focusedOption.name === 'command') {
      if (inputCommand) {
        choices = interaction.client.commands
          .map((value) =>
            value.data.name.includes(inputCommand.toLowerCase())
              ? value.data.name
              : null
          )
          .filter(Boolean)
          .slice(0, 25)
      } else {
        choices = interaction.client.commands
          .sort(() => Math.random() - 0.5)
          .map((value) => value.data.name)
          .slice(0, 25)
      }
    }
    if (focusedOption.name === 'context') {
      if (inputContext) {
        choices = interaction.client.contexts
          .map((value) =>
            value.data.name.includes(inputContext.toLowerCase())
              ? value.data.name
              : null
          )
          .filter(Boolean)
          .slice(0, 25)
      } else {
        choices = interaction.client.contexts
          .sort(() => Math.random() - 0.5)
          .map((value) => value.data.name)
          .slice(0, 25)
      }
    }

    const filtered = choices.filter((choice) =>
      choice.startsWith(focusedOption.value)
    )

    await interaction.respond(
      filtered.map((choice) => ({ name: choice, value: choice }))
    )
  },
  async execute(interaction) {
    const inputCommand = interaction.options.getString('command') ?? ''
    const inputContext = interaction.options.getString('context') ?? ''

    await interaction.reply(
      interaction.client.i18n.t('commands.reload.searching')
    )

    const reload = async (path, name) => {
      delete require.cache[require.resolve(path)]

      try {
        interaction.client.commands.delete(name)

        const newCommand = require(path)

        interaction.client.commands.set(newCommand.data.name, newCommand)
        await interaction.followUp(
          interaction.client.i18n.t('commands.reload.reloaded', {
            command_name: name,
          })
        )
      } catch (error) {
        await interaction.followUp(
          interaction.client.i18n.t('commands.reload.reload_error', {
            command_name: name,
          })
        )
        catchError(
          interaction.client,
          interaction,
          module.exports.data.name,
          error,
          true
        )
      }
    }

    if (inputCommand) {
      const command = interaction.client.temp.commands.find(
        (value) =>
          value[inputCommand.toLowerCase()] &&
          value[inputCommand.toLowerCase()].name === inputCommand.toLowerCase()
      )[inputCommand.toLowerCase()]

      if (!command)
        return await interaction.followUp(
          interaction.client.i18n.t('commands.reload.invalid_command')
        )

      const commandName = command.name
      const commandCategory = command.category
      const commandPath = join(
        __dirname,
        '..',
        commandCategory,
        `${commandName}.js`
      )

      reload(commandPath, commandName)
    }
    if (inputContext) {
      const context = interaction.client.temp.contexts.get(
        inputContext.toLowerCase()
      )

      if (!context)
        return await interaction.followUp(
          interaction.client.i18n.t('commands.reload.invalid_command')
        )

      const contextName = context.name
      const contextPath = join(
        __dirname,
        '..',
        '..',
        'contexts',
        `${contextName}.js`
      )

      reload(contextPath, contextName)
    }
  },
}
