/**
 * This helps in reducing the length of numbers from the thousands and above.
 * To make it easier to read and keep statistics.
 *
 * @param {Number} number The number want to convert
 * @param {Number} digits The number of decimals to be stored.
 * @returns A string of converted numbers: e.g. **12.34k**
 * @example currencyFormatter(12345, 2); // => 12.34k
 */
const currencyFormatter = (number, digits) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ]
  const regex = /\.0+$|(\.[0-9]*[1-9])0+$/
  const item = lookup
    .slice()
    .reverse()
    .find((item) => number >= item.value)

  return item
    ? (number / item.value).toFixed(digits).replace(regex, '$1') + item.symbol
    : '0'
}

/**
 * The `validateURL` function checks if a given string is a valid URL.
 * @param {String} string - The `string` parameter represents the URL that needs to be validated.
 * @returns The function `validateURL` returns a boolean value. It returns `true` if the input string
 * is a valid URL, and `false` otherwise.
 */
const validateURL = (string) => {
  const pattern = new RegExp(
    '^' + // Start of the line
      '(https?:\\/\\/)?' + // Protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // Domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // Port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // Query string
      '(\\#[-a-z\\d_]*)?' + // Fragment locator
      '$', // End of the line.
    'i'
  )

  return !!pattern.test(string)
}

/**
 * Returns an array of emotes found in the given string.
 *
 * @param {string} str - The input string to search for emotes.
 * @returns {Array} - An array of emotes found in the string.
 */
const matchEmotes = (str) => {
  return str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu)
}

/**
 * Returns a string by joining the input strings with newline characters.
 *
 * @param {...string} string - The input strings to be joined.
 * @returns {string} - A string formed by joining the input strings with newline characters.
 */
const newLines = (...string) => {
  return string.join('\n')
}

module.exports = {
  currencyFormatter,
  validateURL,
  matchEmotes,
  newLines,
}
