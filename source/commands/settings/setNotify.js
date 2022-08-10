const { EmbedBuilder } = require("discord.js");
const { getDatabase, ref, child, get, set } = require("firebase/database");

module.exports = {
    "name": "setNotify",
    "description": "Set up the notifications you want.",
    "category": "settings",
    "permissions": {
        "user": ["MANAGE_GUILD"],
        "client": ["SEND_MESSAGES"]
    }
}

module.exports.command = {
    "enable": true,
    "usage": "setNotify [option: set, remove] <type> <channel>",
    "aliases": ["notification", "การแจ้งเตือน"],
    async execute(client, message, args) {
        const input = args.join(" ");
        const inputType = args[0];
        const inputOption = args[1] ? args[1].toLowerCase() : "";
        const inputChannel = args[2];
    
        const guildID = message.guild.id;
        const prefix = client.config.prefix;
        const type = ["alert", "channelCreate", "channelDelete", "channelPinsUpdate", "channelUpdate", "emojiCreate", "emojiDelete", "emojiUpdate", "guildBanAdd", "guildBanRemove", "guildMemberAdd", "guildMemberRemove"];
        const dbRef = child(child(ref(getDatabase(), "Shioru/apps/discord/guilds"), guildID), "config/notification");
    
        get(dbRef).then(async snapshot => {
            if (snapshot.exists()) {
                const alert = snapshot.val().alert;
                const channelCreate = snapshot.val().channelCreate;
                const channelDelete = snapshot.val().channelDelete;
                const channelPinsUpdate = snapshot.val().channelPinsUpdate;
                const channelUpdate = snapshot.val().channelUpdate;
                const emojiCreate = snapshot.val().emojiCreate;
                const emojiDelete = snapshot.val().emojiDelete;
                const emojiUpdate = snapshot.val().emojiUpdate;
                const guildBanAdd = snapshot.val().guildBanAdd;
                const guildBanRemove = snapshot.val().guildBanRemove;
                const guildMemberAdd = snapshot.val().guildMemberAdd;
                const guildMemberRemove = snapshot.val().guildMemberRemove;
    
                if (!input) {
                    const clientFetch = await client.user.fetch();
                    const clientColor = clientFetch.accentColor;
                    const noInputEmbed = new EmbedBuilder()
                        .setTitle(client.translate.commands.notify.title)
                        .setDescription(
                            client.translate.commands.notify.description
                                .replace("%s1", (alert ? ("<#" + alert + ">") : client.translate.commands.notify.not_set))
                                .replace("%s2", (channelCreate ? ("<#" + channelCreate + ">") : client.translate.commands.notify.not_set))
                                .replace("%s3", (channelDelete ? ("<#" + channelDelete + ">") : client.translate.commands.notify.not_set))
                                .replace("%s4", (channelPinsUpdate ? ("<#" + channelPinsUpdate + ">") : client.translate.commands.notify.not_set))
                                .replace("%s5", (channelUpdate ? ("<#" + channelUpdate + ">") : client.translate.commands.notify.not_set))
                                .replace("%s6", (emojiCreate ? ("<#" + emojiCreate + ">") : client.translate.commands.notify.not_set))
                                .replace("%s7", (emojiDelete ? ("<#" + emojiDelete + ">") : client.translate.commands.notify.not_set))
                                .replace("%s8", (emojiUpdate ? ("<#" + emojiUpdate + ">") : client.translate.commands.notify.not_set))
                                .replace("%s9", (guildBanAdd ? ("<#" + guildBanAdd + ">") : client.translate.commands.notify.not_set))
                                .replace("%s10", (guildBanRemove ? ("<#" + guildBanRemove + ">") : client.translate.commands.notify.not_set))
                                .replace("%s11", (guildMemberAdd ? ("<#" + guildMemberAdd + ">") : client.translate.commands.notify.not_set))
                                .replace("%s12", (guildMemberRemove ? ("<#" + guildMemberRemove + ">") : client.translate.commands.notify.not_set))
                                .replace("%s13", (prefix + module.exports.help.usage))
                                .replace("%s14", ("/" + module.exports.help.usage))
                        )
                        .setColor(clientColor)
                        .setTimestamp()
                        .setFooter({ "text": client.translate.commands.notify.data_at });
    
                    return message.channel.send({
                        "embeds": [noInputEmbed]
                    });
                }
    
                switch (inputOption) {
                    case "set":
                        if (!inputType) return message.reply(client.translate.commands.notify.empty_type.replace("%s", type.join(", ")));
                        if (!type.includes(inputType)) return message.reply(client.translate.commands.notify.type_not_found.replace("%s", type.join(", ")));
                        if (!inputChannel) return message.reply(client.translate.commands.notify.empty_config_channel);
    
                        const channel = message.guild.channels.cache.find(channels => (channels.id === inputChannel) || (channels.name === inputChannel));
    
                        if (!channel) return message.reply(client.translate.commands.notify.channel_not_found);
    
                        set(child(dbRef, inputType), channel.id.toString()).then(() => {
                            message.channel.send(client.translate.commands.notify.set_success.replace("%s1", inputType).replace("%s2", channel.name));
                        });
                        break;
                    case "remove":
                        if (!inputType) return message.reply(client.translate.commands.notify.empty_type.replace("%s", type.join(", ")));
                        if (!type.includes(inputType)) return message.reply(client.translate.commands.notify.type_not_found.replace("%s", type.join(", ")));
    
                        set(child(dbRef, inputType), false).then(() => {
                            message.channel.send(client.translate.commands.notify.remove_success.replace("%s", inputType));
                        });
                        break;
                    default:
                        return message.reply(client.translate.commands.notify.invalid_options.replace("%s", inputOption));
                }
            } else {
                set(dbRef, {
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
                    "guildMemberAdd": false,
                    "guildMemberRemove": false
                }).then(() => {
                    module.exports.run(client, message, args);
                });
            }
        });
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name.toLowerCase(),
        "name_localizations": {
            "en-US": "notify",
            "th": "การแจ้งเตือน"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Set up the notifications you want.",
            "th": "ตั้งค่าการแจ้งเตือนที่คุณต้องการ"
        },
        "options": [
            {
                "type": 1,
                "name": "info",
                "name_localizations": {
                    "th": "ข้อมูล"
                },
                "description": "Receive information about each channel's notification.",
                "description_localizations": {
                    "th": "รับข้อมูลการแจ้งเตือนของแต่ละช่อง"
                },
                "required": false
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
                "required": false,
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
                        "required": true,
                        "choices": [
                            {
                                "name": "General",
                                "name_localizations": {
                                    "th": "ทั่วไป"
                                },
                                "value": "alert"
                            },
                            {
                                "name": "Channel (Create)",
                                "name_localizations": {
                                    "th": "ช่อง (สร้าง)"
                                },
                                "value": "channelCreate"
                            },
                            {
                                "name": "Channel (Delete)",
                                "name_localizations": {
                                    "th": "ช่อง (ลบ)"
                                },
                                "value": "channelDelete"
                            },
                            {
                                "name": "Channel (Pins Update)",
                                "name_localizations": {
                                    "th": "ช่อง (อัปเดตพิน)"
                                },
                                "value": "channelPinsUpdate"
                            },
                            {
                                "name": "Channel (Update)",
                                "name_localizations": {
                                    "th": "ช่อง (อัพเดท)"
                                },
                                "value": "channelUpdate"
                            },
                            {
                                "name": "Emoji (Create)",
                                "name_localizations": {
                                    "th": "อีโมจิ (สร้าง)"
                                },
                                "value": "emojiCreate"
                            },
                            {
                                "name": "Emoji (Delete)",
                                "name_localizations": {
                                    "th": "อีโมจิ (ลบ)"
                                },
                                "value": "emojiDelete"
                            },
                            {
                                "name": "Emoji (Update)",
                                "name_localizations": {
                                    "th": "อีโมจิ (อัพเดท)"
                                },
                                "value": "emojiUpdate"
                            },
                            {
                                "name": "Guild (Members Join)",
                                "name_localizations": {
                                    "th": "เซิร์ฟเวอร์ (สมาชิกเข้าร่วม)"
                                },
                                "value": "guildMemberAdd"
                            },
                            {
                                "name": "Guild (Members Leave)",
                                "name_localizations": {
                                    "th": "เซิร์ฟเวอร์ (สมาชิกออก)"
                                },
                                "value": "guildMemberRemove"
                            }
                        ]
                    },
                    {
                        "type": 7,
                        "name": "channel",
                        "name_localizations": {
                            "th": "ช่อง"
                        },
                        "description": "The channel you want to set the notification.",
                        "description_localizations": {
                            "th": "ช่องที่คุณต้องการตั้งค่าการแจ้งเตือน"
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
                "required": false,
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
                        "required": true,
                        "choices": [
                            {
                                "name": "General",
                                "name_localizations": {
                                    "th": "ทั่วไป"
                                },
                                "value": "alert"
                            },
                            {
                                "name": "Channel (Create)",
                                "name_localizations": {
                                    "th": "ช่อง (สร้าง)"
                                },
                                "value": "channelCreate"
                            },
                            {
                                "name": "Channel (Delete)",
                                "name_localizations": {
                                    "th": "ช่อง (ลบ)"
                                },
                                "value": "channelDelete"
                            },
                            {
                                "name": "Channel (Pins Update)",
                                "name_localizations": {
                                    "th": "ช่อง (อัปเดตพิน)"
                                },
                                "value": "channelPinsUpdate"
                            },
                            {
                                "name": "Channel (Update)",
                                "name_localizations": {
                                    "th": "ช่อง (อัพเดท)"
                                },
                                "value": "channelUpdate"
                            },
                            {
                                "name": "Emoji (Create)",
                                "name_localizations": {
                                    "th": "อีโมจิ (สร้าง)"
                                },
                                "value": "emojiCreate"
                            },
                            {
                                "name": "Emoji (Delete)",
                                "name_localizations": {
                                    "th": "อีโมจิ (ลบ)"
                                },
                                "value": "emojiDelete"
                            },
                            {
                                "name": "Emoji (Update)",
                                "name_localizations": {
                                    "th": "อีโมจิ (อัพเดท)"
                                },
                                "value": "emojiUpdate"
                            },
                            {
                                "name": "Ban (Add)",
                                "name_localizations": {
                                    "th": "แบน (เพิ่ม)"
                                },
                                "value": "guildBanAdd"
                            },
                            {
                                "name": "Ban (Remove)",
                                "name_localizations": {
                                    "th": "แบน (ปลด)"
                                },
                                "value": "guildBanAdd"
                            },
                            {
                                "name": "Guild (Members Join)",
                                "name_localizations": {
                                    "th": "เซิร์ฟเวอร์ (สมาชิกเข้าร่วม)"
                                },
                                "value": "guildMemberAdd"
                            },
                            {
                                "name": "Guild (Members Leave)",
                                "name_localizations": {
                                    "th": "เซิร์ฟเวอร์ (สมาชิกออก)"
                                },
                                "value": "guildMemberRemove"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const inputType = interaction.options.get("type");
        const inputChannel = interaction.options.get("channel");

        const guildID = interaction.guild.id;
        const prefix = interaction.client.config.prefix;
        const dbRef = child(child(ref(getDatabase(), "Shioru/apps/discord/guilds"), guildID), "config/notification");

        get(dbRef).then(async snapshot => {
            if (snapshot.exists()) {
                const alert = snapshot.val().alert;
                const channelCreate = snapshot.val().channelCreate;
                const channelDelete = snapshot.val().channelDelete;
                const channelPinsUpdate = snapshot.val().channelPinsUpdate;
                const channelUpdate = snapshot.val().channelUpdate;
                const emojiCreate = snapshot.val().emojiCreate;
                const emojiDelete = snapshot.val().emojiDelete;
                const emojiUpdate = snapshot.val().emojiUpdate;
                const guildBanAdd = snapshot.val().guildBanAdd;
                const guildBanRemove = snapshot.val().guildBanRemove;
                const guildMemberAdd = snapshot.val().guildMemberAdd;
                const guildMemberRemove = snapshot.val().guildMemberRemove;

                if (subCommand === "info") {
                    const clientFetch = await interaction.client.user.fetch();
                    const clientColor = clientFetch.accentColor;
                    const noInputEmbed = new EmbedBuilder()
                        .setTitle(interaction.client.translate.commands.notify.title)
                        .setDescription(
                            interaction.client.translate.commands.notify.description
                                .replace("%s1", (alert ? ("<#" + alert + ">") : interaction.client.translate.commands.notify.not_set))
                                .replace("%s2", (channelCreate ? ("<#" + channelCreate + ">") : interaction.client.translate.commands.notify.not_set))
                                .replace("%s3", (channelDelete ? ("<#" + channelDelete + ">") : interaction.client.translate.commands.notify.not_set))
                                .replace("%s4", (channelPinsUpdate ? ("<#" + channelPinsUpdate + ">") : interaction.client.translate.commands.notify.not_set))
                                .replace("%s5", (channelUpdate ? ("<#" + channelUpdate + ">") : interaction.client.translate.commands.notify.not_set))
                                .replace("%s6", (emojiCreate ? ("<#" + emojiCreate + ">") : interaction.client.translate.commands.notify.not_set))
                                .replace("%s7", (emojiDelete ? ("<#" + emojiDelete + ">") : interaction.client.translate.commands.notify.not_set))
                                .replace("%s8", (emojiUpdate ? ("<#" + emojiUpdate + ">") : interaction.client.translate.commands.notify.not_set))
                                .replace("%s9", (guildBanAdd ? ("<#" + guildBanAdd + ">") : interaction.client.translate.commands.notify.not_set))
                                .replace("%s10", (guildBanRemove ? ("<#" + guildBanRemove + ">") : interaction.client.translate.commands.notify.not_set))
                                .replace("%s11", (guildMemberAdd ? ("<#" + guildMemberAdd + ">") : interaction.client.translate.commands.notify.not_set))
                                .replace("%s12", (guildMemberRemove ? ("<#" + guildMemberRemove + ">") : interaction.client.translate.commands.notify.not_set))
                                .replace("%s13", (prefix + module.exports.help.usage))
                                .replace("%s14", ("/" + module.exports.help.usage))
                        )
                        .setColor(clientColor)
                        .setTimestamp()
                        .setFooter({ "text": interaction.client.translate.commands.notify.data_at });

                    return await interaction.editReply({ "embeds": [noInputEmbed] });
                }

                if (subCommand === "set") {
                    const channel = interaction.guild.channels.cache.find(channels => (channels.id === inputChannel.value) || (channels.name === inputChannel.value));

                    if (!channel) return await interaction.editReply(interaction.client.translate.commands.notify.channel_not_found);

                    await set(child(dbRef, inputType.value), channel.id.toString());
                    await interaction.editReply(interaction.client.translate.commands.notify.set_success.replace("%s1", inputType.value).replace("%s2", channel.name));
                }

                if (subCommand === "remove") {
                    await set(child(dbRef, inputType.value), false);
                    await interaction.editReply(interaction.client.translate.commands.notify.remove_success.replace("%s", inputType.value));
                }
            } else {
                set(dbRef, {
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
                    "guildMemberAdd": false,
                    "guildMemberRemove": false
                }).then(() => {
                    module.exports.interaction.execute(interaction);
                });
            }
        });
    }
};