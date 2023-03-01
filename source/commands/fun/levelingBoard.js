const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { levelSystem } = require("../../utils/databaseUtils");

module.exports = {
    "enable": true,
    "name": "levelingBoard",
    "description": "See the ranking of people with the most EXP and Level on the server.",
    "category": "fun",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "levelingBoard",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name.toLowerCase(),
        "name_localizations": {
            "en-US": "levelingboard",
            "th": "กระดานเลเวล"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "See the ranking of people with the most EXP and Level on the server.",
            "th": "ดูการจัดอันดับของผู้ที่มี EXP และเลเวลมากที่สุดบนเซิร์ฟเวอร์"
        }
    },
    async execute(interaction) {
        const map = [];
        const max = 10;
        const snapshot = await levelSystem(interaction.client, interaction, "GET/ALL");

        if (!snapshot) return await interaction.editReply(interaction.client.translate.commands.levelingBoard.no_info);

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
                            "value": interaction.client.translate.commands.levelingBoard.leveling_detail.replace("%s1", exp).replace("%s2", level)
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
        const clientAvatar = interaction.client.user.avatarURL();
        const clientUsername = interaction.client.user.username;
        const embed = new EmbedBuilder()
            .setColor(clientColor)
            .setTitle(interaction.client.translate.commands.levelingBoard.server_rank)
            .setAuthor({ "name": clientUsername, "iconURL": clientAvatar })
            .setThumbnail(userAvatar)
            .setDescription(interaction.client.translate.commands.levelingBoard.server_rank_description)
            .addFields(map)
            .setTimestamp()
            .setFooter({ "text": interaction.client.translate.commands.levelingBoard.server_rank_tips, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/electric-light-bulb_1f4a1.png" });

        await interaction.editReply({ "embeds": [embed] });
    }
}