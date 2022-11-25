const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, update } = require("firebase/database");

module.exports = {
    "name": "setCommand",
    "description": "Set the bot prefix for the server.",
    "category": "settings",
    "permissions": {
        "user": [PermissionsBitField.Flags.ManageGuild],
        "client": [PermissionsBitField.Flags.SendMessages]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "setCommand <options: enable, disable> <command>",
    "aliases": ["setcommand", "cmd", "คำสั่ง"],
    async execute(client, message, args) {
        const input = args.join(" ");
        const inputOption = args[0] ? args[0].toLowerCase() : "";
        const inputCommand = args[1];

        let commands;
        const guildID = message.guild.id;
        const prefix = client.config.prefix;
        const commandsRef = child(child(ref(getDatabase(), "projects/shioru/guilds"), guildID), "commands");

        if (!input) {
            const clientFetch = await client.user.fetch();
            const clientColor = clientFetch.accentColor;
            const noInputEmbed = new EmbedBuilder()
                .setTitle("🪄 คำสั่ง")
                .setDescription(
                    client.translate.commands.setCommand.description
                        .replace("%s1", client.commands.size)
                        .replace("%s2", client.commands.map(dirs => dirs.command.enable ? "`" + dirs.name + "`" : "||" + dirs.name + "||").join(", "))
                        .replace("%s3", (prefix + module.exports.command.usage))
                        .replace("%s4", ("/" + module.exports.command.usage))
                )
                .setColor(clientColor)
                .setTimestamp()
                .setFooter({ "text": client.translate.commands.setCommand.data_at });

            return message.channel.send({
                "embeds": [noInputEmbed]
            });
        }
        if (!inputCommand) return message.reply(client.translate.commands.setCommand.command_input_empty);
        if (inputCommand.toLowerCase() === module.exports.name.toLowerCase()) return message.reply(client.translate.commands.setCommand.can_not_manage_this_command);
        if (client.commands.has(inputCommand)) commands = client.commands.get(inputCommand);
        if (client.aliases.has(inputCommand)) commands = client.commands.get(client.aliases.get(inputCommand));
        if (!commands) return message.reply(client.translate.commands.setCommand.command_not_found);

        switch (inputOption) {
            case "enable":
                commands.command.enable = true;

                update(child(commandsRef, inputCommand), true).then(() => {
                    message.channel.send(client.translate.commands.setCommand.enabled.replace("%s", inputCommand));
                });
                break;
            case "disable":
                commands.command.enable = false;

                update(child(commandsRef, inputCommand), false).then(() => {
                    message.channel.send(client.translate.commands.setCommand.disabled.replace("%s", inputCommand));
                });
                break;
            default:
                return message.reply(client.translate.commands.setCommand.invalid_option.replace("%s", inputOption));
        }
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
    "data": {
        "name": module.exports.name.toLowerCase(),
        "name_localizations": {
            "en-US": "prefix",
            "th": "คำนำหน้า"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Set the bot prefix for the server.",
            "th": "ตั้งค่าคำนำหน้าบอทสำหรับเซิร์ฟเวอร์"
        },
        "options": [
            {
                "type": 1,
                "name": "info",
                "name_localizations": {
                    "th": "ข้อมูล"
                },
                "description": "Explore current commands",
                "description_localizations": {
                    "th": "สำรวจคำสั่งที่เป็นอยู่ในปัจจุบัน"
                },
                "required": false
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
                "required": false,
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
                "required": false,
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
        const inputCommand = interaction.options.get("command");

        let commands;
        const guildID = interaction.guild.id;
        const prefix = interaction.client.config.prefix;
        const commandsRef = child(child(ref(getDatabase(), "projects/shioru/guilds"), guildID), "commands");

        if (subCommand === "info") {
            const clientFetch = await interaction.client.user.fetch();
            const clientColor = clientFetch.accentColor;
            const noInputEmbed = new EmbedBuilder()
                .setTitle("🪄 คำสั่ง")
                .setDescription(
                    interaction.client.translate.commands.setCommand.description
                        .replace("%s1", interaction.client.commands.size)
                        .replace("%s2", interaction.client.commands.map(dirs => dirs.command.enable ? "`" + dirs.name + "`" : "||" + dirs.name + "||").join(", "))
                        .replace("%s3", (prefix + module.exports.command.usage))
                        .replace("%s4", ("/" + module.exports.command.usage))
                )
                .setColor(clientColor)
                .setTimestamp()
                .setFooter({ "text": "ข้อมูลของเมื่อ" });

            return interaction.editReply({ "embeds": [noInputEmbed] });
        }
        if (subCommand === "enable") {
            if (!inputCommand) return await interaction.editReply(interaction.client.translate.commands.setCommand.command_input_empty);
            if (inputCommand.toLowerCase() === module.exports.name.toLowerCase()) return interaction.editReply(interaction.client.translate.commands.setCommand.can_not_manage_this_command);
            if (interaction.client.commands.has(inputCommand)) commands = interaction.client.commands.get(inputCommand);
            if (interaction.client.aliases.has(inputCommand)) commands = interaction.client.commands.get(interaction.client.aliases.get(inputCommand));
            if (!commands) return await interaction.editReply(interaction.client.translate.commands.setCommand.command_not_found);

            commands.command.enable = true;

            update(child(commandsRef, inputCommand), true).then(async () => {
                await interaction.editReply(interaction.client.translate.commands.setCommand.enabled.replace("%s", inputCommand));
            });
        }
        if (subCommand === "disable") {
            if (!inputCommand) return await interaction.editReply(interaction.client.translate.commands.setCommand.command_input_empty);
            if (inputCommand.toLowerCase() === module.exports.name.toLowerCase()) return interaction.editReply(interaction.client.translate.commands.setCommand.can_not_manage_this_command);
            if (interaction.client.commands.has(inputCommand)) commands = interaction.client.commands.get(inputCommand);
            if (interaction.client.aliases.has(inputCommand)) commands = interaction.client.commands.get(client.aliases.get(inputCommand));
            if (!commands) return await interaction.editReply(interaction.client.translate.commands.setCommand.command_not_found);

            commands.command.enable = false;

            update(child(commandsRef, inputCommand), false).then(async () => {
                await interaction.editReply(interaction.client.translate.commands.setCommand.disabled.replace("%s", inputCommand));
            });
        }
    }
}