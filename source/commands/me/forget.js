const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { getDatabase, ref, child, get, remove } = require("firebase/database");

module.exports = {
  cooldown: 60,
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("forget")
    .setDescription("Manage your personal data stored by Shioru.")
    .setDescriptionLocalizations({
      th: "จัดการข้อมูลส่วนตัวของคุณที่ Shioru จัดเก็บไว้",
    })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("me")
        .setDescription("Delete all your personal data.")
        .setDescriptionLocalizations({
          th: "ลบข้อมูลส่วนตัวทั้งหมดของคุณ",
        }),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("guild")
        .setDescription(
          "Delete all guild data and remove the bot from this server.",
        )
        .setDescriptionLocalizations({
          th: "ลบข้อมูลกิลด์ทั้งหมดและนำบอทออกจากเซิร์ฟเวอร์นี้",
        }),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;

    switch (subcommand) {
      case "me": {
        const userRef = child(ref(getDatabase(), "users"), userId);
        const userSnapshot = await get(userRef);

        if (!userSnapshot.exists()) {
          return await interaction.reply({
            content: interaction.client.i18n.t("commands.forget.no_data"),
            ephemeral: true,
          });
        }

        const confirmRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("confirm-delete-me")
            .setLabel(interaction.client.i18n.t("commands.forget.confirm"))
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId("cancel-delete")
            .setLabel(interaction.client.i18n.t("commands.forget.cancel"))
            .setStyle(ButtonStyle.Secondary),
        );

        const confirmEmbed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle(interaction.client.i18n.t("commands.forget.title"))
          .setDescription(
            interaction.client.i18n.t("commands.forget.description"),
          )
          .setTimestamp();

        const response = await interaction.reply({
          embeds: [confirmEmbed],
          components: [confirmRow],
          ephemeral: true,
        });

        try {
          const btn = await response.awaitMessageComponent({
            filter: (i) => i.user.id === userId,
            componentType: ComponentType.Button,
            time: 30_000,
          });

          if (btn.customId === "confirm-delete-me") {
            await remove(userRef);

            const successEmbed = new EmbedBuilder()
              .setColor(Colors.Green)
              .setTitle(
                interaction.client.i18n.t("commands.forget.success_title"),
              )
              .setDescription(
                interaction.client.i18n.t("commands.forget.success"),
              )
              .setTimestamp();

            await btn.update({ embeds: [successEmbed], components: [] });
          } else {
            await btn.update({
              content: interaction.client.i18n.t("commands.forget.cancelled"),
              embeds: [],
              components: [],
            });
          }
        } catch {
          await interaction.editReply({
            content: interaction.client.i18n.t("commands.forget.timeout"),
            embeds: [],
            components: [],
          });
        }
        break;
      }
      case "guild": {
        if (!interaction.guild) {
          return await interaction.reply({
            content: interaction.client.i18n.t("commands.forget.guild_only"),
            ephemeral: true,
          });
        }

        if (
          !interaction.member.permissions.has(PermissionFlagsBits.ManageGuild)
        ) {
          return await interaction.reply({
            content: interaction.client.i18n.t("commands.forget.no_permission"),
            ephemeral: true,
          });
        }

        const guildRef = child(
          ref(getDatabase(), "guilds"),
          interaction.guild.id,
        );

        const confirmRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("confirm-delete-guild")
            .setLabel(
              interaction.client.i18n.t("commands.forget.guild_confirm"),
            )
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId("cancel-delete")
            .setLabel(interaction.client.i18n.t("commands.forget.cancel"))
            .setStyle(ButtonStyle.Secondary),
        );

        const confirmEmbed = new EmbedBuilder()
          .setColor(Colors.Red)
          .setTitle(interaction.client.i18n.t("commands.forget.guild_title"))
          .setDescription(
            interaction.client.i18n.t("commands.forget.guild_description"),
          )
          .setTimestamp();

        const response = await interaction.reply({
          embeds: [confirmEmbed],
          components: [confirmRow],
          ephemeral: true,
        });

        try {
          const btn = await response.awaitMessageComponent({
            filter: (i) => i.user.id === userId,
            componentType: ComponentType.Button,
            time: 30_000,
          });

          if (btn.customId === "confirm-delete-guild") {
            await remove(guildRef);

            await btn.update({
              content: interaction.client.i18n.t(
                "commands.forget.guild_success",
              ),
              embeds: [],
              components: [],
            });

            await interaction.guild.leave();
          } else {
            await btn.update({
              content: interaction.client.i18n.t("commands.forget.cancelled"),
              embeds: [],
              components: [],
            });
          }
        } catch {
          await interaction.editReply({
            content: interaction.client.i18n.t("commands.forget.timeout"),
            embeds: [],
            components: [],
          });
        }
        break;
      }
    }
  },
};
