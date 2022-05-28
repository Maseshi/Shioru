module.exports.run = (client, message, args) => {
    const inputOption = args[0];
    const queue = client.music.getQueue(message);
    const filterList = Object.keys(client.music.filters);

    if (!queue) return message.reply(client.translate.commands.filter.no_queue);
    if (message.author.id !== queue.songs[0].user.id && queue.autoplay === false) return message.reply(client.translate.commands.filter.not_queue_owner);
    if (!inputOption) return message.reply({
        "content": client.translate.commands.filter.sound_filtering,
        "embeds": [
            {
                "title": client.translate.commands.filter.available_filter,
                "description": client.translate.commands.filter.available_filter_description.replace("%s1", filterList.length).replace("%s2", filterList),
                "color": 14684245
            }
        ]
    });
    if (!filterList.includes(inputOption.toLowerCase())) return message.reply(client.translate.commands.filter.unavailable_filter);

    queue.filter = inputOption.toLowerCase();
    client.music.setFilter(message, inputOption.toLowerCase());
    message.channel.send(client.translate.commands.filter.filter_changed.replace("%s", (inputOption || client.translate.commands.filter.off)));
};

module.exports.help = {
    "name": "filter",
    "description": "Filter your music to be more powerful.",
    "usage": "filter <option>",
    "category": "music",
    "aliases": ["กรอง", "bass"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "filter",
            "th": "กรอง"
        },
        "description": module.exports.help.description,
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
                "description": "The filter option you want to use.",
                "description_localizations": {
                    "th": "ตัวเลือกตัวกรองที่คุณต้องการใช้"
                },
                "required": true,
                "choices": [
                    {
                        "name": "3D",
                        "value": "3d"
                    },
                    {
                        "name": "8D",
                        "value": "8d"
                    },
                    {
                        "name": "BassBoost",
                        "value": "bassboost"
                    },
                    {
                        "name": "Clear",
                        "value": "clear"
                    },
                    {
                        "name": "Earwax",
                        "value": "earwax"
                    },
                    {
                        "name": "Echo",
                        "value": "echo"
                    },
                    {
                        "name": "Flanger",
                        "value": "flanger"
                    },
                    {
                        "name": "Gate",
                        "value": "gate"
                    },
                    {
                        "name": "Haas",
                        "value": "haas"
                    },
                    {
                        "name": "Karaoke",
                        "value": "karaoke"
                    },
                    {
                        "name": "LowBass",
                        "value": "lowbass"
                    },
                    {
                        "name": "MCompand",
                        "value": "mcompand"
                    },
                    {
                        "name": "Nightcore",
                        "value": "nightcore"
                    },
                    {
                        "name": "Normalizer",
                        "value": "normalizer"
                    },
                    {
                        "name": "Phaser",
                        "value": "phaser"
                    },
                    {
                        "name": "Pulsator",
                        "value": "pulsator"
                    },
                    {
                        "name": "PureBass",
                        "value": "purebass"
                    },
                    {
                        "name": "Reverse",
                        "value": "reverse"
                    },
                    {
                        "name": "SubBoost",
                        "value": "subboost"
                    },
                    {
                        "name": "Surround",
                        "value": "surround"
                    },
                    {
                        "name": "Surrounding",
                        "value": "surrounding"
                    },
                    {
                        "name": "Treble",
                        "value": "treble"
                    },
                    {
                        "name": "Tremolo",
                        "value": "tremolo"
                    },
                    {
                        "name": "VaporWave",
                        "value": "vaporwave"
                    },
                    {
                        "name": "Vibrato",
                        "value": "vibrato"
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const inputOption = interaction.options.get("option").value;
        const queue = interaction.client.music.getQueue(interaction);

        if (!queue) return await interaction.editReply(interaction.client.translate.commands.filter.no_queue);
        if (interaction.user.id !== queue.songs[0].user.id && queue.autoplay === false) return await interaction.editReply(interaction.client.translate.commands.filter.not_queue_owner);

        queue.filter = inputOption.toLowerCase();
        interaction.client.music.setFilter(interaction, inputOption);
        await interaction.editReply(interaction.client.translate.commands.filter.filter_changed.replace("%s", (inputOption || interaction.client.translate.commands.filter.off)));
    }
};