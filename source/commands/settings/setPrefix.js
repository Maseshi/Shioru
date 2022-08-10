const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");

module.exports = {
    "name": "setPrefix",
    "description": "Set the bot prefix for the server.",
    "category": "settings",
    "permissions": {
        "user": ["MANAGE_GUILD"],
        "client": ["SEND_MESSAGES"]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "setPrefix [option: set, default] <value>",
    "aliases": ["pf", "คำนำหน้า"],
    async execute(client, message, args) {
        const input = args.join(" ");
        const inputOption = args[0] ? args[0].toLowerCase() : "";
        const inputValue = args[1];
    
        const guildID = message.guild.id;
        const prefix = client.config.prefix;
        const dbRef = child(child(ref(getDatabase(), "Shioru/apps/discord/guilds"), guildID), "config");
    
        if (!input) {
            const clientFetch = await client.user.fetch();
            const clientColor = clientFetch.accentColor;
            const noInputEmbed = new EmbedBuilder()
                .setTitle(client.translate.commands.prefix.title)
                .setDescription(
                    client.translate.commands.prefix.description
                        .replace("%s1", prefix)
                        .replace("%s2", (prefix + module.exports.help.usage))
                        .replace("%s3", ("/" + module.exports.help.usage))
                )
                .setColor(clientColor)
                .setTimestamp()
                .setFooter({ "text": client.translate.commands.prefix.data_at });
    
            return message.channel.send({
                "embeds": [noInputEmbed]
            });
        }
    
        switch (inputOption) {
            case "set":
                if (!inputValue) return message.reply(client.translate.commands.prefix.empty_value);
                if (inputValue === prefix) return message.reply(client.translate.commands.prefix.already_set.replace("%s", inputValue));
                if (inputValue.length > 5) return message.reply(client.translate.commands.prefix.too_long);
    
                client.config.prefix = inputValue;
    
                set(child(dbRef, "prefix"), inputValue).then(() => {
                    message.channel.send(client.translate.commands.prefix.set_success.replace("%s", inputValue));
                });
                break;
            case "default":
                client.config.prefix = "S";
    
                set(child(dbRef, "prefix"), "S").then(() => {
                    message.channel.send(client.translate.commands.prefix.default_success);
                });
                break;
            default:
                return message.reply(client.translate.commands.prefix.this_options_not_found.replace("%s", inputOption));
        }
    }
}

module.exports.interaction = {
    "enable": true,
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
                "name": "current",
                "name_localizations": {
                    "th": "ปัจจุบัน",
                },
                "description": "Displays the current prefix.",
                "description_localizations": {
                    "th": "แสดงคำนำหน้าปัจจุบัน"
                },
                "required": false
            },
            {
                "type": 1,
                "name": "set",
                "name_localizations": {
                    "th": "ตั้งค่า",
                },
                "description": "Sets the prefix for the bot.",
                "description_localizations": {
                    "th": "ตั้งค่าคำนำหน้าสำหรับบอท"
                },
                "required": false,
                "options": [
                    {
                        "type": 3,
                        "name": "value",
                        "name_localizations": {
                            "th": "ค่า",
                        },
                        "description": "The new prefix.",
                        "description_localizations": {
                            "th": "คำนำหน้าใหม่"
                        },
                        "required": true,
                        "max_value": 5
                    }
                ]
            },
            {
                "type": 1,
                "name": "default",
                "name_localizations": {
                    "th": "ค่าเริ่มต้น",
                },
                "description": "Sets the prefix for the bot to the default prefix.",
                "description_localizations": {
                    "th": "ตั้งค่าคำนำหน้าสำหรับบอทเป็นคำนำหน้าเริ่มต้น"
                },
                "required": false
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const inputValue = interaction.options.get("value");

        const guildID = interaction.guild.id;
        const prefix = interaction.client.config.prefix;
        const dbRef = child(child(ref(getDatabase(), "Shioru/apps/discord/guilds"), guildID), "config");

        if (subCommand === "current") {
            const clientFetch = await interaction.client.user.fetch();
            const clientColor = clientFetch.accentColor;
            const noInputEmbed = new EmbedBuilder()
                .setTitle(interaction.client.translate.commands.prefix.title)
                .setDescription(
                    interaction.client.translate.commands.prefix.description
                        .replace("%s1", prefix)
                        .replace("%s2", (prefix + module.exports.help.usage))
                        .replace("%s3", ("/" + module.exports.help.usage))
                )
                .setColor(clientColor)
                .setTimestamp()
                .setFooter({ "text": interaction.client.translate.commands.prefix.data_at });

            return await interaction.editReply({
                "embeds": [noInputEmbed]
            });
        }

        if (subCommand === "set") {
            if (inputValue.value === prefix) return await interaction.editReply(interaction.client.translate.commands.prefix.already_set.replace("%s", inputValue.value));

            interaction.client.config.prefix = inputValue.value;

            await set(child(dbRef, "prefix"), inputValue.value);
            await interaction.editReply(interaction.client.translate.commands.prefix.set_success.replace("%s", inputValue.value));
        }

        if (subCommand === "default") {
            interaction.client.config.prefix = "S";

            await set(child(dbRef, "prefix"), "S");
            await interaction.editReply(interaction.client.translate.commands.prefix.default_success);
        }
    }
}