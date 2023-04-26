const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "kill",
    "description": "Fake messages that say you will kill something.",
    "category": "fun",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "kill <name(String)>",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ฆ่า"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ข้อความปลอมที่บอกว่าคุณจะฆ่าอะไรบางอย่าง"
        },
        "options": [
            {
                "type": 3,
                "name": "name",
                "name_localizations": {
                    "th": "ชื่อ"
                },
                "description": "The name of what you are about to kill.",
                "description_localizations": {
                    "th": "ชื่อของสิ่งที่คุณกำลังจะฆ่า"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        const inputName = interaction.options.getString("name");

        const authorUsername = interaction.user.username;
        const clientUsername = interaction.client.user.username;
        const killEmbed = new EmbedBuilder()
            .setDescription(interaction.client.translate.commands.kill.killed.replace("%s1", authorUsername).replace("%s2", inputName))
            .setColor("Default");

        if (inputName === clientUsername) return await interaction.reply(interaction.client.translate.commands.kill.do_not_kill_me);

        await interaction.reply({ "embeds": [killEmbed] });
    }
}