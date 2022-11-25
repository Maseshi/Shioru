const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "name": "eat",
    "description": "Fake text saying who you are eating.",
    "category": "fun",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "eat <name>",
    "aliases": ["e", "กิน"],
    async execute(client, message, args) {
        const inputName = args.join(" ");

        if (!inputName) return message.reply(client.translate.commands.eat.empty);

        const authorUsername = message.author.username;
        const clientUsername = client.user.username;
        const eatEmbed = new EmbedBuilder()
            .setDescription(client.translate.commands.eat.already_eaten.replace("%s1", authorUsername).replace("%s2", inputName))
            .setColor("Default");

        if (inputName === clientUsername) {
            return message.reply("...").then(() => {
                setTimeout(() => {
                    message.reply(client.translate.commands.eat.do_not_eat_me);
                }, 8000);
            });
        }

        message.channel.send({
            "embeds": [eatEmbed]
        });
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "eat",
            "th": "กิน"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Fake text saying who you are eating.",
            "th": "ข้อความปลอมที่บอกว่าคุณกำลังจะกินใคร!"
        },
        "options": [
            {
                "type": 3,
                "name": "name",
                "name_localizations": {
                    "th": "ชื่อ"
                },
                "description": "The name of what you want to eat.",
                "description_localizations": {
                    "th": "ชื่อของสิ่งที่คุณอยากกิน!"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        const inputName = interaction.options.get("name").value;

        const authorUsername = interaction.user.username;
        const clientUsername = interaction.client.user.username;
        const eatEmbed = new EmbedBuilder()
            .setDescription(interaction.client.translate.commands.eat.already_eaten.replace("%s1", authorUsername).replace("%s2", inputName))
            .setColor("Default");

        if (inputName === clientUsername) {
            return await interaction.editReply("...").then(() => {
                setTimeout(async () => {
                    await interaction.followUp(interaction.client.translate.commands.eat.do_not_eat_me);
                }, 8000);
            });
        }

        await interaction.editReply({
            "embeds": [eatEmbed]
        });
    }
};