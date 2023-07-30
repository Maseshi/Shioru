const supportTranslate = {
    "af": "Afrikaans",
    "sq": "Albanian",
    "am": "Amharic",
    "ar": "Arabic",
    "hy": "Armenian",
    "az": "Azerbaijani",
    "eu": "Basque",
    "be": "Belarusian",
    "bn": "Bengali",
    "bs": "Bosnian",
    "bg": "Bulgarian",
    "ca": "Catalan",
    "ceb": "Cebuano",
    "ny": "Chichewa",
    "zh-CN": "Chinese (Simplified)",
    "zh-TW": "Chinese (Traditional)",
    "co": "Corsican",
    "hr": "Croatian",
    "cs": "Czech",
    "da": "Danish",
    "nl": "Dutch",
    "en": "English",
    "eo": "Esperanto",
    "et": "Estonian",
    "tl": "Filipino",
    "fi": "Finnish",
    "fr": "French",
    "fy": "Frisian",
    "gl": "Galician",
    "ka": "Georgian",
    "de": "German",
    "el": "Greek",
    "gu": "Gujarati",
    "ht": "Haitian Creole",
    "ha": "Hausa",
    "haw": "Hawaiian",
    "he": "Hebrew",
    "iw": "Hebrew",
    "hi": "Hindi",
    "hmn": "Hmong",
    "hu": "Hungarian",
    "is": "Icelandic",
    "ig": "Igbo",
    "id": "Indonesian",
    "ga": "Irish",
    "it": "Italian",
    "ja": "Japanese",
    "jw": "Javanese",
    "kn": "Kannada",
    "kk": "Kazakh",
    "km": "Khmer",
    "ko": "Korean",
    "ku": "Kurdish (Kurmanji)",
    "ky": "Kyrgyz",
    "lo": "Lao",
    "la": "Latin",
    "lv": "Latvian",
    "lt": "Lithuanian",
    "lb": "Luxembourgish",
    "mk": "Macedonian",
    "mg": "Malagasy",
    "ms": "Malay",
    "ml": "Malayalam",
    "mt": "Maltese",
    "mi": "Maori",
    "mr": "Marathi",
    "mn": "Mongolian",
    "my": "Myanmar (Burmese)",
    "ne": "Nepali",
    "no": "Norwegian",
    "ps": "Pashto",
    "fa": "Persian",
    "pl": "Polish",
    "pt": "Portuguese",
    "pa": "Punjabi",
    "ro": "Romanian",
    "ru": "Russian",
    "sm": "Samoan",
    "gd": "Scots Gaelic",
    "sr": "Serbian",
    "st": "Sesotho",
    "sn": "Shona",
    "sd": "Sindhi",
    "si": "Sinhala",
    "sk": "Slovak",
    "sl": "Slovenian",
    "so": "Somali",
    "es": "Spanish",
    "su": "Sundanese",
    "sw": "Swahili",
    "sv": "Swedish",
    "tg": "Tajik",
    "ta": "Tamil",
    "te": "Telugu",
    "th": "Thai",
    "tr": "Turkish",
    "uk": "Ukrainian",
    "ur": "Urdu",
    "uz": "Uzbek",
    "vi": "Vietnamese",
    "cy": "Welsh",
    "xh": "Xhosa",
    "yi": "Yiddish",
    "yo": "Yoruba",
    "zu": "Zulu"
}

const timeFormat = (timeInSeconds) => {
    const days = Math.floor((timeInSeconds % 31536000) / 86400);
    const hours = Math.floor((timeInSeconds % 86400) / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.round(timeInSeconds % 60);

    return (
        (days > 0 ? days + " days, " : "") +
        (hours > 0 ? hours + " hours, " : "") +
        (minutes > 0 ? minutes + " minutes, " : "") +
        (seconds > 0 ? seconds + " seconds" : "")
    );
}

/**
 * Convert time and date.
 * 
 * @param {Client} client 
 * @param {Date} data 
 * @returns 
 */
const dateFormat = (client, data) => {
    if (!data) return console.log("[dateFormat] Please enter date information to continue.");

    const date = new Date(data);
    const days = [
        client.translate.utils.miscUtils.sunday,
        client.translate.utils.miscUtils.monday,
        client.translate.utils.miscUtils.tuesday,
        client.translate.utils.miscUtils.wednesday,
        client.translate.utils.miscUtils.thursday,
        client.translate.utils.miscUtils.friday,
        client.translate.utils.miscUtils.saturday
    ];
    const months = [
        client.translate.utils.miscUtils.january,
        client.translate.utils.miscUtils.february,
        client.translate.utils.miscUtils.march,
        client.translate.utils.miscUtils.april,
        client.translate.utils.miscUtils.may,
        client.translate.utils.miscUtils.june,
        client.translate.utils.miscUtils.july,
        client.translate.utils.miscUtils.august,
        client.translate.utils.miscUtils.september,
        client.translate.utils.miscUtils.october,
        client.translate.utils.miscUtils.november,
        client.translate.utils.miscUtils.december
    ];

    return client.translate.utils.miscUtils.format_at
        .replace("%s1", days[date.getDay()])
        .replace("%s2", date.getDate())
        .replace("%s3", months[date.getMonth()])
        .replace("%s4", date.getFullYear())
        .replace("%s5", date.getHours())
        .replace("%s6", date.getMinutes());
};

/**
 * Convert the time to the remaining time before continuing.
 * 
 * @param {Integer} timeUntil 
 * @returns 
 */
const remainingTime = (timeUntil) => {
    const seconds = Math.abs((timeUntil - new Date()) / 1000);
    const time = timeFormat(seconds);

    return time;
}

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
        { "value": 1, "symbol": "" },
        { "value": 1e3, "symbol": "k" },
        { "value": 1e6, "symbol": "M" },
        { "value": 1e9, "symbol": "G" },
        { "value": 1e12, "symbol": "T" },
        { "value": 1e15, "symbol": "P" },
        { "value": 1e18, "symbol": "E" }
    ];
    const regex = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup.slice().reverse().find((item) => number >= item.value);

    return item ? (number / item.value).toFixed(digits).replace(regex, "$1") + item.symbol : "0";
}

/**
 * Convert text to ID
 * 
 * @param {String} text 
 */
const IDConvertor = (text) => {
    return text.toLowerCase().replace(/[^\w\s]/g, "-").replace(/ +/g, "-");
}


module.exports = {
    supportTranslate,
    timeFormat,
    dateFormat,
    remainingTime,
    currencyFormatter,
    IDConvertor
};
