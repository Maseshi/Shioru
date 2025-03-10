const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  InteractionContextType,
} = require("discord.js");
const { StreamType } = require("distube");

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("quality")
    .setDescription(
      "Try this command if you have sound problems or people with poor internet connection.",
    )
    .setDescriptionLocalizations({
      th: "ลองใช้คำสั่งนี้หากคุณมีปัญหาด้านเสียงหรือผู้ที่มีการเชื่อมต่ออินเทอร์เน็ตไม่ดี",
    })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addStringOption((option) =>
      option
        .setName("option")
        .setDescription("Options for setting sound quality.")
        .setDescriptionLocalizations({
          th: "ตัวเลือกสำหรับตั้งค่าคุณภาพของเสียง",
        })
        .setChoices(
          {
            name: "High Quality",
            name_localizations: { th: "คุณภาพสูง" },
            value: "high",
          },
          {
            name: "Low Quality",
            name_localizations: { th: "คุณภาพต่ำ" },
            value: "low",
          },
        ),
    ),
  async execute(interaction) {
    const inputOption = interaction.options.getString("option") ?? "";

    const quality =
      interaction.client.player.options.streamType === 0
        ? interaction.client.i18n.t("commands.quality.focus_on_high_quality")
        : interaction.client.i18n.t("commands.quality.low_efficiency");
    const adviceEmbed = new EmbedBuilder()
      .setTitle(
        interaction.client.i18n.t("commands.quality.advice_embed_title"),
      )
      .setDescription(
        interaction.client.i18n
          .t("commands.quality.advice_embed_description")
          .replace("%s", quality),
      )
      .setFooter({
        text: interaction.client.i18n.t(
          "commands.quality.advice_embed_footer_text",
        ),
      })
      .setColor("Blue")
      .setTimestamp();

    if (!inputOption) return await interaction.reply({ embeds: [adviceEmbed] });

    switch (inputOption) {
      case "high":
        interaction.client.player.options.streamType = StreamType.OPUS;
        await interaction.reply(
          interaction.client.i18n.t("commands.quality.opus_mode_selected"),
        );
        break;
      case "low":
        interaction.client.player.options.streamType = StreamType.RAW;
        await interaction.reply(
          interaction.client.i18n.t("commands.quality.raw_mode_selected"),
        );
        break;
      default:
        await interaction.reply({ embeds: [adviceEmbed] });
    }
  },
};
