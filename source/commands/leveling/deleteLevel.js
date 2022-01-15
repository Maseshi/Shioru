const { getDatabase, ref, child, get, remove } = require("firebase/database");
const catchError = require("../../extras/catchError");

module.exports.run = async (client, message, args) => {
    const inputMember = args.join(" ");
    
    if (!inputMember) return message.reply(client.translate.commands.deleteLevel.empty);

    const member = message.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));
    
    if (!member) return message.reply(client.translate.commands.deleteLevel.can_not_find_user);

    const memberID = member.user.id;
    const msg = await message.reply(client.translate.commands.deleteLevel.deleting);

    const db = getDatabase();
    const childRef = child(ref(db, "Shioru/apps/discord/guilds"), message.guild.id);
    get(child(child(child(childRef, "data/users"), memberID), "leveling")).then((snapshot) => {
        if (!snapshot.exists()) return message.reply(client.translate.commands.deleteLevel.user_current_no_level);
        
        remove(child(child(child(childRef, "data/users"), memberID), "leveling")).then(() => {
            msg.edit(client.translate.commands.deleteLevel.success);
        }).catch(() => {
            msg.edit(client.translate.commands.deleteLevel.error);
        });
    });
};

module.exports.help = {
    "name": "deleteLevel",
    "description": "Removing EXP and Level of members",
    "usage": "deleteLevel <member: id, username, username&tag>",
    "category": "leveling",
    "aliases": ["dLevel", "deletelevel", "ลบระดับชั้น"],
    "userPermission": ["MANAGE_GUILD"],
    "clientPermissions": ["SEND_MESSAGES", "MANAGE_GUILD"]
};