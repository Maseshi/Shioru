module.exports = function (channel, error) {
    if (!error) return;
    if (channel) {
        channel.send({
            "embed": {
                "title": "⚠ เกิดข้อผิดพลาดขณะดำเนินการ",
                "description": "```JavaScript\n" + error + "\n```[รายงานปัญหา](https://github.com/Maseshi/Shioru/issues/new)",
                "color": 13632027,
                "timestamp": new Date()
            }
        });
    }
    console.error(error);
};