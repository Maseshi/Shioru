const { create } = require("sourcebin");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
    "name": "paste",
    "description": "Paste the text in sourceb.in.",
    "category": "utility",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "paste <title> <content>",
    "aliases": ["วาง"],
    async execute(client, message, args) {
        const inputTitle = args.shift();
        const inputContent = args.join(" ");
    
        if (!inputTitle) return message.reply(client.translate.commands.paste.title_empty);
        if (!inputContent) return message.reply(client.translate.commands.paste.content_empty);
    
        let response;
    
        try {
            response = await create(
                [
                    {
                        "name": " ",
                        "content": inputContent,
                        "language": "text",
                    },
                ],
                {
                    "title": inputTitle,
                    "description": " ",
                }
            );
        } catch (error) {
            return catchError(client, message, module.exports.help.name, error);
        }
    
        if (!response) return message.reply(client.translate.commands.paste.backend_not_response);
    
        const url = response.url;
        const raw = "https://cdn.sourceb.in/bins/" + response.key + "/0";
    
        message.channel.send(("**Sourcebin**\n🔸 " + client.translate.commands.paste.file + ": <%s1>\n🔹 " + client.translate.commands.paste.raw + ": <%s2>").replace("%s1", url).replace("%s2", raw));
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "paste",
            "th": "วาง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Paste the text in sourceb.in.",
            "th": "วางข้อความใน sourceb.in"
        },
        "options": [
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
                "required": true
            },
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
            }
        ]
    },
    async execute(interaction) {
        const inputTitle = interaction.options.get("title").value;
        const inputContent = interaction.options.get("content").value;

        let response;

        try {
            response = await create(
                [
                    {
                        "name": " ",
                        "content": inputContent,
                        "language": "text",
                    },
                ],
                {
                    "title": inputTitle,
                    "description": " ",
                }
            );
        } catch (error) {
            return catchError(interaction.client, interaction, module.exports.help.name, error);
        }

        if (!response) return await interaction.editReply(interaction.client.translate.commands.paste.backend_not_response);

        const url = response.url;
        const raw = "https://cdn.sourceb.in/bins/" + response.key + "/0";

        await interaction.editReply(("**Sourcebin**\n🔸 " + interaction.client.translate.commands.paste.file + ": <%s1>\n🔹 " + interaction.client.translate.commands.paste.raw + ": <%s2>").replace("%s1", url).replace("%s2", raw));
    }
}