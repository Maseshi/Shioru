const weather = module.require("weather-js");

module.exports.run = async function (client, message, args) {
    weather.find({
        "search": args.join(" "),
        "degreeType": "C"
    },
    function (err, result) {
        if (err) {
            message.channel.send("❓ ขอตำแหน่งที่คุณต้องการด้วยคะ เช่น กรุงเทพ");
        } else {
            if (result === undefined) {
                message.channel.send("❎ เอ๋...ฉันหาข้อมูลของพื้นที่นี้แล้ว แต่ไม่เจออ่ะ");
            } else {
                let current = result[0].current;
                let location = result[0].location;

                if (current.skytext === "Rain Showers") {
                    current.skytext = "อาบน้ำฝน";
                }
                if (current.skytext === "Mostly Cloudy") {
                    current.skytext = "มีเมฆมากเป็นส่วนใหญ่";
                }
                if (current.skytext === "Partly Sunny") {
                    current.skytext = "แดดออกเป็นบางส่วน";
                }
                if (current.skytext === "Partly Cloudy") {
                    current.skytext = "มีเมฆบางส่วน";
                }
                if (current.skytext === "Sunny") {
                    current.skytext = "แดดจัด";
                }
                if (current.skytext === "Rain") {
                    current.skytext = "ฝนตก";
                }
                if (current.skytext === "Cloudy") {
                    current.skytext = "มีเมฆมาก";
                }
                if (current.skytext === "Mostly Sunny") {
                    current.skytext = "แดดจัดเป็นส่วนใหญ่";
                }

                const embed = {
                    "description": "สภาพอากาศของ __**" + args.join(" ") + "**__ ในขณะนี้คือ \n```" + current.skytext + "```",
                    "color": 0x00AE86,
                    "footer": {
                        "icon_url": "https://www.tonystam.com/en/img/Microsoft-portfolio.png",
                        "text": "ข้อมูลที่ถูกต้องและแม่นย้ำโดย Microsoft"
                    },
                    "thumbnail": {
                        "url": current.imageUrl
                    },
                    "author": {
                        "name": "Microsoft News",
                        "url": "https://www.msn.com/th-th/Weather",
                        "icon_url": "https://cdn.icon-icons.com/icons2/1488/PNG/512/5307-msn_102525.png"
                    },
                    "fields": [
                        {
                            "name": "🌐 เขตเวลา",
                            "value": "UTC" + location.timezone,
                            "inline": true
                        },
                        {
                            "name": "⚖️ หน่วยวัด",
                            "value": location.degreetype,
                            "inline": true
                        },
                        {
                            "name": "🌡️ อุณหภูมิ",
                            "value": current.temperature,
                            "inline": true
                        },
                        {
                            "name": "🎐 รู้สึกเหมือน",
                            "value": current.feelslike + " องศา",
                            "inline": true
                        },
                        {
                            "name": "🎏 ลม",
                            "value": current.winddisplay,
                            "inline": true
                        },
                        {
                            "name": "💧 ความชื้น",
                            "value": current.humidity + "%",
                            "inline": true
                        },
                        {
                            "name": "📅 วัน",
                            "value": current.day,
                            "inline": true
                        },
                        {
                            "name": "📆 วันที่",
                            "value": current.date,
                            "inline": true
                        }
                    ]
                };
                message.channel.send({ embed });
            }
        }
    });
};

module.exports.help = {
    "name": "weather",
    "description": "See today's weather",
    "usage": "Cweather <area>",
    "category": "information",
    "aliases": ["สภาพอากาศ"]
};