const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "snake",
    "description": "Play a snake board game.",
    "category": "games",
    "permissions": {
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.AddReactions,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageMessages
        ]
    },
    "usage": "snake",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "snake",
            "th": "สายงู"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Play a snake board game.",
            "th": "เล่นเกมกระดานงู"
        }
    },
    async execute(interaction) {
        const WIDTH = 15;
        const HEIGHT = 10;
        const gameBoard = [];
        const apple = { "x": 1, "y": 1 };
        let snake = [{ "x": 5, "y": 5 }];
        let snakeLength = 1;
        let score = 0;
        let gameEmbedMessage = null;
        let inGame = false;

        for (let y = 0; y < HEIGHT; y++) {
            for (let x = 0; x < WIDTH; x++) {
                gameBoard[y * WIDTH + x] = "🟦";
            }
        }

        const gameBoardToString = () => {
            let str = "";
            for (let y = 0; y < HEIGHT; y++) {
                for (let x = 0; x < WIDTH; x++) {
                    if (x === apple.x && y === apple.y) {
                        str += "🍎";
                        continue;
                    }

                    let flag = true;
                    for (let s = 0; s < snake.length; s++) {
                        if (x === snake[s].x && y === snake[s].y) {
                            str += "🟢";
                            flag = false;
                        }
                    }

                    if (flag) str += gameBoard[y * WIDTH + x];
                }
                str += "\n";
            }
            return str;
        };
        const isLocationInSnake = (pos) => {
            return snake.find(sPos => sPos.x === pos.x && sPos.y === pos.y);
        };
        const newAppleLocation = () => {
            let newApplePos = { "x": 0, "y": 0 };
            do {
                newApplePos = { "x": parseInt(Math.random() * WIDTH), "y": parseInt(Math.random() * HEIGHT) };
            } while (isLocationInSnake(newApplePos));

            apple.x = newApplePos.x;
            apple.y = newApplePos.y;
        };
        const step = () => {
            if (apple.x === snake[0].x && apple.y === snake[0].y) {
                score += 1;
                snakeLength++;
                newAppleLocation();
            }

            const authorAvatar = interaction.user.displayAvatarURL();
            const authorUsername = interaction.user.username;
            const editEmbed = new EmbedBuilder()
                .setTimestamp()
                .setColor("Green")
                .setTitle(interaction.client.translate.commands.snake.game_name)
                .setDescription(gameBoardToString())
                .setFooter({ "iconURL": authorAvatar, "text": interaction.client.translate.commands.snake.played_on.replace("%s", authorUsername) });

            gameEmbedMessage.edit({ "embeds": [editEmbed] });
            waitForReaction();
        };
        const gameOver = () => {
            inGame = false;
            const authorAvatar = interaction.user.displayAvatarURL();
            const authorUsername = interaction.user.username;
            const editEmbed = new EmbedBuilder()
                .setTimestamp()
                .setColor("Blue")
                .setTitle(interaction.client.translate.commands.snake.game_over)
                .setDescription(interaction.client.translate.commands.snake.game_score.replace("%s1", score).replace("%s2", Math.floor(playTime / 1000)))
                .setFooter({ "iconURL": authorAvatar, "text": interaction.client.translate.commands.snake.played_on.replace("%s", authorUsername) });

            gameEmbedMessage.edit({ "embeds": [editEmbed] });
            gameEmbedMessage.reactions.removeAll();
        };
        const waitForReaction = () => {
            gameEmbedMessage.awaitReactions({
                filter: (reaction, user) => {
                    return ["⬅️", "⬆️", "⬇️", "➡️", "⏹️"].includes(reaction.emoji.name) && user.id !== gameEmbedMessage.author.id;
                },
                "max": 1,
                "time": 60000,
                "errors": ["time"]
            }).then(collected => {
                const reaction = collected.first();
                const snakeHead = snake[0];
                const nextPos = { "x": snakeHead.x, "y": snakeHead.y };

                switch (reaction.emoji.name) {
                    case "⬅️":
                        let nextLeftX = snakeHead.x - 1;
                        if (nextLeftX < 0) nextLeftX = WIDTH - 1;
                        nextPos.x = nextLeftX;
                        break;
                    case "⬆️":
                        let nextTopY = snakeHead.y - 1;
                        if (nextTopY < 0) nextTopY = HEIGHT - 1;
                        nextPos.y = nextTopY;
                        break;
                    case "⬇️":
                        let nextBottomY = snakeHead.y + 1;
                        if (nextBottomY >= HEIGHT) nextBottomY = 0;
                        nextPos.y = nextBottomY;
                        break;
                    case "➡️":
                        let nextRightX = snakeHead.x + 1;
                        if (nextRightX >= WIDTH) nextRightX = 0;
                        nextPos.x = nextRightX;
                        break;
                    case "⏹️":
                        gameOver();
                        break;
                }

                reaction.users.remove(reaction.users.cache.filter(user => user.id !== gameEmbedMessage.author.id).first().id).then(() => {
                    if (isLocationInSnake(nextPos)) return gameOver();

                    snake.unshift(nextPos);
                    if (snake.length > snakeLength) snake.pop();

                    step();
                });
            }).catch(() => {
                gameOver();
            });
        };

        if (inGame) return;

        inGame = true;
        score = 0;
        snakeLength = 1;
        snake = [{ "x": 5, "y": 5 }];
        newAppleLocation();

        await interaction.editReply(interaction.client.translate.commands.snake.building_board_game);

        const authorAvatar = interaction.user.displayAvatarURL();
        const authorUsername = interaction.user.username;
        const embed = new EmbedBuilder()
            .setTimestamp()
            .setColor("Green")
            .setTitle(interaction.client.translate.commands.snake.game_name)
            .setDescription(gameBoardToString())
            .setFooter({ "iconURL": authorAvatar, "text": interaction.client.translate.commands.snake.played_on.replace("%s", authorUsername) });

        await interaction.editReply({
            "content": "",
            "embeds": [embed]
        }).then(async (message) => {
            gameEmbedMessage = message;

            await gameEmbedMessage.react("⬅️");
            await gameEmbedMessage.react("⬆️");
            await gameEmbedMessage.react("⬇️");
            await gameEmbedMessage.react("➡️");
            await gameEmbedMessage.react("⏹️");

            waitForReaction();
        });
    }
}