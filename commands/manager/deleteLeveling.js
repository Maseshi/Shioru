const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    let arg = args.join(" ");
    if (!arg) return message.reply(client.lang.command_information_deleteLeveling_arg_empty);

    let member = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
    if (!member) return message.reply(client.lang.command_information_deleteLeveling_not_found_user);

    let id = member.user.id;
    let msg = await message.reply(client.lang.command_information_deleteLeveling_deleting);

    let database = firebase.database();
    let ref = database.ref("Shioru/apps/discord/guilds").child(message.guild.id);

    ref.child("data/users").child(id).child("leveling").remove().then(function () {
        msg.edit(client.lang.command_information_deleteLeveling_delete_success);
    }).catch(function (error) {
        msg.edit(client.lang.command_information_deleteLeveling_delete_error);
        console.log(error);
    });
};

module.exports.help = {
    "name": "deleteLeveling",
    "description": "Removing EXP and Level of members",
    "usage": "deleteLeveling <member: id, username, username&tag>",
    "category": "manager",
    "aliases": ["dLeveling", "deleteleveling", "ลบระดับชั้น"],
    "permissions": ["SEND_MESSAGES", "MANAGE_GUILD"]
};