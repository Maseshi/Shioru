const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
} = require("discord.js");

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName("paste")
    .setDescription("Paste the text in sourceb.in.")
    .setDescriptionLocalizations({ th: "วางข้อความใน sourceb.in" })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addStringOption((option) =>
      option
        .setName("content")
        .setDescription("Content to be placed")
        .setDescriptionLocalizations({ th: "เนื้อหาที่ต้องการจะวาง" })
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("The title is about the content to be pasted.")
        .setDescriptionLocalizations({
          th: "ชื่อเรื่องเกี่ยวกับเนื้อหาที่จะวาง",
        }),
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Description of what you are writing.")
        .setDescriptionLocalizations({ th: "คำอธิบายของสิ่งคุณกำลังเขียน" }),
    ),
  async execute(interaction) {
    const inputTitle = interaction.options.getString("title") ?? "";
    const inputDescription = interaction.options.getString("description") ?? "";
    const inputContent = interaction.options.getString("content");

    await interaction.deferReply();

    const response = await fetch("https://sourceb.in/api/bins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: inputTitle,
        description: inputDescription,
        files: [{ name: inputTitle, content: inputContent }],
      }),
    });

    if (response.status !== 200)
      return await interaction.editReply(
        interaction.client.i18n.t("commands.paste.backend_not_response"),
      );

    const data = await response.json();
    const url = `https://sourceb.in/${data.key}`;
    const raw = `https://cdn.sourceb.in/bins/${data.key}/0`;

    await interaction.editReply(
      [
        "**Sourcebin**",
        `🔸 ${interaction.client.i18n.t("commands.paste.file")}: <${url}>`,
        `🔹 ${interaction.client.i18n.t("commands.paste.raw")}: <${raw}>`,
      ].join("\n"),
    );
  },
};
