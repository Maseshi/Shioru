const weather = require("weather-js");

module.exports.run = async function (client, message, args) {
    let arg = args.join(" ");
    
    if (arg === "") {
        message.reply("❓ ขอตำแหน่งที่คุณต้องการด้วยคะ เช่น กรุงเทพ");
    } else {
        weather.find({
            "search": arg,
            "degreeType": "C"
        },
        function (err, result) {
            if (err) {
                console.log(err);
                return message.reply("❌ ไม่สามารถหาพื้นที่ดังกล่าวได้ค่ะ");
            } else {
                if (!result) {
                    message.channel.send("❎ เอ๋...ฉันหาข้อมูลของพื้นที่นี้แล้ว แต่ไม่เจออ่ะ");
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

                    let embed = {
                        "description": "สภาพอากาศของ __**" + city.location.name + "**__ ในขณะนี้คือ \n```" + skyText + "```",
                        "color": 0x00AE86,
                        "footer": {
                            "icon_url": "https://www.tonystam.com/en/img/Microsoft-portfolio.png",
                            "text": "ข้อมูลที่ถูกต้องและแม่นย้ำโดย Microsoft"
                        },
                        "thumbnail": {
                            "url": imageURL
                        },
                        "author": {
                            "name": "Microsoft News",
                            "url": "https://www.msn.com/th-th/Weather",
                            "icon_url": "https://cdn.icon-icons.com/icons2/1488/PNG/512/5307-msn_102525.png"
                        },
                        "fields": [{
                                "name": "🌐 เขตเวลา",
                                "value": "UTC" + timezone,
                                "inline": true
                            },
                            {
                                "name": "⚖️ หน่วยวัด",
                                "value": degreeType,
                                "inline": true
                            },
                            {
                                "name": "🌡️ อุณหภูมิ",
                                "value": temperature,
                                "inline": true
                            },
                            {
                                "name": "🎐 รู้สึกเหมือน",
                                "value": feelsLike + " องศา",
                                "inline": true
                            },
                            {
                                "name": "🎏 ลม",
                                "value": wind,
                                "inline": true
                            },
                            {
                                "name": "💧 ความชื้น",
                                "value": humidity + "%",
                                "inline": true
                            },
                            {
                                "name": "📅 วัน",
                                "value": day,
                                "inline": true
                            },
                            {
                                "name": "📆 วันที่",
                                "value": date,
                                "inline": true
                            }
                        ]
                    };
                    message.channel.send({
                        embed
                    });
                }
            }
        });
    }

    function skyTextTran(current) {
        if (current.skytext === "Clear") {
            current.skytext = "อากาศแจ่มใส";
        }
        if (current.skytext === "Light Rain") {
            current.skytext = "ฝนตกปรอยๆ";
        }
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
        if (current.skytext === "Mostly Clear") {
            current.skytext = "ท้องฟ้าแจ่มใสเป็นส่วนใหญ่";
        }
    }
};

module.exports.help = {
    "name": "weather",
    "description": "See today's weather",
    "usage": "Yweather <area>",
    "category": "information",
    "aliases": ["สภาพอากาศ"]
};