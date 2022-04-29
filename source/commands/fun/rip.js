const { MessageAttachment } = require("discord.js");

module.exports.run = (client, message, args) => {
    const rip = new MessageAttachment("https://i.imgur.com/w3duR07.png");

    if (!rip) return message.reply(client.translate.commands.rip.no_image);

    message.channel.send({ "files": [rip] });
};

module.exports.help = {
    "name": "rip",
    "description": "Send RIP images",
    "usage": "rip",
    "category": "fun",
    "aliases": ["rip", "อาร์ไอพี", "ลาก๋อย"],
    "userPermissions": ["ATTACH_FILES"],
    "clientPermissions": ["SEND_MESSAGES", "ATTACH_FILES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "rip",
            "th": "ตาย"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Send RIP images",
            "th": "ส่งภาพ RIP"
        }
    },
    async execute(interaction) {
        const rip = new MessageAttachment("https://i.imgur.com/w3duR07.png");

        if (!rip) return await interaction.editReply(interaction.client.translate.commands.rip.no_image);

        await interaction.editReply({ "files": [rip] });
    }
};