const { readdirSync } = require("node:fs");
const path = require("path");

module.exports = {
    "name": "reload",
    "description": "Reload the command that doesn't work.",
    "category": "developer",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "reload <command: name, aliases>",
    "aliases": ["recommand", "รีโหลด", "โหลดซ้ำ"],
    async execute(client, message, args) {
        const inputCommand = args[0];

        if (!inputCommand) return message.reply(client.translate.commands.reload.command_required);

        const commandName = inputCommand.toLowerCase();
        const commands = message.client.commands.get(commandName);
        const aliases = message.client.commands.get(client.aliases.get(commandName));
        const command = commands || aliases;

        if (!command) return message.reply(client.translate.commands.reload.invalid_command);

        readdirSync(path.join(__dirname, "..")).forEach(async (dirs) => {
            const files = readdirSync(path.join(__dirname, "..", dirs));

            if (files.includes(commandName + ".js")) {
                const file = "../" + dirs + "/" + commandName + ".js";

                try {
                    delete require.cache[require.resolve(file)];
                    client.commands.delete(commandName);

                    const pull = require(file);

                    client.commands.set(commandName, pull);
                    message.channel.send(client.translate.commands.reload.reloaded.replace("%s", commandName));
                } catch (error) {
                    message.channel.send(client.translate.commands.reload.reload_error.replace("%s", inputCommand.toUpperCase()));
                    console.log(error.stack || error);
                }
            }
        });
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "reload",
            "th": "โหลดซ้ำ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Reload the command that doesn't work.",
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
        const inputCommand = interaction.options.get("command").value;

        const commandName = inputCommand.toLowerCase();
        const command = interaction.client.interaction.get(commandName);

        if (!command) return await interaction.editReply(interaction.client.translate.commands.reload.invalid_command);

        readdirSync(path.join(__dirname, "..")).forEach(async (dirs) => {
            const files = readdirSync(path.join(__dirname, "..", dirs));

            if (files.includes(commandName + ".js")) {
                const file = "../" + dirs + "/" + commandName + ".js";

                try {
                    delete require.cache[require.resolve(file)];
                    interaction.client.interaction.delete(commandName);

                    const pull = require(file);

                    interaction.client.interaction.set(commandName, pull);
                    await interaction.editReply(interaction.client.translate.commands.reload.reloaded.replace("%s", commandName));
                } catch (error) {
                    await interaction.editReply(interaction.client.translate.commands.reload.reload_error.replace("%s", inputCommand.toUpperCase()));
                    console.log(error.stack || error);
                }
            }
        });
    }
}
