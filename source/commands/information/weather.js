const weather = require("weather-js");
const catchError = require("../../extras/catchError");

module.exports.run = function (client, message, args) {
    let arg = args.join(" ");
    
    if (!arg) return message.reply(client.translate.commands.weather.empty);
    
    weather.find({
        "search": arg,
        "degreeType": "C"
    }, function (error, result) {
        if (error) {
            catchError(client, message, module.exports.help.name, error);
        } else {
            if (!result) return message.channel.send(client.translate.commands.weather.no_result_found);
            
            let city = result[0];
            let current = city.current;
            let location = city.location;
    
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
    
            let skyText = current.skytext;
            let imageURL = current.imageUrl;
            let timezone = location.timezone;
            let degreeType = location.degreetype;
            let temperature = current.temperature;
            let feelsLike = current.feelslike;
            let wind = current.winddisplay;
            let humidity = current.humidity;
            let day = current.day;
            let date = current.date;
    
            message.channel.send({
                "embeds": [
                    {
                        "description": client.translate.commands.weather.weather_at_the_moment.replace("%s1", city.location.name).replace("%s2", skyText),
                        "color": 0x00AE86,
                        "footer": {
                            "icon_url": "https://www.tonystam.com/en/img/Microsoft-portfolio.png",
                            "text": client.translate.commands.weather.information_from_microsoft
                        },
                        "thumbnail": {
                            "url": imageURL
                        },
                        "author": {
                            "name": "Microsoft News",
                            "url": "https://www.msn.com/th-th/Weather",
                            "icon_url": "https://cdn.icon-icons.com/icons2/1488/PNG/512/5307-msn_102525.png"
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
        }
    });
};

module.exports.help = {
    "name": "weather",
    "description": "See today's weather",
    "usage": "weather <area>",
    "category": "information",
    "aliases": ["สภาพอากาศ"],
    "permissions": ["SEND_MESSAGES"]
};