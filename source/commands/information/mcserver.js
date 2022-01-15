const { MessageEmbed, MessageAttachment } = require("discord.js");
const { statusBedrock, status } = require("minecraft-server-util");
const catchError = require("../../extras/catchError");

module.exports.run = (client, message, args) => {
    const inputPlatform = args[0];
    const inputIP = args[1];
    const inputPort = args[2];

    const platform = ["pe", "be", "je", "pocket edition", "bedrock edition", "java edition"];
    const clientUsername = client.user.username;
    const clientAvatar = client.user.displayAvatarURL();
    const serverInfo = new MessageEmbed()
        .setColor("#7ED321")
        .setAuthor({ "name": clientUsername, "iconURL": clientAvatar })
        .setTitle(client.translate.commands.mcserver.server_available)
        .setDescription(client.translate.commands.mcserver.server_detail)
        .setTimestamp()
        .setFooter({ "text": client.translate.commands.mcserver.last_check, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/clock-face-three-oclock_1f552.png" });
    const serverError = new MessageEmbed()
        .setColor("#D0021B")
        .setAuthor({ "name": clientUsername, "iconURL": clientAvatar })
        .setDescription(client.translate.commands.mcserver.server_unavailable)
        .setTimestamp()
        .setFooter({ "text": client.translate.commands.mcserver.last_check, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/clock-face-three-oclock_1f552.png" });

    if (!inputPlatform) return message.reply(client.translate.commands.mcserver.platform_reqiured);
    if (!platform.includes(inputPlatform.toLowerCase())) {
        return message.reply(client.translate.commands.mcserver.no_platform);
    }
    if (!inputIP) return message.reply(client.translate.commands.mcserver.ip_address_reqiured);
    if (inputPort && parseInt(inputPort)) return message.reply("❎ พอร์ตมันควรเป็นตัวเลขทั้งหมดสิ ลองเช็คอีกรอบนะ");
    if (inputPort && inputPort.toString().length !== 5) return message.reply(client.translate.commands.mcserver.five_letter_port);

    switch (inputPlatform.toLowerCase()) {
        case "pe":
        case "be":
        case "pocket edition":
        case "bedrock edition":
            statusBedrock(inputIP, inputPort ? parseInt(inputPort) : 19132).then((beRes) => {
                const beEdition = beRes.edition;
                const beMotd = beRes.motd.clean;
                const beVersion = beRes.version.name ? beRes.version.name : client.translate.commands.mcserver.do_not_have;
                const beMaxPlayers = beRes.players.max.toString();
                const beOnlinePlayers = beRes.players.online ? beRes.players.online.toString() : client.translate.commands.mcserver.do_not_have;
                const beMode = beRes.gameMode ? beRes.gameMode.toString() : client.translate.commands.mcserver.do_not_have;
                const beHost = beRes.srvRecord.host;
                const bePort = beRes.srvRecord.port.toString();
                    
                serverInfo.addFields(
                    { "name": client.translate.commands.mcserver.edition, "value": beEdition, "inline": true },
                    { "name": client.translate.commands.mcserver.address, "value": beHost, "inline": true },
                    { "name": client.translate.commands.mcserver.port, "value": bePort, "inline": true },
                    { "name": client.translate.commands.mcserver.motd, "value": beMotd, "inline": true },
                    { "name": client.translate.commands.mcserver.version, "value": beVersion, "inline": true },
                    { "name": client.translate.commands.mcserver.maximum_player_count, "value": beMaxPlayers, "inline": true },
                    { "name": client.translate.commands.mcserver.player_in_server, "value": beOnlinePlayers, "inline": true },
                    { "name": client.translate.commands.mcserver.mode, "value": beMode, "inline": true }
                );

                message.channel.send({ "embeds": [ serverInfo ] });
            }).catch(() => {
                message.channel.send({ "embeds": [ serverError ] });
            });
        break;
        case "je":
        case "java edition":
            status(inputIP, inputPort ? parseInt(inputPort) : 25565).then((jeRes) => {
                const jeVersion = jeRes.version.name ? jeRes.version.name : client.translate.commands.mcserver.do_not_have;
                const jeOnlinePlayers = jeRes.players.online ? jeRes.players.online.toString() : client.translate.commands.mcserver.do_not_have;
                const jeMaxPlayers = jeRes.players.max.toString();
                const jeMotd = jeRes.motd.clean;
                
                const jeFavicon = jeRes.favicon.split(",").slice(1).join(",");
                const imageStream = Buffer.from(jeFavicon, "base64");
                const attachment = new MessageAttachment(imageStream, "favicon.png");

                const jeHost = jeRes.srvRecord.host;
                const jePort = jeRes.srvRecord.port.toString();

                serverInfo.setThumbnail("attachment://favicon.png")
                .addFields(
                    { "name": client.translate.commands.mcserver.edition, "value": "MCJE", "inline": true },
                    { "name": client.translate.commands.mcserver.address, "value": jeHost, "inline": true },
                    { "name": client.translate.commands.mcserver.port, "value": jePort, "inline": true },
                    { "name": client.translate.commands.mcserver.version, "value": jeVersion, "inline": true },
                    { "name": client.translate.commands.mcserver.player_in_server, "value": jeOnlinePlayers, "inline": true },
                    { "name": client.translate.commands.mcserver.maximum_player_count, "value": jeMaxPlayers, "inline": true },
                    { "name": client.translate.commands.mcserver.motd, "value": jeMotd, "inline": true }
                );
                    
                message.channel.send({ "embeds": [ serverInfo ], "files": [ attachment ] });
            }).catch(() => {
                message.channel.send({ "embeds": [ serverError ] });
            });
        break;
    }
};

module.exports.help = {
    "name": "mcserver",
	"description": "Explore Minecraft server information",
	"usage": "mcserver <platform> <ip> (port)",
	"category": "information",
	"aliases": ["mcs", "minecraftserver", "มายคราฟ", "เซิร์ฟมายคราฟ", "mc"],
    "clientPermissions": ["SEND_MESSAGES"]
};