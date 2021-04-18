module.exports.run = async function (client, message, args) {
    let status = args.join(" ");
    if (status === "") {
        message.reply(client.lang.command_information_status_no_args);
    } else {
        if (status === "online" || status === "offline" || status === "idle" || status === "dnd") {
            let icon = message.guild.iconURL();
            if (status === "online") {
                let onlineCount = message.guild.members.cache.filter(member => member.presence.status === "online").size;

                message.channel.send({
                    "embed": {
                        "description": client.lang.command_information_status_embed_online_descritpion + "```" + onlineCount + "```",
                        "color": 3055702,
                        "footer": {
                            "icon_url": icon,
                            "text": client.lang.command_information_status_embed_online_footer_text
                        }
                    }
                });
            }
            if (status === "offline") {
                let offlineCount = message.guild.members.cache.filter(member => member.presence.status === "offline").size;

                message.channel.send({
                    "embed": {
                        "description": client.lang.command_information_status_embed_offline_footer_text + "```" + offlineCount + "```",
                        "color": 10197915,
                        "footer": {
                            "icon_url": icon,
                            "text": client.lang.command_information_status_embed_offline_footer_text
                        }
                    }
                });
            }
            if (status === "idle") {
                let idleCount = message.guild.members.cache.filter(member => member.presence.status === "idle").size;

                message.channel.send({
                    "embed": {
                        "description": client.lang.command_information_status_embed_idle_descritpion + "```" + idleCount + "```",
                        "color": 16098851,
                        "footer": {
                            "icon_url": icon,
                            "text": client.lang.command_information_status_embed_idle_footer_text
                        }
                    }
                });
            }
            if (status === "dnd") {
                let dndCount = message.guild.members.cache.filter(member => member.presence.status === "dnd").size;

                message.channel.send({
                    "embed": {
                        "description": client.lang.command_information_status_embed_dnd_descritpion + "```" + dndCount + "```",
                        "color": 13632027,
                        "footer": {
                            "icon_url": icon,
                            "text": client.lang.command_information_status_embed_dnd_footer_text
                        }
                    }
                });
            }
        } else {
            message.reply(client.lang.command_information_status_dont_have_this_status);
        }
    }
};

module.exports.help = {
    "name": "status",
    "description": "Check the status of all members within the server",
    "usage": "status <status<online, offline, idle, dnd>>",
    "category": "information",
    "aliases": ["สถานะ"]
};