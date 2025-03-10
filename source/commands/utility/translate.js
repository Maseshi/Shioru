const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
  InteractionContextType,
} = require("discord.js");

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate text")
    .setDescriptionLocalizations({ th: "แปลภาษาข้อความ" })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("the text to be translated")
        .setDescriptionLocalizations({ th: "ข้อความที่ต้องการจะแปล" })
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("from")
        .setDescription(
          "Language code of the text to be translated, such as en, th, ja.",
        )
        .setDescriptionLocalizations({
          th: "รหัสภาษาของข้อความที่ต้องการจะแปล เช่น en, th, ja",
        }),
    )
    .addStringOption((option) =>
      option
        .setName("to")
        .setDescription("Language codes to translate text such as en, th, ja")
        .setDescriptionLocalizations({
          th: "รหัสภาษาที่จะแปลข้อความเช่น en, th, ja",
        }),
    ),
  async execute(interaction) {
    const inputFrom = interaction.options.getString("from") ?? "auto";
    const inputTo = interaction.options.getString("to") ?? interaction.locale;
    const inputMessage = interaction.options.getString("message");

    await interaction.deferReply();

    const baseURL = interaction.client.configs.translation.baseURL;
    const locales = interaction.client.configs.translation.locales;

    if (!baseURL)
      return await interaction.editReply({
        content: interaction.client.i18n.t(
          "commands.translate.base_url_is_missing",
        ),
        ephemeral: true,
      });
    if (!locales[inputTo])
      return await interaction.editReply({
        content: interaction.client.i18n.t(
          "commands.translate.translate_support",
          { locales: Object.keys(locales).join(", ") },
        ),
        ephemeral: true,
      });

    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams({
        sl: inputFrom,
        tl: inputTo,
        q: inputMessage,
      }).toString(),
    });

    if (response.status !== 200)
      return await interaction.editReply({
        content: interaction.client.i18n.t(
          "commands.translate.can_not_translate",
        ),
        ephemeral: true,
      });

    const data = await response.json();
    const source = data.src;
    const sentences = data.sentences;
    const translate = sentences.find((sentence) => "trans" in sentence)?.trans;
    const transliteration = sentences.find(
      (sentence) => "src_translit" in sentence,
    )?.src_translit;

    if (!translate)
      return await interaction.editReply({
        content: interaction.client.i18n.t(
          "commands.translate.can_not_translate",
        ),
        ephemeral: true,
      });

    const userUsername = interaction.user.username;
    const userAvatar = interaction.user.avatarURL();
    const translateEmbed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTimestamp()
      .setDescription(
        `\`\`\`${translate}\`\`\`` +
          (transliteration ? `\n> ${transliteration}` : ""),
      )
      .setAuthor({
        iconURL: userAvatar,
        name: `${userUsername} ${interaction.client.i18n.t("commands.translate.says")}`,
      })
      .setFooter({ text: `[${source}] -> [${inputTo}]` });

    await interaction.editReply({ embeds: [translateEmbed], ephemeral: true });
  },
};
