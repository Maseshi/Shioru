const { MessageEmbed, MessageAttachment } = require("discord.js");
const { statusBedrock, status } = require("minecraft-server-util");
const catchError = require("../../extras/catchError");

module.exports.run = async function (client, message, args) {
    if (!args[0]) return message.reply(client.translate.commands.mcserver.platform_reqiured);

    let platform = args[0].toLowerCase();
    let ip = args[1];
    let port = parseInt(args[2]);

    if (!["pe", "be", "je", "pocket edition", "bedrock edition", "java edition"].includes(platform)) {
        return message.reply(client.translate.commands.mcserver.no_platform);
    }
    if (!ip) return message.reply(client.translate.commands.mcserver.ip_address_reqiured);
    
    let username = client.user.username;
    let avatar = client.user.displayAvatarURL();

    let serverInfo = new MessageEmbed()
	.setColor("#7ED321")
	.setAuthor(username, avatar)
    .setTitle(client.translate.commands.mcserver.server_available)
	.setDescription(client.translate.commands.mcserver.server_detail)
	.setTimestamp()
	.setFooter(client.translate.commands.mcserver.last_check, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/clock-face-three-oclock_1f552.png");
    let serverError = new MessageEmbed()
	.setColor("#D0021B")
    .setAuthor(username, avatar)
	.setDescription(client.translate.commands.mcserver.server_unavailable)
    .setTimestamp()
	.setFooter(client.translate.commands.mcserver.last_check, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/clock-face-three-oclock_1f552.png");

    switch (platform) {
        case "pe":
        case "be":
        case "pocket edition":
        case "bedrock edition":
            let beres;

            if (port) {
                if ((port.toString().length) !== 5) return message.reply(client.translate.commands.mcserver.five_letter_port);

                beres = await statusBedrock(ip, {
                    "port": port
                }).catch(message.channel.send({ "embeds": [ serverError ] }));
            } else {
                beres = await statusBedrock(ip).catch(message.reply({ "embeds": [ serverError ] }));
            }
            
            if (beres) {
                let brhost = beres.host;
                serverInfo.addField(client.translate.commands.mcserver.address, brhost, true);
                
                let beport = beres.port;
                if (port) serverInfo.addField(client.translate.commands.mcserver.port, beport, true);

                let bemotda = beres.motdLine1.descriptionText;
                let bemotdb = beres.motdLine2.descriptionText;
                let beversion = beres.version;
                let bemaxPlayers = beres.maxPlayers;
                
                let beonlinePlayers = beres.onlinePlayers;
                if (!beonlinePlayers) beonlinePlayers = client.translate.commands.mcserver.do_not_have;

                let bemode = beres.gameMode;
                
                let beipv4 = beres.portIPv4;
                if (!beipv4) beipv4 = client.translate.commands.mcserver.not_found;

                let beipv6 = beres.portIpv6;
                if (!beipv6) beipv6 = client.translate.commands.mcserver.not_found;

                serverInfo.addFields(
                    { "name": client.translate.commands.mcserver.description_one, "value": bemotda, "inline": true },
                    { "name": client.translate.commands.mcserver.description_two, "value": bemotdb, "inline": true },
                    { "name": client.translate.commands.mcserver.version, "value": beversion, "inline": true },
                    { "name": client.translate.commands.mcserver.maximum_player_count, "value": bemaxPlayers, "inline": true },
                    { "name": client.translate.commands.mcserver.player_in_server, "value": beonlinePlayers, "inline": true },
                    { "name": client.translate.commands.mcserver.do_not_have, "value": bemode, "inline": true },
                    { "name": client.translate.commands.mcserver.mode, "value": beipv4, "inline": true },
                    { "name": "IPv4", "value": beipv6, "inline": true }
                );
                message.channel.send({ "embeds": [ serverInfo ] });
            }
        break;
        
        case "je":
        case "java edition":
            let jeres;

            if (port) {
                if ((port.toString().length) !== 5) return message.reply(client.translate.commands.mcserver.five_letter_port);

                jeres = await status(ip, {
                    "port": port
                }).catch(function() {
                    message.channel.send({
                        "embeds": [ serverError ]
                    });
                }).catch(function(error) {
                    return catchError(client, message, module.exports.help.name, error);
                });
            } else {
                jeres = await status(ip).catch(function(error) {
                    message.channel.send({
                        "embeds": [ serverError ]
                    });
                }).catch(function(error) {
                    return catchError(client, message, module.exports.help.name, error);
                });
            }

            if (jeres) {
                let jehost = jeres.host;
                serverInfo.addField(client.translate.commands.mcserver.address, jehost, true);

                let jeport = jeres.port;
                if (port) serverInfo.addField(client.translate.commands.mcserver.port, jeport, true);

                let jeversion = jeres.version;

                let jeonlinePlayers = jeres.onlinePlayers;
                if (jeonlinePlayers === 0) jeonlinePlayers = client.translate.commands.mcserver.do_not_have;

                let jemaxPlayers = jeres.maxPlayers;
                let jedescription = jeres.description.descriptionText;
                
                let jefavicon = jeres.favicon.split(",").slice(1).join(",");
                let imageStream = Buffer.from(jefavicon, "base64");
                let attachment = new MessageAttachment(imageStream, "favicon.png");
                serverInfo.attachFiles([attachment]).setThumbnail("attachment://favicon.png");
                
                serverInfo.addFields(
                    { "name": client.translate.commands.mcserver.version, "value": jeversion, "inline": true },
                    { "name": client.translate.commands.mcserver.player_in_server, "value": jeonlinePlayers, "inline": true },
                    { "name": client.translate.commands.mcserver.maximum_player_count, "value": jemaxPlayers, "inline": true },
                    { "name": client.translate.commands.mcserver.description, "value": jedescription, "inline": true }
                );
                message.channel.send({ "embeds": [ serverInfo ] });
            }
        break;
    }
};

module.exports.help = {
    "name": "mcserver",
	"description": "Explore Minecraft server information",
	"usage": "mcserver (platform) (ip) [port]",
	"category": "information",
	"aliases": ["mcs", "minecraftserver", "มายคราฟ", "เซิร์ฟมายคราฟ", "mc"],
    "permissions": ["SEND_MESSAGES"]
};