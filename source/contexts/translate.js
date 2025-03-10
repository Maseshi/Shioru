const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
} = require("discord.js");

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new ContextMenuCommandBuilder()
    .setType(ApplicationCommandType.Message)
    .setName("translate")
    .setNameLocalizations({
      th: "แปลภาษา",
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true),
  async execute(interaction) {
    const inputTo = interaction.locale;
    const inputMessage = interaction.targetMessage;

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
          {
            locales: Object.keys(locales).join(", "),
          },
        ),
        ephemeral: true,
      });

    const response = await fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams({
        sl: "auto",
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
      .setFooter({
        text: `[${source}] -> [${inputTo}]`,
      });

    await interaction.editReply({ embeds: [translateEmbed], ephemeral: true });
  },
};
