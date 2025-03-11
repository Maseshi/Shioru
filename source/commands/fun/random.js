const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	InteractionContextType,
} = require('discord.js');
const { catchError } = require('../../utils/consoleUtils');

module.exports = {
	permissions: [
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.AttachFiles,
	],
	data: new SlashCommandBuilder()
		.setName('random')
		.setDescription('Randomize what you want')
		.setDescriptionLocalizations({ th: 'สุ่มสิ่งที่ต้องการ' })
		.setDefaultMemberPermissions()
		.setContexts([
			InteractionContextType.BotDM,
			InteractionContextType.Guild,
			InteractionContextType.PrivateChannel,
		])
		.addSubcommand((subcommand) =>
			subcommand
				.setName('items')
				.setDescription('Randomly select one of the items.')
				.setDescriptionLocalizations({ th: 'สุ่มเลือกหนึ่งในรายการ' })
				.addStringOption((option) =>
					option
						.setName('item')
						.setDescription('item separated by ","')
						.setDescriptionLocalizations({ th: 'รายการคั่นด้วย ","' }),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('number')
				.setDescription('Random number')
				.setDescriptionLocalizations({ th: 'สุ่มตัวเลข' })
				.addNumberOption((option) =>
					option
						.setName('min')
						.setDescription('The minimum number')
						.setDescriptionLocalizations({ th: 'จำนวนขั้นต่ำ' })
						.setRequired(true),
				)
				.addNumberOption((option) =>
					option
						.setName('max')
						.setDescription('The maximum number')
						.setDescriptionLocalizations({ th: 'จำนวนสูงสุด' })
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('image')
				.setDescription('Randomly select the desired image.')
				.setDescriptionLocalizations({ th: 'สุ่มภาพที่ต้องการ' })
				.addNumberOption((option) =>
					option
						.setName('width')
						.setDescription('Image width size.')
						.setDescriptionLocalizations({ th: 'ขนาดความกว้างของรูปภาพ' }),
				)
				.addNumberOption((option) =>
					option
						.setName('height')
						.setDescription('Image height size.')
						.setDescriptionLocalizations({ th: 'ขนาดความสูงของรูปภาพ' }),
				)
				.addNumberOption((option) =>
					option
						.setName('amount')
						.setDescription('Number of images required.')
						.setDescriptionLocalizations({ th: 'จำนวนของรูปภาพที่ต้องการ' })
						.setMinValue(1),
				)
				.addBooleanOption((option) =>
					option
						.setName('grayscale')
						.setDescription('Want the image to be in grayscale?')
						.setDescriptionLocalizations({
							th: 'ต้องการให้รูปภาพเป็นแบบระดับสีเทาหรือไม่',
						}),
				)
				.addIntegerOption((option) =>
					option
						.setName('blur')
						.setDescription('Image height size.')
						.setDescriptionLocalizations({
							th: 'สามารถทำการเบลอรูปภาพได้ตามขนาด',
						})
						.setMinValue(1)
						.setMaxValue(10),
				)
				.addStringOption((option) =>
					option
						.setName('format')
						.setDescription('Change the format of the image')
						.setDescriptionLocalizations({ th: 'เปลี่ยนรูปแบบของภาพ' })
						.addChoices(
							{ name: 'WebP', value: '.webp' },
							{ name: 'JPG', value: '.jpg' },
						),
				),
		),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const inputItem = interaction.options.getString('item');
		let inputMin = interaction.options.getNumber('min');
		let inputMax = interaction.options.getNumber('max');
		const inputWidth = interaction.options.getNumber('width') ?? 1920;
		const inputHeight = interaction.options.getNumber('height') ?? 1080;
		const inputAmount = interaction.options.getNumber('amount') ?? 1;
		const inputGrayscale = interaction.options.getBoolean('grayscale') ?? false;
		const inputBlur = interaction.options.getInteger('blur') ?? 0;
		const inputFormat = interaction.options.getString('format') ?? '';

		switch (subcommand) {
			case 'items': {
				const items = inputItem.split(',');
				const result = items[Math.floor(Math.random() * items.length)];

				await interaction.reply(
					interaction.client.i18n.t('commands.random.result', {
						result: result,
					}),
				);
				break;
			}
			case 'number': {
				if (inputMin > inputMax) {
					const temp = inputMax;
					inputMax = inputMin;
					inputMin = temp;
				}

				const result =
					Math.floor(Math.random() * (inputMax - inputMin + 1)) + inputMin;

				await interaction.reply(
					interaction.client.i18n.t('commands.random.result', {
						result: result,
					}),
				);
				break;
			}
			case 'image': {
				await interaction.deferReply();

				const images = [];
				const endpoint = 'https://picsum.photos';
				const sizePath = `/${inputWidth}/${inputHeight}`;
				const fileType = `${inputFormat}`;

				try {
					for (let i = 0; i < inputAmount; i++) {
						const options =
							'?' +
							[
								`random=${i + 1}`,
								inputGrayscale ? 'grayscale' : '',
								inputBlur ? `blur=${inputBlur}` : '',
							].join('&');
						const response = await fetch(
							endpoint + sizePath + fileType + options,
						);

						if (response.status !== 200) return;

						images.push(response.url);
					}

					await interaction.editReply({ files: images });
				} catch (error) {
					if (error.message.includes('Request aborted'))
						return await interaction.editReply(
							interaction.client.i18n.t('commands.random.request_aborted'),
						);

					await interaction.editReply(
						interaction.client.i18n.t('commands.random.request_error'),
					);
					catchError(
						interaction.client,
						interaction,
						module.exports.data.name,
						error,
						true,
					);
				}
				break;
			}
		}
	},
};
