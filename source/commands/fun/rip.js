const { AttachmentBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "rip",
    "description": "Send RIP images",
    "category": "fun",
    "permissions": {
        "user": [PermissionsBitField.Flags.AttachFiles],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.AttachFiles
        ]
    },
    "usage": "rip",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
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
}