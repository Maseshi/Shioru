const { PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "8ball",
    "description": "8ball game",
    "category": "fun",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "8ball <question(String)>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "description": module.exports.description,
        "description_localizations": {
            "th": "เกม 8ball"
        },
        "options": [
            {
                "type": 3,
                "name": "question",
                "name_localizations": {
                    "th": "คำถาม"
                },
                "description": "นี่จะเป็นคำถามของคุณสำหรับ 8ball",
                "description_localizations": {
                    "th": "This will be your question for the 8ball."
                },
            }
        ]
    },
    async execute(interaction) {
        const inputQuestion = interaction.options.getString("question");

        const choices = [
            "It is certian.",
            "It is decidedly so.",
            "Without a doubt.",
            "Yes definitely.",
            "You may rely on it.",
            "As I see it, yes.",
            "Most likely.",
            "Outlook good.",
            "Yes.",
            "Signs point to yes.",
            "Reply hazy, try again.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
            "Don't count on it.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Very doubtful."
        ];
        const ball = Math.floor(Math.random() * choices.length);

        const memberAvatar = interaction.member.user.displayAvatarURL();
        const memberName = interaction.member.user.username;
        const eightBallEmbed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(interaction.client.translate.commands.eight_ball.game)
            .setDescription(interaction.client.translate.commands.eight_ball.risk)
            .setAuthor({ "iconURL": memberAvatar, "name": memberName })
            .setFields({ "name": interaction.client.translate.commands.eight_ball.question, "value": inputQuestion, "inline": true });
        const eightBallButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("8ball-button")
                    .setLabel(interaction.client.translate.commands.eight_ball.roll_ball)
                    .setStyle(ButtonStyle.Primary)
            );

        const message = await interaction.reply({ "embeds": [eightBallEmbed], "components": [eightBallButton] });
        const collector = message.createMessageComponentCollector();

        collector.on("collect", async (component) => {
            if (component.customId === "8ball-button") {
                eightBallEmbed.addFields({ "name": interaction.client.translate.commands.eight_ball.answer, "value": choices[ball], "inline": true });
                component.update({ "embeds": [eightBallEmbed], "components": [] });
            }
        });
    }
}