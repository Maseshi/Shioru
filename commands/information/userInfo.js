const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
  let arg = args.join(" ");
  let guildIcon = message.guild.iconURL();
  let avatar = message.author.displayAvatarURL();
  let username = message.author.username;
  let userDiscriminator = message.author.discriminator;
  let id = message.author.id;
  let accountCreateAt = message.author.createdAt;

  let database = firebase.database();
  let ref = database.ref("Shioru/apps/discord/guilds").child(message.guild.id);

  if (arg) {
    let member = message.guild.members.cache.find(members => (members.user.username === arg) || (members.user.id === arg) || (members.user.tag === arg));
    if (!member) return message.reply(client.lang.command_information_userInfo_no_user);
    
    avatar = member.user.avatarURL();
    username = member.user.username;
    userDiscriminator = member.user.discriminator;
    id = member.user.id;
    accountCreateAt = member.user.createdAt;

    ref.child("data/users").child(id).child("access").once("value").then(function(snapshot) {
      if (snapshot.exists()) {
        let PMSInfo = snapshot.val().info;

        if (!PMSInfo) return message.reply(client.lang.command_information_userInfo_not_access);

        return userInfo(guildIcon, avatar, username, userDiscriminator, id, accountCreateAt);
      } else {
        ref.child("data/users").child(id).update({
          "access": {
            "avatar": false,
            "info": false,
            "uid": false
          }
        }).then(function() {
          return module.exports.run(client, message, args);
        });
      }
    });
  } else {
    return userInfo(guildIcon, avatar, username, userDiscriminator, id, accountCreateAt);
  }

  function userInfo(guildIcon, avatar, username, userDiscriminator, id, accountCreateAt) {
    let date = new Date(accountCreateAt);
    let days = client.lang.command_information_userInfo_function_userInfo_days;
    let months = client.lang.command_information_userInfo_function_userInfo_months;
    let createdAt = client.lang.command_information_userInfo_function_userInfo_createdAt.replace("%day", days[date.getDay()]).replace("%date", date.getDate()).replace("%months", months[date.getMonth()]).replace("%year", date.getFullYear()).replace("%hours", date.getHours()).replace("%minutes", date.getMinutes());

    message.channel.send({
      "embed": {
        "title": client.lang.command_information_userInfo_function_userInfo_embed_info_title,
        "color": 4886754,
        "footer": {
          "icon_url": guildIcon,
          "text": client.lang.command_information_userInfo_function_userInfo_embed_info_footer_text
        },
        "thumbnail": {
          "url": avatar
        },
        "fields": [
          {
            "name": client.lang.command_information_userInfo_function_userInfo_embed_info_fields_0_name,
            "value": username + "#" + userDiscriminator
          },
          {
            "name": client.lang.command_information_userInfo_function_userInfo_embed_info_fields_1_name,
            "value": id
          },
          {
            "name": client.lang.command_information_userInfo_function_userInfo_embed_info_fields_2_name,
            "value": createdAt
          }
        ]
      }
    });
  }
};

module.exports.help = {
  "name": "userInfo",
  "description": "Get information about you.",
  "usage": "userInfo (member: id, username, username&tag)",
  "category": "information",
  "aliases": ["user", "ข้อมูลผู้ใช้", "ผู้ใช้", "userinfo"],
  "permissions": ["SEND_MESSAGES"]
};