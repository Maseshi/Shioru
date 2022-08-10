const { EmbedBuilder } = require("discord.js");
const { supportTranslate } = require("../../utils/miscUtils");
const ISO6391 = require("iso-639-1");
const googleTranslate = require("@vitalets/google-translate-api");

module.exports = {
    "name": "translate",
    "description": "Translate text",
    "category": "utility",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "translate <code> <message>",
    "aliases": ["แปล", "tr"],
    async execute(client, message, args) {
        const inputCode = args[0];
        const inputMessage = args.slice(1).join(" ");
    
        if (!inputCode) return message.reply(client.translate.commands.translate.code_empty.replace("%s", Object.keys(translate).join(", ")));
        if (inputCode.length < 2) return message.reply(client.translate.commands.translate.should_not_less_than_two);
        if (!supportTranslate[inputCode]) return message.reply(client.translate.commands.translate.translate_support.replace("%s", Object.keys(translate).join(", ")));
        if (!inputMessage) return message.reply(client.translate.commands.translate.message_empty);
    
        const response = await googleTranslate(inputMessage, { "to": inputCode })
    
        if (!response) return message.reply(client.translate.commands.translate.can_not_translate);
    
        const resOutput = response.text;
        const resInputCode = response.from.language.iso;
        const resOutputCode = inputCode;
        const resInputLang = ISO6391.getName(response.from.language.iso);
        const resOutputLang = ISO6391.getName(resOutputCode);
    
        const authorFetch = await message.author.fetch();
        const authorColor = authorFetch.accentColor;
        const authorUsername = message.author.username;
        const authorAvatar = message.author.displayAvatarURL()
        const translateEmbed = new EmbedBuilder()
            .setColor(authorColor)
            .setTimestamp()
            .setDescription(resOutput)
            .setAuthor({ "iconURL": authorAvatar, "name": authorUsername + " " + client.translate.commands.translate.says })
            .setFooter({ "text": resInputLang + " [" + resInputCode + "] -> " + resOutputLang + " [" + resOutputCode + "]" });
    
        message.channel.send({ "embeds": [translateEmbed] });
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "translate",
            "th": "แปล"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Translate text",
            "th": "แปลภาษาข้อความ"
        },
        "options": [
            {
                "type": 3,
                "name": "code",
                "name_localizations": {
                    "th": "รหัส"
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
        const inputCode = interaction.options.get("code").value;
        const inputMessage = interaction.options.get("message").value;

        if (!supportTranslate[inputCode]) return await interaction.editReply(interaction.client.translate.commands.translate.translate_support.replace("%s", Object.keys(translate).join(", ")));

        const response = await googleTranslate(inputMessage, { "to": inputCode })

        if (!response) return await interaction.editReply(interaction.client.translate.commands.translate.can_not_translate);

        const resOutput = response.text;
        const resInputCode = response.from.language.iso;
        const resOutputCode = inputCode;
        const resInputLang = ISO6391.getName(response.from.language.iso);
        const resOutputLang = ISO6391.getName(resOutputCode);

        const authorFetch = await interaction.user.fetch();
        const authorColor = authorFetch.accentColor;
        const authorUsername = interaction.user.username;
        const authorAvatar = interaction.user.displayAvatarURL()
        const translateEmbed = new EmbedBuilder()
            .setColor(authorColor)
            .setTimestamp()
            .setDescription(resOutput)
            .setAuthor({ "iconURL": authorAvatar, "name": authorUsername + " " + interaction.client.translate.commands.translate.says })
            .setFooter({ "text": resInputLang + " [" + resInputCode + "] -> " + resOutputLang + " [" + resOutputCode + "]" });

        interaction.editReply({ "embeds": [translateEmbed] });
    }
}