const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { changeLanguage } = require("../../utils/clientUtils");
const { getGuildData } = require("../../utils/cacheUtils");
const { createLanguage } = require("../../schemas/guild");
const { updateLanguage } = require("../../repositories/guildSettings");

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("language")
    .setDescription("Set the language to use in the guild.")
    .setDescriptionLocalizations({ th: "ตั้งค่าภาษาสำหรับบอท" })
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([ApplicationIntegrationType.GuildInstall])
    .addSubcommand((subcommand) =>
      subcommand
        .setName("get")
        .setDescription("See the language that is currently being used.")
        .setDescriptionLocalizations({ th: "ดูภาษาที่ใช้อยู่ในปัจจุบัน" }),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("Explore supported languages")
        .setDescriptionLocalizations({ th: "สำรวจภาษาที่ระบบรองรับ" }),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription(
          "Set language in case of manual setting for CUSTOM type.",
        )
        .setDescriptionLocalizations({
          th: "ตั้งค่าภาษากรณีตั้งค่าด้วยตัวเองสำหรับประเภท CUSTOM",
        })
        .addStringOption((option) =>
          option
            .setName("locale")
            .setDescription("Language locale code (e.g. en-US)")
            .setDescriptionLocalizations({
              th: "รหัสสถานที่ของภาษา (ตัวอย่าง th)",
            })
            .setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("by")
        .setDescription("Refer to language settings by type.")
        .setDescriptionLocalizations({ th: "อ้างอิงการตั้งค่าภาษาตามประเภท" })
        .addStringOption((option) =>
          option
            .setName("type")
            .setDescription("Type of language setting")
            .setDescriptionLocalizations({ th: "ประเภทของการตั้งค่าภาษา" })
            .setChoices(
              {
                name: "CUSTOM",
                name_localizations: { th: "กำหนดเอง" },
                value: "CUSTOM",
              },
              {
                name: "USER",
                name_localizations: { th: "ผู้ใช้" },
                value: "USER",
              },
              {
                name: "GUILD",
                name_localizations: { th: "กิลด์" },
                value: "GUILD",
              },
            )
            .setRequired(true),
        ),
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const inputLocale = interaction.options.getString("locale");
    const inputType = interaction.options.getString("type");

    const locale = interaction.client.i18n.language;
    const locales = interaction.client.i18n.options.preload;
    const guildVal =
      getGuildData(interaction.client, interaction.guild.id) ?? {};
    const languageData = guildVal.language ?? createLanguage();

    switch (subcommand) {
      case "get": {
        const getEmbed = new EmbedBuilder()
          .setTitle(interaction.client.i18n.t("commands.language.title"))
          .setDescription(
            interaction.client.i18n.t("commands.language.description", {
              command: `</${interaction.commandName}:${interaction.commandId}>`,
              type: languageData.type || createLanguage().type,
              locale: locale,
            }),
          )
          .setColor(Colors.Blue)
          .setTimestamp();

        await interaction.reply({ embeds: [getEmbed] });
        break;
      }
      case "list": {
        const listEmbed = new EmbedBuilder()
          .setTitle(interaction.client.i18n.t("commands.language.title"))
          .setDescription(
            interaction.client.i18n.t("commands.language.support", {
              command: `</${interaction.commandName}:${interaction.commandId}>`,
              locales: locales.join(", "),
            }),
          )
          .setColor(Colors.Blue)
          .setTimestamp()
          .setFooter({
            text: interaction.client.i18n.t("commands.language.data_at"),
          });

        await interaction.reply({ embeds: [listEmbed] });
        break;
      }
      case "set": {
        if (!locales.includes(inputLocale))
          return await interaction.reply(
            interaction.client.i18n.t("commands.language.language_not_found", {
              locales: locales,
            }),
          );
        if (inputLocale === locale)
          return await interaction.reply(
            interaction.client.i18n.t("commands.language.already_set", {
              locale: inputLocale,
            }),
          );

        await updateLanguage(interaction.guild.id, { locale: inputLocale });

        if (languageData.type === "CUSTOM")
          changeLanguage(interaction.client, inputLocale);

        await interaction.reply(
          interaction.client.i18n.t("commands.language.changed_locale", {
            locale: inputLocale,
          }),
        );
        break;
      }
      case "by": {
        await updateLanguage(interaction.guild.id, { type: inputType });

        if (inputType === "CUSTOM")
          changeLanguage(
            interaction.client,
            languageData.locale || createLanguage().locale,
          );
        if (inputType === "GUILD")
          changeLanguage(interaction.client, guildVal.preferredLocale);
        if (inputType === "USER")
          changeLanguage(interaction.client, interaction.locale);

        await interaction.reply(
          interaction.client.i18n.t("commands.language.changed_type", {
            type: inputType,
          }),
        );
        break;
      }
    }
  },
};
