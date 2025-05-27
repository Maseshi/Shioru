const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
	Colors,
	InteractionContextType,
	ApplicationIntegrationType,
} = require('discord.js');

module.exports = {
	permissions: [
		PermissionFlagsBits.SendMessages,
		PermissionFlagsBits.EmbedLinks,
	],
	data: new SlashCommandBuilder()
		.setName('covid')
		.setDescription('Get covid statistics for a country')
		.setDescriptionLocalizations({ th: 'สำหรวจสถิติโควิดในประเทศที่ต้องการ' })
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
		.addStringOption((option) =>
			option
				.setName('country')
				.setDescription('Countries you want to explore statistics on COVID-19')
				.setDescriptionLocalizations({
					th: 'ประเทศที่คุณต้องการจะสำรวจสถิติเกี่ยวกับเชื้อไวรัสโควิด 19',
				})
				.setRequired(true),
		),
	async execute(interaction) {
		const inputCountry = interaction.options.getString('country');

		await interaction.deferReply();

		const response = await fetch(
			`https://disease.sh/v3/covid-19/countries/${inputCountry}`,
		);

		if (response.status !== 200)
			return await interaction.editReply(
				interaction.client.i18n.t('commands.covid.country_not_found'),
			);

		const data = await response.json();

		if (!data)
			return await interaction.editReply(
				interaction.client.i18n.t('commands.covid.backend_issue'),
			);

		const date = new Date(data.updated);
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();
		const hours = date.getHours();
		const minutes = '0' + date.getMinutes();
		const formattedTime =
			day +
			'/' +
			month +
			'/' +
			year +
			' ' +
			interaction.client.i18n.t('commands.covid.when') +
			' ' +
			hours +
			':' +
			minutes.slice(-2);

		const covidEmbed = new EmbedBuilder()
			.setTitle('🧫 Covid - %s'.replace('%s', data.country))
			.setThumbnail(data.countryInfo.flag)
			.setColor(Colors.Blue)
			.addFields([
				{
					name: interaction.client.i18n.t('commands.covid.cases_total'),
					value: data.cases.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t('commands.covid.cases_today'),
					value: data.todayCases.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t('commands.covid.deaths_total'),
					value: data.deaths.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t('commands.covid.deaths_today'),
					value: data.todayDeaths.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t('commands.covid.recovered'),
					value: data.recovered.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t('commands.covid.active'),
					value: data.active.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t('commands.covid.critical_stage'),
					value: data.critical.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t(
						'commands.covid.cases_per_one_million',
					),
					value: data.casesPerOneMillion.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t('commands.covid.tests'),
					value: data.tests.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t(
						'commands.covid.tests_per_one_million',
					),
					value: data.testsPerOneMillion.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t('commands.covid.population'),
					value: data.population.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t('commands.covid.one_case_per_people'),
					value: data.oneCasePerPeople.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t(
						'commands.covid.one_death_per_people',
					),
					value: data.oneDeathPerPeople.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t('commands.covid.one_test_per_people'),
					value: data.oneTestPerPeople.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t(
						'commands.covid.active_per_one_million',
					),
					value: data.activePerOneMillion.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t(
						'commands.covid.recovered_per_one_million',
					),
					value: data.recoveredPerOneMillion.toLocaleString(),
					inline: true,
				},
				{
					name: interaction.client.i18n.t(
						'commands.covid.critical_per_one_million',
					),
					value: data.criticalPerOneMillion.toLocaleString(),
					inline: true,
				},
			])
			.setFooter({
				text: interaction.client.i18n
					.t('commands.covid.updated_on')
					.replace('%s', formattedTime),
			});

		await interaction.editReply({ embeds: [covidEmbed] });
	},
};
