const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const { randomInt } = require("../../utils/miscUtils");
const fetch = require("node-fetch");

module.exports = {
    "enable": true,
    "name": "meme",
    "description": "Randomly select the meme you want.",
    "category": "fun",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "meme [category]",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "meme",
            "th": "มีม"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Randomly select the meme you want.",
            "th": "สุ่มเลือกมีมที่คุณต้องการ"
        },
        "options": [
            {
                "type": 3,
                "name": "category",
                "name_localizations": {
                    "th": "หมวดหมู่"
                },
                "description": "Preferred category of meme",
                "description_localizations": {
                    "th": "หมวดหมู่ของมีมที่ต้องการ"
                }
            }
        ]
    },
    async execute(interaction) {
        const inputCategory = interaction.options.get("category");

        const randomEmbed = async (choice) => {
            const category = ["meme", "Memes_Of_The_Dank", "memes", "dankmemes"];
            const random = choice ? choice.value : category[randomInt(category.length)];

            const response = await fetch("https://www.reddit.com/r/" + random + "/random/.json");

            if (response.status !== 200) {
                return new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(interaction.client.translate.commands.meme.can_not_fetch);
            }

            const data = await response.json();

            if (!Array.isArray(data) || data.length === 0) {
                return new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(interaction.client.translate.commands.meme.meme_not_found.replace("%s", choice));
            }

            try {
                const permalink = data[0].data.children[0].data.permalink;
                const memeUrl = "https://reddit.com" + permalink;
                const memeImage = data[0].data.children[0].data.url;
                const memeTitle = data[0].data.children[0].data.title;
                const memeUpvotes = data[0].data.children[0].data.ups;
                const memeNumComments = data[0].data.children[0].data.num_comments;
                const memeCreate = data[0].data.children[0].data.created;

                return new EmbedBuilder()
                    .setTitle(memeTitle)
                    .setURL(memeUrl)
                    .setImage(memeImage)
                    .setColor("Random")
                    .setFooter({ "text": "👍 %s1 | 💬 %s2".replace("%s1", memeUpvotes).replace("%s2", memeNumComments) })
                    .setTimestamp(new Date(memeCreate) * 1000);
            } catch (error) {
                return new EmbedBuilder()
                    .setColor("Red")
                    .setDescription(interaction.client.translate.commands.meme.can_not_fetch);
            }
        };

        const memeEmbed = await randomEmbed(inputCategory);
        const buttonRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("regenMemeButton")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("🔁")
            );

        await interaction.editReply({
            "embeds": [memeEmbed],
            "components": [buttonRow],
        });

        const collector = interaction.channel.createMessageCollector({
            filter: (reactor) => reactor.user.id !== interaction.user.id,
            "time": 60,
            "max": 3,
            "dispose": true,
        });

        collector.on("collect", async (response) => {
            if (response.customId !== "regenMemeButton") return;
            await response.deferUpdate();

            const randomMemeEmbed = await randomEmbed(inputCategory);

            await interaction.editReply({
                "embeds": [randomMemeEmbed],
                "components": [buttonRow],
            });
        });

        collector.on("end", async () => {
            buttonRow.components.forEach((button) => button.setDisabled(true));

            return await interaction.editReply({ "components": [buttonRow] });
        });
    }
}