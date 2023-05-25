const { PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, push, update } = require("firebase/database");
const { IDConvertor } = require("../../utils/miscUtils");

module.exports = {
    "enable": true,
    "name": "bug",
    "description": "Report error information about bots.",
    "category": "me",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "bug <message(String)>",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "บัค"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "รายงานข้อผิดพลาดเกี่ยวกับบอท"
        },
        "options": [
            {
                "type": 3,
                "name": "message",
                "name_localizations": {
                    "th": "ข้อความ"
                },
                "description": "Message about the bugs you find.",
                "description_localizations": {
                    "th": "ข้อความเกี่ยวกับข้อบกพร่องที่คุณพบ"
                },
                "required": true,
                "min_value": 5
            }
        ]
    },
    async execute(interaction) {
        const inputMessage = interaction.options.getString("message");

        const bugsRef = child(child(ref(getDatabase(), "projects"), IDConvertor(interaction.client.user.username)), "bugs");

        const authorUid = interaction.user.id;
        const authorTag = interaction.user.tag;
        const date = new Date();

        await interaction.reply(interaction.client.translate.commands.bug.sending);

        await update(push(bugsRef), {
            "message": inputMessage,
            "user": authorTag,
            "uid": authorUid,
            "reportAt": date,
            "status": {
                "read": false,
                "close": false,
                "comment": false
            }
        });

        await interaction.editReply(interaction.client.translate.commands.bug.success);
    }
};