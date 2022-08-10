const { ChannelType } = require("discord.js")

module.exports = {
    "name": "say",
    "description": "Let the bot print instead",
    "category": "me",
    "permissions": {
        "user": ["MANAGE_MESSAGES"],
        "client": ["SEND_MESSAGES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "say (channel: name, id) <text>",
    "aliases": ["s", "พูด", "ส่งข้อความ"],
    async execute(client, message, args) {
        const inputChannel = args[0];
        const inputText = args.slice(1).join(" ");
        const textChannel = [ChannelType.GuildText, ChannelType.GuildCategory, ChannelType.GuildNews, ChannelType.GuildNewsThread, ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildForum];
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
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "say",
            "th": "พูด"
        },
        "description": module.exports.description,
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