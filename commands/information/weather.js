const weather = require("weather-js");

module.exports.run = async function (client, message, args) {
    let arg = args.join(" ");
    
    if (arg === "") {
        message.reply(client.lang.command_information_weather_no_args);
    } else {
        weather.find({
            "search": arg,
            "degreeType": "C"
        }, function (err, result) {
            if (err) {
                console.log(err);
                return message.reply(client.lang.command_information_weather_error);
            } else {
                if (!result) {
                    message.channel.send(client.lang.command_information_weather_result_error);
                } else {
                    let city = result[0];
                    let current = city.current;
                    let location = city.location;

                    skyTextTran(current);

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
                        "embed": {
                            "description": client.lang.command_information_weather_embed_result_description.replace("%location", city.location.name).replace("%skyText", skyText),
                            "color": 0x00AE86,
                            "footer": {
                                "icon_url": "https://www.tonystam.com/en/img/Microsoft-portfolio.png",
                                "text": client.lang.command_information_weather_embed_result_footer_text
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
                                    "name": client.lang.command_information_weather_embed_result_fields_0_name,
                                    "value": "UTC" + timezone,
                                    "inline": true
                                },
                                {
                                    "name": client.lang.command_information_weather_embed_result_fields_1_name,
                                    "value": degreeType,
                                    "inline": true
                                },
                                {
                                    "name": client.lang.command_information_weather_embed_result_fields_2_name,
                                    "value": temperature,
                                    "inline": true
                                },
                                {
                                    "name": client.lang.command_information_weather_embed_result_fields_3_name,
                                    "value": feelsLike + client.lang.command_information_weather_embed_result_fields_3_value,
                                    "inline": true
                                },
                                {
                                    "name": client.lang.command_information_weather_embed_result_fields_4_name,
                                    "value": wind,
                                    "inline": true
                                },
                                {
                                    "name": client.lang.command_information_weather_embed_result_fields_5_name,
                                    "value": humidity + "%",
                                    "inline": true
                                },
                                {
                                    "name": client.lang.command_information_weather_embed_result_fields_7_name,
                                    "value": day,
                                    "inline": true
                                },
                                {
                                    "name": client.lang.command_information_weather_embed_result_fields_8_name,
                                    "value": date,
                                    "inline": true
                                }
                            ]
                        }
                    });
                }
            }
        });
    }

    function skyTextTran(current) {
        if (current.skytext === "Clear") {
            current.skytext = client.lang.command_information_weather_function_skyTextTran.clear;
        }
        if (current.skytext === "Light Rain") {
            current.skytext = client.lang.command_information_weather_function_skyTextTran.light_rain;
        }
        if (current.skytext === "Rain Showers") {
            current.skytext = client.lang.command_information_weather_function_skyTextTran.rain_showers;
        }
        if (current.skytext === "Mostly Cloudy") {
            current.skytext = client.lang.command_information_weather_function_skyTextTran.mostly_cloudy;
        }
        if (current.skytext === "Partly Sunny") {
            current.skytext = client.lang.command_information_weather_function_skyTextTran.partly_sunny;
        }
        if (current.skytext === "Partly Cloudy") {
            current.skytext = client.lang.command_information_weather_function_skyTextTran.partly_cloudy;
        }
        if (current.skytext === "Sunny") {
            current.skytext = client.lang.command_information_weather_function_skyTextTran.sunny;
        }
        if (current.skytext === "Rain") {
            current.skytext = client.lang.command_information_weather_function_skyTextTran.rain;
        }
        if (current.skytext === "Cloudy") {
            current.skytext = client.lang.command_information_weather_function_skyTextTran.cloudy;
        }
        if (current.skytext === "Mostly Sunny") {
            current.skytext = client.lang.command_information_weather_function_skyTextTran.mostly_sunny;
        }
        if (current.skytext === "Mostly Clear") {
            current.skytext = client.lang.command_information_weather_function_skyTextTran.mostly_clear;
        }
    }
};

module.exports.help = {
    "name": "weather",
    "description": "See today's weather",
    "usage": "weather <area>",
    "category": "information",
    "aliases": ["สภาพอากาศ"]
};