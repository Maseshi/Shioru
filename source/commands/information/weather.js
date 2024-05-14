const {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  PermissionFlagsBits,
} = require('discord.js')
const { catchError } = require('../../utils/consoleUtils')

module.exports = {
  permissions: [PermissionFlagsBits.SendMessages],
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription("See today's weather in each area.")
    .setDescriptionLocalizations({
      th: 'ดูสภาพอากาศของวันนี้ในแต่ละพื้นที่ที่ต้องการ',
    })
    .setDefaultMemberPermissions()
    .setDMPermission(true)
    .addStringOption((option) =>
      option
        .setName('location')
        .setDescription('The location you want to know the weather')
        .setDescriptionLocalizations({
          th: 'พื้นที่ที่คุณต้องการทราบสภาพอากาศ',
        })
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('degree_type')
        .setDescription('Unit of measure for weather conditions.')
        .setDescriptionLocalizations({
          th: 'หน่วยวัดของสภาพอากาศ',
        })
        .setRequired(false)
        .addChoices(
          { name: 'Metric', value: 'M' },
          { name: 'Scientific', value: 'S' },
          { name: 'Fahrenheit', value: 'I' }
        )
    ),
  async execute(interaction) {
    const inputLocation = interaction.options.getString('location')
    const inputDegreeType = interaction.options.getString('degree_type') ?? 'C'

    await interaction.deferReply()

    const token = interaction.client.configs.weatherbit_token
    const service = 'https://api.weatherbit.io/v2.0/current'

    if (!token)
      return await interaction.editReply(
        interaction.client.i18n.t('commands.weather.no_token_provider')
      )

    try {
      const response = await fetch(
        `${service}?key=${token}&lang=en&units=${inputDegreeType}&city=${encodeURIComponent(inputLocation)}`
      )
      const json = await response.json()

      if (!json || !json.data || !json.data.length)
        return await interaction.editReply(
          interaction.client.i18n.t('commands.weather.cannot_parse_data')
        )
      if (!json.data[0])
        return await interaction.editReply(
          interaction.client.i18n.t('commands.weather.no_result_found')
        )

      const city = json.data[0]
      const latitude = city.lat.toString()
      const longitude = city.lon.toString()
      const sunrise = city.sunrise
      const sunset = city.sunset
      const timezone = city.timezone
      const observationTime = city.ob_time
      const cityName = city.city_name
      const countryCode = city.country_code
      const stateCode = city.state_code
      const pres = city.pres.toString()
      const seaLevel = city.slp.toString()
      const windSpeed = city.wind_spd.toString()
      const windGustSpeed = city.gust.toString()
      const windDirection = city.wind_dir.toString()
      const temperature = city.temp.toString()
      const feelsLike = city.app_temp.toString()
      const humidity = city.rh.toString()
      const dewPoint = city.dewpt.toString()
      const clouds = city.clouds.toString()
      const partOfDay = city.pod
      const icon = city.weather.icon
      const code = city.weather.code

      switch (code) {
        case 200:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.thunderstorm_with_light_rain'
          )
          break
        case 201:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.thunderstorm_with_rain'
          )
          break
        case 202:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.thunderstorm_with_heavy_rain'
          )
          break
        case 230:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.thunderstorm_with_light_drizzle'
          )
          break
        case 231:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.thunderstorm_with_drizzle'
          )
          break
        case 232:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.thunderstorm_with_heavy_drizzle'
          )
          break
        case 233:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.thunderstorm_with_hail'
          )
          break
        case 300:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.light_drizzle'
          )
          break
        case 301:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.drizzle'
          )
          break
        case 302:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.heavy_drizzle'
          )
          break
        case 500:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.light_rain'
          )
          break
        case 501:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.moderate_rain'
          )
          break
        case 502:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.heavy_rain'
          )
          break
        case 511:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.freezing_rain'
          )
          break
        case 520:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.light_shower_rain'
          )
          break
        case 521:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.shower_rain'
          )
          break
        case 522:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.heavy_shower_rain'
          )
          break
        case 600:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.light_snow'
          )
          break
        case 601:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.snow'
          )
          break
        case 602:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.heavy_snow'
          )
          break
        case 610:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.mix_snow_rain'
          )
          break
        case 611:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.sleet'
          )
          break
        case 612:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.heavy_sleet'
          )
          break
        case 621:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.snow_shower'
          )
          break
        case 622:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.heavy_snow_shower'
          )
          break
        case 623:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.flurries'
          )
          break
        case 700:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.mist'
          )
          break
        case 711:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.smoke'
          )
          break
        case 721:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.haze'
          )
          break
        case 731:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.sand_dust'
          )
          break
        case 741:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.fog'
          )
          break
        case 751:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.freezing_fog'
          )
          break
        case 800:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.clear_sky'
          )
          break
        case 801:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.few_clouds'
          )
          break
        case 802:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.scattered_clouds'
          )
          break
        case 803:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.broken_clouds'
          )
          break
        case 804:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.overcast_clouds'
          )
          break
        case 900:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.unknown_precipitation'
          )
          break
        default:
          city.weather.description = interaction.client.i18n.t(
            'commands.weather.unknown'
          )
      }

      const description = city.weather.description
      const visibility = city.vis.toString()
      const precipitationRate = city.precip.toString()
      const snowFall = city.snow.toString()
      const uv = city.uv.toString()
      const airQuality = city.aqi.toString()

      const weatherEmbed = new EmbedBuilder()
        .setTitle(interaction.client.i18n.t('commands.weather.weather'))
        .setDescription(
          interaction.client.i18n
            .t('commands.weather.weather_at_the_moment')
            .replace('%s1', cityName)
            .replace('%s2', description)
        )
        .setColor(Colors.Blue)
        .setThumbnail(
          'https://cdn.weatherbit.io/static/img/icons/' + icon + '.png'
        )
        .addFields([
          {
            name: interaction.client.i18n.t('commands.weather.latitude'),
            value: latitude + ' °',
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.longitude'),
            value: longitude + ' °',
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.sunrise'),
            value: sunrise,
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.sunset'),
            value: sunset,
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.timezone'),
            value: timezone,
            inline: true,
          },
          {
            name: interaction.client.i18n.t(
              'commands.weather.observation_time'
            ),
            value: observationTime,
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.country_code'),
            value: countryCode,
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.state_code'),
            value: stateCode,
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.pressure'),
            value:
              pres +
              ' ' +
              interaction.client.i18n.t('commands.weather.millibars'),
            inline: true,
          },
          {
            name: interaction.client.i18n.t(
              'commands.weather.sea_level_pressure'
            ),
            value:
              seaLevel +
              ' ' +
              interaction.client.i18n.t('commands.weather.millibars'),
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.wind_speed'),
            value: windSpeed + ' m/s',
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.wind_gust_speed'),
            value: windGustSpeed + ' m/s',
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.wind_direction'),
            value: windDirection + ' °',
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.temperature'),
            value: temperature + ' °' + inputDegreeType,
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.feels_like'),
            value: feelsLike + ' °' + inputDegreeType,
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.humidity'),
            value: humidity + '%',
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.dew_point'),
            value: dewPoint + ' °' + inputDegreeType,
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.clouds'),
            value: clouds,
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.part_of_the_day'),
            value:
              partOfDay === 'd'
                ? interaction.client.i18n.t('commands.weather.day')
                : interaction.client.i18n.t('commands.weather.night'),
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.visibility'),
            value: visibility + ' KM',
            inline: true,
          },
          {
            name: interaction.client.i18n.t(
              'commands.weather.liquid_equivalent_precipitation_rate'
            ),
            value: precipitationRate + ' mm/hr',
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.snow_fall'),
            value: snowFall + ' mm/hr',
            inline: true,
          },
          {
            name: interaction.client.i18n.t('commands.weather.uv_index'),
            value: uv,
            inline: true,
          },
          {
            name: interaction.client.i18n.t(
              'commands.weather.air_quality_index'
            ),
            value: airQuality,
            inline: true,
          },
        ])

      await interaction.editReply({ embeds: [weatherEmbed] })
    } catch (error) {
      if (error.response) {
        await interaction.editReply(
          interaction.client.i18n
            .t('commands.weather.error_with_code')
            .replace('%s', error.response.statusCode)
        )
        return catchError(
          interaction.client,
          interaction,
          module.exports.data.name,
          error.response.data,
          true
        )
      } else {
        await interaction.editReply(
          interaction.client.i18n.t('commands.weather.unknown_error')
        )
        return catchError(
          interaction.client,
          interaction,
          module.exports.data.name,
          error,
          true
        )
      }
    }
  },
}
