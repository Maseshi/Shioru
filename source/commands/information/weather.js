const weather = require("weather-js");
const catchError = require("../../extras/catchError");

module.exports.run = (client, message, args) => {
    const inputArea = args.join(" ");

    if (!inputArea) return message.reply(client.translate.commands.weather.empty);

    weather.find({
        "search": inputArea,
        "degreeType": "C"
    }, (error, result) => {
        if (error) return catchError(client, message, module.exports.help.name, error);
        if (!result) return message.channel.send(client.translate.commands.weather.no_result_found);

        const city = result[0];
        const current = city.current;
        const location = city.location;

        switch (current.skytext) {
            case "Clear":
                current.skytext = client.translate.commands.weather.clear_weather;
                break;
            case "Light Rain":
                current.skytext = client.translate.commands.weather.light_rain;
                break;
            case "Rain Showers":
                current.skytext = client.translate.commands.weather.rain_showers;
                break;
            case "Mostly Cloudy":
                current.skytext = client.translate.commands.weather.mostly_cloudy;
                break;
            case "Partly Sunny":
                current.skytext = client.translate.commands.weather.partly_sunny;
                break;
            case "Partly Cloudy":
                current.skytext = client.translate.commands.weather.partly_cloudy;
                break;
            case "Sunny":
                current.skytext = client.translate.commands.weather.sunny;
                break;
            case "Rain":
                current.skytext = client.translate.commands.weather.rain;
                break;
            case "Cloudy":
                current.skytext = client.translate.commands.weather.cloudy;
                break;
            case "Mostly Sunny":
                current.skytext = client.translate.commands.weather.mostly_sunny;
                break;
            case "Mostly Clear":
                current.skytext = client.translate.commands.weather.mostly_clear;
                break;
        }

        const skyText = current.skytext;
        const imageURL = current.imageUrl;
        const timezone = location.timezone;
        const degreeType = location.degreetype;
        const temperature = current.temperature;
        const feelsLike = current.feelslike;
        const wind = current.winddisplay;
        const humidity = current.humidity;
        const day = current.day;
        const date = current.date;

        message.channel.send({
            "embeds": [
                {
                    "title": client.translate.commands.weather.weather,
                    "description": client.translate.commands.weather.weather_at_the_moment.replace("%s1", city.location.name).replace("%s2", skyText),
                    "color": 0x00AE86,
                    "footer": {
                        "iconURL": "https://www.tonystam.com/en/img/Microsoft-portfolio.png",
                        "text": client.translate.commands.weather.information_from_microsoft
                    },
                    "thumbnail": {
                        "url": imageURL
                    },
                    "fields": [
                        {
                            "name": client.translate.commands.weather.timezone,
                            "value": "UTC" + timezone,
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.weather.degree_type,
                            "value": degreeType,
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.weather.temperature,
                            "value": temperature,
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.weather.feels_like,
                            "value": feelsLike,
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.weather.wind,
                            "value": wind,
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.weather.humidity,
                            "value": humidity + "%",
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.weather.day,
                            "value": day,
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.weather.date,
                            "value": date,
                            "inline": true
                        }
                    ]
                }
            ]
        });
    });
};

module.exports.help = {
    "name": "weather",
    "description": "See today's weather in each area.",
    "usage": "weather <area>",
    "category": "information",
    "aliases": ["สภาพอากาศ"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "weather",
            "th": "สภาพอากาศ"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "See today's weather in each area.",
            "th": "ดูสภาพอากาศของวันนี้ในแต่ละพื้นที่ที่ต้องการ"
        },
        "options": [
            {
                "type": 3,
                "name": "area",
                "name_localizations": {
                    "th": "พื้นที่"
                },
                "description": "The area you want to know the weather",
                "description_localizations": {
                    "th": "พื้นที่ที่คุณต้องการทราบสภาพอากาศ"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        const inputArea = interaction.options.get("area").value;

        if (!inputArea) return await interaction.editReply(interaction.client.translate.commands.weather.empty);

        weather.find({
            "search": inputArea,
            "degreeType": "C"
        }, async (error, result) => {
            if (error) return catchError(interaction.client, interaction, module.exports.help.name, error);
            if (!result) return await interaction.editReply(interaction.client.translate.commands.weather.no_result_found);

            const city = result[0];
            const current = city.current;
            const location = city.location;

            switch (current.skytext) {
                case "Clear":
                    current.skytext = interaction.client.translate.commands.weather.clear_weather;
                    break;
                case "Light Rain":
                    current.skytext = interaction.client.translate.commands.weather.light_rain;
                    break;
                case "Rain Showers":
                    current.skytext = interaction.client.translate.commands.weather.rain_showers;
                    break;
                case "Mostly Cloudy":
                    current.skytext = interaction.client.translate.commands.weather.mostly_cloudy;
                    break;
                case "Partly Sunny":
                    current.skytext = interaction.client.translate.commands.weather.partly_sunny;
                    break;
                case "Partly Cloudy":
                    current.skytext = interaction.client.translate.commands.weather.partly_cloudy;
                    break;
                case "Sunny":
                    current.skytext = interaction.client.translate.commands.weather.sunny;
                    break;
                case "Rain":
                    current.skytext = interaction.client.translate.commands.weather.rain;
                    break;
                case "Cloudy":
                    current.skytext = interaction.client.translate.commands.weather.cloudy;
                    break;
                case "Mostly Sunny":
                    current.skytext = interaction.client.translate.commands.weather.mostly_sunny;
                    break;
                case "Mostly Clear":
                    current.skytext = interaction.client.translate.commands.weather.mostly_clear;
                    break;
            }

            const skyText = current.skytext;
            const imageURL = current.imageUrl;
            const timezone = location.timezone;
            const degreeType = location.degreetype;
            const temperature = current.temperature;
            const feelsLike = current.feelslike;
            const wind = current.winddisplay;
            const humidity = current.humidity;
            const day = current.day;
            const date = current.date;

            await interaction.editReply({
                "embeds": [
                    {
                        "title": interaction.client.translate.commands.weather.weather,
                        "description": interaction.client.translate.commands.weather.weather_at_the_moment.replace("%s1", city.location.name).replace("%s2", skyText),
                        "color": 0x00AE86,
                        "footer": {
                            "iconURL": "https://www.tonystam.com/en/img/Microsoft-portfolio.png",
                            "text": interaction.client.translate.commands.weather.information_from_microsoft
                        },
                        "thumbnail": {
                            "url": imageURL
                        },
                        "fields": [
                            {
                                "name": interaction.client.translate.commands.weather.timezone,
                                "value": "UTC" + timezone,
                                "inline": true
                            },
                            {
                                "name": interaction.client.translate.commands.weather.degree_type,
                                "value": degreeType,
                                "inline": true
                            },
                            {
                                "name": interaction.client.translate.commands.weather.temperature,
                                "value": temperature,
                                "inline": true
                            },
                            {
                                "name": interaction.client.translate.commands.weather.feels_like,
                                "value": feelsLike,
                                "inline": true
                            },
                            {
                                "name": interaction.client.translate.commands.weather.wind,
                                "value": wind,
                                "inline": true
                            },
                            {
                                "name": interaction.client.translate.commands.weather.humidity,
                                "value": humidity + "%",
                                "inline": true
                            },
                            {
                                "name": interaction.client.translate.commands.weather.day,
                                "value": day,
                                "inline": true
                            },
                            {
                                "name": interaction.client.translate.commands.weather.date,
                                "value": date,
                                "inline": true
                            }
                        ]
                    }
                ]
            });
        });
    }
};