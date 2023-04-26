const { PermissionsBitField } = require("discord.js");
const { create } = require("sourcebin");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
    "enable": true,
    "name": "paste",
    "description": "Paste the text in sourceb.in.",
    "category": "tools",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "paste <title(String)> [description(String)] <content(String)> <language(String)>",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "วาง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "วางข้อความใน sourceb.in"
        },
        "options": [
            {
                "type": 3,
                "name": "content",
                "name_localizations": {
                    "th": "เนื้อหา"
                },
                "description": "Content to be placed",
                "description_localizations": {
                    "th": "เนื้อหาที่ต้องการจะวาง"
                },
                "required": true
            },
            {
                "type": 3,
                "name": "title",
                "name_localizations": {
                    "th": "ชื่อเรื่อง"
                },
                "description": "The title is about the content to be pasted.",
                "description_localizations": {
                    "th": "ชื่อเรื่องเกี่ยวกับเนื้อหาที่จะวาง"
                },
                "required": false
            },
            {
                "type": 3,
                "name": "description",
                "name_localizations": {
                    "th": "คำอธิบาย"
                },
                "description": "Description of what you are writing.",
                "description_localizations": {
                    "th": "คำอธิบายของสิ่งคุณกำลังเขียน"
                },
                "required": false
            },
            {
                "type": 3,
                "name": "language",
                "name_localizations": {
                    "th": "ภาษา"
                },
                "description": "Here, it means programming languages such as Javascript, Python, C++, etc.",
                "description_localizations": {
                    "th": "ในที่นี้จะหมายถึงภาษาทางโปรแกรม เช่น Javascript, Python, C++ เป็นต้น"
                },
                "required": false
            }
        ]
    },
    async execute(interaction) {
        const inputTitle = interaction.options.getString("title") ?? "";
        const inputDescription = interaction.options.getString("description") ?? "";
        const inputContent = interaction.options.getString("content");
        const inputLanguage = interaction.options.getString("language") ?? "text";

        let response;

        try {
            response = await create({
                "title": inputTitle,
                "description": inputDescription,
                "files": [
                    {
                        "content": inputContent,
                        "language": inputLanguage,
                    }
                ]
            });
        } catch (error) {
            return catchError(interaction.client, interaction, module.exports.name, error);
        }

        if (!response) return await interaction.reply(interaction.client.translate.commands.paste.backend_not_response);

        const url = response.url;
        const raw = "https://cdn.sourceb.in/bins/" + response.key + "/0";

        await interaction.reply(("**Sourcebin**\n🔸 " + interaction.client.translate.commands.paste.file + ": <%s1>\n🔹 " + interaction.client.translate.commands.paste.raw + ": <%s2>").replace("%s1", url).replace("%s2", raw));
    }
}