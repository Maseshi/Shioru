const { EmbedBuilder, PermissionsBitField, ApplicationCommandType } = require("discord.js");
const { supportTranslate } = require("../../utils/miscUtils");
const { translate } = require("@vitalets/google-translate-api");

module.exports = {
    "name": "translate",
    "description": "Translate text",
    "category": "information",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "translate <to> <message>",
    "aliases": ["แปล", "tr"],
    async execute(client, message, args) {
        const inputTo = args[0];
        const inputMessage = args.slice(1).join(" ");
    
        if (!inputTo) return message.reply(client.translate.commands.translate.code_empty.replace("%s", Object.keys(supportTranslate).join(", ")));
        if (inputTo.length < 2) return message.reply(client.translate.commands.translate.should_not_less_than_two);
        if (!supportTranslate[inputTo]) return message.reply(client.translate.commands.translate.translate_support.replace("%s", Object.keys(supportTranslate).join(", ")));
        if (!inputMessage) return message.reply(client.translate.commands.translate.message_empty);
    
        const response = await translate(inputMessage, { "to": inputTo })
    
        if (!response) return message.reply(client.translate.commands.translate.can_not_translate);

        const resOutput = response.text;
        const resInputCode = response.raw.src.toUpperCase();
        const resOutputCode = inputTo.toUpperCase();
    
        const authorFetch = await message.author.fetch();
        const authorColor = authorFetch.accentColor;
        const authorUsername = message.author.username;
        const authorAvatar = message.author.displayAvatarURL()
        const translateEmbed = new EmbedBuilder()
            .setColor(authorColor)
            .setTimestamp()
            .setDescription("```" + resOutput + "```")
            .setAuthor({ "iconURL": authorAvatar, "name": authorUsername + " " + client.translate.commands.translate.says })
            .setFooter({ "text": "[" + resInputCode + "] -> [" + resOutputCode + "]" });
    
        message.channel.send({ "embeds": [translateEmbed] });
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "translate",
            "th": "แปลภาษา"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Translate text",
            "th": "แปลภาษาข้อความ"
        },
        "options": [
            {
                "type": 3,
                "name": "to",
                "name_localizations": {
                    "th": "เป็น"
                },
                "description": "Country code for translation",
                "description_localizations": {
                    "th": "รหัสประเทศสำหรับการแปลภาษา"
                },
                "required": true,
                "min_length": 2
            },
            {
                "type": 3,
                "name": "message",
                "name_localizations": {
                    "th": "ข้อความ"
                },
                "description": "the text to be translated",
                "description_localizations": {
                    "th": "ข้อความที่ต้องการจะแปล"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        const inputTo = interaction.options.get("to").value;
        const inputMessage = interaction.options.get("message").value;

        if (!supportTranslate[inputTo]) return await interaction.editReply(interaction.client.translate.commands.translate.translate_support.replace("%s", Object.keys(supportTranslate).join(", ")));

        const response = await translate(inputMessage, { "to": inputTo })

        if (!response) return await interaction.editReply(interaction.client.translate.commands.translate.can_not_translate);

        const resOutput = response.text;
        const resInputCode = response.raw.src;
        const resOutputCode = inputTo.toLowerCase();

        const authorFetch = await interaction.user.fetch();
        const authorColor = authorFetch.accentColor;
        const authorUsername = interaction.user.username;
        const authorAvatar = interaction.user.displayAvatarURL()
        const translateEmbed = new EmbedBuilder()
            .setColor(authorColor)
            .setTimestamp()
            .setDescription("```" + resOutput + "```")
            .setAuthor({ "iconURL": authorAvatar, "name": authorUsername + " " + interaction.client.translate.commands.translate.says })
            .setFooter({ "text": "[" + resInputCode + "] -> [" + resOutputCode + "]" });

        interaction.editReply({ "embeds": [translateEmbed], "ephemeral": true });
    }
}

module.exports.interaction.context = {
    "data": {
        "type": ApplicationCommandType.Message,
        "name": "contextTranslate",
        "name_localizations": {
            "en-US": "translate",
            "th": "แปลภาษา"
        }
    },
    async execute(interaction) {
        const inputTo = interaction.locale;
        const inputMessage = interaction.targetMessage;

        if (!supportTranslate[inputTo]) return await interaction.editReply(interaction.client.translate.commands.translate.translate_support.replace("%s", Object.keys(supportTranslate).join(", ")));

        const response = await translate(inputMessage, { "to": inputTo })

        if (!response) return await interaction.editReply(interaction.client.translate.commands.translate.can_not_translate);

        const resOutput = response.text;
        const resInputCode = response.raw.src;
        const resOutputCode = inputTo.toLowerCase();

        const authorFetch = await interaction.user.fetch();
        const authorColor = authorFetch.accentColor;
        const authorUsername = interaction.user.username;
        const authorAvatar = interaction.user.displayAvatarURL()
        const translateEmbed = new EmbedBuilder()
            .setColor(authorColor)
            .setTimestamp()
            .setDescription("```" + resOutput + "```")
            .setAuthor({ "iconURL": authorAvatar, "name": authorUsername + " " + interaction.client.translate.commands.translate.says })
            .setFooter({ "text": "[" + resInputCode + "] -> [" + resOutputCode + "]" });

        interaction.editReply({ "embeds": [translateEmbed] });
    }
}