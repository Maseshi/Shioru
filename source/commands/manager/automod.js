const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
    "enable": true,
    "name": "automod",
    "description": "Manage your server with automation.",
    "category": "manager",
    "permissions": {
        "user": [PermissionsBitField.Flags.ManageGuild],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ManageGuild
        ]
    },
    "usage": "automod: flagged_words, spam_messages, mention_spam <count(Integer)>, keyword <word(String)>, [regex_patterns(String)], [allow_list(String)]",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "description": module.exports.description,
        "description_localizations": {
            "th": "จัดการเซิร์ฟเวอร์ของคุณด้วยระบบอัตโนมัติ"
        },
        "options": [
            {
                "type": 1,
                "name": "flagged_words",
                "name_localizations": {
                    "th": "คำต้องห้าม"
                },
                "description": "Block profanity, sexual content, and slurs",
                "description_localizations": {
                    "th": "บล็อกคำหยาบคาย เนื้อหาเกี่ยวกับเรื่องเพศ และคำสบประมาท"
                }
            },
            {
                "type": 1,
                "name": "spam_messages",
                "name_localizations": {
                    "th": "ข้อความสแปม"
                },
                "description": "Prevent message spam",
                "description_localizations": {
                    "th": "ป้องกันการสแปมข้อความ"
                }
            },
            {
                "type": 1,
                "name": "mention_spam",
                "name_localizations": {
                    "th": "กล่าวถึงสแปม"
                },
                "description": "Prevent unnecessary mention spam.",
                "description_localizations": {
                    "th": "ป้องกันการสแปมการกล่าวถึงที่ไม่จำเป็น"
                },
                "options": [
                    {
                        "type": 4,
                        "name": "count",
                        "name_localizations": {
                            "th": "จำนวน"
                        },
                        "description": "Number of unnecessary mentions",
                        "description_localizations": {
                            "th": "จำนวนของการกล่าวถึงที่ไม่จำเป็น"
                        },
                        "min_value": 0,
                        "max_value": 50,
                        "required": true
                    }
                ]
            },
            {
                "type": 1,
                "name": "keyword",
                "name_localizations": {
                    "th": "คำสำคัญ"
                },
                "description": "Block unwanted or forbidden words.",
                "description_localizations": {
                    "th": "บล็อคคำที่ไม่ต้องการหรือคำต้องห้าม"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "word",
                        "name_localizations": {
                            "th": "คำ"
                        },
                        "description": "Words to be blocked which, if found, will not be able to send messages.",
                        "description_localizations": {
                            "th": "คำที่ต้องการบล็อค ซึ่งหากพบจะไม่สามารถส่งข้อความได้"
                        },
                        "min_length": 0,
                        "max_length": 1000,
                        "required": true
                    },
                    {
                        "type": 3,
                        "name": "regex_patterns",
                        "name_localizations": {
                            "th": "รูปแบบนิพจน์ทั่วไป"
                        },
                        "description": "Regular expression patterns which will be matched against content",
                        "description_localizations": {
                            "th": "รูปแบบนิพจน์ทั่วไปซึ่งจะจับคู่กับเนื้อหา"
                        },
                        "min_length": 0,
                        "max_length": 10,
                        "required": false
                    },
                    {
                        "type": 3,
                        "name": "allow_list",
                        "name_localizations": {
                            "th": "คำที่อนุญาต"
                        },
                        "description": "Substrings which should not trigger the rule",
                        "description_localizations": {
                            "th": "คำย่อยที่ไม่ควรเรียกใช้กฎ"
                        },
                        "min_length": 0,
                        "max_length": 100,
                        "required": false
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case "flagged_words":
                try {
                    const flaggedWordsRule = await interaction.guild.autoModerationRules.create({
                        "name": interaction.client.translate.commands.automod.flagged_words_name,
                        "creatorId": interaction.client.config.team.owner,
                        "enabled": true,
                        "eventType": 1,
                        "triggerType": 4,
                        "triggerMetadata": {
                            "presets": [1, 2, 3]
                        },
                        "actions": [
                            {
                                "type": 1,
                                "metadata": {
                                    "channel": interaction.channel,
                                    "durationSeconds": 10,
                                    "customMessage": interaction.client.translate.commands.automod.prevent_message
                                }
                            }
                        ]
                    });

                    if (!flaggedWordsRule) return;

                    const flaggedWordsEmbed = new EmbedBuilder()
                        .setColor("Blue")
                        .setDescription(interaction.client.translate.commands.automod.flagged_words_success)

                    await interaction.reply({ "content": "", "embeds": [flaggedWordsEmbed] });
                } catch (error) {
                    catchError(interaction.client, interaction, module.exports.name, error);
                }
                break;
            case "spam_messages":
                try {
                    const spamMessagesRule = await interaction.guild.autoModerationRules.create({
                        "name": interaction.client.translate.commands.automod.spam_messages_name,
                        "creatorId": interaction.client.config.team.owner,
                        "enabled": true,
                        "eventType": 1,
                        "triggerType": 3,
                        "triggerMetadata": {},
                        "actions": [
                            {
                                "type": 1,
                                "metadata": {
                                    "channel": interaction.channel,
                                    "durationSeconds": 10,
                                    "customMessage": interaction.client.translate.commands.automod.prevent_message
                                }
                            }
                        ]
                    });

                    if (!spamMessagesRule) return;

                    const spamMessagesEmbed = new EmbedBuilder()
                        .setColor("Blue")
                        .setDescription(interaction.client.translate.commands.automod.spam_messages_success)

                    await interaction.reply({ "content": "", "embeds": [spamMessagesEmbed] });
                } catch (error) {
                    catchError(interaction.client, interaction, module.exports.name, error);
                }
                break;
            case "mention_spam":
                const inputCount = interaction.options.getInteger("count");

                try {
                    const mentionSpamRule = await interaction.guild.autoModerationRules.create({
                        "name": interaction.client.translate.commands.automod.mention_spam_name,
                        "creatorId": interaction.client.config.team.owner,
                        "enabled": true,
                        "eventType": 1,
                        "triggerType": 5,
                        "triggerMetadata": {
                            "mentionTotalLimit": inputCount
                        },
                        "actions": [
                            {
                                "type": 1,
                                "metadata": {
                                    "channel": interaction.channel,
                                    "durationSeconds": 10,
                                    "customMessage": interaction.client.translate.commands.automod.prevent_message
                                }
                            }
                        ]
                    });

                    if (!mentionSpamRule) return;

                    const mentionSpamEmbed = new EmbedBuilder()
                        .setColor("Blue")
                        .setDescription(interaction.client.translate.commands.automod.mention_spam_success)

                    await interaction.reply({ "content": "", "embeds": [mentionSpamEmbed] });
                } catch (error) {
                    catchError(interaction.client, interaction, module.exports.name, error);
                }
                break;
            case "keyword":
                const inputWord = interaction.options.getString("word");
                const inputRegexPatterns = interaction.options.getString("regex_patterns") ?? "";
                const inputAllowList = interaction.options.getString("allow_list") ?? "";

                try {
                    const keywordRule = await interaction.guild.autoModerationRules.create({
                        "name": interaction.client.translate.commands.automod.keyword_name.replace("%s", inputWord),
                        "creatorId": interaction.client.config.team.owner,
                        "enabled": true,
                        "eventType": 1,
                        "triggerType": 1,
                        "triggerMetadata": {
                            "keywordFilter": [inputWord],
                            "regexPatterns": [inputRegexPatterns],
                            "allowList": [inputAllowList]
                        },
                        "actions": [
                            {
                                "type": 1,
                                "metadata": {
                                    "channel": interaction.channel,
                                    "durationSeconds": 10,
                                    "customMessage": interaction.client.translate.commands.automod.prevent_message
                                }
                            }
                        ]
                    });

                    if (!keywordRule) return;

                    const keywordEmbed = new EmbedBuilder()
                        .setColor("Blue")
                        .setDescription(interaction.client.translate.commands.automod.keyword_success.replace("%s", inputWord))

                    await interaction.reply({ "content": "", "embeds": [keywordEmbed] });
                } catch (error) {
                    catchError(interaction.client, interaction, module.exports.name, error);
                }
                break;
        }
    }
};