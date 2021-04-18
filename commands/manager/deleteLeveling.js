const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_ROLES"])) {
        let arg = args.join(" ");
        if (arg === "") {
            message.reply(client.lang.command_information_deleteLeveling_arg_empty);
        } else {
            let user = client.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
            if (!user) {
                message.channel.send(client.lang.command_information_deleteLeveling_not_found_user);
            } else {
                let id = user.id;
                let msg = await message.channel.send(client.lang.command_information_deleteLeveling_deleting);
                let database = firebase.database();
                database.ref("Shioru/Discord/Users/" + id + "/Leveling/").remove()
                .then(function () {
                    msg.edit(client.lang.command_information_deleteLeveling_delete_success);
                }).catch(function (error) {
                    msg.edit(client.lang.command_information_deleteLeveling_delete_error);
                    console.log(error);
                });
            }
        }
    } else {
        message.channel.send(client.lang.command_information_deleteLeveling_dont_have_permission);
    }
};

module.exports.help = {
    "name": "deleteLeveling",
    "description": "Removing EXP and Level of members",
    "usage": "deleteLeveling <member<id, username, username&tag>>",
    "category": "manager",
    "aliases": ["dLeveling", "deleteleveling", "ลบระดับชั้น"]
};