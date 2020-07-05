module.exports.run = async function (client, message, args) {
  let guildIcon = message.guild.iconURL();
  let avatar = message.author.displayAvatarURL();
  let username = message.author.username;
  let userDiscriminator = message.author.discriminator;
  let id = message.author.id;
  let accountCreateAt = message.author.createdAt;
  let arg = args.join(" ");
  if (arg) {
    let user = client.users.cache.find(user => (user.username === arg) || (user.id === arg));
    if (user === undefined) {
      message.channel.send("❎ ไม่พบสมาชิกรายนี้นะคะ เอ๋..พิมพ์ผิดหรือเปล่า..?");
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

  function userInfo(guildIcon, avatar, username, userDiscriminator, id, accountCreateAt) {
    let date = new Date(accountCreateAt);
    let days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    let months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    let createdAt = "วัน" + days[date.getDay()] + "ที่ " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " เวลา " + date.getHours() + ":" + date.getMinutes() + " น.";

    let embed = {
      "title": "ข้อมูลของคุณ!",
      "color": 4886754,
      "footer": {
        "icon_url": guildIcon,
        "text": "อ้างอิงข้อมูลจากเซิร์ฟเวอร์"
      },
      "thumbnail": {
        "url": avatar
      },
      "fields": [
        {
          "name": "ชื่อเต็ม:",
          "value": username + "#" + userDiscriminator
        },
        {
          "name": "รหัสบัญชี:",
          "value": id
        },
        {
          "name": "สร้างบัญชีเมื่อ:",
          "value": createdAt
        }
      ]
    };
    message.channel.send({ embed });
  }
};

module.exports.help = {
  "name": "userInfo",
  "description": "Get information about you.",
  "usage": "YuserInfo",
  "category": "information",
  "aliases": ["user", "ข้อมูลผู้ใช้", "ผู้ใช้", "userinfo"]
};