const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    let arg = args.join(" ");
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    let id = message.author.id;

    if (arg) {
        let member = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
        if (!member) return message.reply(client.lang.command_fun_leveling_null_user);

        avatar = member.user.avatarURL();
        username = member.user.username;
        id = member.user.id;
        
        return getLeveling(avatar, id);
    }
    
    getLeveling(avatar, id);

    function getLeveling(avatar, id) {
        let database = firebase.database();
        let ref = database.ref("Shioru/apps/discord/guilds").child(message.guild.id);

        ref.child("data/users").child(id).once("value").then(function (snapshot) {
            if (!snapshot.exists()) return message.reply(client.lang.command_fun_leveling_function_getLeveling_else_not_level);
            
            let exp = snapshot.val().exp;
            let level = snapshot.val().level;

            message.channel.send({
                "embed": {
                    "color": 4886754,
                    "thumbnail": {
                        "url": avatar
                    },
                    "fields": [
                        {
                            "name": client.lang.command_fun_leveling_function_getLeveling_embed_fields_0_name,
                            "value": "```" + level + "```"
                        },
                        {
                            "name": client.lang.command_fun_leveling_function_getLeveling_embed_fields_1_name,
                            "value": "```" + exp + "```"
                        }
                    ]
                }
            });
        }).catch(function (error) {
            console.log(error);
            message.channel.send(client.lang.database_error + error);
        });
    }
};

module.exports.help ={
    "name": "leveling",
    "description": "See your leveling amount",
    "usage": "leveling (member: id, username, username&tag)",
    "category": "fun",
    "aliases": ["Leveling", "EXP", "exp", "level", "เลเวล", "อีเอ็กพี", "เวล"],
    "permissions": ["SEND_MESSAGES"]
};