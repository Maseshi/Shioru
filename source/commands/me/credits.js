const { EmbedBuilder } = require("discord.js");

module.exports = {
    "name": "credits",
    "description": "Credit of other creators.",
    "category": "me",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "credits",
    "aliases": ["เครดิต", "creator"],
    async execute(client, message, args) {
        const clientFetch = await client.user.fetch();
        const clientColor = clientFetch.accentColor;
        const clientUsername = client.user.username;
        const clientAvatar = client.user.displayAvatarURL();
        const contentUpdate = client.config.update;
        const creditEmbed = new EmbedBuilder()
            .setTitle(client.translate.commands.credits.creator_credit)
            .setDescription(client.translate.commands.credits.creator_credit_description)
            .setColor(clientColor)
            .setTimestamp(new Date(contentUpdate))
            .setFooter({ "text": client.translate.commands.credits.update_on, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/lower-left-ballpoint-pen_1f58a.png" })
            .setAuthor({ "name": clientUsername, "iconURL": clientAvatar, "url": "https://shiorus.web.app/" })
            .addFields(
                [
                    {
                        "name": "1. 夏月 まりな (NATSUKI MARINA)",
                        "value": client.translate.commands.credits.natsuki_marina_credit
                    }
                ]
            );
    
        message.channel.send({
            "embeds": [creditEmbed]
        });
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "credits",
            "th": "เครดิต"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Credit of other creators.",
            "th": "เครดิตของผู้สร้างรายอื่น"
        }
    },
    async execute(interaction) {
        const clientFetch = await interaction.client.user.fetch();
        const clientColor = clientFetch.accentColor;
        const clientUsername = interaction.client.user.username;
        const clientAvatar = interaction.client.user.displayAvatarURL();
        const contentUpdate = interaction.client.config.update;
        const creditEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.credits.creator_credit)
            .setDescription(interaction.client.translate.commands.credits.creator_credit_description)
            .setColor(clientColor)
            .setTimestamp(new Date(contentUpdate))
            .setFooter({ "text": interaction.client.translate.commands.credits.update_on, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/lower-left-ballpoint-pen_1f58a.png" })
            .setAuthor({ "name": clientUsername, "iconURL": clientAvatar, "url": "https://shiorus.web.app/" })
            .addFields(
                [
                    {
                        "name": "1. 夏月 まりな (NATSUKI MARINA)",
                        "value": interaction.client.translate.commands.credits.natsuki_marina_credit
                    }
                ]
            );

        await interaction.editReply({
            "embeds": [creditEmbed]
        });
    }
};