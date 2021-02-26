module.exports.run = async function (client, message, args) {
  let guildIcon = message.guild.iconURL();
  let avatar = message.author.displayAvatarURL();
  let username = message.author.username;
  let userDiscriminator = message.author.discriminator;
  let id = message.author.id;
  let accountCreateAt = message.author.createdAt;
  let arg = args.join(" ");
  if (arg) {
    let user = message.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
    if (!user) {
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

  function userInfo(SguildIcon, Savatar, Susername, SuserDiscriminator, Sid, SaccountCreateAt) {
    let date = new Date(SaccountCreateAt);
    let days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    let months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    let createdAt = "วัน" + days[date.getDay()] + "ที่ " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " เวลา " + date.getHours() + ":" + date.getMinutes() + " น.";

    message.channel.send({
      "embed": {
        "title": "📖 รายละเอียดข้อมูลของคุณ",
        "color": 4886754,
        "footer": {
          "icon_url": SguildIcon,
          "text": "อ้างอิงข้อมูลจาก Discord"
        },
        "thumbnail": {
          "url": Savatar
        },
        "fields": [
          {
            "name": "ชื่อเต็ม:",
            "value": Susername + "#" + SuserDiscriminator
          },
          {
            "name": "รหัสบัญชี:",
            "value": Sid
          },
          {
            "name": "สร้างบัญชีเมื่อ:",
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