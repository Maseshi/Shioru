module.exports.run = (client, message, args) => {
    const inputType = args.join(" ");
    const guildIcon = message.guild.iconURL();

    if (!inputType) return message.reply(client.translate.commands.status.empty);
    if (!["online", "offline", "idle", "dnd"].includes(inputType)) {
        return message.reply(client.translate.commands.status.no_status);
    }

    switch (inputType) {
        case "online":
            const onlineCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "online" : null).size;

            message.channel.send({
                "embeds": [
                    {
                        "description": client.translate.commands.status.online_status.replace("%s", onlineCount),
                        "color": 3055702,
                        "footer": {
                            "icon_url": guildIcon,
                            "text": client.translate.commands.status.data_by_server
                        }
                    }
                ]
            });
            break;
        case "offline":
            const offlineCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "offline" : "offline").size;

            message.channel.send({
                "embeds": [
                    {
                        "description": client.translate.commands.status.offline_status.replace("%s", offlineCount),
                        "color": 10197915,
                        "footer": {
                            "icon_url": guildIcon,
                            "text": client.translate.commands.status.data_by_server
                        }
                    }
                ]
            });
            break;
        case "idle":
            const idleCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "idle" : null).size;

            message.channel.send({
                "embeds": [
                    {
                        "description": client.translate.commands.status.idle_status.replace("%s", idleCount),
                        "color": 16098851,
                        "footer": {
                            "icon_url": guildIcon,
                            "text": client.translate.commands.status.data_by_server
                        }
                    }
                ]
            });
            break;
        case "dnd":
            const dndCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "dnd" : null).size;

            message.channel.send({
                "embeds": [
                    {
                        "description": client.translate.commands.status.dnd_status.replace("%s", dndCount),
                        "color": 13632027,
                        "footer": {
                            "icon_url": guildIcon,
                            "text": client.translate.commands.status.data_by_server
                        }
                    }
                ]
            });
            break;
    }
};

module.exports.help = {
    "name": "status",
    "description": "Check the status of all members within the server",
    "usage": "status <type: online, offline, idle, dnd>",
    "category": "information",
    "aliases": ["สถานะ"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "status",
            "th": "สถานะ"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Check the status of all members within the server",
            "th": "ตรวจสอบสถานะของสมาชิกทั้งหมดภายในเซิร์ฟเวอร์"
        },
        "options": [
            {
                "type": 3,
                "name": "type",
                "name_localizations": {
                    "th": "ประเภท"
                },
                "description": "The status you want to check.",
                "description_localizations": {
                    "th": "สถานะที่คุณต้องการตรวจสอบ"
                },
                "required": true,
                "choices": [
                    {
                        "name": "Online",
                        "name_localizations": {
                            "th": "ออนไลน์"
                        },
                        "value": "online"
                    },
                    {
                        "name": "Offline",
                        "name_localizations": {
                            "th": "ออฟไลน์"
                        },
                        "value": "offline"
                    },
                    {
                        "name": "Idle",
                        "name_localizations": {
                            "th": "ไม่ได้ใช้งาน"
                        },
                        "value": "idle"
                    },
                    {
                        "name": "Do Not Disturb",
                        "name_localizations": {
                            "th": "ห้ามรบกวน"
                        },
                        "value": "dnd"
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const inputType = interaction.options.get("type").value;
        const guildIcon = interaction.guild.iconURL();

        switch (inputType) {
            case "online":
                const onlineCount = interaction.guild.members.cache.filter(members => members.presence ? members.presence.status === "online" : null).size;

                await interaction.editReply({
                    "embeds": [
                        {
                            "description": interaction.client.translate.commands.status.online_status.replace("%s", onlineCount),
                            "color": 3055702,
                            "footer": {
                                "icon_url": guildIcon,
                                "text": interaction.client.translate.commands.status.data_by_server
                            }
                        }
                    ]
                });
                break;
            case "offline":
                const offlineCount = interaction.guild.members.cache.filter(members => members.presence ? members.presence.status === "offline" : "offline").size;

                await interaction.editReply({
                    "embeds": [
                        {
                            "description": interaction.client.translate.commands.status.offline_status.replace("%s", offlineCount),
                            "color": 10197915,
                            "footer": {
                                "icon_url": guildIcon,
                                "text": interaction.client.translate.commands.status.data_by_server
                            }
                        }
                    ]
                });
                break;
            case "idle":
                const idleCount = interaction.guild.members.cache.filter(members => members.presence ? members.presence.status === "idle" : null).size;

                await interaction.editReply({
                    "embeds": [
                        {
                            "description": interaction.client.translate.commands.status.idle_status.replace("%s", idleCount),
                            "color": 16098851,
                            "footer": {
                                "icon_url": guildIcon,
                                "text": interaction.client.translate.commands.status.data_by_server
                            }
                        }
                    ]
                });
                break;
            case "dnd":
                const dndCount = interaction.guild.members.cache.filter(members => members.presence ? members.presence.status === "dnd" : null).size;

                await interaction.editReply({
                    "embeds": [
                        {
                            "description": interaction.client.translate.commands.status.dnd_status.replace("%s", dndCount),
                            "color": 13632027,
                            "footer": {
                                "icon_url": guildIcon,
                                "text": interaction.client.translate.commands.status.data_by_server
                            }
                        }
                    ]
                });
                break;
        }
    }
}