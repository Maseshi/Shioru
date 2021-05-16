module.exports.run = async function (client, message, args) {
    let status = args.join(" ");
    let icon = message.guild.iconURL();

    if (!status) return message.reply(client.lang.command_information_status_no_args);
    if (!["online", "offline", "idle", "dnd"].includes(status)) return message.reply(client.lang.command_information_status_dont_have_this_status);

    switch (status) {
        case "online":
            let onlineCount = message.guild.members.cache.filter(members => members.presence.status === "online").size;

            message.channel.send({
                "embed": {
                    "description": client.lang.command_information_status_embed_online_description + "```" + onlineCount + "```",
                    "color": 3055702,
                    "footer": {
                        "icon_url": icon,
                        "text": client.lang.command_information_status_embed_online_footer_text
                    }
                }
            });
        break;
        case "offline":
            let offlineCount = message.guild.members.cache.filter(members => members.presence.status === "offline").size;

            message.channel.send({
                "embed": {
                    "description": client.lang.command_information_status_embed_offline_description + "```" + offlineCount + "```",
                    "color": 10197915,
                    "footer": {
                        "icon_url": icon,
                        "text": client.lang.command_information_status_embed_offline_footer_text
                    }
                }
            });
        break;
        case "idle":
            let idleCount = message.guild.members.cache.filter(members => members.presence.status === "idle").size;

            message.channel.send({
                "embed": {
                    "description": client.lang.command_information_status_embed_idle_description + "```" + idleCount + "```",
                    "color": 16098851,
                    "footer": {
                        "icon_url": icon,
                        "text": client.lang.command_information_status_embed_idle_footer_text
                    }
                }
            });
        break;
        case "dnd":
            let dndCount = message.guild.members.cache.filter(members => members.presence.status === "dnd").size;

            message.channel.send({
                "embed": {
                    "description": client.lang.command_information_status_embed_dnd_description + "```" + dndCount + "```",
                    "color": 13632027,
                    "footer": {
                        "icon_url": icon,
                        "text": client.lang.command_information_status_embed_dnd_footer_text
                    }
                }
            });
        break;
    }
};

module.exports.help = {
    "name": "status",
    "description": "Check the status of all members within the server",
    "usage": "status <status: online, offline, idle, dnd>",
    "category": "information",
    "aliases": ["สถานะ"],
    "permissions": ["SEND_MESSAGES"]
};