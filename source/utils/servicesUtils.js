const { AutoPoster } = require('topgg-autoposter')
const { get, post } = require('axios').default
const { logger } = require('./consoleUtils')
const { version } = require('../../package.json')
const configs = require('../configs/data')

/**
 * Function to check for updates from Github.
 *
 * @returns {Promise<void>} - A promise that resolves when the update check is complete.
 */
const updateChecker = async () => {
  const enable = configs.check_update.enable
  const releasesURL = configs.check_update.releases_url

  if (!enable) return
  if (!releasesURL) return

  const child = logger.child({}, { msgPrefix: '[UC] ' })

  child.info('Checking for updates from Github...')

  try {
    const response = await get(releasesURL)

    if (response.status !== 200)
      child.warn('Unable to detect latest version at this time.')
    if (response.data) {
      if (version >= response.data.tag_name) {
        child.info('Currently using the latest version.')
      } else {
        child.info(
          `Update is available ${version} -> ${response.data.tag_name}).`
        )
        child.info('Run npm pull to update')
      }
    }
  } catch (error) {
    child.error(error, 'Failed to check for new updates')
  }
}

/**
 * Submits system metrics data to the status page.
 *
 * @returns {void}
 */
const systemMetricsSubmitter = () => {
  const apiKey = configs.monitoring.apiKey
  const pageId = configs.monitoring.pageId
  const metricId = configs.monitoring.metricId

  if (!apiKey) return
  if (!pageId) return
  if (!metricId) return

  const totalPoints = (60 / 5) * 24
  const epochInSeconds = Math.floor(new Date() / 1000)
  const child = logger.child({}, { msgPrefix: '[SMSu] ' })

  child.info('Sending system matrix data to status page...')

  const submitPoint = async (count) => {
    ++count

    if (count > totalPoints)
      return child.info('Done, the matrix has been updated.')

    const currentTimestamp = epochInSeconds - (count - 1) * 5 * 60
    const randomValue = Math.floor(Math.random() * 1000)

    try {
      await post(
        `https://api.statuspage.io/v1/pages/${pageId}/metrics/${metricId}/data.json`,
        {
          data: {
            timestamp: currentTimestamp,
            value: randomValue,
          },
        },
        {
          headers: {
            Authorization: `OAuth ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      )

      child.info(
        `Testing processing submitted point ${count} of ${totalPoints}`
      )

      setTimeout(() => submitPoint(count), 1000)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        child.error(
          'Error encountered. Please ensure that your page code and authorization key are correct.'
        )
      } else {
        child.error(
          error,
          'An error occurred while sending data to the matrix.'
        )
      }
    }
  }

  submitPoint(0)
}

/**
 * Function: statisticsSubmitter
 *
 * Description:
 * This function submits statistics data to Top.gg using the provided client and topGGToken.
 * It logs the process and handles any errors that occur during the submission.
 *
 * Parameters:
 * - client: The client object used for submitting the statistics data.
 *
 * Returns:
 * This function does not return any value.
 */
const statisticsSubmitter = (client) => {
  const topGGToken = configs.top_gg_token

  if (!topGGToken) return

  const child = logger.child({}, { msgPrefix: '[SSSu] ' })

  child.info('Sending statistics data to Top.gg...')

  const poster = AutoPoster(topGGToken, client)

  poster.on('posted', (stats) => {
    child.info(
      `Posted statistics data to Top.gg with ${stats.serverCount} servers`
    )
  })
  poster.on('error', (error) => {
    child.error(error, `Unable to post statistical data to Top.gg.`)
  })
}

module.exports = {
  updateChecker,
  systemMetricsSubmitter,
  statisticsSubmitter,
}
