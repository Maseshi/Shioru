module.exports.run = async function (client, message, args) {
  let guildIcon = message.guild.iconURL();
  let avatar = message.author.displayAvatarURL();
  let username = message.author.username;
  let userDiscriminator = message.author.discriminator;
  let id = message.author.id;
  let accountCreateAt = message.author.createdAt;
  let arg = args.join(" ");
  if (arg) {
    let user = client.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
    if (!user) {
      message.channel.send(client.lang.command_information_userInfo_no_user);
    } else {
      avatar = user.avatarURL();
      username = user.username;
      userDiscriminator = user.discriminator;
      id = user.id;
      accountCreateAt = user.createdAt;
      userInfo(guildIcon, avatar, username, userDiscriminator, id, accountCreateAt);
    }
  } else {
    userInfo(guildIcon, avatar, username, userDiscriminator, id, accountCreateAt);
  }

  function userInfo(SguildIcon, Savatar, Susername, SuserDiscriminator, Sid, SaccountCreateAt) {
    let date = new Date(SaccountCreateAt);
    let days = client.lang.command_information_userInfo_function_userInfo_days;
    let months = client.lang.command_information_userInfo_function_userInfo_months;
    let createdAt = client.lang.command_information_userInfo_function_userInfo_createdAt.replace("%day", days[date.getDay()]).replace("%date", date.getDate()).replace("%months", months[date.getMonth()]).replace("%year", date.getFullYear()).replace("%hours", date.getHours()).replace("%minutes", date.getMinutes());

    message.channel.send({
      "embed": {
        "title": client.lang.command_information_userInfo_function_userInfo_embed_info_title,
        "color": 4886754,
        "footer": {
          "icon_url": SguildIcon,
          "text": client.lang.command_information_userInfo_function_userInfo_embed_info_footer_text
        },
        "thumbnail": {
          "url": Savatar
        },
        "fields": [
          {
            "name": client.lang.command_information_userInfo_function_userInfo_embed_info_fields_0_name,
            "value": Susername + "#" + SuserDiscriminator
          },
          {
            "name": client.lang.command_information_userInfo_function_userInfo_embed_info_fields_1_name,
            "value": Sid
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
  "usage": "userInfo (Member)",
  "category": "information",
  "aliases": ["user", "ข้อมูลผู้ใช้", "ผู้ใช้", "userinfo"]
};