const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "uptime",
    "description": "Displays the bots current uptime!",
    "category": "developer",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "uptime",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "uptime",
            "th": "เวลาทำงาน"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Displays the bots current uptime!",
            "th": "แสดงเวลาทำงานของบอทในปัจจุบัน!"
        }
    },
    async execute(interaction) {
        const ms = interaction.client.uptime;
        const sec = Math.floor((ms / 1000) % 60).toString();
        const min = Math.floor((ms / (1000 * 60)) % 60).toString();
        const hrs = Math.floor((ms / (1000 * 60 * 60)) % 60).toString();
        const days = Math.floor((ms / (1000 * 60 * 60 * 24)) % 60).toString();
        const duration = days.padStart(1, "0") + " " + interaction.client.translate.commands.uptime.days + " " +
            hrs.padStart(2, "0") + " " + interaction.client.translate.commands.uptime.hours + " " +
            min.padStart(2, "0") + " " + interaction.client.translate.commands.uptime.minute + " " +
            sec.padStart(2, "0") + " " + interaction.client.translate.commands.uptime.second + " ";

        const clientColor = interaction.guild.members.me.displayHexColor;
        const uptimeEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.uptime.info_title)
            .setDescription("```" + duration + "```")
            .setColor(clientColor);

        await interaction.editReply({
            "embeds": [uptimeEmbed]
        });
    }
}