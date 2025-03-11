const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
	Colors,
	InteractionContextType,
} = require('discord.js');

module.exports = {
	permissions: [PermissionFlagsBits.SendMessages],
	data: new SlashCommandBuilder()
		.setName('qrcode')
		.setDescription('Generate your QR code.')
		.setDescriptionLocalizations({ th: 'สร้างคิวอาร์โค้ดของคุณ' })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.BotDM,
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addStringOption((option) =>
			option
				.setName('content')
				.setDescription('Messages or links that want to create QR code.')
				.setDescriptionLocalizations({
					th: 'ข้อความหรือลิงค์ที่ต้องการจะสร้างคิวอาร์โค้ด',
				})
				.setRequired(true),
		)
		.addIntegerOption((option) =>
			option
				.setName('size')
				.setDescription(
					'Size of the QR code image you want to generate. (Default is 200)',
				)
				.setDescriptionLocalizations({
					th: 'ขนาดของภาพคิวอาร์โค้ดที่คุณต้องการสร้าง (ค่าเริ่มต้นคือ 200)',
				})
				.setMinValue(10)
				.setMaxValue(1000000),
		)
		.addStringOption((option) =>
			option
				.setName('ecc')
				.setDescription('QR code quality to reduce errors (Default is low)')
				.setDescriptionLocalizations({
					th: 'คุณภาพของคิวอาร์โค้ดเพื่อลดข้อผิดพลาด (ค่าเริ่มต้นคือต่ำ)',
				})
				.addChoices(
					{ name: 'Low', name_localizations: { th: 'ต่ำ' }, value: 'L' },
					{ name: 'Middle', name_localizations: { th: 'กลาง' }, value: 'M' },
					{ name: 'Quality', name_localizations: { th: 'คุณภาพ' }, value: 'Q' },
					{ name: 'High', name_localizations: { th: 'สูง' }, value: 'H' },
				),
		)
		.addStringOption((option) =>
			option
				.setName('format')
				.setDescription('QR code file format image. (Default is PNG)')
				.setDescriptionLocalizations({
					th: 'รูปแบบไฟล์ของภาพคิวอาร์โค้ด (ค่าเริ่มต้นคือ PNG)',
				})
				.addChoices(
					{ name: 'PNG', value: 'png' },
					{ name: 'GIF', value: 'gif' },
					{ name: 'JPEG', value: 'jpeg' },
					{ name: 'JPG', value: 'jpg' },
					{ name: 'SVG', value: 'svg' },
					{ name: 'EPS', value: 'eps' },
				),
		),
	async execute(interaction) {
		const inputContent = interaction.options.getString('content');
		let inputSize = interaction.options.getInteger('size') ?? 200;
		const inputECC = interaction.options.getInteger('ecc') ?? 'L';
		const inputFormat = interaction.options.getInteger('format') ?? 'png';

		await interaction.deferReply();

		if (
			['png', 'gif', 'jpeg', 'jpg'].includes(inputFormat) &&
			inputSize >= 1000
		) {
			inputSize = 1000;
			await interaction.editReply(
				interaction.client.i18n.t('commands.qrcode.image_size_too_large'),
			);
		}

		const response = await fetch(
			`https://api.qrserver.com/v1/create-qr-code?data=${encodeURI(inputContent)}&size=${inputSize}x${inputSize}&ecc=${inputECC}&format=${inputFormat}`,
		);

		if (response.status !== 200) {
			if (interaction.replied)
				return await interaction.followUp(
					interaction.client.i18n.t('commands.qrcode.can_not_generate'),
				);

			return await interaction.editReply(
				interaction.client.i18n.t('commands.qrcode.can_not_generate'),
			);
		}

		const url = response.url;
		const qrCodeEmbed = new EmbedBuilder()
			.setColor(Colors.White)
			.setTitle(interaction.client.i18n.t('commands.qrcode.qr_code'))
			.setDescription(
				interaction.client.i18n.t('commands.qrcode.qr_code_generated'),
			)
			.setImage(url)
			.setTimestamp();

		if (interaction.replied)
			return await interaction.followUp({ embeds: [qrCodeEmbed] });

		return await interaction.editReply({ embeds: [qrCodeEmbed] });
	},
};
