const firebase = require("firebase");

module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR", "MANAGE_ROLES"])) {
        let memberId = args.join(" ");
        if (memberId.length === 0) {
            return message.reply("❓ กรุณาระบุรหัสสมาชิกที่ต้องการจะลบในฐานข้อมูลด้วยคะ!")
                .then(function (msg) {
                    msg.delete({
                        timeout: 10000
                    });
                });
        } else {
            let msg = await message.channel.send("📁 กำลังลบข้อมูล EXP และ Level");
            let database = firebase.database();
            database.ref("Discord/Users/" + memberId + "/Leveling/").remove()
                .then(function () {
                    msg.edit("✅ ลบ EXP และ Level ของสมาชิกนี้ ออกจากฐานข้อมูลเรียบร้อยแล้วคะ!");
                }).catch(function (error) {
                    msg.edit("❎ ไม่พบผู้ใช้ในฐานข้อมูลคะ");
                    console.error(error);
                });
        }
    } else {
        return message.reply("🛑 ขอโทษนะคะ แต่ว่าาา...คุณไม่มีสิทธิ์ในการใช้งานฟังก์ชันนี้คะ <:shioru_heavy:694159309877018685>");
    }
};

module.exports.help = {
    "name": "deleteLeveling",
    "description": "Removing EXP and Level of members",
    "usage": "YdeleteLeveling <member>",
    "category": "manager",
    "aliases": ["dLeveling", "deleteLeveling", "ลบระดับชั้น"]
};