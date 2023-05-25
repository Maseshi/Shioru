const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { levelSystem } = require("../../utils/databaseUtils");

module.exports = {
    "enable": true,
    "name": "board",
    "description": "View the ranking on this server.",
    "category": "fun",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "board: level",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "จัดอันดับ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ดูการจัดอันดับบนเซิร์ฟเวอร์นี้"
        },
        "options": [
            {
                "type": 1,
                "name": "level",
                "name_localizations": {
                    "th": "เลเวล"
                },
                "description": "See the ranking of people with the most EXP and Level on the server.",
                "description_localizations": {
                    "th": "ดูการจัดอันดับของผู้ที่มี EXP และเลเวลมากที่สุดบนเซิร์ฟเวอร์"
                }
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case "level": {
                const map = [];
                const max = 10;
                const snapshot = await levelSystem(interaction.client, interaction, "GET/ALL");

                if (!snapshot) return await interaction.reply(interaction.client.translate.commands.board.no_info);

                for (const users in snapshot) {
                    const member = interaction.guild.members.cache.find(members => (members.id === users));

                    if (member) {
                        if (!member.user.bot) {
                            const leveling = snapshot[member.user.id].leveling;

                            if (leveling) {
                                const exp = leveling.exp;
                                const level = leveling.level;

                                map.push({
                                    "data": {
                                        "exp": exp,
                                        "level": level,
                                        "avatar": member.user.displayAvatarURL()
                                    },
                                    "name": member.user.username,
                                    "value": interaction.client.translate.commands.board.leveling_detail.replace("%s1", exp).replace("%s2", level)
                                });
                            }
                        }
                    }
                }

                map.sort((userA, userB) => userB.data.level - userA.data.level || userB.data.exp - userA.data.exp);

                const userAvatar = map[0].data.avatar;

                for (let i = 0; i < map.length; i++) {
                    if (!map[i]) return;
                    if (i === max) return;

                    delete map[i].data;
                    map[i].name = (i + 1) + ". " + map[i].name;
                }

                const clientColor = interaction.guild.members.me.displayHexColor;
                const clientAvatar = interaction.client.user.displayAvatarURL();
                const clientUsername = interaction.client.user.username;
                const embed = new EmbedBuilder()
                    .setColor(clientColor)
                    .setAuthor({ "name": clientUsername, "iconURL": clientAvatar })
                    .setTitle(interaction.client.translate.commands.board.server_rank)
                    .setDescription(interaction.client.translate.commands.board.server_rank_description)
                    .setThumbnail(userAvatar)
                    .addFields(map)
                    .setFooter({ "text": interaction.client.translate.commands.board.server_rank_tips })
                    .setTimestamp();

                await interaction.reply({ "embeds": [embed] });
                break;
            }
        }
    }
}