const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");
const { IDConvertor } = require("../../utils/miscUtils");

module.exports = {
    "enable": true,
    "name": "set-notify",
    "description": "Set up the notifications you want.",
    "category": "settings",
    "permissions": {
        "user": [PermissionsBitField.Flags.ManageGuild],
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "set-notify: get, set <type(String)> <channel>, remove <type(String)>",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ตั้งค่าการแจ้งเตือน"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ตั้งค่าการแจ้งเตือนที่คุณต้องการ"
        },
        "options": [
            {
                "type": 1,
                "name": "get",
                "name_localizations": {
                    "th": "รับ"
                },
                "description": "Receive information about each channel's notification.",
                "description_localizations": {
                    "th": "รับข้อมูลการแจ้งเตือนของแต่ละช่อง"
                }
            },
            {
                "type": 1,
                "name": "set",
                "name_localizations": {
                    "th": "ตั้งค่า"
                },
                "description": "The type of notification you want to set.",
                "description_localizations": {
                    "th": "ประเภทของการแจ้งเตือนที่คุณต้องการตั้งค่า"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "type",
                        "name_localizations": {
                            "th": "ประเภท"
                        },
                        "description": "The type of notification you want to set.",
                        "description_localizations": {
                            "th": "ประเภทของการแจ้งเตือนที่คุณต้องการตั้งค่า"
                        },
                        "required": true
                    },
                    {
                        "type": 7,
                        "name": "channel",
                        "name_localizations": {
                            "th": "ช่อง"
                        },
                        "description": "The channel you want to set the notification.",
                        "description_localizations": {
                            "th": "ช่องที่คุณต้องการตั้งค่าการแจ้งเตือน เช่น alert, channelCreate"
                        },
                        "required": true,
                        "channel_types": [
                            0,
                            5,
                            10,
                            11,
                            12,
                            15
                        ]
                    }
                ]
            },
            {
                "type": 1,
                "name": "remove",
                "name_localizations": {
                    "th": "ลบ"
                },
                "description": "The type of notification you want to remove.",
                "description_localizations": {
                    "th": "ประเภทของการแจ้งเตือนที่คุณต้องการลบ"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "type",
                        "name_localizations": {
                            "th": "ประเภท"
                        },
                        "description": "The type of notification you want to remove.",
                        "description_localizations": {
                            "th": "ประเภทของการแจ้งเตือนที่คุณต้องการลบ"
                        },
                        "required": true
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const inputType = interaction.options.getString("type") ?? "";
        const inputChannel = interaction.options.getChannel("channel") ?? "";

        const guildID = interaction.guild.id;
        const clientFetch = await interaction.client.user.fetch();
        const clientColor = clientFetch.accentColor;
        const notifyRef = child(child(child(child(ref(getDatabase(), "projects"), IDConvertor(interaction.client.user.username)), "guilds"), guildID), "notification");
        const notifySnapshot = interaction.client.api.guilds[guildID].notification;
        const type = [
            "alert",
            "channelCreate",
            "channelDelete",
            "channelPinsUpdate",
            "channelUpdate",
            "emojiCreate",
            "emojiDelete",
            "emojiUpdate",
            "guildBanAdd",
            "guildBanRemove",
            "guildIntegrationsUpdate",
            "guildMemberAdd",
            "guildMemberRemove",
            "guildMembersChunk",
            "guildUnavailable",
            "inviteCreate",
            "inviteDelete",
            "roleCreate",
            "roleDelete",
            "roleUpdate",
            "stageInstanceCreate",
            "stageInstanceDelete",
            "stageInstanceUpdate",
            "stickerCreate",
            "stickerDelete",
            "stickerUpdate",
            "threadCreate",
            "threadDelete",
            "threadUpdate",
            "webhookUpdate"
        ];

        if (notifySnapshot) {
            const alert = notifySnapshot.alert;
            const channelCreate = notifySnapshot.channelCreate;
            const channelDelete = notifySnapshot.channelDelete;
            const channelPinsUpdate = notifySnapshot.channelPinsUpdate;
            const channelUpdate = notifySnapshot.channelUpdate;
            const emojiCreate = notifySnapshot.emojiCreate;
            const emojiDelete = notifySnapshot.emojiDelete;
            const emojiUpdate = notifySnapshot.emojiUpdate;
            const guildBanAdd = notifySnapshot.guildBanAdd;
            const guildBanRemove = notifySnapshot.guildBanRemove;
            const guildIntegrationsUpdate = notifySnapshot.guildIntegrationsUpdate;
            const guildMemberAdd = notifySnapshot.guildMemberAdd;
            const guildMemberRemove = notifySnapshot.guildMemberRemove;
            const guildMembersChunk = notifySnapshot.guildMembersChunk;
            const guildUnavailable = notifySnapshot.guildUnavailable;
            const inviteCreate = notifySnapshot.inviteCreate;
            const inviteDelete = notifySnapshot.inviteDelete;
            const roleCreate = notifySnapshot.roleCreate;
            const roleDelete = notifySnapshot.roleDelete;
            const roleUpdate = notifySnapshot.roleUpdate;
            const stageInstanceCreate = notifySnapshot.stageInstanceCreate;
            const stageInstanceDelete = notifySnapshot.stageInstanceDelete;
            const stageInstanceUpdate = notifySnapshot.stageInstanceUpdate;
            const stickerCreate = notifySnapshot.stickerCreate;
            const stickerDelete = notifySnapshot.stickerDelete;
            const stickerUpdate = notifySnapshot.stickerUpdate;
            const threadCreate = notifySnapshot.threadCreate;
            const threadDelete = notifySnapshot.threadDelete;
            const threadUpdate = notifySnapshot.threadUpdate;
            const webhookUpdate = notifySnapshot.webhookUpdate;

            switch (subCommand) {
                case "get": {
                    const noInputEmbed = new EmbedBuilder()
                        .setTitle(interaction.client.translate.commands.set_notify.title)
                        .setDescription(
                            interaction.client.translate.commands.set_notify.description
                                .replace("%s1", (alert ? ("<#" + alert + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s2", (channelCreate ? ("<#" + channelCreate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s3", (channelDelete ? ("<#" + channelDelete + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s4", (channelPinsUpdate ? ("<#" + channelPinsUpdate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s5", (channelUpdate ? ("<#" + channelUpdate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s6", (emojiCreate ? ("<#" + emojiCreate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s7", (emojiDelete ? ("<#" + emojiDelete + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s8", (emojiUpdate ? ("<#" + emojiUpdate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s9", (guildBanAdd ? ("<#" + guildBanAdd + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s10", (guildBanRemove ? ("<#" + guildBanRemove + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s11", (guildIntegrationsUpdate ? ("<#" + guildIntegrationsUpdate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s12", (guildMemberAdd ? ("<#" + guildMemberAdd + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s13", (guildMemberRemove ? ("<#" + guildMemberRemove + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s14", (guildMembersChunk ? ("<#" + guildMembersChunk + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s15", (guildUnavailable ? ("<#" + guildUnavailable + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s16", (inviteCreate ? ("<#" + inviteCreate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s17", (inviteDelete ? ("<#" + inviteDelete + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s18", (roleCreate ? ("<#" + roleCreate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s19", (roleDelete ? ("<#" + roleDelete + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s20", (roleUpdate ? ("<#" + roleUpdate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s21", (stageInstanceCreate ? ("<#" + stageInstanceCreate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s22", (stageInstanceDelete ? ("<#" + stageInstanceDelete + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s23", (stageInstanceUpdate ? ("<#" + stageInstanceUpdate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s24", (stickerCreate ? ("<#" + stickerCreate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s25", (stickerDelete ? ("<#" + stickerDelete + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s26", (stickerUpdate ? ("<#" + stickerUpdate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s27", (threadCreate ? ("<#" + threadCreate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s28", (threadDelete ? ("<#" + threadDelete + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s29", (threadUpdate ? ("<#" + threadUpdate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s30", (webhookUpdate ? ("<#" + webhookUpdate + ">") : interaction.client.translate.commands.set_notify.not_set))
                                .replace("%s31", ("/" + module.exports.usage))
                        )
                        .setColor(clientColor)
                        .setTimestamp()
                        .setFooter({ "text": interaction.client.translate.commands.set_notify.data_at });

                    await interaction.reply({ "embeds": [noInputEmbed] });
                    break;
                }
                case "set": {
                    if (!type.includes(inputType)) return await interaction.reply(interaction.client.translate.commands.set_notify.type_not_found.replace("%s", type.join(", ")));

                    await set(child(notifyRef, inputType), inputChannel.id.toString());
                    await interaction.reply(interaction.client.translate.commands.set_notify.set_success.replace("%s1", inputType).replace("%s2", inputChannel.id));
                    break;
                }
                case "remove": {
                    if (!type.includes(inputType)) return await interaction.reply(interaction.client.translate.commands.set_notify.type_not_found.replace("%s", type.join(", ")));

                    await set(child(notifyRef, inputType), false);
                    await interaction.reply(interaction.client.translate.commands.set_notify.remove_success.replace("%s", inputType));
                    break;
                }
            }
        } else {
            set(notifyRef, {
                "alert": false,
                "channelCreate": false,
                "channelDelete": false,
                "channelPinsUpdate": false,
                "channelUpdate": false,
                "emojiCreate": false,
                "emojiDelete": false,
                "emojiUpdate": false,
                "guildBanAdd": false,
                "guildBanRemove": false,
                "guildIntegrationsUpdate": false,
                "guildMemberAdd": false,
                "guildMemberRemove": false,
                "guildMembersChunk": false,
                "guildUnavailable": false,
                "inviteCreate": false,
                "inviteDelete": false,
                "roleCreate": false,
                "roleDelete": false,
                "roleUpdate": false,
                "stageInstanceCreate": false,
                "stageInstanceDelete": false,
                "stageInstanceUpdate": false,
                "stickerCreate": false,
                "stickerDelete": false,
                "stickerUpdate": false,
                "threadCreate": false,
                "threadDelete": false,
                "threadUpdate": false,
                "webhookUpdate": false
            }).then(() => {
                module.exports.function.command.execute(interaction);
            });
        }
    }
};