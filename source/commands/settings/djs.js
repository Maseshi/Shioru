const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
} = require('discord.js')
const {
  getFirestore,
  doc,
  updateDoc,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  getDoc,
} = require('firebase/firestore')

module.exports = {
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.ManageGuild,
  ],
  data: new SlashCommandBuilder()
    .setName('djs')
    .setDescription('Set who has permission to control music')
    .setDescriptionLocalizations({
      th: 'ตั้งค่าผู้ที่มีสิทธิ์ในการควบคุมเพลง',
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName('get')
        .setDescription(
          'View currently available information about music control rights.'
        )
        .setDescriptionLocalizations({
          th: 'ดูข้อมูลที่มีอยู่ในตอนนี้เกี่ยวกับสิทธิ์ในการควบคุมเพลง',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('enable')
        .setDescription('Enable who has music control permissions')
        .setDescriptionLocalizations({
          th: 'เปิดใช้งานผู้ที่มีสิทธิ์ควบคุมเพลง',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('disable')
        .setDescription('Disable who has music control permissions')
        .setDescriptionLocalizations({
          th: 'ปิดใช้งานผู้ที่มีสิทธิ์ควบคุมเพลง',
        })
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('only')
        .setDescription(
          'Can it only be used by people who have permission to control the music?'
        )
        .setDescriptionLocalizations({
          th: 'สามารถใช้งานได้เฉพาะผู้ที่มีสิทธิ์ในการควบคุมเพลงหรือไม่',
        })
        .addBooleanOption((option) =>
          option
            .setName('set')
            .setDescription(
              'If true, only the music supervisor will be able to change or control the music.'
            )
            .setDescriptionLocalizations({
              th: 'หากเป็นจริง จะมีเพียงผู้ควบคุมเพลงเท่านั้นที่จะสามารถเปลี่ยนแปลงหรือควบคุมเพลงได้',
            })
        )
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('roles')
        .setDescription('Manage available music supervisor roles')
        .setDescriptionLocalizations({
          th: 'จัดการบทบาทของผู้ควบคุมเพลงที่สามารถใช้งานได้',
        })
        .addSubcommand((subcommand) =>
          subcommand
            .setName('add')
            .setDescription('Added the role of Music Conductor')
            .setDescriptionLocalizations({
              th: 'เพิ่มบทบาทของผู้ควบคุมเพลง',
            })
            .addRoleOption((option) =>
              option
                .setName('name')
                .setDescription('Name of the required role')
                .setDescriptionLocalizations({
                  th: 'ชื่อของบทบาทที่ต้องการ',
                })
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('remove')
            .setDescription('Name of the required role')
            .setDescriptionLocalizations({
              th: 'ลดบทบาทของผู้ควบคุมเพลง',
            })
            .addRoleOption((option) =>
              option
                .setName('name')
                .setDescription('Name of the required role')
                .setDescriptionLocalizations({
                  th: 'ชื่อของบทบาทที่ต้องการ',
                })
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('clear')
            .setDescription('Clear all Music Controller roles.')
            .setDescriptionLocalizations({
              th: 'ล้างบทบาททั้งหมดของผู้ควบคุมเพลง',
            })
        )
    )
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName('users')
        .setDescription(
          'Manage who has control over which songs are available.'
        )
        .setDescriptionLocalizations({
          th: 'จัดการผู้ที่มีสิทธิ์ควบคุมเพลงที่สามารถใช้งานได้',
        })
        .addSubcommand((subcommand) =>
          subcommand
            .setName('add')
            .setDescription(
              'Add users who can have permission to control music.'
            )
            .setDescriptionLocalizations({
              th: 'เพิ่มผู้ใช้ที่สามารถมีสิทธิ์ในการควบคุมเพลง',
            })
            .addUserOption((option) =>
              option
                .setName('name')
                .setDescription('Name of desired user')
                .setDescriptionLocalizations({
                  th: 'ชื่อของผู้ใช้ที่ต้องการ',
                })
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('remove')
            .setDescription('Delete who has permission to control music')
            .setDescriptionLocalizations({
              th: 'ลบผู้ที่มีสิทธิ์ในการควบคุมเพลง',
            })
            .addUserOption((option) =>
              option
                .setName('name')
                .setDescription('Name of desired user')
                .setDescriptionLocalizations({
                  th: 'ชื่อของผู้ใช้ที่ต้องการ',
                })
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName('clear')
            .setDescription('Clear all those who can control the music.')
            .setDescriptionLocalizations({
              th: 'ล้างผู้ที่สามารถควบคุมเพลงได้ทั้งหมด',
            })
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand()
    const subcommandGroup = interaction.options.getSubcommandGroup()
    const inputSet = interaction.options.getBoolean('set') ?? false
    const inputRolesName = interaction.options.getRole('name') ?? ''
    const inputUsersName = interaction.options.getUser('name') ?? ''

    const guildDoc = doc(getFirestore(), 'guilds', interaction.guild.id)
    const guildSnapshot = await getDoc(guildDoc)

    const configs = interaction.client.config

    switch (subcommand) {
      case 'get': {
        const noInputEmbed = new EmbedBuilder()
          .setTitle(interaction.client.i18n.t('commands.djs.music_djs'))
          .setDescription(
            [
              interaction.client.i18n.t('commands.djs.manage_music_like_dj', {
                command: `</${interaction.commandId}: ${interaction.commandName}>`,
              }),
            ].join('\n\n')
          )
          .setColor(Colors.Blue)
          .setTimestamp()

        await interaction.reply({ embeds: [noInputEmbed] })
        break
      }
      case 'enable': {
        if (configs.djs.enable)
          return await interaction.reply(
            interaction.client.i18n.t('commands.djs.currently_enabled')
          )

        configs.djs.enable = true
        await updateDoc(guildDoc, {
          ['djs.enable']: true,
          ['djs.toggledAt']: serverTimestamp(),
        })

        await interaction.reply(
          interaction.client.i18n.t('commands.djs.enable_djs_mode')
        )
        break
      }
      case 'disable': {
        if (!configs.djs.enable)
          return await interaction.reply(
            interaction.client.i18n.t('commands.djs.currently_disabled')
          )

        configs.djs.enable = false
        await updateDoc(guildDoc, {
          ['djs.enable']: false,
          ['djs.toggledAt']: serverTimestamp(),
        })

        await interaction.reply(
          interaction.client.i18n.t('commands.djs.disable_djs_mode')
        )
        break
      }
      case 'only': {
        if (configs.djs.only === inputSet)
          return await interaction.reply(
            interaction.client.i18n.t('commands.djs.currently_switched', {
              boolean: inputSet,
            })
          )

        configs.djs.only = inputSet
        await updateDoc(guildDoc, {
          ['djs.only']: inputSet,
          ['djs.editedAt']: serverTimestamp(),
        })

        await interaction.reply(
          inputSet
            ? interaction.client.i18n.t('commands.djs.only_djs_can_manage')
            : interaction.client.i18n.t('commands.djs.everyone_can_manage')
        )
        break
      }
    }
    switch (subcommandGroup) {
      case 'roles': {
        switch (subcommand) {
          case 'add': {
            if (configs.djs.roles.includes(inputRolesName.id))
              return await interaction.reply(
                interaction.client.i18n.t(
                  'commands.djs.role_have_been_added_before'
                )
              )

            configs.djs.roles.push(inputRolesName.id)
            await updateDoc(guildDoc, {
              ['djs.editedAt']: serverTimestamp(),
              ['djs.roles']: arrayUnion(inputRolesName.id),
            })

            await interaction.reply(
              interaction.client.i18n.t('commands.djs.added_role', {
                role_id: inputRolesName,
              })
            )
            break
          }
          case 'remove': {
            if (!configs.djs.roles.includes(inputRolesName.id))
              return await interaction.reply(
                interaction.client.i18n.t(
                  'commands.djs.role_currently_can_not_manage_music'
                )
              )
            if (configs.djs.roles.indexOf(inputRolesName.id) > -1) {
              configs.djs.roles.splice(configs.djs.roles, 1)
            } else {
              return await interaction.reply(
                interaction.client.i18n.t('commands.djs.role_not_found_in_list')
              )
            }

            await updateDoc(guildDoc, {
              ['djs.editedAt']: serverTimestamp(),
              ['djs.roles']: arrayRemove(inputRolesName.id),
            })

            await interaction.reply(
              interaction.client.i18n.t('commands.djs.deleted_role', {
                role_id: inputRolesName.id,
              })
            )
            break
          }
          case 'clear': {
            if (!configs.djs.roles.length)
              return await interaction.reply(
                interaction.client.i18n.t('commands.djs.empty_roles_in_list')
              )

            configs.djs.roles = []
            await updateDoc(guildDoc, {
              ['djs.editedAt']: serverTimestamp(),
              ['djs.roles']: [],
            })

            if (guildSnapshot.exists()) {
              const guildData = guildSnapshot.data()

              if (!guildData.djs.roles.length && !guildData.djs.users.length) {
                configs.djs.enable = false
                await updateDoc(guildDoc, {
                  ['djs.enable']: false,
                })
              }
            }

            await interaction.reply(
              interaction.client.i18n.t('commands.djs.cleared_roles_in_list')
            )
            break
          }
        }
        break
      }
      case 'users': {
        switch (subcommand) {
          case 'add': {
            if (configs.djs.users.includes(inputUsersName.id))
              return await interaction.reply(
                interaction.client.i18n.t(
                  'commands.djs.user_currently_can_manage_music'
                )
              )

            configs.djs.users.push(inputUsersName.id)
            await updateDoc(guildDoc, {
              ['djs.editedAt']: serverTimestamp(),
              ['djs.users']: arrayUnion(inputUsersName.id),
            })

            await interaction.reply(
              interaction.client.i18n.t('commands.djs.added_user', {
                user_id: inputUsersName.id,
              })
            )
            break
          }
          case 'remove': {
            if (!configs.djs.users.includes(inputUsersName.id))
              return await interaction.reply(
                interaction.client.i18n.t(
                  'commands.djs.user_have_been_added_before'
                )
              )
            if (configs.djs.users.indexOf(inputUsersName.id) > -1) {
              configs.djs.users.splice(configs.djs.roles, 1)
            } else {
              return await interaction.reply(
                interaction.client.i18n.t('commands.djs.user_not_found_in_list')
              )
            }

            await updateDoc(guildDoc, {
              ['djs.editedAt']: serverTimestamp(),
              ['djs.users']: arrayRemove(inputUsersName.id),
            })

            await interaction.reply(
              interaction.client.i18n.t('commands.djs.deleted_user', {
                user_id: inputUsersName.id,
              })
            )
            break
          }
          case 'clear': {
            if (!configs.djs.users.length)
              return await interaction.reply(
                interaction.client.i18n.t('commands.djs.empty_users_in_list')
              )

            configs.djs.users = []
            await updateDoc(guildDoc, {
              ['djs.editedAt']: serverTimestamp(),
              ['djs.users']: [],
            })

            if (guildSnapshot.exists()) {
              const guildData = guildSnapshot.data()

              if (!guildData.djs.users.length && !guildData.djs.users.length) {
                configs.djs.enable = false
                await updateDoc(guildDoc, {
                  ['djs.enable']: false,
                })
              }
            }

            await interaction.reply(
              interaction.client.i18n.t('commands.djs.cleared_users_in_list')
            )
            break
          }
        }
        break
      }
    }
  },
}
