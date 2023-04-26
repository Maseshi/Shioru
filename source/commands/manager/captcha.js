const { PermissionsBitField } = require("discord.js");
const { getDatabase, ref, child, set } = require("firebase/database");

module.exports = {
    "enable": true,
    "name": "captcha",
    "description": "Setup the captcha verification system.",
    "category": "manager",
    "permissions": {
        "user": [PermissionsBitField.Flags.ModerateMembers],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ModerateMembers
        ]
    },
    "usage": "captcha <role> <captcha(String)>",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "description": module.exports.description,
        "description_localizations": {
            "th": "ตั้งค่าระบบตรวจสอบ captcha"
        },
        "options": [
            {
                "type": 1,
                "name": "setup",
                "name_localizations": {
                    "th": "ตั้งค่า"
                },
                "description": "Set up the Captcha system",
                "description_localizations": {
                    "th": "ตั้งค่าระบบ Captcha"
                },
                "options": [
                    {
                        "type": 8,
                        "name": "role",
                        "name_localizations": {
                            "th": "บทบาท"
                        },
                        "description": "Role or rank when confirmed.",
                        "description_localizations": {
                            "th": "บทบาทหรือยศเมื่อผ่านการยืนยัน"
                        },
                        "required": true
                    },
                    {
                        "type": 3,
                        "name": "captcha",
                        "description": "The name you want the captcha to generate.",
                        "description_localizations": {
                            "th": "ชื่อที่คุณต้องการให้ captcha สร้างขึ้นมา"
                        },
                        "required": true
                    }
                ]
            },
            {
                "type": 1,
                "name": "enable",
                "name_localizations": {
                    "th": "เปิด"
                },
                "description": "Enable the captcha system.",
                "description_localizations": {
                    "th": "เปิดใช้งานระบบ captcha"
                }
            },
            {
                "type": 1,
                "name": "disable",
                "name_localizations": {
                    "th": "ปิด"
                },
                "description": "Disable the captcha system.",
                "description_localizations": {
                    "th": "ปิดใช้งานระบบ captcha"
                }
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        const guildID = interaction.guild.id;
        const captchaSnapshot = interaction.client.api.guilds[guildID].captcha;
        const captchaRef = child(child(ref(getDatabase(), "projects/shioru/guilds"), guildID), "captcha");

        switch (subCommand) {
            case "setup":
                const inputRole = interaction.options.getRole("role");
                const inputCaptcha = interaction.options.getString("captcha");

                await set(captchaRef, {
                    "enable": true,
                    "role": inputRole.id,
                    "text": inputCaptcha
                });

                await interaction.reply(interaction.client.translate.commands.captcha.captcha_setup_success);
                break;
            case "enable":
                if (!captchaSnapshot) return await interaction.reply(interaction.client.translate.commands.captcha.need_to_setup_before);
                if (captchaSnapshot.enable) return await interaction.reply(interaction.client.translate.commands.captcha.currently_enable);

                await set(child(captchaRef, "enable"), true);
                await interaction.reply(interaction.client.translate.commands.captcha.enabled_captcha);
                break;
            case "disable":
                if (!captchaSnapshot) return await interaction.reply(interaction.client.translate.commands.captcha.need_to_setup_before);
                if (!captchaSnapshot.enable) return await interaction.reply(interaction.client.translate.commands.captcha.currently_disable);

                await set(child(captchaRef, "enable"), false);
                await interaction.reply(interaction.client.translate.commands.captcha.disabled_captcha);
                break;
        }
    }
}