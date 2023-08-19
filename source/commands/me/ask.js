const { PermissionsBitField } = require("discord.js");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
    "enable": true,
    "name": "ask",
    "description": "Ask the bot something",
    "category": "me",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "ask <messages(String)>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ถาม"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ถามบางอย่างกับบอท"
        },
        "options": [
            {
                "type": 3,
                "name": "messages",
                "name_localizations": {
                    "th": "ข้อความ"
                },
                "description": "What you want to ask.",
                "description_localizations": {
                    "th": "สิ่งที่คุณต้องการจะถาม"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        const inputMessages = interaction.options.getString("messages");

        if (!interaction.client.ai) return interaction.reply(interaction.client.translate.commands.ask.has_been_disabled);

        await interaction.deferReply();

        try {
            const response = await interaction.client.ai.createCompletion({
                "model": "text-davinci-003",
                "prompt": inputMessages,
                "user": interaction.client.user.username
            });

            if (!response.data && response.data.choices) {
                catchError(interaction.client, interaction, "chatSystem", response.data, true);
                return await interaction.editReply(interaction.client.translate.commands.ask.cannot_reply_at_this_time);
            }

            interaction.editReply(response.data.choices[0].text);
        } catch (error) {
            if (error.response) {
                await interaction.editReply(interaction.client.translate.commands.ask.error_cannot_reply.replace("%s", error.response.status));
                return catchError(interaction.client, interaction, module.exports.name, error, true);
            } else {
                return catchError(interaction.client, interaction, module.exports.name, error);
            }
        }
    }
};