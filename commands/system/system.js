const discord = require("discord.js");
const os = require("os");
const cpuStat = require("cpu-stat");

module.exports.run = async function (client, message, args) {
    let msg = await message.channel.send(client.data.language.command_system_system_status_process);
    cpuStat.usagePercent(function (error, percent) {
        if (error) {
            console.error(error);
            msg.edit(client.data.language.command_system_system_status_error + error);
        } else {
            let totalSeconds = (client.uptime / 1000);
            // let days = Math.floor(totalSeconds / 86400);
            let hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            let minutes = Math.floor(totalSeconds / 60);
            // let seconds = Math.floor(totalSeconds % 60);

            // let duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
            msg.edit("", {
                "embed": {
                    "title": client.data.language.command_system_system_embed_title,
                    "description": client.data.language.command_system_system_embed_description,
                    "color": 4886754,
                    "fields": [
                        {
                            "name": client.data.language.command_system_system_field_0,
                            "value": (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "/" + (os.totalmem() / 1024 / 1024).toFixed(2) + "MB",
                            "inline": true
                        },
                        {
                            "name": client.data.language.command_system_system_field_1,
                            "value": hours + "h " + minutes + "m",
                            "inline": true
                        },
                        {
                            "name": client.data.language.command_system_system_field_2,
                            "value": "Google.inc",
                            "inline": true
                        },
                        {
                            "name": client.data.language.command_system_system_field_3,
                            "value": "Maseshi",
                            "inline": true
                        },
                        {
                            "name": client.data.language.command_system_system_field_4,
                            "value": "v" + discord.version,
                            "inline": true
                        },
                        {
                            "name": client.data.language.command_system_system_field_5,
                            "value": process.version,
                            "inline": true
                        },
                        {
                            "name": client.data.language.command_system_system_field_6,
                            "value": "```md\n" + os.cpus().map(i => i.model)[0] + "```",
                            "inline": true
                        },
                        {
                            "name": client.data.language.command_system_system_field_7,
                            "value": "`" + percent.toFixed(2) + "%`",
                            "inline": true
                        },
                        {
                            "name": client.data.language.command_system_system_field_8,
                            "value": "``" + os.platform() + "``",
                            "inline": true
                        }
                    ]
                }
            });
        }
    });
};

module.exports.help = {
    "name": "system",
    "description": "Get system operating status and more",
    "usage": "system",
    "category": "system",
    "aliases": ["sys", "ระบบ"],
    "permissions": ["SEND_MESSAGES", "ADMINISTRATOR"]
};