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
    "usage": "unban <member: id, username, tag> (reason)",
    "function": {
        "command": {}
    }
}

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "en-US": "unban",
            "th": "ปลดแบน"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Stop banning members who are banned in the server.",
            "th": "ปลดแบนสมาชิกที่ถูกแบนในเซิร์ฟเวอร์"
        },
        "options": [
            {
                "type": 6,
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
        const inputMember = interaction.options.get("member").value;
        let inputReason = interaction.options.get("reason");

        const banned = await interaction.guild.bans.fetch();

        if (banned.length <= 0) return await interaction.editReply(interaction.client.translate.commands.unban.no_one_gets_banned);

        const bannedUser = banned.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));

        if (!bannedUser) return await interaction.editReply(interaction.client.translate.commands.unban.this_user_not_banned);
        if (!inputReason) inputReason = "";

        interaction.guild.bans.remove(bannedUser.user, {
            "reason": inputReason
        }).then(async () => {
            const authorUsername = interaction.user.username;
            const memberUsername = bannedUser.user.username;
            const memberID = bannedUser.user.id;
            const memberAvatar = bannedUser.user.avatar;
            const memberAvatarURL = "https://cdn.discordapp.com/avatars/" + memberID + "/" + memberAvatar + ".png";
            const time = new Date().toISOString();

            if (!inputReason) inputReason = interaction.client.translate.commands.unban.no_reason;

            const unbanEmbed = new EmbedBuilder()
                .setTitle(interaction.client.translate.commands.unban.user_has_been_unbanned.replace("%s", memberUsername))
                .setDescription(interaction.client.translate.commands.unban.reason_for_unban.replace("%s1", authorUsername).replace("%s2", inputReason))
                .setColor("Green")
                .setTimestamp()
                .setThumbnail(memberAvatarURL);

            await interaction.editReply({
                "embeds": [unbanEmbed]
            });
        });
    }
};