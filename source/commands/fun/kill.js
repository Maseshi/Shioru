module.exports.run = (client, message, args) => {
    const inputName = args.join(" ");

    if (!inputName) return message.reply(client.translate.commands.kill.empty);

    const authorUsername = message.author.username;
    const clientUsername = client.user.username;

    if (inputName === clientUsername) return message.reply(client.translate.commands.kill.do_not_kill_me);

    message.channel.send({
        "embeds": [
            {
                "color": 1,
                "description": client.translate.commands.kill.killed.replace("%s1", authorUsername).replace("%s2", inputName)
            }
        ]
    });
};

module.exports.help = {
    "name": "kill",
    "description": "Fake messages that say you will kill something.",
    "usage": "kill <name>",
    "category": "fun",
    "aliases": ["kia", "ฆ่า"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "kill",
            "th": "ฆ่า"
        },
        "description": module.exports.help.description,
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

        if (inputName === clientUsername) return await interaction.editReply(interaction.client.translate.commands.kill.do_not_kill_me);

        await interaction.editReply({
            "embeds": [
                {
                    "color": 1,
                    "description": interaction.client.translate.commands.kill.killed.replace("%s1", authorUsername).replace("%s2", inputName)
                }
            ]
        });
    }
}