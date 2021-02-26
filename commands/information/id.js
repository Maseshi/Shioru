module.exports.run = async function (client, message, args) {
    let avatar = message.author.displayAvatarURL();
    let username = message.author.username;
    let id = message.author.id;
    let arg = args.join(" ");
    if (arg) {
        let user = message.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
        if (!user) {
            message.channel.send("❎ ไม่พบสมาชิกรายนี้นะคะ เอ๋..พิมพ์ผิดหรือเปล่า?");
        } else {
            avatar = user.avatarURL();
            username = user.username;
            id = user.id;
            userID(avatar, username, id);
        }
    } else {
        userID(avatar, username, id);
    }

    function userID(Savatar, Susername, Sid) {
        message.channel.send({
            "embed": {
                "title": "#️⃣ รหัสบัญชีของ " + Susername,
                "description": "```" + Sid + "```\nเคล็ดลับ: วิธีเปิด **โหมดผู้พัฒนา** เพื่อรับตัวเลือกเพิ่มเติม เช่น คัดลอก ID, คัดลอก ID ข้อความ และอื่นๆ โดยให้เข้าไปที่ __ตั้งค่าผู้ใช้ > หน้าตา > ขั้นสูง__ และทำการเปิดที่ __โหมดผู้พัฒนา__",
                "color": 4886754,
                "thumbnail": {
                    "url": Savatar
                }
            }
        });
    }
};

module.exports.help = {
    "name": "id",
    "description": "Get your id",
    "usage": "id (Member)",
    "category": "information",
    "aliases": ["myid", "myId", "ID", "รหัส", "ไอดี", "รหัสบัญชี"]
};