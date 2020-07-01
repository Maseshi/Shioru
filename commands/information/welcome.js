module.exports.run = async function (client, message, args) {
    if (message.member.hasPermission(["ADMINISTRATOR"])) {
        // Coming soon!!
    } else {
        return message.reply("❌ คำสั่งนี้ต้องใช้สิทธิ์ระดับสูงสุดเท่านั้น");
    }
};

module.exports.help = {
    "name": "welcome",
    "description": "Send a welcome message for the homepage.",
    "usage": "Cwelcome",
    "category": "information",
    "aliases": [""]
    
};