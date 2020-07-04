const fs = require("fs");
const path = require("path");

module.exports.run = (client, message, args) => {
    if (args[0] === undefined) {
        message.reply("❓ ระบุคำสั่งที่จะให้ฉันโหลดซ้ำด้วยคะ")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    } else {
        let commandName = args[0].toLowerCase();
        let command = client.commands.get(commandName) || client.commands.get(client.aliases.get(commandName));
        if (command === undefined) {
            message.reply("❎ อืมม...ดูเหมือนจะไม่มีคำสั่งนี้นะคะ...ลองตรวจสอบดีๆ อีกครั้งนะคะว่าพิมพ์ถูกหรือเปล่า?")
            .then(function (msg) {
                msg.delete({
                    timeout: 10000
                });
            });
        } else {
            fs.readdirSync(path.join(__dirname, "..")).forEach(dirs => {
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
                        message.channel.send("❌ แย่ละ..ฉันพยายามโหลดคำสั่งซ้ำแล้ว แต่ฉันโหลดซ้ำไม่ได้: " + args[0].toUpperCase());
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
    "aliases": ["รีโหลด", "โหลดซ้ำ"]
};