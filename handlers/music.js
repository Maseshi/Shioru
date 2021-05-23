const distube = require("distube");
const { success, error, warning } = require("log-symbols");
const diff = require("ansi-diff-stream")();

module.exports = function (client) {
    diff.pipe(process.stdout);

    client.music = new distube(client, {
        "leaveOnEmpty": true,
        "leaveOnFinish": false,
        "leaveOnStop": false,
        "youtubeDL": true,
        "updateYouTubeDL": false,
        "customFilters": {
            "3d": "apulsator=hz=0.125",
            "8d": "apulsator=hz=0.08",
            "bassboost": "bass=g=20,dynaudnorm=f=200",
            "clear": "dynaudnorm=f=200",
            "earwax": "earwax",
            "echo": "aecho=0.8:0.9:1000:0.3",
            "flanger": "flanger",
            "gate": "agate",
            "haas": "haas",
            "karaoke": "stereotools=mlev=0.03",
            "lowbass": "bass=g=6,dynaudnorm=f=200",
            "mcompand": "mcompand",
            "nightcore": "aresample=48000,asetrate=48000*1.25",
            "normalizer": "dynaudnorm=f=200",
            "phaser": "aphaser=in_gain=0.4",
            "pulsator": "apulsator=hz=1",
            "purebass": "bass=g=20,dynaudnorm=f=200,asubboost,apulsator=hz=0.08",
            "reverse": "areverse",
            "subboost": "asubboost",
            "surround": "surround",
            "surrounding": "surround",
            "treble": "treble=g=5",
            "tremolo": "tremolo",
            "vaporwave": "aresample=48000,asetrate=48000*0.8",
            "vibrato": "vibrato=f=6.5"
        }
    })
    .on("playSong", function (message, queue, song) {
        message.channel.send("🎶 กำลังเล่นเพลง: %name - `%time`".replace("%name", song.name).replace("%time", song.formattedDuration));
    })
    .on("addSong", function (message, queue, song) {
        message.channel.send("✅ เพิ่มเพลง `%name` เรียบร้อยแล้วคะ".replace("%name", song.name));
    })
    .on("playList", function (message, queue, playlist, song) {
        // Coming soon
    })
    .on("addList", function (message, queue, playlist, song) {
        // Coming soon
        // let list = playlist.map((songs, index) => "**" + (index + 1) + "**. " + songs.name);

        // message.channel.send({
        //     "embed": {
        //         "title": playlist.title,
        //         "description": client.data.language.command_music_search_embed_description.replace("%search", list),
        //         "color": 16296490,
        //         "timestamp": new Date(),
        //         "footer": {
        //             "icon_url": message.author.displayAvatarURL(),
        //             "text": message.author.username
        //         }
        //     }
        // });
    })
    .on("searchResult", function (message, result) {
        let index = 0;
        let search = result.map(song => "**" + (++index) + "**. " + song.name + " - `" + song.formattedDuration + "`").join("\n");

        message.channel.send({
            "embed": {
                "title": client.data.language.command_music_search_embed_title,
                "description": client.data.language.command_music_search_embed_description.replace("%search", search),
                "color": 16296490,
                "timestamp": new Date(),
                "footer": {
                    "icon_url": message.author.displayAvatarURL(),
                    "text": message.author.username
                }
            }
        });
        client.music.options.searchSongs = false;
    })
    .on("searchCancel", function (message) {
        message.reply("🕘 ยกเลิกการค้นหาแล้ว เนื่องจากไม่พบการเลือกเพลงใดๆ");
        client.music.options.searchSongs = false;
    })
    .on("initQueue", function (queue) {
        queue.autoplay = false;
        queue.volume = 100;
        queue.filter = "clear";
    })
    .on("empty", function (message) {
        message.channel.send("💨 เอ่อ...จู่ๆ พวกเขาก็หายไปแล้วไม่กลับมาอีกเลย งั้น..ชิ่งก่อนละ~");
    })
    .on("finish", function (message) {
        message.channel.send("🍃 ตอนนี้ฉันคิวว่างแล้ว พร้อมที่จะเล่นเพลงต่อไปแล้วคะ");
    })
    .on("error", function (message, error) {
        console.log(error);
        message.reply(client.data.language.structures_musicPlayer_dispatcher_error + error);
    });

    diff.write(success + " All music and events handlers are installed.");
};