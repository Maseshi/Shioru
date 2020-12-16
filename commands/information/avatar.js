module.exports.run = async function (client, message, args) {
    let arg = args.join(" ");
    if (arg === client.user.username || arg === client.user.tag || arg === client.user.id) {
        if (message.author.id !== client.config.owner) {
            message.channel.send("ถ้าเป็นรูปของฉันละก็...อืมม...")
                .then(function () {
                    message.channel.send("ไม่ให้ดีกว่า...ฉันให้เฉพาะเจ้าของฉันเท่านั้นแหล่ะ 😁", {
                        "timeout": 8000
                    });
                });
        } else {
            let avatar = client.user.avatarURL();
            let embed = {
                "title": "นี่คือลิงค์รูปของฉันคะ",
                "description": avatar,
                "url": avatar,
                "color": 14684245,
                "thumbnail": {
                    "url": avatar
                }
            };
            message.channel.send({
                embed
            });
        }
    } else {
        if (arg) {
            let user = client.users.cache.find(users => (users.username === arg) || (users.id === arg) || (users.tag === arg));
            if (!user) {
                message.channel.send("❎ ไม่พบสมาชิกรายนี้นะคะ เอ๋..พิมพ์ผิดหรือเปล่า?");
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
    }
};

module.exports.help = {
    "name": "avatar",
    "description": "Get your link and profile.",
    "usage": "avatar (name)",
    "category": "information",
    "aliases": ["profile", "profiles", "at", "รูปของฉัน", "อวาตาร์"]
};
