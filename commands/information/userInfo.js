module.exports.run = async function (client, message, args) {
    let date = new Date(message.author.createdAt);
    let days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    let months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    let format = "วัน" + days[date.getDay()] + "ที่ " + date.getDate() + " " + months[date.getMonth()] + " " + date.getFullYear() + " | " + date.getHours() + ":" + date.getMinutes() + " น.";

    let embed = {
      "title": "ข้อมูลของคุณ!",
      "color": 4886754,
      "footer": {
        "icon_url": message.guild.iconURL(),
        "text": "อ้างอิงข้อมูลจากเซิร์ฟเวอร์"
      },
      "thumbnail": {
        "url": message.author.displayAvatarURL()
      },
      "fields": [
        {
          "name": "ชื่อเต็ม:",
          "value": message.author.username + "#" + message.author.discriminator
        },
        {
          "name": "รหัส:",
          "value": message.author.id
        },
        {
          "name": "สร้างบัญชีเมื่อ:",
          "value": format
        }
      ]
    };
    message.channel.send({ embed });
};

module.exports.help = {
  "name": "userInfo",
  "description": "Get information about you.",
  "usage": "YuserInfo",
  "category": "information",
  "aliases": ["user", "ข้อมูลผู้ใช้", "ผู้ใช้"]
};