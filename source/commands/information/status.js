const { EmbedBuilder } = require("discord.js");

module.exports = {
    "name": "status",
    "description": "Check the status of all members within the server",
    "category": "information",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "status <type: online, offline, idle, dnd>",
    "aliases": ["สถานะ"],
    async execute(client, message, args) {
        const inputType = args.join(" ");
    
        const guildIcon = message.guild.iconURL();
        const statusEmbed = new EmbedBuilder()
            .setTimestamp()
            .setFooter({ "text": client.translate.commands.status.data_by_server, "iconURL": guildIcon });
    
        if (!inputType) return message.reply(client.translate.commands.status.empty);
        if (!["online", "offline", "idle", "dnd"].includes(inputType)) {
            return message.reply(client.translate.commands.status.no_status);
        }
    
        switch (inputType) {
            case "online":
                const onlineCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "online" : null).size;
    
                statusEmbed.setDescription(client.translate.commands.status.online_status.replace("%s", onlineCount))
                    .setColor("Green");
                message.channel.send({
                    "embeds": [statusEmbed]
                });
                break;
            case "offline":
                const offlineCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "offline" : "offline").size;
    
                statusEmbed.setDescription(client.translate.commands.status.offline_status.replace("%s", offlineCount))
                    .setColor("Grey");
                message.channel.send({
                    "embeds": [statusEmbed]
                });
                break;
            case "idle":
                const idleCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "idle" : null).size;
    
                statusEmbed.setDescription(client.translate.commands.status.idle_status.replace("%s", idleCount))
                    .setColor("Yellow");
                message.channel.send({
                    "embeds": [statusEmbed]
                });
                break;
            case "dnd":
                const dndCount = message.guild.members.cache.filter(members => members.presence ? members.presence.status === "dnd" : null).size;
    
                statusEmbed.setDescription(client.translate.commands.status.dnd_status.replace("%s", dndCount))
                    .setColor("Red");
                message.channel.send({
                    "embeds": [statusEmbed]
                });
                break;
        }
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "status",
            "th": "สถานะ"
        },
        "description": module.exports.description,
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
        const statusEmbed = new EmbedBuilder()
            .setTimestamp()
            .setFooter({ "text": interaction.client.translate.commands.status.data_by_server, "iconURL": guildIcon });

        switch (inputType) {
            case "online":
                const onlineCount = interaction.guild.members.cache.filter(members => members.presence ? members.presence.status === "online" : null).size;

                statusEmbed.setDescription(interaction.client.translate.commands.status.online_status.replace("%s", onlineCount))
                    .setColor("Green");
                await interaction.editReply({
                    "embeds": [statusEmbed]
                });
                break;
            case "offline":
                const offlineCount = interaction.guild.members.cache.filter(members => members.presence ? members.presence.status === "offline" : "offline").size;

                statusEmbed.setDescription(interaction.client.translate.commands.status.offline_status.replace("%s", offlineCount))
                    .setColor("Grey");
                await interaction.editReply({
                    "embeds": [statusEmbed]
                });
                break;
            case "idle":
                const idleCount = interaction.guild.members.cache.filter(members => members.presence ? members.presence.status === "idle" : null).size;

                statusEmbed.setDescription(interaction.client.translate.commands.status.idle_status.replace("%s", idleCount))
                    .setColor("Yellow");
                await interaction.editReply({
                    "embeds": [statusEmbed]
                });
                break;
            case "dnd":
                const dndCount = interaction.guild.members.cache.filter(members => members.presence ? members.presence.status === "dnd" : null).size;

                statusEmbed.setDescription(interaction.client.translate.commands.status.dnd_status.replace("%s", dndCount))
                    .setColor("Red");
                await interaction.editReply({
                    "embeds": [statusEmbed]
                });
                break;
        }
    }
}