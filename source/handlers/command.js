const { Collection, PermissionsBitField } = require('discord.js')
const { readdirSync } = require('node:fs')
const { join } = require('node:path')
const { usageBuilder } = require('../utils/clientUtils')

module.exports = (client) => {
  const foldersPath = join(__dirname, '../commands')
  const commandFolders = readdirSync(foldersPath)

  client.cooldowns = new Collection()
  client.commands = new Collection()
  client.temp.commands = new Collection()

  client.logger.info('Verifying and loading all commands...')

  for (const folder of commandFolders) {
    const commandsPath = join(foldersPath, folder)
    const commandFiles = readdirSync(commandsPath).filter((file) =>
      file.endsWith('.js')
    )

    for (const file of commandFiles) {
      const filePath = join(commandsPath, file)
      const commandName = file.split('.')[0]
      const command = require(filePath)

      client.logger.debug(
        `Checking details of ${commandName} command at (${filePath})`
      )

      if (typeof command.data !== 'object') {
        client.logger.warn(
          {
            path: filePath,
            type: 'command',
            reason: 'You have a missing "data" or "data" is not a object.',
          },
          `Unable to load command ${commandName} successfully.`
        )
      }
      if (typeof command.execute !== 'function') {
        client.logger.warn(
          {
            path: filePath,
            type: 'command',
            reason:
              'You have a missing "function" or "function" is not a string.',
          },
          `Unable to load command ${commandName} successfully.`
        )
      }
      if (client.commands.get(command.data.name)) {
        client.logger.warn(
          {
            path: filePath,
            type: 'command',
            reason: `Found a command with a duplicate name as ${command.data.name}.`,
          },
          `Unable to load command ${command.data.name} successfully.`
        )
      }

      client.commands.set(command.data.name, command)
      client.temp.commands.set(folder, {
        ...client.temp.commands.get(folder),
        [command.data.name]: {
          name: command.data.name ?? '',
          description: {
            'en-US': command.data.description ?? '',
            ...(command.data.description_localizations ?? null),
          },
          cooldown: command.cooldown ?? 3,
          category: folder ?? '',
          permissions: command.permissions
            ? new PermissionsBitField(command.permissions).toArray()
            : [],
          usage: usageBuilder(command),
        },
      })
    }
  }
}
