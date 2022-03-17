const levelSystem = require("../../extras/levelSystem");

module.exports.run = async (client, message, args) => {
    const inputMember = args.join(" ");
    
    if (!inputMember) return message.reply(client.translate.commands.deleteLevel.empty);

    const member = message.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));
    
    if (!member) return message.reply(client.translate.commands.deleteLevel.can_not_find_user);

    const memberID = member.user.id;
    const msg = await message.reply(client.translate.commands.deleteLevel.deleting);
    const data = await levelSystem(client, message, "DELETE", memberID);

    if (data === "missing") return message.reply(client.translate.commands.deleteLevel.user_current_no_level);
    if (data === "success") return msg.edit(client.translate.commands.deleteLevel.success);
    if (data === "error") return msg.edit(client.translate.commands.deleteLevel.error);
};

module.exports.help = {
    "name": "deleteLevel",
    "description": "Removing EXP and Level of members",
    "usage": "deleteLevel <member: id, username, username&tag>",
    "category": "leveling",
    "aliases": ["dleveling", "dlevel", "delleveling", "dellevel", "deletelevel", "deleteleveling", "ลบระดับชั้น", "ลบเลเวล"],
    "userPermission": ["MANAGE_GUILD"],
    "clientPermissions": ["SEND_MESSAGES", "MANAGE_GUILD"]
};