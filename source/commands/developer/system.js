const { version } = require("discord.js");
const { get } = require("systeminformation");
const catchError = require("../../extras/catchError");

module.exports.run = async (client, message, args) => {
    const msg = await message.channel.send(client.translate.commands.system.loading);

    get({
        "time": "uptime",
        "system": "manufacturer, model",
        "bios": "vendor, version, releaseDate",
        "cpu": "manufacturer, brand, speed, cores, physicalCores",
        "cpuTemperature": "main",
        "mem": "total, used",
        "battery": "hasBattery, isCharging, percent, type",
        "graphics": "controllers, displays",
        "osInfo": "platform, arch"
    }).then((data) => {
        const serverSeconds = (data.time.uptime / 1000);
        const serverDays = Math.floor(serverSeconds / (3600 * 24));
        const serverHours = Math.floor(serverSeconds % (3600 * 24) / 3600);
        
        const systemManufacturer = data.system.manufacturer;
        const systemModel = data.system.model;

        const biosVendor = data.bios.vendor;
        const biosVersion = data.bios.version;
        const biosReleaseDate = data.bios.releaseDate;
        
        const cpuManufacturer = data.cpu.manufacturer;
        const cpuBrand = data.cpu.brand;
        const cpuSpeed = data.cpu.speed;
        const cpuCores = data.cpu.cores;
        const cpuPhysicalCores = data.cpu.physicalCores;

        const cpuTempMain = data.cpuTemperature.cpuTempMain;

        const memUsed = (data.mem.used / 1024 / 1024).toFixed(2);
        const memTotal = (data.mem.total / 1024 / 1024).toFixed(2);

        const batteryHasBattery = data.battery.hasBattery;
        const batteryIsCharging = data.battery.isCharging;
        const batteryPercent = data.battery.percent;
        const batteryType = data.battery.type;

        const gpuControllers = data.graphics.controllers;
        const gpuControllersLength = gpuControllers.length;
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

            gpuMain += ("```" + gpuMainModel + ", " + (gpuMainMemoryUsed ? (gpuMainMemoryTotal ? gpuMainMemoryUsed + "/" + gpuMainMemoryTotal + "MB" : "") : "") + (gpuMainFanSpeed ? gpuMainFanSpeed + " " : "") + (gpuMainTemperatureGpu ? gpuMainTemperatureGpu : "") + "```");
        }
        
        const gpuDisplays = data.graphics.displays;
        const gpuDisplaysLength = gpuDisplays.length;
        let gpuSecond = "",
        gpuSecondModel = "",
        gpuSecondMain = "";
        for (let i = 0; i < gpuDisplaysLength; i++) {
            gpuSecondModel = gpuDisplays[i].model;
            gpuSecondMain = gpuDisplays[i].main;

            gpuSecond += ("```" + gpuSecondModel + ", " + (gpuSecondMain ? client.translate.commands.system.main : "") + "```");
        }

        const osPlatform = data.osInfo.platform;
        const osArch = data.osInfo.arch;

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
    }).catch((error) => {
        catchError(client, msg, module.exports.help.name, error);
    });
};

module.exports.help = {
    "name": "system",
    "description": "Get system operating status and more",
    "usage": "system",
    "category": "developer",
    "aliases": ["sys", "ระบบ"],
    "clientPermissions": ["SEND_MESSAGES"]
};