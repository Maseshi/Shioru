const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  Colors,
} = require('discord.js')
const { get } = require('axios').default

module.exports = {
  category: 'information',
  permissions: [
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
  ],
  usage: 'covid <country(String)>',
  data: new SlashCommandBuilder()
    .setName('covid')
    .setDescription('Get covid statistics for a country')
    .setDescriptionLocalizations({
      th: 'สำหรวจสถิติโควิดในประเทศที่ต้องการ',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('country')
        .setDescription('Countries you want to explore statistics on COVID-19')
        .setDescriptionLocalizations({
          th: 'ประเทศที่คุณต้องการจะสำรวจสถิติเกี่ยวกับเชื้อไวรัสโควิด 19',
        })
        .setRequired(true)
    ),
  async execute(interaction) {
    const inputCountry = interaction.options.getString('country')

    try {
      const response = await get(
        'https://disease.sh/v3/covid-19/countries/' + inputCountry
      )

      if (response.status === 404)
        return await interaction.reply(
          interaction.client.i18n.t('commands.covid.country_not_found')
        )
      if (!response.data)
        return await interaction.reply(
          interaction.client.i18n.t('commands.covid.backend_issue')
        )

      const date = new Date(response.updated)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      const hours = date.getHours()
      const minutes = '0' + date.getMinutes()
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
        minutes.slice(-2)

      const covidEmbed = new EmbedBuilder()
        .setTitle('🧫 Covid - %s'.replace('%s', response.country))
        .setThumbnail(response.countryInfo.flag)
        .setColor(Colors.Blue)
        .addFields([
          {
            name: interaction.client.i18n.t('commands.covid.cases_total'),
            value: response.cases.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.covid.cases_today'),
            value: response.todayCases.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.covid.deaths_total'),
            value: response.deaths.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.covid.deaths_today'),
            value: response.todayDeaths.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.covid.recovered'),
            value: response.recovered.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.covid.active'),
            value: response.active.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.covid.critical_stage'),
            value: response.critical.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t(
              'commands.covid.cases_per_one_million'
            ),
            value: response.casesPerOneMillion.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.covid.tests'),
            value: response.tests.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t(
              'commands.covid.tests_per_one_million'
            ),
            value: response.testsPerOneMillion.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.covid.population'),
            value: response.population.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t(
              'commands.covid.one_case_per_people'
            ),
            value: response.oneCasePerPeople.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t(
              'commands.covid.one_death_per_people'
            ),
            value: response.oneDeathPerPeople.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t(
              'commands.covid.one_test_per_people'
            ),
            value: response.oneTestPerPeople.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t(
              'commands.covid.active_per_one_million'
            ),
            value: response.activePerOneMillion.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t(
              'commands.covid.recovered_per_one_million'
            ),
            value: response.recoveredPerOneMillion.toLocaleString(),
            inline: true,
          },
          {
            name: interaction.client.i18n.t(
              'commands.covid.critical_per_one_million'
            ),
            value: response.criticalPerOneMillion.toLocaleString(),
            inline: true,
          },
        ])
        .setFooter({
          text: interaction.client.i18n
            .t('commands.covid.updated_on')
            .replace('%s', formattedTime),
        })

      await interaction.reply({ embeds: [covidEmbed] })
    } catch (error) {
      await interaction.reply(
        interaction.client.i18n.t('commands.covid.country_not_found')
      )
    }
  },
}
