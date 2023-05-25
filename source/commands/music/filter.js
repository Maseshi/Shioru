const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "filter",
    "description": "Add more powerful filters to your music.",
    "category": "music",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "filter: add <filter(String)>, remove <filter(String)>, set <filter(String)>, list, now, clear",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ฟิลเตอร์"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ใส่ฟิลเตอร์ในเพลงของคุณให้มีพลังมากขึ้น"
        },
        "options": [
            {
                "type": 1,
                "name": "add",
                "name_localizations": {
                    "th": "เพิ่ม"
                },
                "description": "Add a filter to the queue.",
                "description_localizations": {
                    "th": "เพิ่มฟิลเตอร์เข้าไปในคิว"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "filter",
                        "name_localizations": {
                            "th": "ฟิลเตอร์"
                        },
                        "description": "The filters you want to use.",
                        "description_localizations": {
                            "th": "รูปแบบเสียงที่คุณต้องการใช้ คุณสามารถระบุเพิ่มเติมได้โดยใช้ \",\" สำหรับรุปแบบหลายรายการ"
                        },
                        "required": true
                    }
                ]
            },
            {
                "type": 1,
                "name": "remove",
                "name_localizations": {
                    "th": "ลบ"
                },
                "description": "Remove the filter in the queue.",
                "description_localizations": {
                    "th": "ลบฟิลเตอร์ในคิว"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "filter",
                        "name_localizations": {
                            "th": "ฟิลเตอร์"
                        },
                        "description": "The filters you want to use.",
                        "description_localizations": {
                            "th": "รูปแบบเสียงที่คุณต้องการใช้ คุณสามารถระบุเพิ่มเติมได้โดยใช้ \",\" สำหรับรุปแบบหลายรายการ"
                        },
                        "required": true
                    }
                ]
            },
            {
                "type": 1,
                "name": "set",
                "name_localizations": {
                    "th": "ตั้ง"
                },
                "description": "Set all new queue filters.",
                "description_localizations": {
                    "th": "ตั้งค่าฟิลเตอร์ในคิวใหม่ทั้งหมด"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "filter",
                        "name_localizations": {
                            "th": "ฟิลเตอร์"
                        },
                        "description": "The filters you want to use.",
                        "description_localizations": {
                            "th": "รูปแบบเสียงที่คุณต้องการใช้ คุณสามารถระบุเพิ่มเติมได้โดยใช้ \",\" สำหรับรุปแบบหลายรายการ"
                        },
                        "required": true
                    }
                ]
            },
            {
                "type": 1,
                "name": "list",
                "name_localizations": {
                    "th": "รายการ"
                },
                "description": "See all supported filters.",
                "description_localizations": {
                    "th": "ดูฟิลเตอร์ทั้งหมดที่รองรับ"
                }
            },
            {
                "type": 1,
                "name": "now",
                "name_localizations": {
                    "th": "ตอนนี้"
                },
                "description": "View filters that are currently queued.",
                "description_localizations": {
                    "th": "ดูฟิลเตอร์ที่อยู่คิวตอนนี้"
                }
            },
            {
                "type": 1,
                "name": "clear",
                "name_localizations": {
                    "th": "ล้าง"
                },
                "description": "Remove all filters in the queue.",
                "description_localizations": {
                    "th": "ลบฟิลเตอร์ทั้งหมดในคิว"
                }
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();
        const inputFilters = interaction.options.getString("filter") ?? "";

        const queue = interaction.client.music.getQueue(interaction);
        const filterString = inputFilters.split(",").map(value => value.toLowerCase());
        const filterList = Object.keys(interaction.client.music.filters);
        const filterEmbed = {
            "content": interaction.client.translate.commands.filter.sound_filtering,
            "embeds": [
                new EmbedBuilder()
                    .setTitle(interaction.client.translate.commands.filter.available_filter)
                    .setDescription(interaction.client.translate.commands.filter.available_filter_description.replace("%s1", filterList.length).replace("%s2", filterList.join(", ")))
                    .setColor("Blue")
            ]
        };

        const checkFilters = (filters) => {
            let count = 0;
            const validFilters = [];
            const invalidFilters = [];

            for (const filter of filters) {
                if (filterList.includes(filter)) {
                    count++;
                    validFilters.push(filter);
                } else {
                    count++;
                    invalidFilters.push(filter);
                }

                if (count === filters.length) {
                    return {
                        "valid": validFilters,
                        "invalid": invalidFilters
                    };
                }
            }
        };

        if (!queue) return await interaction.reply(interaction.client.translate.commands.filter.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.reply(interaction.client.translate.commands.filter.not_queue_owner);

        switch (subCommand) {
            case "add": {
                if (!filterString.length) return await interaction.reply(filterEmbed);
                if (checkFilters(filterString).invalid.length > 0) return await interaction.reply(interaction.client.translate.commands.filter.unknown_filter.replace("%s", checkFilters(filterString).invalid.join(", ")));

                await queue.filters.add(filterString);
                await interaction.reply(interaction.client.translate.commands.filter.add_filter.replace("%s", filterString.join(", ")));
                break;
            }
            case "remove": {
                if (!filterString.length) return await interaction.reply(filterEmbed);
                if (checkFilters(filterString).invalid.length > 0) return await interaction.reply(interaction.client.translate.commands.filter.unknown_filter.replace("%s", checkFilters(filterString).invalid.join(", ")));

                await queue.filters.remove(filterString);
                await interaction.reply(interaction.client.translate.commands.filter.remove_filter.replace("%s", filterString.join(", ")));
                break;
            }
            case "set": {
                if (!filterString.length) return await interaction.reply(filterEmbed);
                if (checkFilters(filterString).invalid.length > 0) return await interaction.reply(interaction.client.translate.commands.filter.unknown_filter.replace("%s", checkFilters(filterString).invalid.join(", ")));

                await queue.filters.set(filterString);
                await interaction.reply(interaction.client.translate.commands.filter.set_filter.replace("%s", filterString.join(", ")));
                break;
            }
            case "list": {
                const availableEmbed = new EmbedBuilder()
                    .setTitle(interaction.client.translate.commands.filter.available_filter)
                    .setDescription(interaction.client.translate.commands.filter.available_filter_description.replace("%s1", filterList.length).replace("%s2", filterList))
                    .setColor("Green");

                await interaction.reply({
                    "content": interaction.client.translate.commands.filter.sound_filtering,
                    "embeds": [availableEmbed]
                });
                break;
            }
            case "now": {
                const filtersName = queue.filters.names.join(", ");
                const filtersSize = queue.filters.names.length;
                const listEmbed = new EmbedBuilder()
                    .setTitle(interaction.client.translate.commands.filter.list_filter_title)
                    .setDescription(filtersSize ? interaction.client.translate.commands.filter.list_filter_description.replace("%s1", filtersSize).replace("%s2", filtersName) : interaction.client.translate.commands.filter.list_filter_description_empty)
                    .setColor("Blue");

                await interaction.reply({ "embeds": [listEmbed] });
                break;
            }
            case "clear": {
                await queue.filters.clear();
                await interaction.reply(interaction.client.translate.commands.filter.clear_filter);
                break;
            }
            default: {
                return await interaction.reply(interaction.client.translate.commands.filter.unknown_input_option);
            }
        }
    }
};