const discord = require("discord.js");

module.exports.run = async function (client, message, args) {
    let voiceChannel = message.member.voice.channel;
    let soundTestEmbed = new discord.MessageEmbed()
        .setTitle(client.lang.command_system_soundTest_embed_soundTestEmbed_title)
        .setDescription(client.lang.command_system_soundTest_embed_soundTestEmbed_description)
        .setColor("#000000")
        .setFooter(client.lang.command_system_soundTest_embed_soundTestEmbed_footer_text, "https://yt3.ggpht.com/ytc/AAUvwnhGeyT9kVHP50xFQZYQZShQUJeJtEU0D63pfG_d4A=s48-c-k-c0xffffffff-no-rj-mo")
        .addField(client.lang.command_system_soundTest_embed_soundTestEmbed_field_0, client.lang.command_system_soundTest_embed_soundTestEmbed_field_0_value)
        .addField(client.lang.command_system_soundTest_embed_soundTestEmbed_field_1, client.lang.command_system_soundTest_embed_soundTestEmbed_field_1_value)
        .addField(client.lang.command_system_soundTest_embed_soundTestEmbed_field_2, client.lang.command_system_soundTest_embed_soundTestEmbed_field_2_value);
    let soundTestPlayingEmbed = new discord.MessageEmbed()
        .setTitle(client.lang.command_system_soundTest_embed_soundTestPlayingEmbed_title)
        .setColor("#000000")
        .setFooter(client.lang.command_system_soundTest_embed_soundTestPlayingEmbed_footer_text, "https://yt3.ggpht.com/ytc/AAUvwnhGeyT9kVHP50xFQZYQZShQUJeJtEU0D63pfG_d4A=s48-c-k-c0xffffffff-no-rj-mo");

    if (!voiceChannel) {
        message.reply(client.lang.command_system_soundTest_user_not_in_channel);
    } else {
        voiceChannel.join().then(function (connection) {
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

                    soundTestPlayingEmbed.setDescription(client.lang.command_system_soundTest_testing);
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
                            soundTestPlayingEmbed.setDescription(client.lang.command_system_soundTest_testing_cancel_disconnect);
                            reactionMessage.edit(soundTestPlayingEmbed);
                        });

                        let stream = "./assets/sounds/Dolby - " + name + ".mp3";
                        let dispatcher = connection.play(stream, {
                            "volume": 1
                        });
                        dispatcher.on("finish", async function () {
                            if (status === 1) {
                                soundTestPlayingEmbed.setDescription(client.lang.command_system_soundTest_testing_finish);
                                reactionMessage.edit(soundTestPlayingEmbed);
                                voiceChannel.leave();
                            } else {
                                soundTestPlayingEmbed.setDescription(client.lang.command_system_soundTest_question_problem);
                                reactionMessage.edit(soundTestPlayingEmbed);

                                await reactionMessage.react("👍");
                                await reactionMessage.react("👎");

                                reactionMessage.awaitReactions(RFilter, {
                                    "max": 1,
                                    "maxProcessed": 1,
                                    "errors": ["time"]
                                }).then(function (collected) {
                                    switch (collected.first().emoji.name) {
                                        case "👍":
                                            soundTestPlayingEmbed.setDescription(client.lang.command_system_soundTest_no_problem);
                                            reactionMessage.edit(soundTestPlayingEmbed);
                                            voiceChannel.leave();
                                        break

                                        case "👎":
                                            soundTestPlayingEmbed.setDescription(client.lang.command_system_soundTest_found_problem);
                                            reactionMessage.edit(soundTestPlayingEmbed);
                                            voiceChannel.leave();
                                        break
                                    }
                                });
                            }
                        });
                        dispatcher.on("error", function (error) {
                            soundTestPlayingEmbed.setDescription(client.lang.command_system_soundTest_error_playing.replace("%error", error));
                            message.channel.send(soundTestPlayingEmbed);
                            voiceChannel.leave();
                        });
                    });
                }).catch(function (error) {
                    console.log(error);
                    message.channel.activeCollector = false;

                    soundTestPlayingEmbed.setDescription(client.lang.command_system_soundTest_cancel_timeout);
                    soundTestMessage.edit(soundTestPlayingEmbed);
                    voiceChannel.leave();
                });
            });
        }).catch(function (error) {
            console.log(error);
            message.channel.send(client.lang.command_system_soundTest_cant_join_channel + error);
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
	"name": "soundTest",
	"description": "Test the sound system",
	"usage": "soundTest",
	"category": "system",
	"aliases": ["soundtest", "stest", "soundt", "ทดสอบเสียง", "ทดสอบระบบเสียง"]
};