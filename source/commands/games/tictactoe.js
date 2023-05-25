const { ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
    "enable": true,
    "name": "tictactoe",
    "description": "Play tic-tac-toe with friends",
    "category": "games",
    "permissions": {
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory,
            PermissionsBitField.Flags.ManageMessages
        ]
    },
    "usage": "tictactoe <opponent> [x_emoji(String)] [o_emoji(String)]",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "โอเอกซ์"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "เล่นโอเอกซ์กับเพื่อน"
        },
        "options": [
            {
                "type": 6,
                "name": "opponent",
                "name_localizations": {
                    "th": "ฝั่งตรงข้าม"
                },
                "description": "Members within the guild who want to play",
                "description_localizations": {
                    "th": "สมาชิกภายในกิลด์ที่ต้องการจะเล่น"
                },
                "required": true
            },
            {
                "type": 3,
                "name": "x_emoji",
                "description": "Your emoji on the board",
                "description_localizations": {
                    "th": "อีโมจิของคุณในกระดาน"
                },
                "min_value": 0,
                "max_value": 1,
                "required": false
            },
            {
                "type": 3,
                "name": "o_emoji",
                "description": "The opponent emoji on the board",
                "description_localizations": {
                    "th": "อีโมจิของฝั่งตรงข้ามในกระดาน"
                },
                "min_value": 0,
                "max_value": 1,
                "required": false
            }
        ]
    },
    async execute(interaction) {
        const inputOpponent = interaction.options.getUser("opponent");
        const inputFirstEmoji = interaction.options.getString("x_emoji") ?? "❌";
        const inputSecondEmoji = interaction.options.getString("o_emoji") ?? "⭕";

        const getRandomString = (length) => {
            let result = "";
            const randomChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

            for (let i = 0; i < length; i++) {
                result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
            }

            return result;
        }
        const checkResult = (tie, gameData, player, author, member, midDuel, gameCollector, inputFirstEmoji, inputSecondEmoji, emojiTopLeft, emojiTopCenter, emojiTopRight, emojiMiddleLeft, emojiMiddleCenter, emojiMiddleRight, emojiBottomLeft, emojiBottomCenter, emojiBottomRight) => {
            const winsMessage = async () => {
                await interaction.followUp(interaction.client.translate.commands.tictactoe.winner.replace("%s", gameData[player].member.username))
                gameCollector.stop()
                midDuel.delete(author.id)
                midDuel.delete(member.id)
            }
            const tieMessage = async () => {
                await interaction.followUp(interaction.client.translate.commands.tictactoe.tie)
                gameCollector.stop()
                midDuel.delete(author.id)
                midDuel.delete(member.id)
            }

            if (tie) {
                if (emojiTopLeft == inputFirstEmoji && emojiMiddleLeft == inputFirstEmoji && emojiBottomLeft == inputFirstEmoji || emojiTopLeft == inputSecondEmoji && emojiMiddleLeft == inputSecondEmoji && emojiBottomLeft == inputSecondEmoji) {
                    winsMessage()
                } else if (emojiTopCenter == inputFirstEmoji && emojiMiddleCenter == inputFirstEmoji && emojiBottomCenter == inputFirstEmoji || emojiTopCenter == inputSecondEmoji && emojiMiddleCenter == inputSecondEmoji && emojiBottomCenter == inputSecondEmoji) {
                    winsMessage()
                } else if (emojiTopRight == inputFirstEmoji && emojiMiddleRight == inputFirstEmoji && emojiBottomRight == inputFirstEmoji || emojiTopRight == inputSecondEmoji && emojiMiddleRight == inputSecondEmoji && emojiBottomRight == inputSecondEmoji) {
                    winsMessage()
                } else if (emojiTopLeft == inputFirstEmoji && emojiTopCenter == inputFirstEmoji && emojiTopRight == inputFirstEmoji || emojiTopLeft == inputSecondEmoji && emojiTopCenter == inputSecondEmoji && emojiTopRight == inputSecondEmoji) {
                    winsMessage()
                } else if (emojiMiddleLeft == inputFirstEmoji && emojiMiddleCenter == inputFirstEmoji && emojiMiddleRight == inputFirstEmoji || emojiMiddleLeft == inputSecondEmoji && emojiMiddleCenter == inputSecondEmoji && emojiMiddleRight == inputSecondEmoji) {
                    winsMessage()
                } else if (emojiBottomLeft == inputFirstEmoji && emojiBottomCenter == inputFirstEmoji && emojiBottomRight == inputFirstEmoji || emojiBottomLeft == inputSecondEmoji && emojiBottomCenter == inputSecondEmoji && emojiBottomRight == inputSecondEmoji) {
                    player = (player + 1) % 2;
                    winsMessage()
                } else if (emojiTopLeft == inputFirstEmoji && emojiMiddleCenter == inputFirstEmoji && emojiBottomRight == inputFirstEmoji || emojiTopLeft == inputSecondEmoji && emojiMiddleCenter == inputSecondEmoji && emojiBottomRight == inputSecondEmoji) {
                    winsMessage()
                } else if (emojiTopRight == inputFirstEmoji && emojiMiddleCenter == inputFirstEmoji && emojiBottomLeft == inputFirstEmoji || emojiTopRight == inputSecondEmoji && emojiMiddleCenter == inputSecondEmoji && emojiBottomLeft == inputSecondEmoji) {
                    winsMessage()
                } else if (emojiTopLeft !== '⬜' && emojiTopCenter !== '⬜' && emojiTopRight !== '⬜' && emojiMiddleLeft !== '⬜' && emojiMiddleCenter !== '⬜' && emojiMiddleRight !== '⬜' && emojiBottomLeft !== '⬜' && emojiBottomCenter !== '⬜' && emojiBottomRight !== '⬜') {
                    tieMessage()
                }
            } else {
                if (emojiTopLeft == inputFirstEmoji && emojiMiddleLeft == inputFirstEmoji && emojiBottomLeft == inputFirstEmoji || emojiTopLeft == inputSecondEmoji && emojiMiddleLeft == inputSecondEmoji && emojiBottomLeft == inputSecondEmoji) {
                    winsMessage()
                } else if (emojiTopCenter == inputFirstEmoji && emojiMiddleCenter == inputFirstEmoji && emojiBottomCenter == inputFirstEmoji || emojiTopCenter == inputSecondEmoji && emojiMiddleCenter == inputSecondEmoji && emojiBottomCenter == inputSecondEmoji) {
                    winsMessage()
                } else if (emojiTopRight == inputFirstEmoji && emojiMiddleRight == inputFirstEmoji && emojiBottomRight == inputFirstEmoji || emojiTopRight == inputSecondEmoji && emojiMiddleRight == inputSecondEmoji && emojiBottomRight == inputSecondEmoji) {
                    winsMessage()
                } else if (emojiTopLeft == inputFirstEmoji && emojiTopCenter == inputFirstEmoji && emojiTopRight == inputFirstEmoji || emojiTopLeft == inputSecondEmoji && emojiTopCenter == inputSecondEmoji && emojiTopRight == inputSecondEmoji) {
                    winsMessage()
                } else if (emojiMiddleLeft == inputFirstEmoji && emojiMiddleCenter == inputFirstEmoji && emojiMiddleRight == inputFirstEmoji || emojiMiddleLeft == inputSecondEmoji && emojiMiddleCenter == inputSecondEmoji && emojiMiddleRight == inputSecondEmoji) {
                    winsMessage()
                } else if (emojiBottomLeft == inputFirstEmoji && emojiBottomCenter == inputFirstEmoji && emojiBottomRight == inputFirstEmoji || emojiBottomLeft == inputSecondEmoji && emojiBottomCenter == inputSecondEmoji && emojiBottomRight == inputSecondEmoji) {
                    player = (player + 1) % 2;
                    winsMessage()
                } else if (emojiTopLeft == inputFirstEmoji && emojiMiddleCenter == inputFirstEmoji && emojiBottomRight == inputFirstEmoji || emojiTopLeft == inputSecondEmoji && emojiMiddleCenter == inputSecondEmoji && emojiBottomRight == inputSecondEmoji) {
                    winsMessage()
                } else if (emojiTopRight == inputFirstEmoji && emojiMiddleCenter == inputFirstEmoji && emojiBottomLeft == inputFirstEmoji || emojiTopRight == inputSecondEmoji && emojiMiddleCenter == inputSecondEmoji && emojiBottomLeft == inputSecondEmoji) {
                    winsMessage()
                }
            }
        }

        if (inputOpponent.bot) return await interaction.reply(interaction.client.translate.commands.tictactoe.can_not_play_with_bot);
        if (/([\uD800-\uDBFF][\uDC00-\uDFFF])/g.test(inputFirstEmoji)) return await interaction.reply(interaction.client.translate.commands.tictactoe.need_one_emoji)
        if (/([\uD800-\uDBFF][\uDC00-\uDFFF])/g.test(inputSecondEmoji)) return await interaction.reply(interaction.client.translate.commands.tictactoe.need_one_emoji)

        let player = 0;
        const midDuel = new Set()
        const author = interaction.user;
        const member = inputOpponent;

        if (!member) return await interaction.reply(interaction.client.translate.commands.tictactoe.member_not_found);
        if (midDuel.has(author.id)) return await interaction.reply(interaction.client.translate.commands.tictactoe.in_duel.replace("%s", member.id))
        if (midDuel.has(member.id)) return await interaction.reply(interaction.client.translate.commands.tictactoe.in_another_duel.replace("%s", member.id))
        if (member.id === interaction.client.user.id) return await interaction.reply(interaction.client.translate.commands.tictactoe.can_not_duel_with_me)

        const gameData = [
            { "member": author, "emoji": inputFirstEmoji },
            { "member": member, "emoji": inputSecondEmoji }
        ];
        const tictactoeEmbed = new EmbedBuilder()
            .setDescription("🎮 " + author.username + " VS " + member.username + " 🎮")
            .setColor(3426654)

        let emojiTopLeft = "⬜"
        let emojiTopCenter = "⬜"
        let emojiTopRight = "⬜"
        let emojiMiddleLeft = "⬜"
        let emojiMiddleCenter = "⬜"
        let emojiMiddleRight = "⬜"
        let emojiBottomLeft = "⬜"
        let emojiBottomCenter = "⬜"
        let emojiBottomRight = "⬜"

        const idTopLeft = (getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4))
        const idTopCenter = (getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4))
        const idTopRight = (getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4))
        const idMiddleLeft = (getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4))
        const idMiddleCenter = (getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4))
        const idMiddleRight = (getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4))
        const idBottomLeft = (getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4))
        const idBottomCenter = (getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4))
        const idBottomRight = (getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4))

        let ButtonTopLeft = new ButtonBuilder()
            .setCustomId(idTopLeft)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("~")
        let ButtonTopCenter = new ButtonBuilder()
            .setCustomId(idTopCenter)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("~")
        let ButtonTopRight = new ButtonBuilder()
            .setCustomId(idTopRight)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("~")
        let ButtonMiddleLeft = new ButtonBuilder()
            .setCustomId(idMiddleLeft)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("~")
        let ButtonMiddleCenter = new ButtonBuilder()
            .setCustomId(idMiddleCenter)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("~")
        let ButtonMiddleRight = new ButtonBuilder()
            .setCustomId(idMiddleRight)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("~")
        let ButtonBottomLeft = new ButtonBuilder()
            .setCustomId(idBottomLeft)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("~")
        let ButtonBottomCenter = new ButtonBuilder()
            .setCustomId(idBottomCenter)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("~")
        let ButtonBottomRight = new ButtonBuilder()
            .setCustomId(idBottomRight)
            .setStyle(ButtonStyle.Secondary)
            .setLabel("~")

        await interaction.reply({
            "embeds": [tictactoeEmbed],
            "components": [
                {
                    "type": 1,
                    "components": [
                        ButtonTopLeft,
                        ButtonTopCenter,
                        ButtonTopRight
                    ]
                },
                {
                    "type": 1,
                    "components": [
                        ButtonMiddleLeft,
                        ButtonMiddleCenter,
                        ButtonMiddleRight
                    ]
                },
                {
                    "type": 1,
                    "components": [
                        ButtonBottomLeft,
                        ButtonBottomCenter,
                        ButtonBottomRight
                    ]
                },
            ]
        })

        midDuel.add(author.id);
        midDuel.add(member.id);

        const gameFilter = (members => members.user.id === author.id || members.user.id === member.id);
        const gameCollector = interaction.channel.createMessageComponentCollector({
            gameFilter,
            "time": 60000,
            "componentType": ComponentType.Button
        });

        gameCollector.on("collect", async collection => {
            if (collection.customId == idTopLeft && gameData[player].member.id === collection.user.id) {
                collection.deferUpdate();

                if (collection.label == inputSecondEmoji || collection.label == inputFirstEmoji) {
                    collection.reply("");
                } else {
                    try {
                        emojiTopLeft = gameData[player].emoji
                        checkResult(false, gameData, player, author, member, midDuel, gameCollector, inputFirstEmoji, inputSecondEmoji, emojiTopLeft, emojiTopCenter, emojiTopRight, emojiMiddleLeft, emojiMiddleCenter, emojiMiddleRight, emojiBottomLeft, emojiBottomCenter, emojiBottomRight)
                    } catch (error) {
                        catchError(interaction.client, interaction, module.exports.name, error);
                    }

                    player = (player + 1) % 2;
                    ButtonTopLeft = new ButtonBuilder()
                        .setCustomId(idTopLeft)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(gameData[player].emoji)
                        .setDisabled()

                    await interaction.editReply({
                        "embeds": [tictactoeEmbed],
                        "components": [
                            {
                                "type": 1,
                                "components": [
                                    ButtonTopLeft,
                                    ButtonTopCenter,
                                    ButtonTopRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonMiddleLeft,
                                    ButtonMiddleCenter,
                                    ButtonMiddleRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonBottomLeft,
                                    ButtonBottomCenter,
                                    ButtonBottomRight
                                ]
                            },
                        ]
                    })
                }
            } else if (collection.customId == idTopCenter && gameData[player].member.id === collection.user.id) {
                collection.deferUpdate()

                if (collection.label == inputSecondEmoji || collection.label == inputFirstEmoji) {
                    collection.reply(interaction.client.translate.commands.tictactoe.button_is_selected)
                } else {
                    try {
                        emojiTopCenter = gameData[player].emoji
                        checkResult(false, gameData, player, author, member, midDuel, gameCollector, inputFirstEmoji, inputSecondEmoji, emojiTopLeft, emojiTopCenter, emojiTopRight, emojiMiddleLeft, emojiMiddleCenter, emojiMiddleRight, emojiBottomLeft, emojiBottomCenter, emojiBottomRight)
                    } catch (error) {
                        catchError(interaction.client, interaction, module.exports.name, error);
                    }

                    player = (player + 1) % 2;
                    ButtonTopCenter = new ButtonBuilder()
                        .setCustomId(idTopCenter)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(gameData[player].emoji)
                        .setDisabled()

                    await interaction.editReply({
                        "embeds": [tictactoeEmbed],
                        "components": [
                            {
                                "type": 1,
                                "components": [
                                    ButtonTopLeft,
                                    ButtonTopCenter,
                                    ButtonTopRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonMiddleLeft,
                                    ButtonMiddleCenter,
                                    ButtonMiddleRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonBottomLeft,
                                    ButtonBottomCenter,
                                    ButtonBottomRight
                                ]
                            },
                        ]
                    })
                }
            } else if (collection.customId == idTopRight && gameData[player].member.id === collection.user.id) {
                collection.deferUpdate()

                if (collection.label == inputSecondEmoji || collection.label == inputFirstEmoji) { // User tries to place at an already claimed spot
                    collection.reply(interaction.client.translate.commands.tictactoe.button_is_selected)
                } else {
                    try {
                        emojiTopRight = gameData[player].emoji
                        checkResult(false, gameData, player, author, member, midDuel, gameCollector, inputFirstEmoji, inputSecondEmoji, emojiTopLeft, emojiTopCenter, emojiTopRight, emojiMiddleLeft, emojiMiddleCenter, emojiMiddleRight, emojiBottomLeft, emojiBottomCenter, emojiBottomRight)
                    } catch (error) {
                        catchError(interaction.client, interaction, module.exports.name, error);
                    }

                    player = (player + 1) % 2;
                    ButtonTopRight = new ButtonBuilder()
                        .setCustomId(idTopRight)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(gameData[player].emoji)
                        .setDisabled()

                    await interaction.editReply({
                        "embeds": [tictactoeEmbed],
                        "components": [
                            {
                                "type": 1,
                                "components": [
                                    ButtonTopLeft,
                                    ButtonTopCenter,
                                    ButtonTopRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonMiddleLeft,
                                    ButtonMiddleCenter,
                                    ButtonMiddleRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonBottomLeft,
                                    ButtonBottomCenter,
                                    ButtonBottomRight
                                ]
                            },
                        ]
                    })
                }
            } else if (collection.customId == idMiddleLeft && gameData[player].member.id === collection.user.id) {
                collection.deferUpdate()

                if (collection.label == inputSecondEmoji || collection.label == inputFirstEmoji) { // User tries to place at an already claimed spot
                    collection.reply(interaction.client.translate.commands.tictactoe.button_is_selected)
                } else {
                    try {
                        emojiMiddleLeft = gameData[player].emoji
                        checkResult(false, gameData, player, author, member, midDuel, gameCollector, inputFirstEmoji, inputSecondEmoji, emojiTopLeft, emojiTopCenter, emojiTopRight, emojiMiddleLeft, emojiMiddleCenter, emojiMiddleRight, emojiBottomLeft, emojiBottomCenter, emojiBottomRight)
                    } catch (error) {
                        catchError(interaction.client, interaction, module.exports.name, error);
                    }

                    player = (player + 1) % 2;
                    ButtonMiddleLeft = new ButtonBuilder()
                        .setCustomId(idMiddleLeft)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(gameData[player].emoji)
                        .setDisabled()

                    await interaction.editReply({
                        "embeds": [tictactoeEmbed],
                        "components": [
                            {
                                "type": 1,
                                "components": [
                                    ButtonTopLeft,
                                    ButtonTopCenter,
                                    ButtonTopRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonMiddleLeft,
                                    ButtonMiddleCenter,
                                    ButtonMiddleRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonBottomLeft,
                                    ButtonBottomCenter,
                                    ButtonBottomRight
                                ]
                            },
                        ]
                    })
                }
            } else if (collection.customId == idMiddleCenter && gameData[player].member.id === collection.user.id) {
                collection.deferUpdate()

                if (collection.label == inputSecondEmoji || collection.label == inputFirstEmoji) { // User tries to place at an already claimed spot
                    collection.reply(interaction.client.translate.commands.tictactoe.button_is_selected)
                } else {
                    try {
                        emojiMiddleCenter = gameData[player].emoji
                        checkResult(false, gameData, player, author, member, midDuel, gameCollector, inputFirstEmoji, inputSecondEmoji, emojiTopLeft, emojiTopCenter, emojiTopRight, emojiMiddleLeft, emojiMiddleCenter, emojiMiddleRight, emojiBottomLeft, emojiBottomCenter, emojiBottomRight)
                    } catch (error) {
                        catchError(interaction.client, interaction, module.exports.name, error);
                    }

                    player = (player + 1) % 2;
                    ButtonMiddleCenter = new ButtonBuilder()
                        .setCustomId(idMiddleCenter)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(gameData[player].emoji)
                        .setDisabled()

                    await interaction.editReply({
                        "embeds": [tictactoeEmbed],
                        "components": [
                            {
                                "type": 1,
                                "components": [
                                    ButtonTopLeft,
                                    ButtonTopCenter,
                                    ButtonTopRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonMiddleLeft,
                                    ButtonMiddleCenter,
                                    ButtonMiddleRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonBottomLeft,
                                    ButtonBottomCenter,
                                    ButtonBottomRight
                                ]
                            },
                        ]
                    })
                }
            } else if (collection.customId == idMiddleRight && gameData[player].member.id === collection.user.id) {
                collection.deferUpdate()

                if (collection.label == inputSecondEmoji || collection.label == inputFirstEmoji) { // User tries to place at an already claimed spot
                    collection.reply(interaction.client.translate.commands.tictactoe.button_is_selected)
                } else {
                    try {
                        emojiMiddleRight = gameData[player].emoji
                        checkResult(false, gameData, player, author, member, midDuel, gameCollector, inputFirstEmoji, inputSecondEmoji, emojiTopLeft, emojiTopCenter, emojiTopRight, emojiMiddleLeft, emojiMiddleCenter, emojiMiddleRight, emojiBottomLeft, emojiBottomCenter, emojiBottomRight)
                    } catch (error) {
                        catchError(interaction.client, interaction, module.exports.name, error);
                    }

                    player = (player + 1) % 2;
                    ButtonMiddleRight = new ButtonBuilder()
                        .setCustomId(idMiddleRight)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(gameData[player].emoji)
                        .setDisabled()

                    await interaction.editReply({
                        "embeds": [tictactoeEmbed],
                        "components": [
                            {
                                "type": 1,
                                "components": [
                                    ButtonTopLeft,
                                    ButtonTopCenter,
                                    ButtonTopRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonMiddleLeft,
                                    ButtonMiddleCenter,
                                    ButtonMiddleRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonBottomLeft,
                                    ButtonBottomCenter,
                                    ButtonBottomRight
                                ]
                            },
                        ]
                    })
                }
            } else if (collection.customId == idBottomLeft && gameData[player].member.id === collection.user.id) {
                collection.deferUpdate()

                if (collection.label == inputSecondEmoji || collection.label == inputFirstEmoji) { // User tries to place at an already claimed spot
                    collection.reply(interaction.client.translate.commands.tictactoe.button_is_selected)
                } else {
                    try {
                        emojiBottomLeft = gameData[player].emoji
                        checkResult(false, gameData, player, author, member, midDuel, gameCollector, inputFirstEmoji, inputSecondEmoji, emojiTopLeft, emojiTopCenter, emojiTopRight, emojiMiddleLeft, emojiMiddleCenter, emojiMiddleRight, emojiBottomLeft, emojiBottomCenter, emojiBottomRight)
                    } catch (error) {
                        catchError(interaction.client, interaction, module.exports.name, error);
                    }

                    player = (player + 1) % 2;
                    ButtonBottomLeft = new ButtonBuilder()
                        .setCustomId(idBottomLeft)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(gameData[player].emoji)
                        .setDisabled()

                    await interaction.editReply({
                        "embeds": [tictactoeEmbed],
                        "components": [
                            {
                                "type": 1,
                                "components": [
                                    ButtonTopLeft,
                                    ButtonTopCenter,
                                    ButtonTopRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonMiddleLeft,
                                    ButtonMiddleCenter,
                                    ButtonMiddleRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonBottomLeft,
                                    ButtonBottomCenter,
                                    ButtonBottomRight
                                ]
                            },
                        ]
                    })
                }
            } else if (collection.customId == idBottomCenter && gameData[player].member.id === collection.user.id) {
                collection.deferUpdate()

                if (collection.label == inputSecondEmoji || collection.label == inputFirstEmoji) {
                    collection.reply(interaction.client.translate.commands.tictactoe.button_is_selected)
                } else {
                    try {
                        emojiBottomCenter = gameData[player].emoji
                        checkResult(false, gameData, player, author, member, midDuel, gameCollector, inputFirstEmoji, inputSecondEmoji, emojiTopLeft, emojiTopCenter, emojiTopRight, emojiMiddleLeft, emojiMiddleCenter, emojiMiddleRight, emojiBottomLeft, emojiBottomCenter, emojiBottomRight)
                    } catch (error) {
                        catchError(interaction.client, interaction, module.exports.name, error);
                    }

                    player = (player + 1) % 2;
                    ButtonBottomCenter = new ButtonBuilder()
                        .setCustomId(idBottomCenter)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(gameData[player].emoji)
                        .setDisabled()

                    await interaction.editReply({
                        "embeds": [tictactoeEmbed],
                        "components": [
                            {
                                "type": 1,
                                "components": [
                                    ButtonTopLeft,
                                    ButtonTopCenter,
                                    ButtonTopRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonMiddleLeft,
                                    ButtonMiddleCenter,
                                    ButtonMiddleRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonBottomLeft,
                                    ButtonBottomCenter,
                                    ButtonBottomRight
                                ]
                            },
                        ]
                    })
                }
            } else if (collection.customId == idBottomRight && gameData[player].member.id === collection.user.id) {
                collection.deferUpdate()

                if (collection.label == inputSecondEmoji || collection.label == inputFirstEmoji) {
                    collection.reply(interaction.client.translate.commands.tictactoe.button_is_selected)
                } else {
                    try {
                        emojiBottomRight = gameData[player].emoji
                        checkResult(true, gameData, player, author, member, midDuel, gameCollector, inputFirstEmoji, inputSecondEmoji, emojiTopLeft, emojiTopCenter, emojiTopRight, emojiMiddleLeft, emojiMiddleCenter, emojiMiddleRight, emojiBottomLeft, emojiBottomCenter, emojiBottomRight)
                    } catch (error) {
                        catchError(interaction.client, interaction, module.exports.name, error);
                    }

                    player = (player + 1) % 2;
                    ButtonBottomRight = new ButtonBuilder()
                        .setCustomId(idBottomRight)
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(gameData[player].emoji)
                        .setDisabled()

                    await interaction.editReply({
                        "embeds": [tictactoeEmbed],
                        "components": [
                            {
                                "type": 1,
                                "components": [
                                    ButtonTopLeft,
                                    ButtonTopCenter,
                                    ButtonTopRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonMiddleLeft,
                                    ButtonMiddleCenter,
                                    ButtonMiddleRight
                                ]
                            },
                            {
                                "type": 1,
                                "components": [
                                    ButtonBottomLeft,
                                    ButtonBottomCenter,
                                    ButtonBottomRight
                                ]
                            },
                        ]
                    })
                }
            } else {
                return collection.reply({
                    "content": interaction.client.translate.commands.tictactoe.wait_opponent,
                    "ephemeral": true
                });
            }
        });
        gameCollector.on("end", async () => {
            ButtonTopLeft.setDisabled();
            ButtonTopCenter.setDisabled();
            ButtonTopRight.setDisabled();
            ButtonMiddleLeft.setDisabled();
            ButtonMiddleCenter.setDisabled();
            ButtonMiddleRight.setDisabled();
            ButtonBottomLeft.setDisabled();
            ButtonBottomCenter.setDisabled();
            ButtonBottomRight.setDisabled();

            await interaction.editReply({
                "embeds": [tictactoeEmbed],
                "components": [
                    {
                        "type": 1,
                        "components": [
                            ButtonTopLeft,
                            ButtonTopCenter,
                            ButtonTopRight
                        ]
                    },
                    {
                        "type": 1,
                        "components": [
                            ButtonMiddleLeft,
                            ButtonMiddleCenter,
                            ButtonMiddleRight
                        ]
                    },
                    {
                        "type": 1,
                        "components": [
                            ButtonBottomLeft,
                            ButtonBottomCenter,
                            ButtonBottomRight
                        ]
                    },
                ]
            })
        });
    }
};