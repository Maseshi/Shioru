const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    "enable": true,
    "name": "unban",
    "description": "Stop banning members who are banned in the server.",
    "category": "manager",
    "permissions": {
        "user": [PermissionsBitField.Flags.BanMembers],
        "client": [
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.BanMembers
        ]
    },
    "usage": "unban <member(String)> [reason(String)]",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "ปลดแบน"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ปลดแบนสมาชิกที่ถูกแบนในเซิร์ฟเวอร์"
        },
        "options": [
            {
                "type": 3,
                "name": "member",
                "name_localizations": {
                    "th": "สมาชิก"
                },
                "description": "Members who want to unban.",
                "description_localizations": {
                    "th": "สมาชิกที่ต้องการปลดแบน"
                },
                "required": true
            },
            {
                "type": 3,
                "name": "reason",
                "name_localizations": {
                    "th": "เหตุผล"
                },
                "description": "The reason for the unban.",
                "description_localizations": {
                    "th": "เหตุผลสำหรับการปลดแบน"
                },
                "required": false
            }
        ]
    },
    async execute(interaction) {
        const inputMember = interaction.options.getString("member");
        const inputReason = interaction.options.getString("reason") ?? interaction.client.translate.commands.unban.no_reason;

        const banned = await interaction.guild.bans.fetch(inputMember.id);

        if (banned.length <= 0) return await interaction.reply(interaction.client.translate.commands.unban.no_one_gets_banned);

        const bannedUser = banned.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));

        if (!bannedUser) return await interaction.reply(interaction.client.translate.commands.unban.this_user_not_banned);

        await interaction.guild.bans.remove(bannedUser.user, { "reason": inputReason });

        const authorUsername = interaction.user.username;
        const memberUsername = bannedUser.user.username;
        const memberID = bannedUser.user.id;
        const memberAvatar = bannedUser.user.avatar;
        const memberAvatarURL = "https://cdn.discordapp.com/avatars/" + memberID + "/" + memberAvatar + ".png";

        const unbanEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.unban.user_has_been_unbanned.replace("%s", memberUsername))
            .setDescription(interaction.client.translate.commands.unban.reason_for_unban.replace("%s1", authorUsername).replace("%s2", inputReason))
            .setColor("Green")
            .setTimestamp()
            .setThumbnail(memberAvatarURL);

        await interaction.reply({ "embeds": [unbanEmbed] });
    }
};