const { EmbedBuilder } = require("discord.js");

module.exports = {
    "name": "filter",
    "description": "Filter your music to be more powerful.",
    "category": "music",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "filter <option> <filters>",
    "aliases": ["กรอง", "bass", "filters"],
    async execute(client, message, args) {
        const inputOption = args[0];
        const inputFilters = args.slice(1).map(value => value.toLowerCase());

        const queue = client.music.getQueue(message);
        const filterList = Object.keys(client.music.filters);
        const filterEmbed = {
            "content": client.translate.commands.filter.sound_filtering,
            "embeds": [
                new EmbedBuilder()
                    .setTitle(client.translate.commands.filter.available_filter)
                    .setDescription(client.translate.commands.filter.available_filter_description.replace("%s1", filterList.length).replace("%s2", filterList.join(", ")))
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

        if (!queue) return message.reply(client.translate.commands.filter.no_queue);
        if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.filter.not_queue_owner);

        switch (inputOption) {
            case "add":
                if (!inputFilters) return message.reply(filterEmbed);

                const addCheck = checkFilters(inputFilters);
                if (addCheck.invalid.length > 0) return message.reply(client.translate.commands.filter.unknown_filter.replace("%s", addCheck.invalid.join(", ")));

                await queue.filters.add(inputFilters);
                message.channel.send(client.translate.commands.filter.add_filter.replace("%s", inputFilters.join(", ")));
                break;
            case "rm":
            case "remove":
                if (!inputFilters) return message.reply(filterEmbed);

                const removeCheck = checkFilters(inputFilters);
                if (removeCheck.invalid.length > 0) return message.reply(client.translate.commands.filter.unknown_filter.replace("%s", removeCheck.invalid.join(", ")));

                await queue.filters.remove(inputFilters);
                message.channel.send(client.translate.commands.filter.remove_filter.replace("%s", inputFilters.join(", ")));
                break;
            case "set":
                if (!inputFilters) return message.reply(filterEmbed);

                const setCheck = checkFilters(inputFilters);
                if (setCheck.invalid.length > 0) return message.reply(client.translate.commands.filter.unknown_filter.replace("%s", setCheck.invalid.join(", ")));

                await queue.filters.set(inputFilters);
                message.channel.send(client.translate.commands.filter.set_filter.replace("%s", inputFilters.join(", ")));
                break;
            case "ava":
            case "available":
                const availableEmbed = new EmbedBuilder()
                    .setTitle(client.translate.commands.filter.available_filter)
                    .setDescription(client.translate.commands.filter.available_filter_description.replace("%s1", filterList.length).replace("%s2", filterList))
                    .setColor("Green");

                message.reply({
                    "content": client.translate.commands.filter.sound_filtering,
                    "embeds": [availableEmbed]
                });
                break;
            case "l":
            case "list":
                const filtersName = queue.filters.names.join(", ");
                const filtersSize = queue.filters.names.length;
                const listEmbed = new EmbedBuilder()
                    .setTitle(client.translate.commands.filter.list_filter_title)
                    .setDescription(filtersSize ? client.translate.commands.filter.list_filter_description.replace("%s1", filtersSize).replace("%s2", filtersName) : client.translate.commands.filter.list_filter_description_empty)
                    .setColor("Blue");

                message.channel.send({
                    "embeds": [listEmbed]
                });
                break;
            case "clr":
            case "cle":
            case "clear":
                await queue.filters.clear();
                message.channel.send(client.translate.commands.filter.clear_filter);
                break;
            default:
                return message.reply(client.translate.commands.filter.unknown_input_option);
        }
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "filter",
            "th": "กรอง"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Filter your music to be more powerful.",
            "th": "กรองเพลงของคุณให้มีพลังมากขึ้น"
        },
        "options": [
            {
                "type": 3,
                "name": "option",
                "name_localizations": {
                    "th": "ตัวเลือก"
                },
                "description": "Options for filter actions",
                "description_localizations": {
                    "th": "ตัวเลือกสำหรับการกระทำเกี่ยวกับตัวกรอง"
                },
                "required": true,
                "choices": [
                    {
                        "name": "add",
                        "value": "add",
                    },
                    {
                        "name": "remove",
                        "value": "remove",
                    },
                    {
                        "name": "set",
                        "value": "set",
                    },
                    {
                        "name": "available",
                        "value": "available",
                    },
                    {
                        "name": "list",
                        "value": "list",
                    },
                    {
                        "name": "clear",
                        "value": "clear",
                    },
                ]
            },
            {
                "type": 3,
                "name": "filters",
                "name_localizations": {
                    "th": "ตัวกรอง"
                },
                "description": "The filters you want to use.",
                "description_localizations": {
                    "th": "รูปแบบเสียงที่คุณต้องการใช้ คุณสามารถระบุเพิ่มเติมได้โดยใช้ \",\" สำหรับรุปแบบหลายรายการ"
                }
            }
        ]
    },
    async execute(interaction) {
        const inputOption = interaction.options.get("option").value;
        const inputFilters = interaction.options.get("filters").value.split(",").map(value => value.toLowerCase());

        const queue = interaction.client.music.getQueue(message);
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

        if (!queue) return interaction.editReply(interaction.client.translate.commands.filter.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return interaction.editReply(interaction.client.translate.commands.filter.not_queue_owner);

        switch (inputOption) {
            case "add":
                if (!inputFilters) return interaction.editReply(filterEmbed);

                const addCheck = checkFilters(inputFilters);
                if (addCheck.invalid.length > 0) return interaction.editReply(interaction.client.translate.commands.filter.unknown_filter.replace("%s", addCheck.invalid.join(", ")));

                await queue.filters.add(inputFilters);
                interaction.editReply(interaction.client.translate.commands.filter.add_filter.replace("%s", inputFilters.join(", ")));
                break;
            case "remove":
                if (!inputFilters) return interaction.editReply(filterEmbed);

                const removeCheck = checkFilters(inputFilters);
                if (removeCheck.invalid.length > 0) return interaction.editReply(interaction.client.translate.commands.filter.unknown_filter.replace("%s", removeCheck.invalid.join(", ")));

                await queue.filters.remove(inputFilters);
                interaction.editReply(interaction.client.translate.commands.filter.remove_filter.replace("%s", inputFilters.join(", ")));
                break;
            case "set":
                if (!inputFilters) return interaction.editReply(filterEmbed);

                const setCheck = checkFilters(inputFilters);
                if (setCheck.invalid.length > 0) return interaction.editReply(interaction.client.translate.commands.filter.unknown_filter.replace("%s", setCheck.invalid.join(", ")));

                await queue.filters.set(inputFilters);
                interaction.editReply(interaction.client.translate.commands.filter.set_filter.replace("%s", inputFilters.join(", ")));
                break;
            case "available":
                const availableEmbed = new EmbedBuilder()
                    .setTitle(interaction.client.translate.commands.filter.available_filter)
                    .setDescription(interaction.client.translate.commands.filter.available_filter_description.replace("%s1", filterList.length).replace("%s2", filterList))
                    .setColor("Green");

                interaction.editReply({
                    "content": interaction.client.translate.commands.filter.sound_filtering,
                    "embeds": [availableEmbed]
                });
                break;
            case "list":
                const filtersName = queue.filters.names.join(", ");
                const filtersSize = queue.filters.names.length;
                const listEmbed = new EmbedBuilder()
                    .setTitle(interaction.client.translate.commands.filter.list_filter_title)
                    .setDescription(filtersSize ? interaction.client.translate.commands.filter.list_filter_description.replace("%s1", filtersSize).replace("%s2", filtersName) : interaction.client.translate.commands.filter.list_filter_description_empty)
                    .setColor("Blue");

                interaction.editReply({
                    "embeds": [listEmbed]
                });
                break;
            case "clear":
                await queue.filters.clear();
                interaction.editReply(interaction.client.translate.commands.filter.clear_filter);
                break;
            default:
                return interaction.editReply(interaction.client.translate.commands.filter.unknown_input_option);
        }
    }
};