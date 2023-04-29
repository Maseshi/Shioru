const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { dateFormat } = require("../../utils/miscUtils");

module.exports = {
    "enable": true,
    "name": "user",
    "description": "Get your user information",
    "category": "information",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "user [info] [member]",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ผู้ใช้"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "รับข้อมูลผู้ใช้ของคุณ"
        },
        "options": [
            {
                "type": 3,
                "name": "info",
                "name_localizations": {
                    "th": "ข้อมูล"
                },
                "description": "The information you want to get",
                "description_localizations": {
                    "th": "ข้อมูลที่คุณต้องการจะดู"
                },
                "required": false,
                "choices": [
                    {
                        "name": "Avatar link",
                        "name_localizations": {
                            "th": "ลิงค์รูปประจำตัว"
                        },
                        "value": "avatarURL"
                    },
                    {
                        "name": "Bot",
                        "name_localizations": {
                            "th": "บอท"
                        },
                        "value": "bot"
                    },
                    {
                        "name": "Created when",
                        "name_localizations": {
                            "th": "สร้างเมื่อ"
                        },
                        "value": "createdAt"
                    },
                    {
                        "name": "Created when (Timestamp)",
                        "name_localizations": {
                            "th": "สร้างเมื่อ (ประทับเวลา)"
                        },
                        "value": "createdTimestamp"
                    },
                    {
                        "name": "Default link of avatar",
                        "name_localizations": {
                            "th": "ลิงค์รูปประจำตัวค่าเริ่มต้น"
                        },
                        "value": "defaultAvatarURL"
                    },
                    {
                        "name": "Discriminator",
                        "name_localizations": {
                            "th": "การแยกแยะ"
                        },
                        "value": "discriminator"
                    },
                    {
                        "name": "ID",
                        "name_localizations": {
                            "th": "รหัสประจำตัว"
                        },
                        "value": "id"
                    },
                    {
                        "name": "Partial",
                        "name_localizations": {
                            "th": "อคติ"
                        },
                        "value": "partial"
                    },
                    {
                        "name": "System",
                        "name_localizations": {
                            "th": "ระบบ"
                        },
                        "value": "system"
                    },
                    {
                        "name": "Tag",
                        "name_localizations": {
                            "th": "แท็ก"
                        },
                        "value": "tag"
                    },
                    {
                        "name": "Username",
                        "name_localizations": {
                            "th": "ชื่อผู้ใช้"
                        },
                        "value": "username"
                    }
                ]
            },
            {
                "type": 6,
                "name": "member",
                "name_localizations": {
                    "th": "สมาชิก"
                },
                "description": "Information of other members you wish to see.",
                "description_localizations": {
                    "th": "ข้อมูลของสมาชิกคนอื่น ๆ ที่คุณต้องการเห็น"
                },
                "required": false
            }
        ]
    },
    async execute(interaction) {
        const inputInfo = interaction.options.getString("info") ?? "";
        const inputMember = interaction.options.getMember("member") ?? "";

        let avatar = interaction.user.avatarURL() || interaction.client.translate.commands.user.unknown;
        let bot = interaction.user.bot ? interaction.client.translate.commands.user.yes : interaction.client.translate.commands.user.none;
        let createdAt = interaction.user.createdAt.toString() || interaction.client.translate.commands.user.unknown;
        let createdTimestamp = dateFormat(interaction.user.createdTimestamp) || interaction.client.translate.commands.user.unknown;
        let defaultAvatarURL = interaction.user.defaultAvatarURL || interaction.client.translate.commands.user.unknown;
        let discriminator = interaction.user.discriminator || interaction.client.translate.commands.user.unknown;
        let id = interaction.user.id || interaction.client.translate.commands.user.unknown;
        let partial = interaction.user.partial ? interaction.client.translate.commands.user.yes : interaction.client.translate.commands.user.none;
        let system = interaction.user.system ? interaction.client.translate.commands.user.yes : interaction.client.translate.commands.user.none;
        let tag = interaction.user.tag || interaction.client.translate.commands.user.unknown;
        let username = interaction.user.username || interaction.client.translate.commands.user.unknown;

        const usersSnapshot = interaction.client.api.users
        const usersRef = child(child(ref(getDatabase(), "Shioru/apps/discord/guilds"), interaction.guild.id), "data/users");
        const clientUsername = interaction.client.user.username;
        const clientAvatarURL = interaction.client.user.avatarURL();
        const embed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.user.user_info)
            .setDescription(interaction.client.translate.commands.user.user_info_description)
            .setColor("Blue")
            .setTimestamp()
            .setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
            .setThumbnail(avatar)
            .setAuthor({ "name": clientUsername, "iconURL": clientAvatarURL });

        if (inputMember) {
            avatar = inputMember.user.avatarURL() || interaction.client.translate.commands.user.unknown;
            bot = inputMember.user.bot ? interaction.client.translate.commands.user.yes : interaction.client.translate.commands.user.none;
            createdAt = inputMember.user.createdAt.toString() || interaction.client.translate.commands.user.unknown;
            createdTimestamp = dateFormat(inputMember.user.createdTimestamp) || interaction.client.translate.commands.user.unknown;
            defaultAvatarURL = inputMember.user.defaultAvatarURL || interaction.client.translate.commands.user.unknown;
            discriminator = inputMember.user.discriminator || interaction.client.translate.commands.user.unknown;
            id = inputMember.user.id || interaction.client.translate.commands.user.unknown;
            partial = inputMember.user.partial ? interaction.client.translate.commands.user.yes : interaction.client.translate.commands.user.none;
            system = inputMember.user.system ? interaction.client.translate.commands.user.yes : interaction.client.translate.commands.user.none;
            tag = inputMember.user.tag || interaction.client.translate.commands.user.unknown;
            username = inputMember.user.username || interaction.client.translate.commands.user.unknown;
        }

        const info = [
            "avatarURL",
            "bot",
            "createAt",
            "createdTimestamp",
            "defaultAvatarURL",
            "discriminator",
            "id",
            "partial",
            "system",
            "tag",
            "username"
        ];
        const infoList = [
            { "name": interaction.client.translate.commands.user.avatar, "value": avatar, "inline": true },
            { "name": interaction.client.translate.commands.user.bot, "value": bot, "inline": true },
            { "name": interaction.client.translate.commands.user.created_at, "value": createdAt, "inline": true },
            { "name": interaction.client.translate.commands.user.created_timestamp, "value": createdTimestamp, "inline": true },
            { "name": interaction.client.translate.commands.user.default_avatar_url, "value": defaultAvatarURL, "inline": true },
            { "name": interaction.client.translate.commands.user.discriminator, "value": discriminator, "inline": true },
            { "name": interaction.client.translate.commands.user.id, "value": id, "inline": true },
            { "name": interaction.client.translate.commands.user.partial, "value": partial, "inline": true },
            { "name": interaction.client.translate.commands.user.system, "value": system, "inline": true },
            { "name": interaction.client.translate.commands.user.tag, "value": tag, "inline": true },
            { "name": interaction.client.translate.commands.user.username, "value": username, "inline": true }
        ];

        if (inputInfo) {
            if (inputMember) {
                if (bot) {
                    embed.setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
                        .setThumbnail(avatar);

                    for (let i = 0; i < info.length; i++) {
                        if (inputInfo === info[i]) {
                            embed.addFields(infoList[i]);
                            await interaction.reply({ "embeds": [embed] });
                        }
                    }
                } else {
                    const snapshot = usersSnapshot[id].access

                    if (snapshot) {
                        if (snapshot.info) {
                            embed.setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
                                .setThumbnail(avatar);

                            for (let i = 0; i < info.length; i++) {
                                if (inputInfo === info[i]) {
                                    embed.addFields(infoList[i]);
                                    await interaction.reply({ "embeds": [embed] });
                                }
                            }
                        } else {
                            await interaction.reply(interaction.client.translate.commands.user.info.not_allowed);
                        }
                    } else {
                        set(child(child(usersRef, id), "access"), {
                            "avatar": false,
                            "info": false,
                            "uid": false
                        }).then(() => {
                            module.exports.interaction.execute(interaction);
                        });
                    }
                }
            } else {
                if (inputMember) {
                    if (bot) {
                        embed.setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
                            .setThumbnail(avatar)
                            .addFields(Array.from(infoList));

                        await interaction.reply({ "embeds": [embed] });
                    } else {
                        const snapshot = usersSnapshot[id].access

                        if (snapshot) {
                            if (snapshot.info) {
                                embed.setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
                                    .setThumbnail(avatar)
                                    .addFields(Array.from(infoList));

                                await interaction.reply({ "embeds": [embed] });
                            } else {
                                await interaction.reply(interaction.client.translate.commands.user.info.not_allowed);
                            }
                        } else {
                            set(child(child(usersRef, id), "access"), {
                                "avatar": false,
                                "info": false,
                                "uid": false
                            }).then(() => {
                                module.exports.interaction.execute(interaction);
                            });
                        }
                    }
                } else {
                    for (let i = 0; i < info.length; i++) {
                        if (inputInfo === info[i]) {
                            embed.addFields(infoList[i]);
                            await interaction.reply({ "embeds": [embed] });
                        }
                    }
                }
            }
        } else {
            if (inputMember) {
                if (bot) {
                    embed.setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
                        .setThumbnail(avatar)
                        .addFields(Array.from(infoList));

                    await interaction.reply({ "embeds": [embed] });
                } else {
                    const snapshot = usersSnapshot[id].access

                    if (snapshot) {
                        if (snapshot.info) {
                            embed.setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
                                .setThumbnail(avatar)
                                .addFields(Array.from(infoList));

                            await interaction.reply({ "embeds": [embed] });
                        } else {
                            await interaction.reply(interaction.client.translate.commands.user.info.not_allowed);
                        }
                    } else {
                        set(child(child(usersRef, id), "access"), {
                            "avatar": false,
                            "info": false,
                            "uid": false
                        }).then(() => {
                            module.exports.interaction.execute(interaction);
                        });
                    }
                }
            } else {
                embed.addFields(Array.from(infoList));
                await interaction.reply({ "embeds": [embed] });
            }
        }
    }
}