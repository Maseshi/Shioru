const { Collection, Events, PermissionsBitField } = require("discord.js");
const { changeLanguage } = require("../utils/clientUtils");
const { catchError } = require("../utils/consoleUtils");
const { fetchLevel, incrementStatistics } = require("../utils/databaseUtils");
const { getGuildData } = require("../utils/cacheUtils");

module.exports = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction) {
    if (interaction.user.bot) return;

    if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command)
        return interaction.client.logger.warn(
          `No autocomplete matching ${interaction.commandName} was found.`,
        );

      try {
        await command.autocomplete(interaction);
      } catch (error) {
        if (error.code !== 10062 && error.code !== 40060)
          interaction.client.logger.error(error);
      }
      return;
    }

    const command = interaction.isChatInputCommand()
      ? interaction.client.commands.get(interaction.commandName)
      : null;

    if (command?.deferReply && !interaction.deferred && !interaction.replied)
      await interaction.deferReply();

    const guildVal = getGuildData(interaction.client, interaction.guildId);

    const executeCommand = async (func, path) => {
      // Check if the command has a cooldown or not.
      if (!interaction.client.cooldowns.has(func.data.name))
        interaction.client.cooldowns.set(func.data.name, new Collection());

      const now = Date.now();
      const timestamps = interaction.client.cooldowns.get(func.data.name);
      const cooldownAmount = (func.cooldown ?? 3) * 1_000;

      if (timestamps.has(interaction.user.id)) {
        const expirationTime =
          timestamps.get(interaction.user.id) + cooldownAmount;

        if (now < expirationTime) {
          const expiredTimestamp = Math.round(expirationTime / 1_000);
          return interaction.reply({
            content: interaction.client.i18n.t(
              "events.interactionCreate.command_has_cooldown",
              {
                command_name: func.data.name,
                expired_timestamp: expiredTimestamp,
              },
            ),
            ephemeral: true,
          });
        }
      }

      timestamps.set(interaction.user.id, now);
      setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

      // Check the permissions of the command for the bot.
      if (func.permissions) {
        if (!interaction.guild.members.me.permissions.has(func.permissions)) {
          try {
            return await interaction.member.send({
              content: interaction.client.i18n.t(
                "events.interactionCreate.client_is_not_allowed",
                {
                  permissions: new PermissionsBitField(
                    func.permissions,
                  ).toArray(),
                },
              ),
              ephemeral: true,
            });
          } catch (error) {
            return catchError(
              interaction.client,
              interaction,
              interaction.commandName,
              error,
              true,
            );
          }
        }
      }

      try {
        await func.execute(interaction);

        // Stores information when the bot is working properly.
        void incrementStatistics([
          "size/worked",
          `${path}/${func.data.name}`,
        ]).catch((error) =>
          interaction.client.logger.error(
            { err: error, command: func.data.name },
            "Failed to update command statistics.",
          ),
        );
      } catch (error) {
        await catchError(
          interaction.client,
          interaction,
          func.data.name,
          error,
        );
      }
    };

    // Set language from this guild's cached settings.
    const languageType = guildVal?.language?.type;
    if (languageType === "CUSTOM" && guildVal.language.locale)
      changeLanguage(interaction.client, guildVal.language.locale);
    else if (languageType === "GUILD" && guildVal?.preferredLocale)
      changeLanguage(interaction.client, guildVal.preferredLocale);
    else changeLanguage(interaction.client, interaction.locale);

    // Increase user level
    void fetchLevel(interaction.client, interaction, "POST", {
      amount: 123,
      type: "exp",
    }).catch((error) =>
      interaction.client.logger.error(
        { err: error },
        "Failed to update interaction level.",
      ),
    );

    if (interaction.isChatInputCommand()) {
      const commandName = interaction.commandName;

      if (!command)
        return interaction.client.logger.warn(
          `No command matching ${commandName} was found.`,
        );

      await executeCommand(command, "commands");
    }
    if (interaction.isMessageContextMenuCommand()) {
      const contextName = interaction.commandName;
      const context = interaction.client.contexts.get(contextName);

      if (!context)
        return interaction.client.logger.warn(
          `No context matching ${contextName} was found.`,
        );

      await executeCommand(context, "contexts");
    }
  },
};
