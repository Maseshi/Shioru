const { PermissionsBitField } = require("discord.js");

module.exports = {
    "name": "numbers",
    "description": "Random number.",
    "category": "fun",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "numbers <min> <max>",
    "aliases": ["randomnumbers", "randomnumber", "number", "สุ่มเลข"],
    async execute(client, message, args) {
        let inputMin = parseInt(args[0]);
        let inputMax = parseInt(args[1]);
    
        if (inputMin > inputMax) {
            const temp = inputMax;
            inputMax = inputMin;
            inputMin = temp;
        }
    
        const result = Math.floor(Math.random() * (inputMax - inputMin + 1)) + inputMin;
    
        if (!result) return message.reply(client.translate.commands.numbers.empty);
    
        message.channel.send(client.translate.commands.numbers.result.replace("%s", result));
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "numbers",
            "th": "ตัวเลข"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Random number.",
            "th": "สุ่มตัวเลข"
        },
        "options": [
            {
                "type": 10,
                "name": "min",
                "name_localizations": {
                    "th": "ต่ำสุด"
                },
                "description": "The minimum number",
                "description_localizations": {
                    "th": "จำนวนขั้นต่ำ"
                },
                "required": true
            },
            {
                "type": 10,
                "name": "max",
                "name_localizations": {
                    "th": "สูงสุด"
                },
                "description": "The maximum number",
                "description_localizations": {
                    "th": "จำนวนสูงสุด"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        let inputMin = interaction.options.get("min").value;
        let inputMax = interaction.options.get("max").value;

        if (inputMin > inputMax) {
            const temp = inputMax;
            inputMax = inputMin;
            inputMin = temp;
        }

        const result = Math.floor(Math.random() * (inputMax - inputMin + 1)) + inputMin;

        if (!result) return await interaction.editReply(interaction.client.translate.commands.numbers.empty);

        await interaction.editReply(interaction.client.translate.commands.numbers.result.replace("%s", result));
    }
}