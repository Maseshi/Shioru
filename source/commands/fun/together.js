const fetch = require("node-fetch");
const catchError = require("../../extras/catchError");

module.exports.run = function (client, message, args) {
    const inputType = args[0];
    const inputChannel = args.slice(1).join(" ");
    
    const token = client.config.token;
    let voiceChannel = message.member.voice.channel;
    const apps = {
        youtube: "880218394199220334",
        youtubedev: "880218832743055411",
        poker: "755827207812677713",
        betrayal: "773336526917861400",
        fishing: "814288819477020702",
        chess: "832012774040141894",
        chessdev: "832012586023256104",
        lettertile: "879863686565621790",
        wordsnack: "879863976006127627",
        doodlecrew: "878067389634314250",
        awkword: "879863881349087252",
        spellcast: "852509694341283871",
        checkers: "832013003968348200",
        puttparty: "763133495793942528",
        sketchyartist: "879864070101172255"
    };
    const list = Object.keys(apps);

    if (!inputType) return message.reply(client.translate.commands.together.empty.replace("%s", list));
    if (!list.includes(inputType.toLowerCase())) return message.reply(client.translate.commands.together.do_not_have.replace("%s1", inputType).replace("%s2", list.length).replace("%s3", list));
    if (!inputChannel) {
        if (!voiceChannel) return message.reply(client.translate.commands.together.user_not_in_channel);
    } else {
        voiceChannel = message.guild.channels.cache.find(channels => (channels.id === inputChannel) || (channels.name === inputChannel));
        
        if (voiceChannel.type === "GUILD_TEXT") return message.reply(client.translate.commands.together.not_in_text_channel);
        if (!voiceChannel) return message.reply(client.translate.commands.together.voice_channel_not_found);
    }

    fetch("https://discord.com/api/v8/channels/" + voiceChannel.id + "/invites", {
            "method": "POST",
            "body": JSON.stringify({
                "max_age": 86400,
                "max_uses": 0,
                "target_application_id": apps[inputType],
                "target_type": 2,
                "temporary": false,
                "validate": null,
            }),
            "headers": {
                "Authorization": "Bot " + token,
                "Content-Type": "application/json",
            }
        })
    .then((res) => res.json())
    .then((invite) => {
        if (!invite.code) return message.reply(client.translate.commands.together.can_not_open.replace("%s", inputType));
            
        message.channel.send(client.translate.commands.together.join_via_this_link + invite.code);
    }).catch((error) => {
        catchError(client, message, module.exports.help.name, error);
    });
};

module.exports.help = {
    "name": "together",
    "description": "Run a specific emulator through the audio channel.",
    "usage": "together <name> (channel: name, id)",
    "category": "fun",
    "aliases": ["tg"],
    "userPermissions": ["START_EMBEDDED_ACTIVITIES"],
    "clientPermissions": ["SEND_MESSAGES", "START_EMBEDDED_ACTIVITIES"]
};