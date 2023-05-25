const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { catchError } = require("../../utils/consoleUtils");

module.exports = {
    "enable": true,
    "name": "stats",
    "description": "Review the statistics of the bots.",
    "category": "me",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "stats",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "สถิติ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ตรวจดูข้อมูลสถิติของบอท"
        }
    },
    async execute(interaction) {
        const clientAvatar = interaction.client.user.displayAvatarURL();
        const clientUsername = interaction.client.user.username;
        const clientColor = interaction.guild.members.me.displayHexColor;
        const statsEmbed = new EmbedBuilder()
            .setColor(clientColor)
            .setAuthor({ "iconURL": clientAvatar, "name": clientUsername })
            .setThumbnail();

        if (interaction.client.shard && interaction.client.shard.count) {
            const promises = [
                interaction.client.shard.fetchClientValues("guilds.cache.size"),
                interaction.client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)),
            ];

            return Promise.all(promises)
                .then(async (results) => {
                    const totalGuilds = results[0].reduce((acc, guildCount) => acc + guildCount, 0);
                    const totalMembers = results[1].reduce((acc, memberCount) => acc + memberCount, 0);

                    statsEmbed.setFields(
                        [
                            {
                                "name": interaction.client.translate.commands.stats.server_count,
                                "value": totalGuilds.toString(),
                                "inline": true
                            },
                            {
                                "name": interaction.client.translate.commands.stats.member_count,
                                "value": totalMembers.toString(),
                                "inline": true
                            }
                        ]
                    );

                    return await interaction.reply({ "embeds": [statsEmbed] });
                })
                .catch((error) => {
                    catchError(interaction.client, interaction, module.exports.name, error)
                });
        } else {
            const totalGuilds = interaction.client.guilds.cache.size;
            const totalMembers = interaction.client.users.cache.size;

            statsEmbed.setFields(
                [
                    {
                        "name": interaction.client.translate.commands.stats.server_count,
                        "value": totalGuilds.toString(),
                        "inline": true
                    },
                    {
                        "name": interaction.client.translate.commands.stats.member_count,
                        "value": totalMembers.toString(),
                        "inline": true
                    }
                ]
            );

            await interaction.reply({ "embeds": [statsEmbed] });
        }
    }
}
