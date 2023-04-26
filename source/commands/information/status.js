const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "status",
    "description": "Check the status of all members within the server",
    "category": "information",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "status <type>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "สถานะ"
        },
        "description": module.exports.description,
        "description_localizations": {
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
        const inputType = interaction.options.getString("type");

        const guildIcon = interaction.guild.iconURL();
        const statusEmbed = new EmbedBuilder()
            .setTimestamp()
            .setFooter({ "text": interaction.client.translate.commands.status.data_by_server, "iconURL": guildIcon });

        switch (inputType) {
            case "online":
                const onlineCount = interaction.guild.members.cache.filter(members => members.presence ? members.presence.status === "online" : null).size;

                statusEmbed.setDescription(interaction.client.translate.commands.status.online_status.replace("%s", onlineCount))
                    .setColor("Green");
                await interaction.reply({ "embeds": [statusEmbed] });
                break;
            case "offline":
                const offlineCount = interaction.guild.members.cache.filter(members => members.presence ? members.presence.status === "offline" : "offline").size;

                statusEmbed.setDescription(interaction.client.translate.commands.status.offline_status.replace("%s", offlineCount))
                    .setColor("Grey");
                await interaction.reply({ "embeds": [statusEmbed] });
                break;
            case "idle":
                const idleCount = interaction.guild.members.cache.filter(members => members.presence ? members.presence.status === "idle" : null).size;

                statusEmbed.setDescription(interaction.client.translate.commands.status.idle_status.replace("%s", idleCount))
                    .setColor("Yellow");
                await interaction.reply({ "embeds": [statusEmbed] });
                break;
            case "dnd":
                const dndCount = interaction.guild.members.cache.filter(members => members.presence ? members.presence.status === "dnd" : null).size;

                statusEmbed.setDescription(interaction.client.translate.commands.status.dnd_status.replace("%s", dndCount))
                    .setColor("Red");
                await interaction.reply({ "embeds": [statusEmbed] });
                break;
        }
    }
}