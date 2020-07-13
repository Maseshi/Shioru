module.exports.run = async function (client, message, args) {
    let min = parseInt(args[0]);
    let max = parseInt(args[1]);

    if (min > max) {
        let temp = max;
        max = min;
        min = temp;
    }

    let Result = Math.floor(Math.random() * (max - min + 1)) + min;

    if (isNaN(Result)) {
        message.channel.send("❓ ขอทราบจำนวนที่กำหนดระหว่าง ต่ำสุด กับ สูงสุด ด้วยคะ")
        .then(function (msg) {
            msg.delete({
                timeout: 10000
            });
        });
    } else {
        message.channel.send("ผลลัพธ์คือ " + Result);
    }
};

module.exports.help = {
    "name": "numbers",
    "description": "Random number specified",
    "usage": "Ynumbers <min> <max>",
    "category": "messages",
    "aliases": ["randomNumbers", "randomnumbers", "randomNumber", "randomnumber", "number", "สุ่มเลข"]
};