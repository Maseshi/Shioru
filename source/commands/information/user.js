const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");

module.exports = {
    "name": "user",
    "description": "Get your user information",
    "category": "information",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "user (info) (member)",
    "aliases": ["member", "members", "ผู้ใช้", "สมาชิก"],
    async execute(client, message, args) {
        const inputInfo = args[0];
        const inputMember = args[1];

        const dateFormat = (data) => {
            if (!data) return;

            const date = new Date(data);
            const days = [
                client.translate.commands.guild.sunday,
                client.translate.commands.guild.monday,
                client.translate.commands.guild.tuesday,
                client.translate.commands.guild.wednesday,
                client.translate.commands.guild.thursday,
                client.translate.commands.guild.friday,
                client.translate.commands.guild.saturday
            ];
            const months = [
                client.translate.commands.guild.january,
                client.translate.commands.guild.february,
                client.translate.commands.guild.march,
                client.translate.commands.guild.april,
                client.translate.commands.guild.may,
                client.translate.commands.guild.june,
                client.translate.commands.guild.july,
                client.translate.commands.guild.august,
                client.translate.commands.guild.september,
                client.translate.commands.guild.october,
                client.translate.commands.guild.november,
                client.translate.commands.guild.december
            ];

            return client.translate.commands.guild.format_at
                .replace("%s1", days[date.getDay()])
                .replace("%s2", date.getDate())
                .replace("%s3", months[date.getMonth()])
                .replace("%s4", date.getFullYear())
                .replace("%s5", date.getHours())
                .replace("%s6", date.getMinutes());
        };

        let avatar = message.author.avatarURL() || client.translate.commands.user.unknown;
        let bot = message.author.bot ? client.translate.commands.user.yes : client.translate.commands.user.none;
        let createdAt = message.author.createdAt.toString() || client.translate.commands.user.unknown;
        let createdTimestamp = dateFormat(message.author.createdTimestamp) || client.translate.commands.user.unknown;
        let defaultAvatarURL = message.author.defaultAvatarURL || client.translate.commands.user.unknown;
        let discriminator = message.author.discriminator || client.translate.commands.user.unknown;
        let id = message.author.id || client.translate.commands.user.unknown;
        let partial = message.author.partial ? client.translate.commands.user.yes : client.translate.commands.user.none;
        let system = message.author.system ? client.translate.commands.user.yes : client.translate.commands.user.none;
        let tag = message.author.tag || client.translate.commands.user.unknown;
        let username = message.author.username || client.translate.commands.user.unknown;

        const usersSnapshot = client.api.apps.discord.guilds[message.guild.id].data.users
        const usersRef = child(child(ref(getDatabase(), "Shioru/apps/discord/guilds"), message.guild.id), "data/users");
        const clientUsername = client.user.username;
        const clientAvatarURL = client.user.avatarURL();
        const embed = new EmbedBuilder()
            .setTitle(client.translate.commands.user.user_info)
            .setDescription(client.translate.commands.user.user_info_description)
            .setColor("BLUE")
            .setTimestamp()
            .setFooter({ "text": client.translate.commands.user.info_date, "iconURL": avatar })
            .setThumbnail(avatar)
            .setAuthor({ "name": clientUsername, "iconURL": clientAvatarURL });
        const member = message.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));

        if (member) {
            avatar = member.user.avatarURL() || client.translate.commands.user.unknown;
            bot = member.user.bot ? client.translate.commands.user.yes : client.translate.commands.user.none;
            createdAt = member.user.createdAt.toString() || client.translate.commands.user.unknown;
            createdTimestamp = dateFormat(member.user.createdTimestamp) || client.translate.commands.user.unknown;
            defaultAvatarURL = member.user.defaultAvatarURL || client.translate.commands.user.unknown;
            discriminator = member.user.discriminator || client.translate.commands.user.unknown;
            id = member.user.id || client.translate.commands.user.unknown;
            partial = member.user.partial ? client.translate.commands.user.yes : client.translate.commands.user.none;
            system = member.user.system ? client.translate.commands.user.yes : client.translate.commands.user.none;
            tag = member.user.tag || client.translate.commands.user.unknown;
            username = member.user.username || client.translate.commands.user.unknown;
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
            { "name": client.translate.commands.user.avatar, "value": avatar, "inline": true },
            { "name": client.translate.commands.user.bot, "value": bot, "inline": true },
            { "name": client.translate.commands.user.created_at, "value": createdAt, "inline": true },
            { "name": client.translate.commands.user.created_timestamp, "value": createdTimestamp, "inline": true },
            { "name": client.translate.commands.user.default_avatar_url, "value": defaultAvatarURL, "inline": true },
            { "name": client.translate.commands.user.discriminator, "value": discriminator, "inline": true },
            { "name": client.translate.commands.user.id, "value": id, "inline": true },
            { "name": client.translate.commands.user.partial, "value": partial, "inline": true },
            { "name": client.translate.commands.user.system, "value": system, "inline": true },
            { "name": client.translate.commands.user.tag, "value": tag, "inline": true },
            { "name": client.translate.commands.user.username, "value": username, "inline": true }
        ];

        if (inputInfo) {
            if (inputMember) {
                if (member) {
                    if (bot) {
                        embed.setFooter({ "text": client.translate.commands.user.info_date, "iconURL": avatar })
                            .setThumbnail(avatar);

                        if (info.includes(inputInfo)) {
                            for (let i = 0; i < info.length; i++) {
                                if (inputInfo === info[i]) {
                                    embed.addFields(infoList[i]);
                                    message.channel.send({ "embeds": [embed] });
                                }
                            }
                        } else {
                            message.reply(client.translate.commands.user.specific_use.replace("%s", info.join(", ")));
                        }
                    } else {
                        const snapshot = usersSnapshot[id].access;

                        if (snapshot) {
                            if (snapshot.info) {
                                embed.setFooter({ "text": client.translate.commands.user.info_date, "iconURL": avatar })
                                    .setThumbnail(avatar);

                                if (info.includes(inputInfo)) {
                                    for (let i = 0; i < info.length; i++) {
                                        if (inputInfo === info[i]) {
                                            embed.addFields(infoList[i]);
                                            message.channel.send({ "embeds": [embed] });
                                        }
                                    }
                                } else {
                                    message.reply(client.translate.commands.user.specific_use.replace("%s", info.join(", ")));
                                }
                            } else {
                                message.reply(client.translate.commands.user.info.not_allowed);
                            }
                        } else {
                            set(child(child(usersRef, id), "access"), {
                                "avatar": false,
                                "info": false,
                                "uid": false
                            }).then(() => {
                                module.exports.run(client, message, args);
                            });
                        }
                    }
                } else {
                    message.reply(client.translate.commands.user.can_not_find_user.replace("%s", client.config.owner));
                }
            } else {
                if (member) {
                    if (bot) {
                        embed.setFooter({ "text": client.translate.commands.user.info_date, "iconURL": avatar })
                            .setThumbnail(avatar)
                            .addFields(Array.from(infoList));

                        message.channel.send({ "embeds": [embed] });
                    } else {
                        const snapshot = usersSnapshot[id].access;

                        if (snapshot) {
                            if (snapshot.info) {
                                embed.setFooter({ "text": client.translate.commands.user.info_date, "iconURL": avatar })
                                    .setThumbnail(avatar)
                                    .addFields(Array.from(infoList));

                                message.channel.send({ "embeds": [embed] });
                            } else {
                                message.reply(client.translate.commands.user.info.not_allowed);
                            }
                        } else {
                            set(child(child(usersRef, id), "access"), {
                                "avatar": false,
                                "info": false,
                                "uid": false
                            }).then(() => {
                                module.exports.run(client, message, args);
                            });
                        }
                    }
                } else {
                    if (info.includes(inputInfo)) {
                        for (let i = 0; i < info.length; i++) {
                            if (inputInfo === info[i]) {
                                embed.addFields(infoList[i]);
                                message.channel.send({ "embeds": [embed] });
                            }
                        }
                    } else {
                        message.reply(client.translate.commands.user.specific_use.replace("%s", info.join(", ")));
                    }
                }
            }
        } else {
            if (inputMember) {
                if (member) {
                    if (bot) {
                        embed.setFooter({ "text": client.translate.commands.user.info_date, "iconURL": avatar })
                            .setThumbnail(avatar)
                            .addFields(Array.from(infoList));

                        message.channel.send({ "embeds": [embed] });
                    } else {
                        const snapshot = usersSnapshot[id].access;

                        if (snapshot) {
                            if (snapshot.info) {
                                embed.setFooter({ "text": client.translate.commands.user.info_date, "iconURL": avatar })
                                    .setThumbnail(avatar)
                                    .addFields(Array.from(infoList));

                                message.channel.send({ "embeds": [embed] });
                            } else {
                                message.reply(client.translate.commands.user.info.not_allowed);
                            }
                        } else {
                            set(child(child(usersRef, id), "access"), {
                                "avatar": false,
                                "info": false,
                                "uid": false
                            }).then(() => {
                                module.exports.run(client, message, args);
                            });
                        }
                    }
                } else {
                    message.reply(client.translate.commands.user.can_not_find_user.replace("%s", client.config.owner));
                }
            } else {
                embed.addFields(Array.from(infoList));
                message.channel.send({ "embeds": [embed] });
            }
        }
    }
}

module.exports.interaction = {
    "enable": true
}

module.exports.interaction.slash = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "user",
            "th": "ผู้ใช้"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Get your user information",
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
        const inputInfo = interaction.options.get("info");
        const inputMember = interaction.options.get("member");

        const dateFormat = (data) => {
            if (!data) return;

            const date = new Date(data);
            const days = [
                interaction.client.translate.commands.guild.sunday,
                interaction.client.translate.commands.guild.monday,
                interaction.client.translate.commands.guild.tuesday,
                interaction.client.translate.commands.guild.wednesday,
                interaction.client.translate.commands.guild.thursday,
                interaction.client.translate.commands.guild.friday,
                interaction.client.translate.commands.guild.saturday
            ];
            const months = [
                interaction.client.translate.commands.guild.january,
                interaction.client.translate.commands.guild.february,
                interaction.client.translate.commands.guild.march,
                interaction.client.translate.commands.guild.april,
                interaction.client.translate.commands.guild.may,
                interaction.client.translate.commands.guild.june,
                interaction.client.translate.commands.guild.july,
                interaction.client.translate.commands.guild.august,
                interaction.client.translate.commands.guild.september,
                interaction.client.translate.commands.guild.october,
                interaction.client.translate.commands.guild.november,
                interaction.client.translate.commands.guild.december
            ];

            return interaction.client.translate.commands.guild.format_at
                .replace("%s1", days[date.getDay()])
                .replace("%s2", date.getDate())
                .replace("%s3", months[date.getMonth()])
                .replace("%s4", date.getFullYear())
                .replace("%s5", date.getHours())
                .replace("%s6", date.getMinutes());
        };

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

        const usersSnapshot = interaction.client.api.apps.discord.guilds[interaction.guild.id].data.users
        const usersRef = child(child(ref(getDatabase(), "Shioru/apps/discord/guilds"), interaction.guild.id), "data/users");
        const clientUsername = interaction.client.user.username;
        const clientAvatarURL = interaction.client.user.avatarURL();
        const embed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.user.user_info)
            .setDescription(interaction.client.translate.commands.user.user_info_description)
            .setColor("BLUE")
            .setTimestamp()
            .setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
            .setThumbnail(avatar)
            .setAuthor({ "name": clientUsername, "iconURL": clientAvatarURL });
        const member = interaction.guild.members.cache.find(members => (members.user.username === (inputMember ? inputMember.value : "")) || (members.user.id === (inputMember ? inputMember.value : "")) || (members.user.tag === (inputMember ? inputMember.value : "")));

        if (member) {
            avatar = member.user.avatarURL() || interaction.client.translate.commands.user.unknown;
            bot = member.user.bot ? interaction.client.translate.commands.user.yes : interaction.client.translate.commands.user.none;
            createdAt = member.user.createdAt.toString() || interaction.client.translate.commands.user.unknown;
            createdTimestamp = dateFormat(member.user.createdTimestamp) || interaction.client.translate.commands.user.unknown;
            defaultAvatarURL = member.user.defaultAvatarURL || interaction.client.translate.commands.user.unknown;
            discriminator = member.user.discriminator || interaction.client.translate.commands.user.unknown;
            id = member.user.id || interaction.client.translate.commands.user.unknown;
            partial = member.user.partial ? interaction.client.translate.commands.user.yes : interaction.client.translate.commands.user.none;
            system = member.user.system ? interaction.client.translate.commands.user.yes : interaction.client.translate.commands.user.none;
            tag = member.user.tag || interaction.client.translate.commands.user.unknown;
            username = member.user.username || interaction.client.translate.commands.user.unknown;
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
                if (member) {
                    if (bot) {
                        embed.setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
                            .setThumbnail(avatar);

                        for (let i = 0; i < info.length; i++) {
                            if (inputInfo.value === info[i]) {
                                embed.addFields(infoList[i]);
                                await interaction.editReply({ "embeds": [embed] });
                            }
                        }
                    } else {
                        const snapshot = usersSnapshot[id].access

                        if (snapshot) {
                            if (snapshot.info) {
                                embed.setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
                                    .setThumbnail(avatar);

                                for (let i = 0; i < info.length; i++) {
                                    if (inputInfo.value === info[i]) {
                                        embed.addFields(infoList[i]);
                                        await interaction.editReply({ "embeds": [embed] });
                                    }
                                }
                            } else {
                                await interaction.editReply(interaction.client.translate.commands.user.info.not_allowed);
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
                    await interaction.editReply(interaction.client.translate.commands.user.can_not_find_user.replace("%s", interaction.client.config.owner));
                }
            } else {
                if (member) {
                    if (bot) {
                        embed.setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
                            .setThumbnail(avatar)
                            .addFields(Array.from(infoList));

                        await interaction.editReply({ "embeds": [embed] });
                    } else {
                        const snapshot = usersSnapshot[id].access

                        if (snapshot) {
                            if (snapshot.info) {
                                embed.setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
                                    .setThumbnail(avatar)
                                    .addFields(Array.from(infoList));

                                await interaction.editReply({ "embeds": [embed] });
                            } else {
                                await interaction.editReply(interaction.client.translate.commands.user.info.not_allowed);
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
                        if (inputInfo.value === info[i]) {
                            embed.addFields(infoList[i]);
                            await interaction.editReply({ "embeds": [embed] });
                        }
                    }
                }
            }
        } else {
            if (inputMember) {
                if (member) {
                    if (bot) {
                        embed.setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
                            .setThumbnail(avatar)
                            .addFields(Array.from(infoList));

                        await interaction.editReply({ "embeds": [embed] });
                    } else {
                        const snapshot = usersSnapshot[id].access

                        if (snapshot) {
                            if (snapshot.info) {
                                embed.setFooter({ "text": interaction.client.translate.commands.user.info_date, "iconURL": avatar })
                                    .setThumbnail(avatar)
                                    .addFields(Array.from(infoList));

                                await interaction.editReply({ "embeds": [embed] });
                            } else {
                                await interaction.editReply(interaction.client.translate.commands.user.info.not_allowed);
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
                    await interaction.editReply(interaction.client.translate.commands.user.can_not_find_user.replace("%s", interaction.client.config.owner));
                }
            } else {
                embed.addFields(Array.from(infoList));
                await interaction.editReply({ "embeds": [embed] });
            }
        }
    }
}