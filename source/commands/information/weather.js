const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
  InteractionContextType,
} = require('discord.js')
const { newLines, newID } = require('../../utils/miscUtils')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription("See today's weather in each area.")
    .setDescriptionLocalizations({
      th: 'ดูสภาพอากาศของวันนี้ในแต่ละพื้นที่ที่ต้องการ',
    })
    .setDefaultMemberPermissions()
    .setContexts([
      InteractionContextType.BotDM,
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ])
    .addStringOption((option) =>
      option
        .setName('city')
        .setDescription('Name the city for which you want to know the weather.')
        .setDescriptionLocalizations({
          th: 'ชื่อเมืองที่คุณต้องการทราบสภาพอากาศ',
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('unit')
        .setDescription('Unit of measure for weather conditions.')
        .setDescriptionLocalizations({
          th: 'หน่วยวัดของสภาพอากาศ',
        })
        .addChoices(
          { name: 'Kelvin', value: 'standard' },
          { name: 'Celsius', value: 'metric' },
          { name: 'Fahrenheit', value: 'imperial' }
        )
    ),
  async execute(interaction) {
    const inputCity = interaction.options.getString('city')
    const inputUnit = interaction.options.getString('unit') ?? 'standard'

    await interaction.deferReply()

    const geoService = async (query, token) => {
      const geoURL = new URL('https://api.openweathermap.org/geo/1.0/direct')

      geoURL.searchParams.append('q', query)
      geoURL.searchParams.append('appid', token)

      const response = await fetch(geoURL)

      if (response.status !== 200) return response.status
      return await response.json()
    }
    const weatherService = async (
      latitude,
      longitude,
      units,
      language,
      token
    ) => {
      const weatherService = new URL(
        'https://api.openweathermap.org/data/2.5/weather'
      )

      weatherService.searchParams.append('lat', latitude)
      weatherService.searchParams.append('lon', longitude)
      weatherService.searchParams.append('units', units)
      weatherService.searchParams.append('lang', language)
      weatherService.searchParams.append('appid', token)

      const response = await fetch(weatherService)

      if (response.status !== 200) return response.status
      return await response.json()
    }

    const token = interaction.client.configs.open_weather_token
    const tempUnits = {
      standard: interaction.client.i18n.t('commands.weather.kelvin'),
      metric: interaction.client.i18n.t('commands.weather.celsius'),
      imperial: interaction.client.i18n.t('commands.weather.fahrenheit'),
    }
    const speedUnits = {
      standard: interaction.client.i18n.t('commands.weather.meter_per_seconds'),
      metric: interaction.client.i18n.t('commands.weather.meter_per_seconds'),
      imperial: interaction.client.i18n.t('commands.weather.miles_per_hour'),
    }

    if (!token)
      return await interaction.editReply(
        interaction.client.i18n.t('commands.weather.no_token_provider')
      )

    const query = newID(inputCity)
    const geoResponse = await geoService(query, token)

    if (typeof geoResponse === 'number')
      return await interaction.editReply(
        interaction.client.i18n.t('commands.weather.no_result_found', {
          status_code: geoResponse,
        })
      )

    const latitude = geoResponse[0].lat
    const longitude = geoResponse[0].lon
    const weatherResponse = await weatherService(
      latitude,
      longitude,
      inputUnit,
      interaction.locale,
      token
    )

    if (typeof weatherResponse === 'number')
      return await interaction.editReply(
        interaction.client.i18n.t('commands.weather.error_with_code', {
          status_code: weatherResponse,
        })
      )

    const tempUnit = tempUnits[inputUnit]
    const speedUnit = speedUnits[inputUnit]
    const weather = weatherResponse.weather[0].main
    const description = weatherResponse.weather[0].description
    const icon = weatherResponse.weather[0].icon
    const base = weatherResponse.base
    const temp = weatherResponse.main.temp
    const feelsLike = weatherResponse.main.feels_like
    const tempMin = weatherResponse.main.temp_min
    const tempMax = weatherResponse.main.temp_max
    const pressure = weatherResponse.main.pressure
    const humidity = weatherResponse.main.humidity
    const seaLevel = weatherResponse.main.sea_level
    const groundLevel = weatherResponse.main.grnd_level
    const visibility = weatherResponse.visibility
    const windSpeed = weatherResponse.wind.speed
    const windDeg = weatherResponse.wind.deg
    const windGust = weatherResponse.wind.gust
    const cloudsAll = weatherResponse.clouds.all
    const rainOneHour = weatherResponse.rain?.['1h']
    const rainThreeHour = weatherResponse.rain?.['3h']
    const snowOneHour = weatherResponse.snow?.['1h']
    const snowThreeHour = weatherResponse.snow?.['3h']
    const dt = weatherResponse.dt
    const sysCountry = weatherResponse.sys.country
    const name = weatherResponse.name

    const clientAvatar = interaction.client.user.avatarURL()
    const weatherEmbed = new EmbedBuilder()
      .setColor(Colors.Blue)
      .setTitle(interaction.client.i18n.t('commands.weather.weather'))
      .setDescription(
        interaction.client.i18n.t('commands.weather.weather_moment', {
          city: name,
          country: sysCountry.toLowerCase(),
          weather: weather,
          description: description,
        })
      )
      .setTimestamp(dt * 1000)
      .setThumbnail(`https://openweathermap.org/img/wn/${icon}@2x.png`)
      .setFooter({
        text: interaction.client.i18n.t('commands.weather.time_to_calculate'),
        iconURL: clientAvatar,
      })
      .setFields([
        {
          name: interaction.client.i18n.t('commands.weather.data_from'),
          value: base,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.weather.temperature'),
          value: `${String(temp)} ${tempUnit}`,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.weather.feels_like'),
          value: `${String(feelsLike)} ${tempUnit}`,
          inline: true,
        },
        {
          name: interaction.client.i18n.t(
            'commands.weather.lowest_temperature'
          ),
          value: `${String(tempMin)} ${tempUnit}`,
          inline: true,
        },
        {
          name: interaction.client.i18n.t(
            'commands.weather.highest_temperature'
          ),
          value: `${String(tempMax)} ${tempUnit}`,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.weather.pressure'),
          value: `${String(pressure)} hPa`,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.weather.humidity'),
          value: `${String(humidity)}%`,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.weather.sea_level'),
          value: `${String(seaLevel)} hPa`,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.weather.ground_level'),
          value: `${String(groundLevel)} hPa`,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.weather.visibility'),
          value: `${String(visibility / 1000)} km`,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.weather.wind_speed'),
          value: `${String(windSpeed)} ${speedUnit}`,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.weather.wind_direction'),
          value: `${String(windDeg)}°`,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.weather.wind_gust'),
          value: `${String(windGust)} ${speedUnit}`,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.weather.clouds'),
          value: `${String(cloudsAll)}%`,
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.weather.rainfall'),
          value:
            rainThreeHour || rainOneHour
              ? newLines(
                  rainThreeHour ? `${String(rainThreeHour)} mm>3h` : null,
                  rainOneHour ? `${String(rainOneHour)} mm>1h` : null
                )
              : interaction.client.i18n.t('commands.weather.none'),
          inline: true,
        },
        {
          name: interaction.client.i18n.t('commands.weather.snowfall'),
          value:
            snowThreeHour || snowOneHour
              ? newLines(
                  snowThreeHour ? `${String(snowThreeHour)} mm>3h` : null,
                  snowOneHour ? `${String(snowOneHour)} mm>1h` : null
                )
              : interaction.client.i18n.t('commands.weather.none'),
          inline: true,
        },
      ])

    await interaction.editReply({ embeds: [weatherEmbed] })
  },
}
