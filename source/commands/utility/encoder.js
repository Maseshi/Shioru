const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
	Colors,
	InteractionContextType,
} = require("discord.js");
const { Buffer } = require("node:buffer");

const encoding = [
	{
		name: "ASCII",
		value: "ascii",
	},
	{
		name: "Base64",
		value: "base64",
	},
	{
		name: "Base64URL",
		value: "base64url",
	},
	{
		name: "Binary",
		value: "binary",
	},
	{
		name: "Hex",
		value: "hex",
	},
	{
		name: "Latin1",
		value: "latin1",
	},
	{
		name: "UCS-2",
		value: "ucs-2",
	},
	{
		name: "UCS2",
		value: "ucs2",
	},
	{
		name: "UTF-16LE",
		value: "utf-16le",
	},
	{
		name: "UTF-8",
		value: "utf-8",
	},
	{
		name: "UTF16LE",
		value: "utf16le",
	},
	{
		name: "UTF8",
		value: "utf8",
	},
];

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName("encoder")
		.setDescription("Encrypt or decrypt your message.")
		.setDescriptionLocalizations({ th: "เข้ารหัสหรือถอดรหัสข้อความของคุณ" })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.BotDM,
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addSubcommand((subcommand) =>
			subcommand
				.setName("encode")
				.setDescription("Encrypt your message.")
				.setDescriptionLocalizations({ th: "เข้ารหัสข้อความของคุณ" })
				.addStringOption((option) =>
					option
						.setName("text")
						.setDescription("Message to be encrypted.")
						.setDescriptionLocalizations({ th: "ข้อความที่ต้องการจะเข้ารหัส" })
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("from")
						.setDescription("Choose an encoding method. (Default is UTF-8)")
						.setDescriptionLocalizations({
							th: "เลือกวิธีการเข้ารหัส (ค่าเริ่มต้นคือ UTF-8)",
						})
						.setChoices(encoding),
				)
				.addStringOption((option) =>
					option
						.setName("to")
						.setDescription("Choose an encoding method. (Default is Base64)")
						.setDescriptionLocalizations({
							th: "เลือกวิธีการเข้ารหัส (ค่าเริ่มต้นคือ Base64)",
						})
						.setChoices(encoding),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("decode")
				.setDescription("Decrypt your message.")
				.setDescriptionLocalizations({ th: "ถอดรหัสข้อความของคุณ" })
				.addStringOption((option) =>
					option
						.setName("text")
						.setDescription("Message to be decrypted.")
						.setDescriptionLocalizations({ th: "ข้อความที่ต้องการจะถอดรหัส" })
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("from")
						.setDescription("Choose an encoding method. (Default is Base64)")
						.setDescriptionLocalizations({
							th: "เลือกวิธีการเข้ารหัส  (ค่าเริ่มต้นคือ Base64)",
						})
						.setChoices(encoding),
				)
				.addStringOption((option) =>
					option
						.setName("to")
						.setDescription("Choose an encoding method. (Default is UTF-8)")
						.setDescriptionLocalizations({
							th: "เลือกวิธีการเข้ารหัส (ค่าเริ่มต้นคือ UTF-8)",
						})
						.setChoices(encoding),
				),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const inputText = interaction.options.getString("text");
		const inputFrom =
			(interaction.options.getString("from") ?? subcommand === "encode")
				? "utf-8"
				: "base64";
		const inputTo =
			(interaction.options.getString("to") ?? subcommand === "encode")
				? "base64"
				: "utf-8";

		const clientAvatar = interaction.client.user.displayAvatarURL();
		const clientUsername = interaction.client.user.username;
		const encoderEmbed = new EmbedBuilder()
			.setColor(Colors.Blue)
			.setAuthor({ iconURL: clientAvatar, name: clientUsername })
			.setTimestamp();

		switch (subcommand) {
			case "encode": {
				encoderEmbed
					.setTitle(
						interaction.client.i18n.t("commands.encoder.encode_message"),
					)
					.setDescription(
						interaction.client.i18n.t("commands.encoder.encode_success"),
					)
					.addFields(
						{
							name: interaction.client.i18n.t("commands.encoder.encode_before"),
							value: `\`\`\`${inputText}\`\`\``,
						},
						{
							name: interaction.client.i18n.t("commands.encoder.encode_after"),
							value: `\`\`\`${Buffer.from(inputText, inputFrom).toString(inputTo)}\`\`\``,
						},
					);
				break;
			}
			case "decode": {
				encoderEmbed
					.setTitle(
						interaction.client.i18n.t("commands.encoder.decode_message"),
					)
					.setDescription(
						interaction.client.i18n.t("commands.encoder.decode_success"),
					)
					.addFields(
						{
							name: interaction.client.i18n.t("commands.encoder.decode_before"),
							value: `\`\`\`${inputText}\`\`\``,
						},
						{
							name: interaction.client.i18n.t("commands.encoder.decode_after"),
							value: `\`\`\`${Buffer.from(inputText, inputFrom).toString(inputTo)}\`\`\``,
						},
					);
				break;
			}
		}

		await interaction.reply({ embeds: [encoderEmbed], ephemeral: true });
	},
};
