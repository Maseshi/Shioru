const { Collection, Events, PermissionsBitField } = require('discord.js')
const { getFirestore, doc, getDoc } = require('firebase/firestore')
const { changeLanguage } = require('../utils/clientUtils')
const { catchError } = require('../utils/consoleUtils')
const {
  fetchLevel,
  fetchStatistics,
  initializeData,
} = require('../utils/databaseUtils')

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (interaction.user.bot) return

    // Automatic settings data on database
    initializeData(interaction.client, interaction.guild)

    const guildDoc = doc(getFirestore(), 'guilds', interaction.guild.id)
    const guildSnapshot = await getDoc(guildDoc)
    const guildData = guildSnapshot.data()

    const executeCommand = async (func, path) => {
      // Check if the command has a cooldown or not.
      if (!interaction.client.cooldowns.has(func.data.name))
        interaction.client.cooldowns.set(func.data.name, new Collection())

      const now = Date.now()
      const timestamps = interaction.client.cooldowns.get(func.data.name)
      const cooldownAmount = (func.cooldown ?? 3) * 1_000

      if (timestamps.has(interaction.user.id)) {
        const expirationTime =
          timestamps.get(interaction.user.id) + cooldownAmount

        if (now < expirationTime) {
          const expiredTimestamp = Math.round(expirationTime / 1_000)
          return interaction.reply({
            content: interaction.client.i18n.t(
              'events.interactionCreate.command_has_cooldown',
              {
                command_name: func.data.name,
                expired_timestamp: expiredTimestamp,
              }
            ),
            ephemeral: true,
          })
        }
      }

      timestamps.set(interaction.user.id, now)
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)

      // Check the permissions of the command for the bot.
      if (func.permissions) {
        if (!interaction.guild.members.me.permissions.has(func.permissions)) {
          try {
            return await interaction.member.send({
              content: interaction.client.i18n.t(
                'events.interactionCreate.client_is_not_allowed',
                {
                  permissions: new PermissionsBitField(
                    func.permissions
                  ).toArray(),
                }
              ),
              ephemeral: true,
            })
          } catch (error) {
            return catchError(
              interaction.client,
              interaction,
              interaction.commandName,
              'interactionCreate',
              error,
              true
            )
          }
        }
      }

      try {
        func.execute(interaction)

        // Stores information when the bot is working properly.
        fetchStatistics('POST', 'size/worked', interaction.client)
        fetchStatistics('POST', `${path}/${func.data.name}`, interaction.client)
      } catch (error) {
        catchError(interaction.client, interaction, 'interactionCreate', error)
      }
    }

    // Set language by type
    if (!guildData?.language.type || guildData?.language.type === 'USER')
      changeLanguage(interaction.client, interaction.locale)

    // Increase user level
    fetchLevel(interaction.client, interaction, 'POST', {
      amount: 123,
      type: 'exp',
    })

    if (interaction.isChatInputCommand()) {
      const commandName = interaction.commandName
      const command = interaction.client.commands.get(commandName)

      if (!command)
        return interaction.client.logger.warn(
          `No command matching ${commandName} was found.`
        )

      executeCommand(command, 'commands')
    }
    if (interaction.isAutocomplete()) {
      const commandName = interaction.commandName
      const command = interaction.client.commands.get(commandName)

      if (!command)
        return interaction.client.logger.warn(
          `No autocomplete matching ${commandName} was found.`
        )

      try {
        await command.autocomplete(interaction)
      } catch (error) {
        interaction.client.logger.error(error)
      }
    }
    if (interaction.isMessageContextMenuCommand()) {
      const contextName = interaction.commandName
      const context = interaction.client.contexts.get(contextName)

      if (!context)
        return interaction.client.logger.warn(
          `No context matching ${contextName} was found.`
        )

      executeCommand(context, 'contexts')
    }
  },
}
