const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_ROLES"])) {
        let arg = args.join(" ");
        if (arg === "") {
            message.reply("❓ สมาชิกที่ต้องการจะลบชื่อว่าอะไรเหรอคะ รหัสบัญชีก็ได้นะ >.<");
        } else {
            let user = message.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
            if (!user) {
                message.channel.send("❎ ไม่พบสมาชิกรายนี้นะคะ เอ๋..พิมพ์ผิดหรือเปล่า..?");
            } else {
                let id = user.id;
                let msg = await message.channel.send("📁 กำลังลบข้อมูลระดับประสบการณ์ของสมาชิกนี้");
                let database = firebase.database();
                database.ref("Shioru/Discord/Users/" + id + "/Leveling/").remove()
                .then(function () {
                    msg.edit("✅ ลบระดับประสบการณ์ของสมาชิกนี้ ออกจากฐานข้อมูลเรียบร้อยแล้วคะ!");
                }).catch(function (error) {
                    msg.edit("❎ ไม่พบผู้ใช้ในฐานข้อมูลคะ");
                    console.log(error);
                });
            }
        }
    } else {
        message.channel.send("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ");
    }
};

module.exports.help = {
    "name": "deleteLeveling",
    "description": "Removing EXP and Level of members",
    "usage": "deleteLeveling <member>",
    "category": "manager",
    "aliases": ["dLeveling", "deleteleveling", "ลบระดับชั้น"]
};