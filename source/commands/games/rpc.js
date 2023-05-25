const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, ComponentType, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "rpc",
    "description": "Play rock-paper-scissors with friends or me",
    "category": "games",
    "permissions": {
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageMessages
        ]
    },
    "usage": "rpc [opponent]",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "เป่ายิ้งฉุบ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "เล่นเป่ายิ้งฉุบกับเพื่อนหรือกับฉัน"
        },
        "options": [
            {
                "type": 6,
                "name": "opponent",
                "name_localizations": {
                    "th": "ฝั่งตรงข้าม"
                },
                "description": "Guild members who want to play or you can play with me.",
                "description_localizations": {
                    "th": "สมาชิกภายในกิลด์ที่ต้องการจะเล่นหรือคุณจะเล่นกับฉันก็ได้นะ"
                },
                "required": false
            }
        ]
    },
    async execute(interaction) {
        const inputOpponent = interaction.options.getUser("opponent");

        const member = await interaction.guild.members.fetch(inputOpponent.id);

        if (inputOpponent && !member) return await interaction.reply(interaction.client.translate.commands.rpc.member_not_found);
        if (inputOpponent && inputOpponent.bot && (inputOpponent.id !== interaction.client.user.id)) return await interaction.reply(interaction.client.translate.commands.rpc.can_not_play_with_another_bot);

        const authorUser = interaction.user;
        const gameObjects = {
            "rock": "🪨",
            "paper": "📄",
            "scissors": "✂️"
        };

        const rpcEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.rpc.rock_paper_scissors)
            .setDescription(interaction.client.translate.commands.rpc.choose_options)
            .setColor(0)
            .setTimestamp();
        const rpcRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("🪨")
                    .setCustomId("rock")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setLabel("📄")
                    .setCustomId("paper")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setLabel("✂️")
                    .setCustomId("scissors")
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({
            "embeds": [rpcEmbed],
            "components": [rpcRow]
        });

        if (!inputOpponent || (inputOpponent.id === interaction.client.user.id)) {
            const gameFilter = (member => member.user.id === authorUser.id);
            const gameCollector = await interaction.channel.awaitMessageComponent({
                gameFilter,
                "componentType": ComponentType.Button,
                "time": 60000,
                "max": 1,
                "errors": ["time"]
            });

            try {
                let winner;
                const choice = Object.keys(gameObjects);
                const playerOne = gameCollector.customId;
                const playerTwo = choice[Math.floor(Math.random() * choice.length)];

                if (playerOne === "rock" && playerTwo === "scissors") winner = authorUser.id
                if (playerOne === "scissors" && playerTwo === "paper") winner = authorUser.id
                if (playerOne === "paper" && playerTwo === "rock") winner = authorUser.id
                if (playerOne === "paper" && playerTwo === "scissors") winner = interaction.client.user.id
                if (playerOne === "scissors" && playerTwo === "rock") winner = interaction.client.user.id
                if (playerOne === "rock" && playerTwo === "paper") winner = interaction.client.user.id

                if (winner === interaction.client.user.id) {
                    gameCollector.reply(interaction.client.translate.commands.rpc.bot_winner.replace("%s", authorUser.id))
                    rpcEmbed.setDescription(authorUser.username + " `" + gameObjects[playerOne] + "` VS `" + gameObjects[playerTwo] + "` " + interaction.client.user.username)

                    return await interaction.editReply({
                        "embeds": [rpcEmbed],
                        "components": []
                    })
                }
                if (winner === authorUser.id) {
                    gameCollector.reply(interaction.client.translate.commands.rpc.user_winner.replace("%s", authorUser.id))
                    rpcEmbed.setDescription(authorUser.username + " `" + gameObjects[playerOne] + "` VS `" + gameObjects[playerTwo] + "` " + interaction.client.user.username)

                    return await interaction.editReply({
                        "embeds": [rpcEmbed],
                        "components": []
                    });
                }
                if (!winner) {
                    gameCollector.reply(interaction.client.translate.commands.rpc.tie);
                    rpcEmbed.setDescription(authorUser.username + " `" + gameObjects[playerOne] + "` VS `" + gameObjects[playerTwo] + "` " + interaction.client.user.username);

                    return await interaction.editReply({
                        "embeds": [rpcEmbed],
                        "components": []
                    });
                }
            } catch (error) {
                rpcEmbed.setDescription(interaction.client.translate.commands.rpc.game_timeout);

                console.log(error);
                await interaction.editReply({
                    "embeds": [rpcEmbed],
                    "components": []
                });
            }
        } else {
            const gameFilter = (member => member.user.id === authorUser.id || member.user.id === inputOpponent.id)
            const gameCollector = interaction.channel.createMessageComponentCollector({
                gameFilter,
                "componentType": ComponentType.Button
            });

            let winner, playerOne, playerTwo;

            gameCollector.on("collect", async collect => {
                if (collect.user.id === authorUser.id) {
                    if (playerOne) return collect.reply({ "content": interaction.client.translate.commands.rpc.answered, "ephemeral": true })

                    playerOne = collect.customId;

                    rpcEmbed.setDescription(interaction.client.translate.commands.rpc.user_answered.replace("%s", authorUser.username))

                    collect.reply({ "content": interaction.client.translate.commands.rpc.your_answer.replace("%s", gameObjects[playerOne]), "ephemeral": true });
                    await interaction.editReply({
                        "embeds": [rpcEmbed],
                        "components": [rpcRow]
                    });
                } else {
                    if (playerTwo) return collect.reply({ "content": interaction.client.translate.commands.rpc.answered, "ephemeral": true })

                    playerTwo = collect.customId;

                    rpcEmbed.setDescription(interaction.client.translate.commands.rpc.user_answered.replace("%s", inputOpponent.username))

                    collect.reply({ "content": interaction.client.translate.commands.rpc.your_answer.replace("%s", gameObjects[playerTwo]), "ephemeral": true });
                    await interaction.editReply({
                        "embeds": [rpcEmbed],
                        "components": [rpcRow]
                    });
                }

                if (playerOne && playerTwo) {
                    if (playerOne === "rock" && playerTwo === "scissors") winner = authorUser.id;
                    if (playerOne === "scissors" && playerTwo === "paper") winner = authorUser.id;
                    if (playerOne === "paper" && playerTwo === "rock") winner = authorUser.id;
                    if (playerOne === "paper" && playerTwo === "scissors") winner = inputOpponent.id;
                    if (playerOne === "scissors" && playerTwo === "rock") winner = inputOpponent.id;
                    if (playerOne === "rock" && playerTwo === "paper") winner = inputOpponent.id;

                    if (winner === inputOpponent.id) {
                        await interaction.followUp(interaction.client.translate.commands.rpc.user_winner.replace("%s", inputOpponent.id));

                        gameCollector.stop();
                        return winner = "", playerOne, playerTwo;
                    }
                    if (winner === authorUser.id) {
                        await interaction.followUp(interaction.client.translate.commands.rpc.user_winner.replace("%s", authorUser.id));

                        gameCollector.stop();
                        return winner = "", playerOne, playerTwo;
                    }
                    if (!winner) {
                        await interaction.followUp(interaction.client.translate.commands.rpc.tie);

                        gameCollector.stop();
                        return winner = "", playerOne, playerTwo;
                    }
                }
            });
            gameCollector.on("end", async () => {
                rpcEmbed.setDescription(authorUser.username + " `" + gameObjects[playerOne] + "` VS `" + gameObjects[playerTwo] + "` " + inputOpponent.username);

                await interaction.editReply({
                    "embeds": [rpcEmbed],
                    "components": []
                });
            })
        }
    }
};