module.exports.run = async (client, message, args) => {
    const inputMember = args[0];
    let inputReason = args.slice(1).join(" ");

    if (!inputMember) return message.reply(client.translate.commands.unban.input_member_empty);

    const banned = await message.guild.bans.fetch();
    
    if (banned.length <= 0) return message.reply(client.translate.commands.unban.no_one_gets_banned);

    const bannedUser = banned.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));
    
    if (!bannedUser) return message.reply(client.translate.commands.unban.this_user_not_banned);
    if (!inputReason) inputReason = "";

    message.guild.bans.remove(bannedUser.user, {
        "reason": inputReason
    }).then(() => {
        const authorUsername = message.author.username;
        const memberUsername = bannedUser.user.username;
        const memberID = bannedUser.user.id;
        const memberAvatar = bannedUser.user.avatar;
        const memberAvatarURL = "https://cdn.discordapp.com/avatars/" + memberID + "/" + memberAvatar + ".png";
        const time = new Date();

        if (!inputReason) inputReason = client.translate.commands.unban.no_reason;

        message.channel.send({
            "embeds": [{
                "title": client.translate.commands.unban.user_has_been_unbanned.replace("%s", memberUsername),
                "description": client.translate.commands.unban.reason_for_unban.replace("%s1", authorUsername).replace("%s2", inputReason),
                "color": 8311585,
                "timestamp": time,
                "thumbnail": {
                    "url": memberAvatarURL
                }
            }]
        });
    });
}

module.exports.help = {
    "name": "unban",
    "description": "unban members",
    "usage": "unban <member: id, username, username&tag> (reason)",
    "category": "guild",
    "aliases": ["unb", "ปลดแบน"],
    "userPermission": ["BAN_MEMBERS"],
    "clientPermissions": ["SEND_MESSAGES", "BAN_MEMBERS"]
}