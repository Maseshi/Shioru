module.exports.run = async function (client, message, args) {
    let arg = args.join(" ");
    if (arg) {
        let user = client.users.cache.find(user => (user.username === arg) || (user.id === arg));
        if (user === undefined) {
            message.channel.send("❎ ไม่พบสมาชิกรายนี้นะคะ เอ๋..พิมพ์ผิดหรือเปล่า..?");
        } else {
            let avatar = user.avatarURL();
            let username = user.username;
            let embed = {
                "title": "นี่คือลิงค์รูปของ " + username,
                "description": avatar,
                "url": avatar,
                "color": 4886754,
                "thumbnail": {
                    "url": avatar
                }
            };
            message.channel.send({
                embed
            });
        }
    } else {
        let avatar = message.author.displayAvatarURL();
        let embed = {
            "title": "นี่คือลิงค์รูปของคุณคะ",
            "description": avatar,
            "url": avatar,
            "color": 4886754,
            "thumbnail": {
                "url": avatar
            }
        };
        message.channel.send({
            embed
        });
    }
};

module.exports.help = {
    "name": "avatar",
    "description": "Get your link and profile.",
    "usage": "Yavatar (name)",
    "category": "information",
    "aliases": ["profile", "profiles", "at", "รูปของฉัน", "อวาตาร์"]
};
