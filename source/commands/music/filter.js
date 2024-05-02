const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
} = require('discord.js')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('filter')
    .setDescription('Add more powerful filters to your music.')
    .setDescriptionLocalizations({
      th: 'ใส่ฟิลเตอร์ในเพลงของคุณให้มีพลังมากขึ้น',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add a filter to the queue.')
        .setDescriptionLocalizations({
          th: 'เพิ่มฟิลเตอร์เข้าไปในคิว',
        })
        .addStringOption((option) =>
          option
            .setName('filter')
            .setDescription('The filters you want to use.')
            .setDescriptionLocalizations({
              th: 'รูปแบบเสียงที่คุณต้องการใช้ คุณสามารถระบุเพิ่มเติมได้โดยใช้ "," สำหรับรุปแบบหลายรายการ',
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove the filter in the queue.')
        .setDescriptionLocalizations({
          th: 'ลบฟิลเตอร์ในคิว',
        })
        .addStringOption((option) =>
          option
            .setName('filter')
            .setDescription('The filters you want to use.')
            .setDescriptionLocalizations({
              th: 'รูปแบบเสียงที่คุณต้องการใช้ คุณสามารถระบุเพิ่มเติมได้โดยใช้ "," สำหรับรุปแบบหลายรายการ',
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('set')
        .setDescription('Set all new queue filters.')
        .setDescriptionLocalizations({
          th: 'ตั้งค่าฟิลเตอร์ในคิวใหม่ทั้งหมด',
        })
        .addStringOption((option) =>
          option
            .setName('filter')
            .setDescription('The filters you want to use.')
            .setDescriptionLocalizations({
              th: 'รูปแบบเสียงที่คุณต้องการใช้ คุณสามารถระบุเพิ่มเติมได้โดยใช้ "," สำหรับรุปแบบหลายรายการ',
            })
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('See all supported filters.')
        .setDescriptionLocalizations({
          th: 'ดูฟิลเตอร์ทั้งหมดที่รองรับ',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('now')
        .setDescription('View filters that are currently queued.')
        .setDescriptionLocalizations({
          th: 'ดูฟิลเตอร์ที่อยู่คิวตอนนี้',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('clear')
        .setDescription('Remove all filters in the queue.')
        .setDescriptionLocalizations({
          th: 'ลบฟิลเตอร์ทั้งหมดในคิว',
        })
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    const inputFilters = interaction.options.getString('filter') ?? ''

    const djs = interaction.client.configs.djs
    const queue = interaction.client.player.getQueue(interaction)
    const filterString = inputFilters
      .split(',')
      .map((value) => value.toLowerCase())
    const filterList = Object.keys(interaction.client.player.filters)
    const filterEmbed = {
      content: interaction.client.i18n.t('commands.filter.sound_filtering'),
      embeds: [
        new EmbedBuilder()
          .setTitle(
            interaction.client.i18n.t('commands.filter.available_filter')
          )
          .setDescription(
            interaction.client.i18n
              .t('commands.filter.available_filter_description')
              .replace('%s1', filterList.length)
              .replace('%s2', filterList.join(', '))
          )
          .setColor('Blue'),
      ],
    }

    const checkFilters = (filters) => {
      let count = 0
      const validFilters = []
      const invalidFilters = []

      for (const filter of filters) {
        if (filterList.includes(filter)) {
          count++
          validFilters.push(filter)
        } else {
          count++
          invalidFilters.push(filter)
        }

        if (count === filters.length) {
          return {
            valid: validFilters,
            invalid: invalidFilters,
          }
        }
      }
    }

    if (!queue)
      return await interaction.reply(
        interaction.client.i18n.t('commands.filter.no_queue')
      )
    if (djs.enable) {
      if (
        interaction.user.id !== queue.songs[0].user.id &&
        queue.autoplay === false
      )
        return await interaction.reply(
          interaction.client.i18n.t('commands.filter.not_queue_owner')
        )
      if (
        djs.users.includes(interaction.user.id) &&
        djs.roles.includes(
          interaction.member.roles.cache.map((role) => role.id)
        ) &&
        djs.only
      )
        return await interaction.reply(
          interaction.client.i18n.t('commands.filter.not_a_dj')
        )
    }

    switch (subcommand) {
      case 'add': {
        if (!filterString.length) return await interaction.reply(filterEmbed)
        if (checkFilters(filterString).invalid.length > 0)
          return await interaction.reply(
            interaction.client.i18n
              .t('commands.filter.unknown_filter')
              .replace('%s', checkFilters(filterString).invalid.join(', '))
          )

        await queue.filters.add(filterString)
        await interaction.reply(
          interaction.client.i18n
            .t('commands.filter.add_filter')
            .replace('%s', filterString.join(', '))
        )
        break
      }
      case 'remove': {
        if (!filterString.length) return await interaction.reply(filterEmbed)
        if (checkFilters(filterString).invalid.length > 0)
          return await interaction.reply(
            interaction.client.i18n
              .t('commands.filter.unknown_filter')
              .replace('%s', checkFilters(filterString).invalid.join(', '))
          )

        await queue.filters.remove(filterString)
        await interaction.reply(
          interaction.client.i18n
            .t('commands.filter.remove_filter')
            .replace('%s', filterString.join(', '))
        )
        break
      }
      case 'set': {
        if (!filterString.length) return await interaction.reply(filterEmbed)
        if (checkFilters(filterString).invalid.length > 0)
          return await interaction.reply(
            interaction.client.i18n
              .t('commands.filter.unknown_filter')
              .replace('%s', checkFilters(filterString).invalid.join(', '))
          )

        await queue.filters.set(filterString)
        await interaction.reply(
          interaction.client.i18n
            .t('commands.filter.set_filter')
            .replace('%s', filterString.join(', '))
        )
        break
      }
      case 'list': {
        const availableEmbed = new EmbedBuilder()
          .setTitle(
            interaction.client.i18n.t('commands.filter.available_filter')
          )
          .setDescription(
            interaction.client.i18n
              .t('commands.filter.available_filter_description')
              .replace('%s1', filterList.length)
              .replace('%s2', filterList.join(', '))
          )
          .setColor('Green')

        await interaction.reply({
          content: interaction.client.i18n.t('commands.filter.sound_filtering'),
          embeds: [availableEmbed],
        })
        break
      }
      case 'now': {
        const filtersName = queue.filters.names.join(', ')
        const filtersSize = queue.filters.names.length
        const listEmbed = new EmbedBuilder()
          .setTitle(
            interaction.client.i18n.t('commands.filter.list_filter_title')
          )
          .setDescription(
            filtersSize
              ? interaction.client.i18n
                  .t('commands.filter.list_filter_description')
                  .replace('%s1', filtersSize)
                  .replace('%s2', filtersName)
              : interaction.client.i18n.t(
                  'commands.filter.list_filter_description_empty'
                )
          )
          .setColor('Blue')

        await interaction.reply({ embeds: [listEmbed] })
        break
      }
      case 'clear': {
        await queue.filters.clear()
        await interaction.reply(
          interaction.client.i18n.t('commands.filter.clear_filter')
        )
        break
      }
      default: {
        return await interaction.reply(
          interaction.client.i18n.t('commands.filter.unknown_input_option')
        )
      }
    }
  },
}
