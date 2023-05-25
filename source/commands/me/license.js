const { PermissionsBitField } = require("discord.js");
const { join } = require("node:path");
const { readFileSync } = require("node:fs");

module.exports = {
    "enable": true,
    "name": "license",
    "description": "Understanding copyrighted material",
    "category": "me",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "license",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ลายเซ็น"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ทำความเข้าใจกับเนื้อหาที่มีลิขสิทธิ์"
        }
    },
    async execute(interaction) {
        const licensePath = join(__dirname, "../../../");
        const MITLicense = readFileSync(licensePath + "LICENSE", { "encoding": "utf-8" });
        const CC0License = readFileSync(licensePath + "LICENSE-ASSETS", { "encoding": "utf-8" });

        await interaction.reply({
            "files": [
                {
                    "attachment": Buffer.from(MITLicense),
                    "name": "LICENSE.txt"
                },
                {
                    "attachment": Buffer.from(CC0License),
                    "name": "LICENSE-ASSETS.txt"
                }
            ]
        });
    }
};