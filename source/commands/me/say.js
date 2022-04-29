module.exports.run = async (client, message, args) => {
    const inputChannel = args[0];
    const inputText = args.slice(1).join(" ");
    const textChannel = ["GUILD_TEXT", "GUILD_CATEGORY", "GUILD_NEWS", "GUILD_NEWS_THREAD", "GUILD_PUBLIC_THREAD", "GUILD_PUBLIC_THREAD", "GUILD_PRIVATE_THREAD", "GUILD_FORUM"];
    const channel = message.guild.channels.cache.find(channels => (channels.id === inputChannel) || (channels.name === inputChannel));

    if (!channel) {
        if (!args.join(" ")) return message.reply(client.translate.commands.say.empty);

        await message.delete();
        await message.channel.send(args.join(" "));
        message.reply({
            "content": client.translate.commands.say.success,
            "ephemeral": true
        });
    } else {
        if (!inputText) return message.reply(client.translate.commands.say.empty);
        if (channel.type === textChannel) return message.reply(client.translate.commands.say.invalid_type);

        await message.delete();
        await channel.send(inputText);
        message.reply({
            "content": client.translate.commands.say.success,
            "ephemeral": true
        });
    }
};

module.exports.help = {
    "name": "say",
    "description": "Let the bot print instead",
    "usage": "say (channel: name, id) <text>",
    "category": "me",
    "aliases": ["s", "พูด", "ส่งข้อความ"],
    "userPermissions": ["MANAGE_MESSAGES"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "say",
            "th": "พูด"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "Let the bot print instead",
            "th": "ปล่อยให้บอทพิมพ์แทน"
        },
        "options": [
            {
                "type": 3,
                "name": "text",
                "name_localizations": {
                    "th": "ข้อความ"
                },
                "description": "The message you want to send.",
                "description_localizations": {
                    "th": "ข้อความที่คุณต้องการส่ง"
                },
                "required": true
            },
            {
                "type": 7,
                "name": "channel",
                "name_localizations": {
                    "th": "ช่อง"
                },
                "description": "The channel to send the message to",
                "description_localizations": {
                    "th": "ช่องที่จะส่งข้อความ"
                },
                "required": false,
                "channel_types": [
                    0,
                    5,
                    10,
                    11,
                    12,
                    15
                ]
            }
        ]
    },
    async execute(interaction) {
        const inputText = interaction.options.get("text").value;
        const inputChannel = interaction.options.get("channel");

        if (!inputChannel) {
            if (!inputText) return await interaction.editReply(interaction.client.translate.commands.say.empty);

            await interaction.editReply(inputText);
            await interaction.followUp({
                "content": interaction.client.translate.commands.say.success,
                "ephemeral": true
            });
        } else {
            const channel = interaction.guild.channels.cache.find(channels => (channels.id === inputChannel.value) || (channels.name === inputChannel.value));

            await channel.send(inputText);
            await interaction.editReply({
                "content": interaction.client.translate.commands.say.success,
                "ephemeral": true
            });
        }
    }
}