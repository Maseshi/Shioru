const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async function (client, message, args) {
    let arg = args[0];
    let voiceChannel = message.member.voice.channel;
    let soundTestEmbed = new discord.MessageEmbed()
        .setTitle("🔊 ทดสอบระบบเสียง")
        .setDescription("เพิ่งฟังเพลงมาแล้วรู้สึกว่าเสียงมันแปลกๆ ใช่ไหมล่าา...งั้นเรามาลองมาทดสอบลำโพงของคุณกันหน่อย \n\n**ลองเลือกมาสักเสียงดูสิ... (60 วินาที)**")
        .setColor("#000000")
        .setFooter("ขับเคลื่อนโดย Dolby Digital", "https://yt3.ggpht.com/ytc/AAUvwnhGeyT9kVHP50xFQZYQZShQUJeJtEU0D63pfG_d4A=s48-c-k-c0xffffffff-no-rj-mo")
        .addField("1. Leaf", "ความยาวของคลิปเสียง: 0:58\nขนาดของ Bit rate: 192kbps\nเสียงอันไพเราะของธรรมชาติ ที่กลมกลี่นไปกลับสายลม\nhttps://youtu.be/qJA2U-YMvkk")
        .addField("2. Movies Matter", "ความยาวของคลิปเสียง: 1:50\nขนาดของ Bit rate: 192kbps\nโรงหนังที่กำลังจะเริ่มฉายในเร็วๆ นี้\nhttps://youtu.be/x7lMmQHKSQY")
        .addField("3. Amaze", "ความยาวของคลิปเสียง: 1:03\nขนาดของ Bit rate: 192kbps\nเหมือนกำลังอยู่ในโรงหนัง 3D ที่กำลังฉายเรื่องสาระคดีอยู่\nhttps://youtu.be/kvAfmYNtugQ");
    let soundTestFinishEmbed = new discord.MessageEmbed()
        .setTitle("🔊 ทดสอบระบบเสียง")
        .setColor("#000000")
        .setFooter("ขับเคลื่อนโดย Dolby Digital", "https://yt3.ggpht.com/ytc/AAUvwnhGeyT9kVHP50xFQZYQZShQUJeJtEU0D63pfG_d4A=s48-c-k-c0xffffffff-no-rj-mo");
    let soundTestPlayingEmbed = new discord.MessageEmbed()
        .setTitle("🔊 ทดสอบระบบเสียง")
        .setDescription("กำลังทำการทดสอบระบบเสียง โปรดรอจนกว่าจะการทดสอบนี้จะเสร็จสมบูรณ์...\n```💡 หากพบว่าเสียงมีอาการกระตุก มันเป็นเรื่องปกติเพราะการเล่นเสียงจำเป็นต้องประมวลผลแบบสดหรืออาจจะลองตรวจสอบการเชื่อมต่ออินเทอร์เน็ตของคุณต้องอยู่ในระดับที่ดี```")
        .setColor("#000000")
        .setFooter("ขับเคลื่อนโดย Dolby Digital", "https://yt3.ggpht.com/ytc/AAUvwnhGeyT9kVHP50xFQZYQZShQUJeJtEU0D63pfG_d4A=s48-c-k-c0xffffffff-no-rj-mo");

    if (!voiceChannel) {
        message.reply("❓ คุณต้องเข้าร่วมช่องก่อนนะคะ ไม่งั้นฉันไม่รู้ว่าต้องเข้าไปช่องไหน =3=");
    } else {
        voiceChannel.join()
        .then(function (connection) {
            message.channel.send(soundTestEmbed)
            .then(async function (soundTestMessage) {
                message.channel.activeCollector = true;

                let name;
                let value;
                let status = 0;
                message.channel.awaitMessages(filter, {
                    "max": 1,
                    "maxProcessed": 1,
                    "time": 60000,
                    "errors": ["time"]
                }).then(function (response) {
                    name = soundTestEmbed.fields[parseInt(response.first()) - 1].name;
                    value = soundTestEmbed.fields[parseInt(response.first()) - 1].value;

                    message.channel.activeCollector = false;

                    soundTestPlayingEmbed.addField(name, value);
                    soundTestMessage.edit(soundTestPlayingEmbed)
                    .then(async function (reactionMessage) {
                        await reactionMessage.react("⏹");

                        reactionMessage.awaitReactions(SFilter, {
                            "max": 1,
                            "maxProcessed": 1,
                            "errors": ["time"]
                        }).then(function (collected) {
                            switch (collected.first().emoji.name) {
                                case "⏹":
                                    status = 1;
                                    connection.dispatcher.end();
                                break
                            }
                        });

                        connection.on("disconnect", function () {
                            soundTestFinishEmbed.setDescription("การทดสอบในครั้งนี้ ถูกยกเลิกไปแล้วคะ..หากต้องการเริ่มใหม่อีกครั้งสามารถใช้คำสั่งเดิมได้เลยคะ");
                            reactionMessage.edit(soundTestFinishEmbed);
                        });

                        let stream = fs.createReadStream("./assets/sounds/Dolby - " + name + ".mp3");
                        let dispatcher = connection.play(stream, {
                            "volume": 0.5
                        });
                        dispatcher.on("finish", async function () {
                            if (status === 1) {
                                soundTestFinishEmbed.setDescription("การทดสอบในครั้งนี้ ถูกยกเลิกไปแล้วคะ..หากต้องการเริ่มใหม่อีกครั้งสามารถใช้คำสั่งเดิมได้เลยคะ");
                                reactionMessage.edit(soundTestFinishEmbed);
                            } else {
                                soundTestFinishEmbed.setDescription("**การทดสอบในครั้งนี้ มีปัญหาหรือไม่?**\n```👍 หมายถึง ไม่มีปัญหาใดๆ\n👎 หมายถึง พบปัญหาบางอย่าง```\n__เสียงที่ใช้ในการทดสอบครั้งนี้__");
                                soundTestFinishEmbed.addField(name, value);
                                reactionMessage.edit(soundTestFinishEmbed);

                                await reactionMessage.react("👍");
                                await reactionMessage.react("👎");

                                reactionMessage.awaitReactions(RFilter, {
                                    "max": 1,
                                    "maxProcessed": 1,
                                    "errors": ["time"]
                                }).then(function (collected) {
                                    switch (collected.first().emoji.name) {
                                        case "👍":
                                            soundTestFinishEmbed.setDescription("✅ ขอขอบคุณสำหรับการทดสอบนี้\n\n__ผลลัพธ์__\n```ไม่พบปัญหาใดๆ เกี่ยวกับเสียง```\n\n__เสียงที่ใช้ในการทดสอบครั้งนี้__");
                                            reactionMessage.edit(soundTestFinishEmbed);
                                        break

                                        case "👎":
                                            soundTestFinishEmbed.setDescription("❎ ขอขอบคุณสำหรับการทดสอบนี้\n\n__ผลลัพธ์__\n```พบเจอปัญหาเกี่ยวกับเสียง```\n__วิธีตรวจสอบและแก้ไขเบื้องต้น__\n**สำหรับหูฟัง**\n```1. ตรวจสอบให้มั่นใจว่า แหล่งจ่ายเสียงของคุณนั้นเปิดอยู่ และมีการเพิ่มระดับเสียงไว้แล้ว\n2. ถ้าหากหูฟังของคุณมีปุ่มระดับเสียง ตรวจสอบให้มั่นใจว่าได้ปรับเพิ่มไว้แล้ว\n3. ถ้าหากหูฟังของคุณเป็นแบบทำงานด้วยแบตเตอรี่ ตรวจสอบให้มั่นใจว่าแบตเตอรี่มีไฟอยู่อย่างเพียงพอ\n4. ตรวจเช็คดูการเชื่อมต่อหูฟังของคุณ\n5. ลองทำการเชื่อมต่อหูฟังของท่านเข้ากับ อุปกรณ์จ่ายสัญญาณเสียงอันอื่นดู```\n**สำหรับคอมพิวเตอร์และโน๊ตบุ๊ค Windows 10**\nhttps://support.microsoft.com/th-th/windows/แก้ไขปัญหาเกี่ยวกับเสียงใน-windows-10-73025246-b61c-40fb-671a-2535c7cd56c8\n**สำหรับโทรศัพท์**\nhttps://support.google.com/duo/answer/6385816?co=GENIE.Platform%3DAndroid&hl=th\n\n__เสียงที่ใช้ในการทดสอบครั้งนี้__");
                                            reactionMessage.edit(soundTestFinishEmbed);
                                        break
                                    }
                                });
                            }
                        });
                        dispatcher.on("error", function (error) {
                            soundTestFinishEmbed.setDescription("เกิดข้อผิดพลาดขณะกำลังจะเริ่มเล่นเสียงคะ\n\n```" + error + "```");
                            message.channel.send(soundTestFinishEmbed);
                            voiceChannel.leave();
                        });
                    });
                }).catch(function () {
                    message.channel.activeCollector = false;

                    soundTestFinishEmbed.setDescription("การทดสอบนี้ถูกยกเลิกแล้วคะ เป็นเพราะเวลาหมดซ่ะก่อน...");
                    soundTestMessage.edit(soundTestFinishEmbed);
                });
            });
        }).catch(function (error) {
            message.channel.send("❌ เกิดข้อผิดพลาดในขณะที่ฉันกำลังเข้าไปคะ: " + error);
        });
    }
    
    function filter(msg) {
        if (msg.author.id !== message.author.id) return;
        return ["1", "2", "3"].includes(msg.content);
    }

    function SFilter(reaction, user) {
        if (user.id !== message.author.id) return;
        return ["⏹"].includes(reaction.emoji.name);
    }

    function RFilter(reaction, user) {
        if (user.id !== message.author.id) return;
        return ["👍", "👎"].includes(reaction.emoji.name);
    }
}

module.exports.help = {
	"name": "soundtest",
	"description": "Test the sound system",
	"usage": "Ssoundtest (tracks)",
	"category": "system",
	"aliases": ["stest", "soundt", "ทดสอบเสียง", "ทดสอบระบบเสียง"]
};