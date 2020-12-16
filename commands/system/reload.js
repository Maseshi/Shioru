const fs = require("fs");
const path = require("path");

module.exports.run = (client, message, args) => {
    let arg = args[0];
    if (!arg) {
        message.reply("❓ ระบุคำสั่งที่จะให้ฉันโหลดซ้ำด้วยคะ");
    } else {
        let commandName = arg.toLowerCase();
        let commands = message.client.commands.get(commandName);
        let aliases = message.client.commands.get(client.aliases.get(commandName));
        let command = commands || aliases;
        if (!command) {
            message.channel.send("❎ อืมม...ดูเหมือนจะไม่มีคำสั่งนี้นะคะ...ลองตรวจสอบดีๆ อีกครั้งนะคะว่าพิมพ์ถูกหรือเปล่า?");
        } else {
            fs.readdirSync(path.join(__dirname, "..")).forEach(function (dirs) {
                let files = fs.readdirSync(path.join(__dirname, "..", dirs));
                if (files.includes(commandName + ".js")) {
                    let file = "../" + dirs + "/" + commandName + ".js";
                    try {
                        delete require.cache[require.resolve(file)];
                        client.commands.delete(commandName);
                        const pull = require(file);
                        client.commands.set(commandName, pull);
                        return message.channel.send('✅ ' + commandName + ' ได้รับการโหลดซ้ำแล้วคะ.!!');
                    } catch (err) {
                        message.channel.send("❌ แย่ละ..ฉันพยายามโหลดคำสั่งซ้ำแล้ว แต่ฉันโหลดซ้ำไม่ได้: " + arg.toUpperCase());
                        return console.log(err.stack || err);
                    }
                }
            });
        }
    }
};

module.exports.help = {
    "name": "reload",
    "description": "Reload the command that doesn't work.",
    "usage": "reload <command>",
    "category": "system",
    "aliases": ["recommand", "รีโหลด", "โหลดซ้ำ"]
};