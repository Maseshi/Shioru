const { EmbedBuilder } = require("discord.js");

module.exports = {
    "name": "kill",
    "description": "Fake messages that say you will kill something.",
    "category": "fun",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "kill <name>",
    "aliases": ["kia", "ฆ่า"],
    async execute(client, message, args) {
        const inputName = args.join(" ");

        if (!inputName) return message.reply(client.translate.commands.kill.empty);

        const authorUsername = message.author.username;
        const clientUsername = client.user.username;
        const killEmbed = new EmbedBuilder()
            .setDescription(client.translate.commands.kill.killed.replace("%s1", authorUsername).replace("%s2", inputName))
            .setColor("Default");

        if (inputName === clientUsername) return message.reply(client.translate.commands.kill.do_not_kill_me);

        message.channel.send({
            "embeds": [killEmbed]
        });
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "kill",
            "th": "ฆ่า"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Fake messages that say you will kill something.",
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
        const inputName = interaction.options.get("name").value;

        const authorUsername = interaction.user.username;
        const clientUsername = interaction.client.user.username;
        const killEmbed = new EmbedBuilder()
            .setDescription(interaction.client.translate.commands.kill.killed.replace("%s1", authorUsername).replace("%s2", inputName))
            .setColor("Default");

        if (inputName === clientUsername) return await interaction.editReply(interaction.client.translate.commands.kill.do_not_kill_me);

        await interaction.editReply({
            "embeds": [killEmbed]
        });
    }
}