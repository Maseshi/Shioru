module.exports.run = (client, message, args) => {
    const inputName = args.join(" ");

    if (!inputName) return message.reply(client.translate.commands.eat.empty);

    const authorUsername = message.author.username;
    const clientUsername = client.user.username;

    if (inputName === clientUsername) {
        return message.reply("...").then(() => {
            setTimeout(() => {
                message.reply(client.translate.commands.eat.do_not_eat_me);
            }, 8000);
        });
    }

    message.channel.send({
        "embeds": [
            {
                "color": 1,
                "description": client.translate.commands.eat.already_eaten.replace("%s1", authorUsername).replace("%s2", inputName)
            }
        ]
    });
};

module.exports.help = {
    "name": "eat",
    "description": "Fake text saying who you are eating.",
    "usage": "eat <name>",
    "category": "fun",
    "aliases": ["e", "กิน"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "eat",
            "th": "กิน"
        },
        "description": module.exports.help.description,
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

        if (inputName === clientUsername) {
            return await interaction.editReply("...").then(() => {
                setTimeout(async () => {
                    await interaction.editReply(interaction.client.translate.commands.eat.do_not_eat_me);
                }, 8000);
            });
        }

        await interaction.editReply({
            "embeds": [
                {
                    "color": 1,
                    "description": interaction.client.translate.commands.eat.already_eaten.replace("%s1", authorUsername).replace("%s2", inputName)
                }
            ]
        });
    }
};