const { database } = require("firebase");
const catchError = require("../../extras/catchError");

module.exports.run = async function (client, message, args) {
    let arg = args.join(" ");
    if (!arg) return message.reply(client.translate.commands.deleteLevel.empty);

    let member = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
    if (!member) return message.reply(client.translate.commands.deleteLevel.can_not_find_user);

    let id = member.user.id;
    let msg = await message.reply(client.translate.commands.deleteLevel.deleting);

    let ref = database().ref("Shioru/apps/discord/guilds").child(message.guild.id);

    ref.child("data/users").child(id).child("leveling").remove().then(function () {
        msg.edit(client.translate.commands.deleteLevel.success);
    }).catch(function (error) {
        msg.edit(client.translate.commands.deleteLevel.error);
    });
};

module.exports.help = {
    "name": "deleteLevel",
    "description": "Removing EXP and Level of members",
    "usage": "deleteLevel <member: id, username, username&tag>",
    "category": "leveling",
    "aliases": ["dLevel", "deletelevel", "ลบระดับชั้น"],
    "permissions": ["SEND_MESSAGES", "MANAGE_GUILD"]
};