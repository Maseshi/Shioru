const { Events, ChannelType } = require('discord.js')
const { getDatabase, ref, child, get, remove } = require('firebase/database')
const { fetchLevel, initializeData } = require('../utils/databaseUtils')
const { catchError } = require('../utils/consoleUtils')

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (message.webhookId) return
    if (message.author.bot) return

    // Automatic settings data on database
    if (message.channel.type !== ChannelType.DM) {
      initializeData(message.client, message.guild)
      fetchLevel(message.client, message, 'POST', {
        amount: 89,
        type: 'exp',
      })
    }

    // Detect if user mention bot
    if (message.mentions.has(message.client.user.id)) {
      const prompts = message.client.configs.constants.prompts
      const replies = message.client.configs.constants.replies
      const alternatives = message.client.configs.constants.alternatives
      const scripts = message.client.configs.constants.scripts
      const argument = message.content.replace(/^<@!?\d{1,20}> ?/i, '')

      // When the bot calls and asks some questions.
      if (argument) {
        message.channel.sendTyping()

        try {
          // Remove all characters except word characters, space, and digits
          // 'tell me a story' -> 'tell me story'
          // 'i feel happy' -> 'happy'
          const text = argument
            .toLowerCase()
            .replace(/ a /g, ' ')
            .replace(/pls/g, 'please')
            .replace(/i feel /g, '')
            .replace(/whats/g, 'what is')
            .replace(/please /g, '')
            .replace(/ please/g, '')
            .replace(/r u/g, 'are you')

          const compare = (
            promptsArray,
            repliesArray,
            scriptsArray,
            textString
          ) => {
            let reply, command, script

            for (let x = 0; x < promptsArray.length; x++) {
              for (let y = 0; y < promptsArray[x].length; y++) {
                if (promptsArray[x][y] === textString) {
                  let replies = repliesArray[x]
                  let scripts = scriptsArray[x] ?? null
                  reply = replies[Math.floor(Math.random() * replies.length)]
                  script = scripts
                    ? scripts[Math.floor(Math.random() * scripts.length)]
                    : null
                  break
                }
              }
            }

            return { reply, command, script }
          }

          if (compare(prompts, replies, scripts, text).reply) {
            message.channel.send(compare(prompts, replies, scripts, text).reply)
          } else {
            message.channel.send(
              alternatives[Math.floor(Math.random() * alternatives.length)]
            )
          }
          if (
            compare(prompts, replies, scripts, text).reply &&
            compare(prompts, replies, scripts, text).script
          ) {
            // Script format on database: ((client, message, answer) => {})
            // Script format when converted: ((client, message, answer) => {})(client, message, answer[randomWords])
            const answerScript = await eval(
              compare(prompts, replies, scripts, text).script
            )(client, message, compare(prompts, replies, scripts, text).reply)

            message.channel.send(answerScript)
          }
        } catch (error) {
          catchError(client, message, 'chatSystem', error)
        }
      }

      // When a bot is called but doesn't type anything
      if (!argument && message.mentions.has(message.client.user.id)) {
        message.channel.sendTyping()

        try {
          const randomWords = Math.floor(Math.random() * alternatives.length)

          message.channel.send(alternatives[randomWords])
        } catch (error) {
          catchError(client, message, 'chatSystem', error)
        }
      }
    }

    // Auto remove AFK status
    if (message.channel.type !== ChannelType.DM) {
      const guildRef = child(ref(getDatabase(), 'guilds'), message.guild.id)
      const guildSnapshot = await get(guildRef)

      if (guildSnapshot.exists()) {
        const afkData = guildSnapshot.val().afk

        if (afkData && afkData[message.author.id]) {
          message.channel.sendTyping()

          try {
            await message.member.setNickname(
              afkData[message.author.id].nickname
            )
          } catch (error) {
            catchError(message.client, message, 'afk', error)
          }

          await remove(child(child(guildRef, 'afk'), message.author.id))
          await message.reply({
            content: message.client.i18n.t(
              'events.messageCreate.afk_user_come_back'
            ),
            ephemeral: true,
          })
        } else {
          const members = message.mentions.users.first()

          if (!members) return
          if (!afkData) return
          if (!afkData[members.id]) return

          message.channel.sendTyping()

          const member = message.guild.members.cache.get(members.id)
          const reason =
            afkData[members.id].message ||
            message.client.i18n.t('events.messageCreate.no_reason_for_afk')

          if (message.content.includes(members)) {
            message.reply(
              message.client.i18n
                .t('events.messageCreate.that_user_is_afk')
                .replace('%s1', member.user.tag)
                .replace('%s2', reason)
            )
          }
        }
      }
    }
  },
}
