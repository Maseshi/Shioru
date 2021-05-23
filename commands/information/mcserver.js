const discord = require("discord.js");
const util = require("minecraft-server-util");

module.exports.run = async function (client, message, args) {
    let platform = toLower(args[0]);
    let ip = args[1];
    let port = parseInt(args[2]);
    
    let username = client.user.username;
    let avatar = client.user.displayAvatarURL();

    let serverInfo = new discord.MessageEmbed()
	.setColor("#7ED321")
	.setAuthor(username, avatar)
    .setTitle(client.data.language.command_information_mcserver_serverInfo_title)
	.setDescription(client.data.language.command_information_mcserver_serverInfo_description)
	.setTimestamp()
	.setFooter(client.data.language.command_information_mcserver_serverInfo_footer_text, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/clock-face-three-oclock_1f552.png");
    let serverError = new discord.MessageEmbed()
	.setColor("#D0021B")
    .setAuthor(username, avatar)
	.setDescription(client.data.language.command_information_mcserver_serverError_title)
    .setTimestamp()
	.setFooter(client.data.language.command_information_mcserver_serverError_footer_text, "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/clock-face-three-oclock_1f552.png");

    if (!platform) return message.reply(client.data.language.command_information_mcserver_platform_empty);
    if (!["pe", "be", "je", "pocket edition", "bedrock edition", "java edition"].includes(platform)) {
        return message.reply(client.data.language.command_information_mcserver_dont_have_this_platform);
    }
    if (!ip) return message.reply(client.data.language.command_information_mcserver_ip_empty);

    switch (platform) {
        case "pe":
        case "be":
        case "pocket edition":
        case "bedrock edition":
            let beres;

            if (port) {
                if ((port.toString().length) !== 5) return message.reply(client.data.language.command_information_mcserver_be_port_empty);

                beres = await util.statusBedrock(ip, { "port": port }).catch(message.channel.send({ "embed": serverError }));
            } else {
                beres = await util.statusBedrock(ip).catch(message.reply({ "embed": serverError }));
            }
            
            if (beres) {
                let brhost = beres.host;
                serverInfo.addField(client.data.language.command_information_mcserver_be_serverInfo_field_0่, brhost, true);
                
                let beport = beres.port;
                if (port) serverInfo.addField(client.data.language.command_information_mcserver_be_serverInfo_field_1, beport, true);

                let bemotda = beres.motdLine1.descriptionText;
                let bemotdb = beres.motdLine2.descriptionText;
                let beversion = beres.version;
                let bemaxPlayers = beres.maxPlayers;
                
                let beonlinePlayers = beres.onlinePlayers;
                if (!beonlinePlayers) beonlinePlayers = client.data.language.command_information_mcserver_be_serverInfo_field_6_not;

                let bemode = beres.gameMode;
                
                let beipv4 = beres.portIPv4;
                if (!beipv4) beipv4 = client.data.language.command_information_mcserver_be_serverInfo_field_8_not;

                let beipv6 = beres.portIpv6;
                if (!beipv6) beipv6 = client.data.language.command_information_mcserver_be_serverInfo_field_9_not;

                serverInfo.addFields(
                    { "name": client.data.language.command_information_mcserver_be_serverInfo_field_2, "value": bemotda, "inline": true },
                    { "name": client.data.language.command_information_mcserver_be_serverInfo_field_3, "value": bemotdb, "inline": true },
                    { "name": client.data.language.command_information_mcserver_be_serverInfo_field_4, "value": beversion, "inline": true },
                    { "name": client.data.language.command_information_mcserver_be_serverInfo_field_5, "value": bemaxPlayers, "inline": true },
                    { "name": client.data.language.command_information_mcserver_be_serverInfo_field_6, "value": beonlinePlayers, "inline": true },
                    { "name": client.data.language.command_information_mcserver_be_serverInfo_field_7, "value": bemode, "inline": true },
                    { "name": client.data.language.command_information_mcserver_be_serverInfo_field_8, "value": beipv4, "inline": true },
                    { "name": client.data.language.command_information_mcserver_be_serverInfo_field_9, "value": beipv6, "inline": true }
                );
                message.channel.send({ "embed": serverInfo });
            }
        break;
        
        case "je":
        case "java edition":
            let jeres;

            if (port) {
                if ((port.toString().length) !== 5) return message.reply(client.data.language.command_information_mcserver_je_port_empty);

                jeres = await util.status(ip, { "port": port }).catch(message.channel.send({ "embed": serverError })).catch(() => { return; });
            } else {
                jeres = await util.status(ip).catch(message.channel.send({ "embed": serverError })).catch(() => { return; });
            }

            if (jeres) {
                let jehost = jeres.host;
                serverInfo.addField(client.data.language.command_information_mcserver_je_serverInfo_field_0, jehost, true);

                let jeport = jeres.port;
                if (port) serverInfo.addField(client.data.language.command_information_mcserver_je_serverInfo_field_1, jeport, true);

                let jeversion = jeres.version;

                let jeonlinePlayers = jeres.onlinePlayers;
                if (jeonlinePlayers === 0) jeonlinePlayers = client.data.language.command_information_mcserver_je_serverInfo_field_3_not;

                let jemaxPlayers = jeres.maxPlayers;
                let jedescription = jeres.description.descriptionText;
                
                let jefavicon = jeres.favicon.split(",").slice(1).join(",");
                let imageStream = Buffer.from(jefavicon, "base64");
                let attachment = new discord.MessageAttachment(imageStream, "favicon.png");
                serverInfo.attachFiles([attachment])
                .setThumbnail("attachment://favicon.png");
                
                serverInfo.addFields(
                    { "name": client.data.language.command_information_mcserver_je_serverInfo_field_2, "value": jeversion, "inline": true },
                    { "name": client.data.language.command_information_mcserver_je_serverInfo_field_3, "value": jeonlinePlayers, "inline": true },
                    { "name": client.data.language.command_information_mcserver_je_serverInfo_field_4, "value": jemaxPlayers, "inline": true },
                    { "name": client.data.language.command_information_mcserver_je_serverInfo_field_5, "value": jedescription, "inline": true }
                );
                message.channel.send({ "embed": serverInfo });
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