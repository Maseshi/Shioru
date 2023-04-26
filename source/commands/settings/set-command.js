const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, update } = require("firebase/database");

module.exports = {
    "enable": true,
    "name": "set-command",
    "description": "Set to enable or disable commands.",
    "category": "settings",
    "permissions": {
        "user": [PermissionsBitField.Flags.ManageGuild],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ManageGuild
        ]
    },
    "usage": "set-command: get, enable <command(String)>, disable <command(String)>",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ตั้งค่าคำสั่ง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ตั้งค่าการเปิดหรือปิดใช้งานคำสั่ง"
        },
        "options": [
            {
                "type": 1,
                "name": "get",
                "name_localizations": {
                    "th": "รับ"
                },
                "description": "Explore current commands",
                "description_localizations": {
                    "th": "สำรวจคำสั่งที่เป็นอยู่ในปัจจุบัน"
                }
            },
            {
                "type": 1,
                "name": "enable",
                "name_localizations": {
                    "th": "เปิดใช้งาน"
                },
                "description": "Activate the desired command.",
                "description_localizations": {
                    "th": "เปิดใช้งานคำสั่งที่ต้องการ"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "command",
                        "name_localizations": {
                            "th": "คำสั่ง"
                        },
                        "description": "The required command will be activated.",
                        "description_localizations": {
                            "th": "คำสั่งที่ต้องการจะเปิดใช้งาน"
                        },
                        "required": true
                    }
                ]
            },
            {
                "type": 1,
                "name": "disable",
                "name_localizations": {
                    "th": "ปิดใช้งาน"
                },
                "description": "Deactivate desired commands.",
                "description_localizations": {
                    "th": "ปิดใช้งานคำสั่งที่ต้องการ"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "command",
                        "name_localizations": {
                            "th": "คำสั่ง"
                        },
                        "description": "The desired command will be disabled.",
                        "description_localizations": {
                            "th": "คำสั่งที่ต้องการจะปิดใช้งาน"
                        },
                        "required": true
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const inputCommand = interaction.options.getString("command");

        let commands;
        const guildID = interaction.guild.id;
        const commandsRef = child(child(ref(getDatabase(), "projects/shioru/guilds"), guildID), "commands");

        switch (subCommand) {
            case "info":
                const clientFetch = await interaction.client.user.fetch();
                const clientColor = clientFetch.accentColor;
                const noInputEmbed = new EmbedBuilder()
                    .setTitle(interaction.client.translate.commands.set_command.title)
                    .setDescription(
                        interaction.client.translate.commands.set_command.description
                            .replace("%s1", interaction.client.commands.size)
                            .replace("%s2", interaction.client.commands.map(dirs => dirs.command.enable ? "`" + dirs.name + "`" : "||" + dirs.name + "||").join(", "))
                            .replace("%s3", ("/" + module.exports.usage))
                    )
                    .setColor(clientColor)
                    .setTimestamp()
                    .setFooter({ "text": interaction.client.translate.commands.set_command.data_at });

                await interaction.reply({ "embeds": [noInputEmbed] });
                break;
            case "enable":
                if (!inputCommand) return await interaction.reply(interaction.client.translate.commands.set_command.command_input_empty);
                if (inputCommand.toLowerCase() === module.exports.name) return await interaction.reply(interaction.client.translate.commands.set_command.can_not_manage_this_command);
                if (interaction.client.commands.has(inputCommand)) commands = interaction.client.commands.get(inputCommand);
                if (interaction.client.aliases.has(inputCommand)) commands = interaction.client.commands.get(interaction.client.aliases.get(inputCommand));
                if (!commands) return await interaction.reply(interaction.client.translate.commands.set_command.command_not_found);

                commands.command.enable = true;

                update(child(commandsRef, inputCommand), true).then(async () => {
                    await interaction.reply(interaction.client.translate.commands.set_command.enabled.replace("%s", inputCommand));
                });
                break;
            case "disable":
                if (!inputCommand) return await interaction.reply(interaction.client.translate.commands.set_command.command_input_empty);
                if (inputCommand.toLowerCase() === module.exports.name) return await interaction.reply(interaction.client.translate.commands.set_command.can_not_manage_this_command);
                if (interaction.client.commands.has(inputCommand)) commands = interaction.client.commands.get(inputCommand);
                if (interaction.client.aliases.has(inputCommand)) commands = interaction.client.commands.get(client.aliases.get(inputCommand));
                if (!commands) return await interaction.reply(interaction.client.translate.commands.set_command.command_not_found);

                commands.command.enable = false;

                update(child(commandsRef, inputCommand), false).then(async () => {
                    await interaction.reply(interaction.client.translate.commands.set_command.disabled.replace("%s", inputCommand));
                });
                break;
        }
    }
}