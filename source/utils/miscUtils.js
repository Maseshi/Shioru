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
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const regex = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find((item) => number >= item.value);

  return item
    ? (number / item.value).toFixed(digits).replace(regex, "$1") + item.symbol
    : "0";
};

/**
 * Checks if a given string contains a valid URL.
 *
 * @param {string} string - The input string to be checked.
 * @returns {boolean} - Returns true if the input string contains a valid URL, otherwise returns false.
 */
const containsURL = (string) => {
  return string.test(
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
  );
};

/**
 * Returns an array of emotes found in the given string.
 *
 * @param {string} string - The input string to search for emotes.
 * @returns {Array} - An array of emotes found in the string.
 */
const matchEmotes = (string) => {
  return string.match(/<a?:.+?:\d+>|\p{Extended_Pictographic}/gu);
};

/**
 * Returns a string by joining the input strings with newline characters.
 *
 * @param {...string} string - The input strings to be joined.
 * @returns {string} - A string formed by joining the input strings with newline characters.
 */
const newLines = (...string) => {
  return string.join("\n");
};

/**
 * Generates a new title by capitalizing the first letter of each word in the input string.
 *
 * @param {string} string - The input string to generate the new title from.
 * @returns {string} - The new title generated from the input string.
 */
const newTitle = (string) => {
  return string.replaceAll(
    /\w\S*/g,
    string.charAt(0).toUpperCase() + string.substring(1).toLowerCase(),
  );
};

/**
 * Generates a new ID by converting the input string to lowercase and replacing certain characters with hyphens.
 *
 * @param {string} string - The input string to generate the new ID from.
 * @returns {string} - The new ID generated from the input string.
 */
const newID = (string) => {
  return string.toLowerCase().replaceAll(/([[\]{}_.:-])\s?/g, "-");
};

module.exports = {
  currencyFormatter,
  containsURL,
  matchEmotes,
  newLines,
  newTitle,
  newID,
};
