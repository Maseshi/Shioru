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
    const response = await fetch(releasesURL)

    if (response.status !== 200)
      child.warn('Unable to detect latest version at this time.')

    const data = await response.json()

    if (data) {
      if (version >= data.tag_name) {
        child.info('Currently using the latest version.')
      } else {
        child.info(`Update is available ${version} -> ${data.tag_name}).`)
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
      await fetch(
        `https://api.statuspage.io/v1/pages/${pageId}/metrics/${metricId}/data.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `OAuth ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              timestamp: currentTimestamp,
              value: randomValue,
            },
          }),
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

  let intervalID = null
  const child = logger.child({}, { msgPrefix: '[STSu] ' })

  child.info('Sending statistics data to Top.gg...')

  try {
    intervalID = setInterval(async () => {
      if (client.shards.size > 0 && client.shards.every((shard) => shard.ready))
        return
      const results = await client.fetchClientValues('guilds.cache.size')
      const guildCount = results.reduce(
        (acc, guildCount) => acc + guildCount,
        0
      )
      const shardCount = results.length
      const response = await fetch('https://top.gg/api/bots/stats', {
        method: 'POST',
        headers: {
          Authorization: topGGToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          server_count: guildCount,
          shard_count: shardCount,
        }),
      })

      if (response.status !== 200) {
        child.warn(
          {
            url: response.url,
            status: {
              id: response.status,
              text: response.statusText,
            },
          },
          'Unable to post statistical data to Top.gg.'
        )
        return clearInterval(intervalID)
      }
    }, 1800000)

    child.info(`Posted statistics data to Top.gg.`)
  } catch (error) {
    child.error(
      error,
      'An error occurred while sending statistics data to Top.gg.'
    )
  }
}

module.exports = {
  updateChecker,
  systemMetricsSubmitter,
  statisticsSubmitter,
}
