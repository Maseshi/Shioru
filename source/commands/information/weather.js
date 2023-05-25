const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { request } = require("../../utils/miscUtils");
const { XMLParser } = require("fast-xml-parser");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
    "enable": true,
    "name": "weather",
    "description": "See today's weather in each area.",
    "category": "information",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "weather <area(String)> [degree_type]",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "สภาพอากาศ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ดูสภาพอากาศของวันนี้ในแต่ละพื้นที่ที่ต้องการ"
        },
        "options": [
            {
                "type": 3,
                "name": "location",
                "name_localizations": {
                    "th": "พื้นที่"
                },
                "description": "The location you want to know the weather",
                "description_localizations": {
                    "th": "พื้นที่ที่คุณต้องการทราบสภาพอากาศ"
                },
                "required": true
            },
            {
                "type": 3,
                "name": "degree_type",
                "name_localizations": {
                    "th": "หน่วยวัด"
                },
                "description": "Unit of measure for weather conditions.",
                "description_localizations": {
                    "th": "หน่วยวัดของสภาพอากาศ"
                },
                "required": false,
                "choices": [
                    {
                        "name": "Celsius",
                        "name_localizations": {
                            "th": "เซลเซียส"
                        },
                        "value": "C"
                    },
                    {
                        "name": "Fahrenheit",
                        "name_localizations": {
                            "th": "ฟาเรนไฮต์"
                        },
                        "value": "F"
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        await interaction.deferReply();

        const inputLocation = interaction.options.getString("location");
        const inputDegreeType = interaction.options.getString("degree_type") ?? "C";

        let response = "";
        const service = "https://weather.service.msn.com/find.aspx";

        try {
            response = await request(
                service
                + "?"
                + "src=msn"
                + "&"
                + "weadegreetype=" + inputDegreeType
                + "&"
                + "culture=en"
                + "&"
                + "weasearchstr=" + encodeURIComponent(inputLocation)
            );
        } catch (error) {
            if (error.response) {
                await interaction.editReply(interaction.client.translate.commands.weather.error_with_code.replace("%s", error.response.statusCode));
                return catchError(interaction.client, interaction, module.exports.name, error.response.data, true);
            } else {
                interaction.editReply(interaction.client.translate.commands.weather.unknown_error);
                return catchError(interaction.client, interaction, module.exports.name, error, true)
            }
        }

        const json = new XMLParser().parse(response, {
            "attributeNamePrefix": "",
            "ignoreAttributes": false,
            "ignoreNameSpace": true,
            "trimValues": true
        });

        if (!json || !json.weatherdata || !json.weatherdata.weather) return await interaction.editReply(interaction.client.translate.commands.weather.cannot_parse_data);
        if (!json.weatherdata.weather[0]) return await interaction.editReply(interaction.client.translate.commands.weather.no_result_found);

        const city = json.weatherdata.weather[0];
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

        const weatherEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.weather.weather)
            .setDescription(interaction.client.translate.commands.weather.weather_at_the_moment.replace("%s1", city.location.name).replace("%s2", skyText))
            .setColor(44678)
            .setFooter({ "text": interaction.client.translate.commands.weather.information_from_microsoft, "iconURL": "https://www.tonystam.com/en/img/Microsoft-portfolio.png" })
            .setThumbnail(imageURL)
            .addFields(
                [
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
            );

        await interaction.editReply({
            "embeds": [weatherEmbed]
        });
    }
}