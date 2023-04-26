const { PermissionsBitField } = require("discord.js");
const { readdirSync } = require("node:fs");
const path = require("path");

module.exports = {
    "enable": true,
    "name": "reload",
    "description": "Reload the command that doesn't work.",
    "category": "developer",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "reload <command(String)>",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "โหลดซ้ำ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "โหลดคำสั่งที่ไม่ทำงานอีกครั้ง"
        },
        "options": [
            {
                "type": 3,
                "name": "command",
                "name_localizations": {
                    "th": "คำสั่ง"
                },
                "description": "Commands or alias that need to be loaded again. Example: ping.",
                "description_localizations": {
                    "th": "คำสั่งหรือนามแฝงที่ต้องการโหลดอีกครั้ง ตัวอย่าง: ping"
                },
                "required": true
            }
        ]
    },
    async execute(interaction) {
        const inputCommand = interaction.options.getString("command", true).toLowerCase();

        const command = interaction.client.commands.get(inputCommand);
        const commandName = command.name.toLowerCase();

        if (!command) return await interaction.reply(interaction.client.translate.commands.reload.invalid_command);

        delete require.cache[require.resolve("./" + commandName + ".js")];

        try {
            interaction.client.commands.delete(commandName);

            const newCommand = require("./" + commandName + ".js");
            const newCommandName = newCommand.name.toLowerCase();

            interaction.client.commands.set(newCommandName, newCommand);
            await interaction.reply(interaction.client.translate.commands.reload.reloaded.replace("%s", inputCommand));
        } catch (error) {
            console.error(error);
            await interaction.reply(interaction.client.translate.commands.reload.reload_error.replace("%s", inputCommand.toUpperCase()));
        }
    }
}
