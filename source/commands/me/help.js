const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  PermissionsBitField,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ApplicationCommandType,
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ComponentType,
  Colors,
} = require('discord.js')
const { newLines } = require('../../utils/miscUtils')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help using it.')
    .setDescriptionLocalizations({
      th: 'รับความช่วยเหลือเกี่ยวกับการใช้งาน',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('command')
        .setDescription('The command you want to ask for help, eg play.')
        .setDescriptionLocalizations({
          th: 'คำสั่งที่คุณต้องการขอความช่วยเหลือเช่น play',
        })
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName('context')
        .setDescription('The context you want to ask for help, eg translate.')
        .setDescriptionLocalizations({
          th: 'บริบทที่คุณต้องการขอความช่วยเหลือเช่น translate',
        })
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

    if (inputCommand && inputContext)
      return await interaction.reply(
        interaction.client.i18n.t('commands.help.choose_one', {
          link: 'https://discord.com/shioru',
        })
      )

    const clientCommands = interaction.client.temp.commands
    const commandCategory = {
      developer: {
        emoji: '💻',
        description: interaction.client.i18n.t(
          'commands.help.developer_category'
        ),
      },
      fun: {
        emoji: '🎃',
        description: interaction.client.i18n.t('commands.help.fun_category'),
      },
      information: {
        emoji: '📖',
        description: interaction.client.i18n.t(
          'commands.help.information_category'
        ),
      },
      manager: {
        emoji: '🔪',
        description: interaction.client.i18n.t(
          'commands.help.manager_category'
        ),
      },
      me: {
        emoji: '🦊',
        description: interaction.client.i18n.t('commands.help.me_category'),
      },
      messages: {
        emoji: '💬',
        description: interaction.client.i18n.t(
          'commands.help.messages_category'
        ),
      },
      music: {
        emoji: '🎵',
        description: interaction.client.i18n.t('commands.help.music_category'),
      },
      settings: {
        emoji: '⚙️',
        description: interaction.client.i18n.t(
          'commands.help.settings_category'
        ),
      },
      tools: {
        emoji: '🧰',
        description: interaction.client.i18n.t('commands.help.tools_category'),
      },
    }
    const clientContexts = interaction.client.temp.contexts
    const guildCommands = await interaction.guild.commands.fetch()

    const clientUsername = interaction.client.user.username
    const clientAvatarURL = interaction.client.user.avatarURL()

    const helpHome = newLines(
      interaction.client.i18n.t('commands.help.greeting_message'),
      interaction.client.i18n.t('commands.help.start_guide'),
      '',
      interaction.client.i18n.t('commands.help.tips'),
      interaction.client.i18n.t('commands.help.can_clickable_some_command'),
      interaction.client.i18n.t('commands.help.symbol_mean'),
      interaction.client.i18n.t('commands.help.other_links', {
        invite_link: 'https://shiorus.web.app/invite',
        status_link: 'https://shioru.statuspage.io/',
        translation_link: 'https://crowdin.com/project/shioru',
        website_link: 'https://shiorus.web.app',
      })
    )
    const helpContexts = newLines(
      '# `{{name}}`',
      interaction.client.i18n.t('commands.help.context_type'),
      interaction.client.i18n.t('commands.help.context_cooldown'),
      interaction.client.i18n.t('commands.help.context_client_permissions'),
      interaction.client.i18n.t('commands.help.context_user_permissions')
    )
    const helpCommand = newLines(
      '# </{{name}}:{{id}}>',
      interaction.client.i18n.t('commands.help.command_category'),
      interaction.client.i18n.t('commands.help.command_description'),
      interaction.client.i18n.t('commands.help.command_cooldown'),
      interaction.client.i18n.t('commands.help.command_client_permissions'),
      interaction.client.i18n.t('commands.help.command_user_permissions'),
      interaction.client.i18n.t('commands.help.command_usage'),
      '```cpp\n{{usage}}\n```',
      interaction.client.i18n.t('commands.help.command_subcommand'),
      '{{subcommand}}'
    )

    const updateCommandMenu = (menu, input) => {
      const clientCategory =
        clientCommands.find(
          (value) => value[input] && value[input].name === input
        ) ?? clientCommands.get(input)

      for (const command in clientCategory) {
        const commandName = clientCategory[command].name
        const commandDescription =
          clientCategory[command].description[interaction.locale] ??
          clientCategory[command].description['en-US']

        menu.addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel(
              commandName.charAt(0).toUpperCase() + commandName.slice(1)
            )
            .setDefault(commandName === input)
            .setDescription(commandDescription)
            .setValue(commandName)
        )
      }
    }
    const updateContextsSelection = (embed, selection) => {
      const clientContext = clientContexts.find(
        (value) => value.name === selection
      )
      const guildCommand = guildCommands.find(
        (guildCommand) =>
          guildCommand.type !== ApplicationCommandType.ChatInput &&
          guildCommand.name === selection
      )
      const name = clientContext.name
      const type = clientContext.type
      const cooldown = clientContext.cooldown
      const clientPermissions = clientContext.permissions
        ? new PermissionsBitField(clientContext.permissions).toArray()
        : interaction.client.i18n.t('commands.help.command_none')
      const userPermissions = guildCommand.default_member_permissions
        ? new PermissionsBitField(
            guildCommand.default_member_permissions
          ).toArray()
        : interaction.client.i18n.t('commands.help.command_none')

      embed.setDescription(
        helpContexts
          .replace('{{name}}', name)
          .replace(
            '{{type}}',
            type === ApplicationCommandType.Message ? 'ข้อความ' : 'ผู้ใช้'
          )
          .replace(
            '{{cooldown}}',
            interaction.client.i18n.t('commands.help.cooldown_time', {
              cooldown,
            })
          )
          .replace('{{client_permissions}}', clientPermissions)
          .replace('{{user_permissions}}', userPermissions)
      )
    }
    const updateCommandSelection = (embed, selection) => {
      const clientCommand = clientCommands.find(
        (value) => value[selection] && value[selection].name === selection
      )[selection]
      const guildCommand = guildCommands.find(
        (guildCommand) =>
          guildCommand.type === ApplicationCommandType.ChatInput &&
          guildCommand.name === selection
      )
      const id = guildCommand.id ?? '0'
      const name = clientCommand.name
      const description =
        clientCommand.description[interaction.locale] ??
        clientCommand.description['en-US']
      const cooldown = clientCommand.cooldown
      const category = clientCommand.category
      const usage = clientCommand.usage
      const clientPermissions = clientCommand.permissions
        ? new PermissionsBitField(clientCommand.permissions).toArray()
        : interaction.client.i18n.t('commands.help.command_none')
      const userPermissions = guildCommand.default_member_permissions
        ? new PermissionsBitField(
            guildCommand.default_member_permissions
          ).toArray()
        : interaction.client.i18n.t('commands.help.command_none')
      const options = guildCommand.options
        ? newLines(
            ...guildCommand.options
              .filter((option) =>
                [
                  ApplicationCommandOptionType.Subcommand,
                  ApplicationCommandOptionType.SubcommandGroup,
                ].includes(option.type)
              )
              .map((option) => {
                const optionName = option.name
                const optionDescription =
                  (option.description_localizations
                    ? option.description_localizations[interaction.locale]
                    : option.description) ??
                  interaction.client.i18n.t('commands.help.command_none')
                const optionOptions = option.options
                  ? option.options
                      .filter((option) =>
                        [
                          ApplicationCommandOptionType.Subcommand,
                          ApplicationCommandOptionType.SubcommandGroup,
                        ].includes(option.type)
                      )
                      .map((option) => {
                        const subOptionName = option.name
                        const subOptionDescription =
                          (option.description_localizations
                            ? option.description_localizations[
                                interaction.locale
                              ]
                            : option.description) ??
                          interaction.client.i18n.t(
                            'commands.help.command_none'
                          )

                        return ` - </${name} ${optionName} ${subOptionName}:${id}>: ${subOptionDescription}`
                      })
                  : null

                return optionOptions
                  ? newLines(
                      `- </${name} ${optionName}:${id}>: ${optionDescription}`,
                      ...optionOptions
                    )
                  : `- </${name} ${optionName}:${id}>: ${optionDescription}`
              })
          ) || interaction.client.i18n.t('commands.help.command_none')
        : interaction.client.i18n.t('commands.help.command_none')

      embed.setDescription(
        helpCommand
          .replace('{{name}}', name)
          .replace('{{id}}', id)
          .replace('{{description}}', description)
          .replace(
            '{{cooldown}}',
            interaction.client.i18n.t('commands.help.cooldown_time', {
              cooldown,
            })
          )
          .replace('{{category}}', category)
          .replace('{{usage}}', usage)
          .replace('{{client_permissions}}', clientPermissions)
          .replace('{{user_permissions}}', userPermissions)
          .replace('{{subcommand}}', options)
      )
    }
    const updateComponents = (menu, select) => {
      menu.options.find((option) => option.data.default)?.setDefault(false)
      menu.options
        .find((option) => option.data.value === select)
        ?.setDefault(true)
    }

    const helpEmbed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle(interaction.client.i18n.t('commands.help.ask_for_help'))
      .setURL('https://shiorus.web.app/commands')
      .setAuthor({
        name: clientUsername,
        iconURL: clientAvatarURL,
        url: 'https://shiorus.web.app',
      })
      .setDescription(helpHome)
      .setTimestamp()
      .setFooter({
        text: interaction.client.i18n.t(
          'commands.help.refer_from_user_language'
        ),
        iconURL:
          'https://support.content.office.net/media/5f1b4e45-ae8f-4977-82c9-c56569e4425a.png',
      })
    const helpSelect = new StringSelectMenuBuilder()
      .setCustomId('help-menu')
      .setPlaceholder(interaction.client.i18n.t('commands.help.select_page'))
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setEmoji('📓')
          .setDefault(inputCommand || inputContext ? false : true)
          .setLabel(interaction.client.i18n.t('commands.help.general_page'))
          .setDescription(
            interaction.client.i18n.t('commands.help.general_information')
          )
          .setValue('home'),
        new StringSelectMenuOptionBuilder()
          .setEmoji('🖱️')
          .setDefault(inputContext ? true : false)
          .setLabel(interaction.client.i18n.t('commands.help.context_page'))
          .setDescription(
            interaction.client.i18n.t('commands.help.context_information')
          )
          .setValue('contexts'),
        ...clientCommands.map((value, key) =>
          new StringSelectMenuOptionBuilder()
            .setEmoji(commandCategory[key].emoji)
            .setDefault(
              inputCommand
                ? (value[inputCommand] &&
                    value[inputCommand].name === inputCommand) ??
                    false
                : false
            )
            .setLabel(key.charAt(0).toUpperCase() + key.slice(1))
            .setDescription(commandCategory[key].description)
            .setValue(key)
        )
      )
    const helpCommandsSelect = new StringSelectMenuBuilder()
      .setCustomId('help-commands-menu')
      .setPlaceholder(
        interaction.client.i18n.t('commands.help.choose_command_to_survey')
      )
    const helpContextsSelect = new StringSelectMenuBuilder()
      .setCustomId('help-contexts-menu')
      .setPlaceholder(
        interaction.client.i18n.t('commands.help.choose_context_to_survey')
      )
      .addOptions(
        ...clientContexts.map((value, key) =>
          new StringSelectMenuOptionBuilder()
            .setDefault(
              inputContext ? value.name === inputContext ?? false : false
            )
            .setLabel(key.charAt(0).toUpperCase() + key.slice(1))
            .setValue(key)
        )
      )
    const helpRow = new ActionRowBuilder().addComponents(helpSelect)
    const helpCommandsRow = new ActionRowBuilder().addComponents(
      helpCommandsSelect
    )
    const helpContextsRow = new ActionRowBuilder().addComponents(
      helpContextsSelect
    )

    if (inputContext) {
      updateContextsSelection(helpEmbed, inputContext)
    }
    if (inputCommand) {
      updateCommandMenu(helpCommandsSelect, inputCommand)
      updateCommandSelection(helpEmbed, inputCommand)
    }

    const response = await interaction.reply({
      embeds: [helpEmbed],
      components: inputContext
        ? [helpRow, helpContextsRow]
        : inputCommand
          ? [helpRow, helpCommandsRow]
          : [helpRow],
    })
    const collection = response.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      filter: (inter) =>
        inter.user.id === interaction.user.id &&
        ['help-menu', 'help-commands-menu', 'help-contexts-menu'].includes(
          inter.customId
        ),
      time: 120_000,
    })

    collection.on('collect', async (inter) => {
      const customId = inter.customId
      const selection = inter.values[0]

      if (customId === 'help-menu') {
        switch (selection) {
          case 'home': {
            helpEmbed.setDescription(helpHome)
            updateComponents(helpSelect, selection)
            await inter.update({
              embeds: [helpEmbed],
              components: [helpRow],
            })
            break
          }
          case 'contexts': {
            const contexts = clientContexts.map((_value, key) => `\`${key}\``)

            helpEmbed.setDescription(contexts.join(', '))
            updateComponents(helpSelect, selection)
            await inter.update({
              embeds: [helpEmbed],
              components: [helpRow, helpContextsRow],
            })
            break
          }
          default: {
            const commands = []
            const category = clientCommands.get(selection)

            for (const index in category) {
              const guildCommand = guildCommands.find(
                (guildCommand) =>
                  guildCommand.type === ApplicationCommandType.ChatInput &&
                  guildCommand.name === category[index].name
              )
              const commandID = guildCommand.id ?? '0'
              const commandName = category[index].name
              const commandDescription =
                category[index].description[interaction.locale] ??
                category[index].description['en-US']

              commands.push(
                `- </${commandName}:${commandID}>: ${commandDescription}`
              )
            }

            helpEmbed.setDescription(newLines(...commands))
            helpCommandsSelect.spliceOptions(
              0,
              helpCommandsSelect.options.length
            )
            updateCommandMenu(helpCommandsSelect, selection)
            updateComponents(helpSelect, selection)
            await inter.update({
              embeds: [helpEmbed],
              components: [helpRow, helpCommandsRow],
            })
            break
          }
        }
      }
      if (customId === 'help-commands-menu') {
        updateCommandSelection(helpEmbed, selection)
        updateComponents(
          helpSelect,
          clientCommands.find(
            (value) => value[selection] && value[selection].name === selection
          )[selection].category
        )
        updateComponents(helpCommandsSelect, selection)
        await inter.update({
          embeds: [helpEmbed],
          components: [helpRow, helpCommandsRow],
        })
      }
      if (customId === 'help-contexts-menu') {
        updateContextsSelection(helpEmbed, selection)
        updateComponents(helpSelect, 'contexts')
        updateComponents(helpContextsSelect, selection)
        await inter.update({
          embeds: [helpEmbed],
          components: [helpRow, helpContextsRow],
        })
      }
    })
    collection.on('end', async (_collected) => {
      helpEmbed.setColor(Colors.Default).setDescription(
        newLines(
          interaction.client.i18n.t('commands.help.timeout_for_help', {
            command_name: interaction.commandName,
            command_id: interaction.commandId,
          }),
          '',
          interaction.client.i18n.t('commands.help.info'),
          interaction.client.i18n.t('commands.help.remaining_time')
        )
      )
      await interaction.editReply({
        embeds: [helpEmbed],
        components: [],
      })
    })
  },
}
