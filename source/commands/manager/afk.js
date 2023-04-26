const { PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, set, remove } = require("firebase/database");

module.exports = {
    "enable": true,
    "name": "afk",
    "description": "Go AFK within your server.",
    "category": "manager",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "afk: set [message(String)], remove",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "description": module.exports.description,
        "description_localizations": {
            "th": "ไป AFK ภายในเซิร์ฟเวอร์ของคุณ"
        },
        "options": [
            {
                "type": 1,
                "name": "set",
                "name_localizations": {
                    "th": "ตั้ง"
                },
                "description": "Set your status to AFK.",
                "description_localizations": {
                    "th": "ตั้งสถานะของคุณเป็น AFK"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "message",
                        "name_localizations": {
                            "th": "ข้อความ"
                        },
                        "description": "The reason you'll be AFK.",
                        "description_localizations": {
                            "th": "เหตุผลที่คุณจะไม่อยู่ที่หน้าจอ (AFK)"
                        },
                        "required": false
                    }
                ]
            },
            {
                "type": 1,
                "name": "remove",
                "name_localizations": {
                    "th": "ลบ"
                },
                "description": "Unset your status to AFK.",
                "description_localizations": {
                    "th": "ยกเลิกตั้งสถานะของคุณเป็น AFK"
                }
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        const guildID = interaction.guild.id;
        const afkSnapshot = interaction.client.api.guilds[guildID].afk;
        const afkRef = child(child(ref(getDatabase(), "projects/shioru/guilds"), guildID), "afk");

        switch (subCommand) {
            case "set":
                if (afkSnapshot && afkSnapshot[interaction.user.id]) return await interaction.reply({ "content": interaction.client.translate.commands.afk.currently_afk, "ephemeral": true });

                const inputMessage = interaction.options.getString("message") ?? "";

                const nickname = interaction.member.nickname || interaction.user.username;

                await set(child(afkRef, interaction.user.id), {
                    "message": inputMessage,
                    "nickname": nickname
                });

                try {
                    await interaction.member.setNickname("[AFK] " + nickname);
                } catch (error) {
                    console.log(error);
                }

                await interaction.reply({ "content": interaction.client.translate.commands.afk.now_afk, "ephemeral": true });
                break;
            case "remove":
                if (!afkSnapshot || !afkSnapshot[interaction.user.id]) return await interaction.reply({ "content": interaction.client.translate.commands.afk.currently_not_afk, "ephemeral": true });

                try {
                    await interaction.member.setNickname(afkSnapshot[interaction.user.id].nickname);
                } catch (error) {
                    console.log(error);
                }

                await remove(afkRef, interaction.user.id);
                await interaction.reply({ "content": interaction.client.translate.commands.afk.now_not_afk, "ephemeral": true });
                break;
        }
    }
};