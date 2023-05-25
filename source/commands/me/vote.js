const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Api } = require("@top-gg/sdk");

module.exports = {
    "enable": true,
    "name": "vote",
    "description": "Vote for this bot on Top.gg.",
    "category": "me",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "vote",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "โหวต"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "โหวตคะแนนให้บอทนี้บน top.gg"
        },
    },
    async execute(interaction) {
        const topName = "top.gg";
        const topURL = "https://top.gg/";
        const topColor = "#FF3366";
        const topFavicon = topFavicon + "favicon.png";
        const topBotLink = topFavicon + "bot/704706906505347183";
        
        const clientAvatar = interaction.client.user.avatarURL();
        const clientUsername = interaction.client.user.username;

        const api = new Api(interaction.client.config.top_gg_token);
        const results = await api.getBot("704706906505347183");
        const date = new Date(results.date);
        const invite = results.invite;
        const point = results.points;
        const shortDescription = results.shortdesc;
        const tags = results.tags.join(", ");

        const voteRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setURL(invite)
                    .setLabel(interaction.client.translate.commands.vote.invite)
                    .setStyle(ButtonStyle.Link),
                new ButtonBuilder()
                    .setURL(topBotLink + "/vote")
                    .setLabel(interaction.client.translate.commands.vote.vote)
                    .setStyle(ButtonStyle.Link)
            );
        const voteEmbed = new EmbedBuilder()
            .setTitle(clientUsername)
            .setURL(topBotLink)
            .setDescription(
                [
                    "**" + interaction.client.translate.commands.vote.votes + "**: `" + point + "`",
                    "**" + interaction.client.translate.commands.vote.tags + "**: `" + tags + "`",
                    "```" + shortDescription + "```"
                ].join("\n")
            )
            .setThumbnail(clientAvatar)
            .setColor(topColor)
            .setTimestamp(date)
            .setAuthor({ "name": topName, "iconURL": topFavicon, "url": topURL });

        await interaction.reply({
            "embeds": [voteEmbed],
            "components": [voteRow]
        });
    }
};