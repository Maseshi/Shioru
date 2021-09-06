const { version } = require("discord.js");
const si = require("systeminformation");
const catchError = require("../../extras/catchError");

module.exports.run = async function(client, message, args) {
    let msg = await message.channel.send(client.translate.commands.system.loading);

    si.get({
        "time": "uptime",
        "system": "manufacturer, model",
        "bios": "vendor, version, releaseDate",
        "cpu": "manufacturer, brand, speed, cores, physicalCores",
        "cpuTemperature": "main",
        "mem": "used, total",
        "battery": "hasBattery, isCharging, percent, type",
        "graphics": "controllers, displays",
        "osInfo": "platform, arch"
    }).then(function(data) {
        let serverSeconds = (data.time.uptime / 1000);
        let serverDays = Math.floor(serverSeconds / (3600 * 24));
        let serverHours = Math.floor(serverSeconds % (3600 * 24) / 3600);
        
        let systemManufacturer = data.system.manufacturer;
        let systemModel = data.system.model;

        let biosVendor = data.bios.vendor;
        let biosVersion = data.bios.version;
        let biosReleaseDate = data.bios.releaseDate;
        
        let cpuManufacturer = data.cpu.manufacturer;
        let cpuBrand = data.cpu.brand;
        let cpuSpeed = data.cpu.speed;
        let cpuCores = data.cpu.cores;
        let cpuPhysicalCores = data.cpu.physicalCores;

        let cpuTempMain = data.cpuTemperature.cpuTempMain;

        let memUsed = (data.mem.used / 1024 / 1024).toFixed(2);
        let memTotal = (data.mem.total / 1024 / 1024).toFixed(2);

        let batteryHasBattery = data.battery.hasBattery;
        let batteryIsCharging = data.battery.isCharging;
        let batteryPercent = data.battery.percent;
        let batteryType = data.battery.type;

        let gpuControllers = data.graphics.controllers;
        let gpuControllersLength = gpuControllers.length;
        let gpuMain = "",
        gpuMainModel = "",
        gpuMainFanSpeed = "",
        gpuMainMemoryTotal = "",
        gpuMainMemoryUsed = "",
        gpuMainTemperatureGpu = "";
        for (let i = 0; i < gpuControllersLength; i++) {
            gpuMainModel = gpuControllers[i].model;
            gpuMainFanSpeed = gpuControllers[i].fanSpeed;
            gpuMainMemoryTotal = gpuControllers[i].memoryTotal;
            gpuMainMemoryUsed = gpuControllers[i].memoryUsed;
            gpuMainTemperatureGpu = gpuControllers[i].temperatureGpu;

            gpuMain =+ "" + "```" + gpuMainModel + ", " + (gpuMainMemoryUsed ? (gpuMainMemoryTotal ? gpuMainMemoryUsed + "/" + gpuMainMemoryTotal + "MB" : "") : client.translate.commands.system.unknown) + (gpuMainFanSpeed ? gpuMainFanSpeed + " " : "") + (gpuMainTemperatureGpu ? gpuMainTemperatureGpu : "") + "```";
        }
        let gpuDisplays = data.graphics.displays;
        let gpuDisplaysLength = gpuDisplays.length;
        let gpuSecond = "",
        gpuSecondModel = "",
        gpuSecondMain = "";
        for (let i = 0; i < gpuDisplaysLength; i++) {
            gpuSecondModel = gpuDisplays[i].model;
            gpuSecondMain = gpuDisplays[i].main;

            gpuSecond =+ "" + "```" + gpuSecondModel + ", " + (gpuSecondMain ? client.translate.commands.system.main : "") + "```";
        }

        let osPlatform = data.osInfo.platform;
        let osArch = data.osInfo.arch;

        msg.edit({
            "content": null,
            "embeds": [
                {
                    "title": client.translate.commands.system.info_title,
                    "description": client.translate.commands.system.info_description,
                    "color": 4886754,
                    "fields": [
                        {
                            "name": "• Discord.js",
                            "value": "```" + "v" + version + "```",
                            "inline": true
                        },
                        {
                            "name": "• Node.js",
                            "value": "```" + process.version + "```",
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.system.info_uptime.title,
                            "value": "```" + client.translate.commands.system.info_uptime.info.replace("%s1", serverDays).replace("%s2", serverHours) + "```",
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.system.info_system,
                            "value": "```" +systemManufacturer + " " + systemModel + "```",
                            "inline": true
                        },
                        {
                            "name": "• BIOS",
                            "value": "```" + biosVendor + " " + biosVersion + ", " + biosReleaseDate + "```",
                            "inline": true
                        },
                        {
                            "name": "• CPU",
                            "value": "```" + cpuManufacturer + " " + cpuBrand + ", " + cpuSpeed + "GHz " + cpuCores + " Cores " + cpuPhysicalCores + " Trades```",
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.system.info_temperature,
                            "value": "```" + (cpuTempMain || client.translate.commands.system.unknown) + "```",
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.system.info_memory_used,
                            "value": "```" + memUsed + " / " + memTotal + "MB" + "```",
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.system.info_battery.title,
                            "value": "```" + (batteryHasBattery ? batteryIsCharging ? client.translate.commands.system.info_battery.charging + " " + batteryPercent + ", " + batteryType || client.translate.commands.system.unknown : client.translate.commands.system.info_battery.charging + " " + batteryPercent + ", " + batteryType || client.translate.commands.system.unknown : client.translate.commands.system.without) + "```",
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.system.info_gpu_control,
                            "value": gpuMain || client.translate.commands.system.unknown,
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.system.info_gpu_display,
                            "value": gpuSecond || client.translate.commands.system.unknown,
                            "inline": true
                        },
                        {
                            "name": client.translate.commands.system.info_platform,
                            "value": "```" + osPlatform + " " + osArch + "```",
                            "inline": true
                        }
                    ]
                }
            ]
        });
    }).catch(function(error) {
        catchError(client, msg, module.exports.help.name, error);
    });
};

module.exports.help = {
    "name": "system",
    "description": "Get system operating status and more",
    "usage": "system",
    "category": "developer",
    "aliases": ["sys", "ระบบ"],
    "permissions": ["SEND_MESSAGES"]
};