const { AttachmentBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "name": "rip",
    "description": "Send RIP images",
    "category": "fun",
    "permissions": {
        "user": [PermissionsBitField.Flags.AttachFiles],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.AttachFiles
        ]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "rip",
    "aliases": ["rip", "อาร์ไอพี", "ลาก๋อย"],
    async execute(client, message, args) {
        const rip = new AttachmentBuilder("https://i.imgur.com/w3duR07.png");
    
        if (!rip) return message.reply(client.translate.commands.rip.no_image);
    
        message.channel.send({ "files": [rip] });
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "rip",
            "th": "ตาย"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Send RIP images",
            "th": "ส่งภาพ RIP"
        }
    },
    async execute(interaction) {
        const rip = new AttachmentBuilder("https://i.imgur.com/w3duR07.png");

        if (!rip) return await interaction.editReply(interaction.client.translate.commands.rip.no_image);

        await interaction.editReply({ "files": [rip] });
    }
};