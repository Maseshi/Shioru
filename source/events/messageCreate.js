const { Events, ChannelType } = require("discord.js");
const { getDatabase, ref, child, get, remove } = require("firebase/database");
const { fetchLevel, initializeData } = require("../utils/databaseUtils");
const { catchError } = require("../utils/consoleUtils");
const {
  findMatch,
  executeScript,
  normalizeText,
  fetchConversationHistory,
  fetchConversationResponse,
  sendReply,
} = require("../utils/chatUtils");

module.exports = {
  name: Events.MessageCreate,
  once: false,
  async execute(message) {
    if (message.webhookId) return;
    if (message.author.bot) return;

    // Settings data on database
    if (message.channel.type !== ChannelType.DM) {
      initializeData(message.client, message.guild);
      fetchLevel(message.client, message, "POST", {
        amount: 89,
        type: "exp",
      });
    }

    // Check if the bot is @mentioned or the user is replying to the bot
    const isMentioned =
      !message.mentions.everyone &&
      message.mentions.has(message.client.user.id);
    const isReplyToBot =
      message.reference &&
      (
        await message.channel.messages
          .fetch(message.reference.messageId)
          .catch(() => null)
      )?.author?.id === message.client.user.id;

    if (isMentioned || isReplyToBot) {
      const argument = message.content.replace(/^<@!?\d{1,20}> ?/i, "").trim();

      // When the bot is called but no argument is provided
      if (!argument) {
        const alternatives = message.client.configs.constants.alternatives;
        message.channel.sendTyping();
        message.reply(
          alternatives[Math.floor(Math.random() * alternatives.length)],
        );
        return;
      }

      // Keep typing indicator alive until response is ready
      message.channel.sendTyping();
      const typingInterval = setInterval(
        () => message.channel.sendTyping(),
        8000,
      );

      try {
        // Check pattern matching — guild conversations first, then global
        const text = normalizeText(argument);
        let matched = null;

        if (message.guild) {
          const guildChatRef = child(
            child(ref(getDatabase(), "guilds"), message.guild.id),
            "chat",
          );
          const guildChatSnapshot = await get(guildChatRef);

          if (guildChatSnapshot.exists()) {
            const guildChat = guildChatSnapshot.val();
            const guildConversations = Array.isArray(guildChat.conversations)
              ? guildChat.conversations
              : Object.values(guildChat.conversations ?? {});

            matched = findMatch(guildConversations, text);
          }
        }

        if (!matched) {
          const { conversations } = message.client.configs.constants;
          matched = findMatch(conversations, text);
        }

        if (matched) {
          if (matched.script) {
            const scriptReply = executeScript(
              matched.script,
              message,
              matched.reply,
            );
            if (scriptReply) {
              message.reply(scriptReply);
              return;
            }
          }
          message.reply(matched.reply);
          return;
        }

        // If no pattern match, use AI to respond
        const { apiKey, baseURL } = message.client.configs.openai;
        const clientUsername = message.client.user.username;
        const systemConstants = message.client.configs.constants.system;

        const conversationHistory = await fetchConversationHistory(
          message.channel,
          message.client.user.id,
        );

        const reply = await fetchConversationResponse({
          apiKey,
          baseURL,
          systemPrompt:
            systemConstants ?? `From now on, you are ${clientUsername}.`,
          conversationHistory,
        });

        await sendReply(message, reply);
      } catch (error) {
        message.reply(
          message.client.i18n.t("commands.ask.can_not_answer_at_this_time"),
        );
        catchError(message.client, message, "chat", error, true);
      } finally {
        clearInterval(typingInterval);
      }
    }

    // Remove AFK status
    if (message.channel.type !== ChannelType.DM) {
      const guildRef = child(ref(getDatabase(), "guilds"), message.guild.id);
      const guildSnapshot = await get(guildRef);

      if (guildSnapshot.exists()) {
        const afkData = guildSnapshot.val().afk;

        if (afkData && afkData[message.author.id]) {
          message.channel.sendTyping();

          try {
            await message.member.setNickname(
              afkData[message.author.id].nickname,
            );
          } catch (error) {
            catchError(message.client, message, "afk", error);
          }

          await remove(child(child(guildRef, "afk"), message.author.id));
          await message.reply({
            content: message.client.i18n.t(
              "events.messageCreate.afk_user_come_back",
            ),
            ephemeral: true,
          });
        } else {
          const members = message.mentions.users.first();

          if (!members) return;
          if (!afkData) return;
          if (!afkData[members.id]) return;

          message.channel.sendTyping();

          const member = message.guild.members.cache.get(members.id);
          const reason =
            afkData[members.id].message ||
            message.client.i18n.t("events.messageCreate.no_reason_for_afk");

          if (message.content.includes(members)) {
            message.reply(
              message.client.i18n
                .t("events.messageCreate.that_user_is_afk")
                .replace("%s1", member.user.tag)
                .replace("%s2", reason),
            );
          }
        }
      }
    }
  },
};
