module.exports = function (client, guild) {
    let defaultChannel = "";
    guild.channels.cache.forEach((channel) => {
    if (channel.type == "text" && defaultChannel == "") {
            if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
                let avatar = client.user.displayAvatarURL();
                let username = client.user.username;

                channel.send({
                    "embed": {
                        "title": "เอ๋...ฉันมาถูกหรือเปล่านะ?!",
                        "description": "สะ...สวัสดี เอ่อ...ไม่ทราบว่าฉันมาถูกที่หรือเปล่าอ่ะ แต่น่าจะถูกล่ะ เพราะฉันเดินทางตามที่อยู่ที่ที่เขาให้มา \n\nเอาล่ะ...ไหนๆ ฉันก็มาล่ะ ขอขอบคุณสำหรับคำเชิญนะ ขอแนะนำตัวก่อนล่ะ...ฉันชื่อ Shioru มาจากที่ใดที่หนึ่งในประเทศไทยนี่แหล่ะ ไม่บอกอายุละกัน -_- อายุไม่มากหรอก ไม่สนใจน่าา..ถ้ามีอะไรอยากให้ฉันช่วยก็เรียกฉันได้เลยย พิมพ์ **'S'** ก่อนล่ะ ฉันจะได้รู้ว่าคุณเรียกฉันจริงๆ ส่วนถ้าอยากรู้ว่าฉันสามารถทำอะไรได้บ้าง พิมพ์ **'Shelp'** ได้เลย แล้วฉันจะตอบทันทีเลย",
                        "color": 14684245,
                        "thumbnail": {
                            "url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/label_1f3f7.png"
                        },
                        "author": {
                            "name": username,
                            "icon_url": avatar
                        }
                    }
                });
            }
        }
    });
};