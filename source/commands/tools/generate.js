const { AttachmentBuilder, PermissionsBitField } = require("discord.js");
const { catchError } = require("../../utils/consoleUtils")

module.exports = {
    "enable": true,
    "name": "generate",
    "description": "Use Ai to generate somethings",
    "category": "tools",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "generate: image <prompts(String)>",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "สร้าง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ใช้ Ai ในการสร้างบางอย่าง"
        },
        "options": [
            {
                "type": 1,
                "name": "images",
                "name_localizations": {
                    "th": "ภาพ"
                },
                "description": "Create an image using prompts.",
                "description_localizations": {
                    "th": "สร้างภาพขึ้นมาโดยใช้พร้อมท์"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "prompts",
                        "name_localizations": {
                            "th": "พร้อมท์"
                        },
                        "description": "Describe the image you want.",
                        "description_localizations": {
                            "th": "อธิบายเกี่ยวกับภาพที่คุณต้องการ"
                        },
                        "max_length": 1000,
                        "min_length": 1,
                        "required": true
                    },
                    {
                        "type": 4,
                        "name": "number",
                        "name_localizations": {
                            "th": "จำนวน"
                        },
                        "description": "The number of images to generate.",
                        "description_localizations": {
                            "th": "จำนวนภาพที่จะสร้าง"
                        },
                        "max_length": 10,
                        "min_length": 1
                    },
                    {
                        "type": 3,
                        "name": "size",
                        "name_localizations": {
                            "th": "ขนาด"
                        },
                        "description": "The size of the generated images.",
                        "description_localizations": {
                            "th": "จำนวนภาพที่จะสร้าง"
                        },
                        "choices": [
                            {
                                "name": "256x256",
                                "value": "256x256"
                            },
                            {
                                "name": "512x512",
                                "value": "512x512"
                            },
                            {
                                "name": "1024x1024",
                                "value": "1024x1024"
                            }
                        ]
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const inputPrompts = interaction.options.getString("prompts") ?? "";
        const inputNumber = interaction.options.getInteger("number") ?? 1;
        const inputSize = interaction.options.getString("size") ?? "1024x1024";

        if (!interaction.client.ai) return interaction.reply(interaction.client.translate.commands.generate.has_been_disabled);

        switch (subCommand) {
            case "images": {
                await interaction.reply(interaction.client.translate.commands.generate.generating_images);

                const attachmentImages = [];

                try {
                    const response = await interaction.client.ai.createImage({
                        "prompt": inputPrompts,
                        "n": inputNumber,
                        "size": inputSize,
                        "user": interaction.client.user.username
                    });
                    const images = response.data.data;

                    images.forEach((data) => attachmentImages.push(new AttachmentBuilder(data.url)));
                } catch (error) {
                    if (error.response) {
                        await interaction.editReply(interaction.client.translate.commands.generate.cannot_generate_image.replace("%s", error.response.status));
                        return catchError(interaction.client, interaction, module.exports.name, error.response.data, true);
                    } else {
                        return catchError(interaction.client, interaction, module.exports.name, error);
                    }
                }

                if (!attachmentImages.length) return await interaction.editReply(interaction.client.translate.commands.generate.breaking_the_rules);

                await interaction.editReply({
                    "content": interaction.client.translate.commands.generate.result_images.replace("%s1", inputSize).replace("%s2", inputPrompts),
                    "files": attachmentImages
                });
                break;
            }
        }
    }
};