const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { statusBedrock, status } = require("minecraft-server-util");

module.exports = {
    "name": "mcServer",
    "description": "Explore Minecraft server information",
    "category": "information",
    "permissions": {
        "client": ["SEND_MESSAGES"]
    }
};

module.exports.command = {
    "enable": true,
    "usage": "mcServer <platform> <ip> (port)",
    "aliases": ["mcserver", "mcs", "minecraftserver", "มายคราฟ", "เซิร์ฟมายคราฟ", "mc"],
    async execute(client, message, args) {
        const inputPlatform = args[0];
        const inputIP = args[1];
        const inputPort = args[2];

        const platform = ["pe", "be", "je", "pocket", "bedrock", "java", "pocket edition", "bedrock edition", "java edition"];
        const clientUsername = client.user.username;
        const clientAvatar = client.user.displayAvatarURL();
        const serverInfo = new EmbedBuilder()
            .setColor("#7ED321")
            .setAuthor({ "name": clientUsername, "iconURL": clientAvatar })
            .setTitle(client.translate.commands.mcServer.server_available)
            .setDescription(client.translate.commands.mcServer.server_detail)
            .setTimestamp()
            .setFooter({ "text": client.translate.commands.mcServer.last_check, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/clock-face-three-oclock_1f552.png" });
        const serverError = new EmbedBuilder()
            .setColor("#D0021B")
            .setAuthor({ "name": clientUsername, "iconURL": clientAvatar })
            .setDescription(client.translate.commands.mcServer.server_unavailable)
            .setTimestamp()
            .setFooter({ "text": client.translate.commands.mcServer.last_check, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/clock-face-three-oclock_1f552.png" });

        if (!inputPlatform) return message.reply(client.translate.commands.mcServer.platform_required);
        if (!platform.includes(inputPlatform.toLowerCase())) {
            return message.reply(client.translate.commands.mcServer.no_platform.replace("%s", platform.join(", ")));
        }
        if (!inputIP) return message.reply(client.translate.commands.mcServer.ip_address_required);
        if (inputPort && typeof inputPort === "number") return message.reply(client.translate.commands.mcServer.port_is_not_numeric);
        if (inputPort && inputPort.toString().length !== 5) return message.reply(client.translate.commands.mcServer.five_letter_port);

        switch (inputPlatform.toLowerCase()) {
            case "pe":
            case "be":
            case "pocket":
            case "bedrock":
            case "pocket edition":
            case "bedrock edition":
                statusBedrock(inputIP, inputPort ? parseInt(inputPort) : 19132).then((beRes) => {
                    const beEdition = beRes.edition;
                    const beMotd = beRes.motd.clean;
                    const beVersion = beRes.version.name ? beRes.version.name : client.translate.commands.mcServer.do_not_have;
                    const beMaxPlayers = beRes.players.max.toString();
                    const beOnlinePlayers = beRes.players.online ? beRes.players.online.toString() : client.translate.commands.mcServer.do_not_have;
                    const beMode = beRes.gameMode ? beRes.gameMode.toString() : client.translate.commands.mcServer.do_not_have;
                    const beHost = beRes.srvRecord.host;
                    const bePort = beRes.srvRecord.port.toString();

                    serverInfo.addFields(
                        { "name": client.translate.commands.mcServer.edition, "value": beEdition, "inline": true },
                        { "name": client.translate.commands.mcServer.address, "value": beHost, "inline": true },
                        { "name": client.translate.commands.mcServer.port, "value": bePort, "inline": true },
                        { "name": client.translate.commands.mcServer.motd, "value": beMotd, "inline": true },
                        { "name": client.translate.commands.mcServer.version, "value": beVersion, "inline": true },
                        { "name": client.translate.commands.mcServer.maximum_player_count, "value": beMaxPlayers, "inline": true },
                        { "name": client.translate.commands.mcServer.player_in_server, "value": beOnlinePlayers, "inline": true },
                        { "name": client.translate.commands.mcServer.mode, "value": beMode, "inline": true }
                    );

                    message.channel.send({ "embeds": [serverInfo] });
                }).catch(() => {
                    message.channel.send({ "embeds": [serverError] });
                });
                break;
            case "je":
            case "java":
            case "java edition":
                status(inputIP, inputPort ? parseInt(inputPort) : 25565).then((jeRes) => {
                    const jeVersion = jeRes.version.name ? jeRes.version.name : client.translate.commands.mcServer.do_not_have;
                    const jeOnlinePlayers = jeRes.players.online ? jeRes.players.online.toString() : client.translate.commands.mcServer.do_not_have;
                    const jeMaxPlayers = jeRes.players.max.toString();
                    const jeMotd = jeRes.motd.clean;

                    const jeFavicon = jeRes.favicon.split(",").slice(1).join(",");
                    const imageStream = Buffer.from(jeFavicon, "base64");
                    const attachment = new AttachmentBuilder(imageStream, { "name": "favicon.png" });

                    const jeHost = jeRes.srvRecord.host;
                    const jePort = jeRes.srvRecord.port.toString();

                    serverInfo.setThumbnail("attachment://favicon.png")
                        .addFields(
                            { "name": client.translate.commands.mcServer.edition, "value": "MCJE", "inline": true },
                            { "name": client.translate.commands.mcServer.address, "value": jeHost, "inline": true },
                            { "name": client.translate.commands.mcServer.port, "value": jePort, "inline": true },
                            { "name": client.translate.commands.mcServer.version, "value": jeVersion, "inline": true },
                            { "name": client.translate.commands.mcServer.player_in_server, "value": jeOnlinePlayers, "inline": true },
                            { "name": client.translate.commands.mcServer.maximum_player_count, "value": jeMaxPlayers, "inline": true },
                            { "name": client.translate.commands.mcServer.motd, "value": jeMotd, "inline": true }
                        );

                    message.channel.send({ "embeds": [serverInfo], "files": [attachment] });
                }).catch(() => {
                    message.channel.send({ "embeds": [serverError] });
                });
                break;
        }
    }
}

module.exports.interaction = {
    "enable": true,
    "data": {
        "name": module.exports.name.toLowerCase(),
        "name_localizations": {
            "en-US": "mcserver",
            "th": "เซิร์ฟเวอร์มายคราฟ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "en-US": "Explore Minecraft server information",
            "th": "สำรวจข้อมูลเซิร์ฟเวอร์ Minecraft"
        },
        "options": [
            {
                "type": 3,
                "name": "platform",
                "name_localizations": {
                    "th": "แพลตฟอร์ม"
                },
                "description": "Platform of Minecraft server",
                "description_localizations": {
                    "th": "แพลตฟอร์มของเซิร์ฟเวอร์ Minecraft"
                },
                "required": true,
                "choices": [
                    {
                        "name": "Bedrock",
                        "value": "be"
                    },
                    {
                        "name": "Java",
                        "value": "je"
                    }
                ]
            },
            {
                "type": 3,
                "name": "ip",
                "description": "IP address of Minecraft server",
                "description_localizations": {
                    "th": "ที่อยู่ IP ของเซิร์ฟเวอร์ Minecraft"
                },
                "required": true
            },
            {
                "type": 10,
                "name": "port",
                "name_localizations": {
                    "th": "พอร์ต"
                },
                "description": "Port of Minecraft server",
                "description_localizations": {
                    "th": "พอร์ตของเซิร์ฟเวอร์ Minecraft"
                },
                "required": false,
                "min_value": 10000,
                "max_value": 99999
            }
        ]
    },
    async execute(interaction) {
        const inputPlatform = interaction.options.get("platform").value;
        const inputIP = interaction.options.get("ip").value;
        const inputPort = interaction.options.get("port");

        const clientUsername = interaction.client.user.username;
        const clientAvatar = interaction.client.user.displayAvatarURL();
        const serverInfo = new EmbedBuilder()
            .setColor("#7ED321")
            .setAuthor({ "name": clientUsername, "iconURL": clientAvatar })
            .setTitle(interaction.client.translate.commands.mcServer.server_available)
            .setDescription(interaction.client.translate.commands.mcServer.server_detail)
            .setTimestamp()
            .setFooter({ "text": interaction.client.translate.commands.mcServer.last_check, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/clock-face-three-oclock_1f552.png" });
        const serverError = new EmbedBuilder()
            .setColor("#D0021B")
            .setAuthor({ "name": clientUsername, "iconURL": clientAvatar })
            .setDescription(interaction.client.translate.commands.mcServer.server_unavailable)
            .setTimestamp()
            .setFooter({ "text": interaction.client.translate.commands.mcServer.last_check, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/clock-face-three-oclock_1f552.png" });

        switch (inputPlatform.toLowerCase()) {
            case "pe":
            case "be":
            case "pocket":
            case "bedrock":
            case "pocket edition":
            case "bedrock edition":
                statusBedrock(inputIP, inputPort ? inputPort.value : 19132).then(async (beRes) => {
                    const beEdition = beRes.edition;
                    const beMotd = beRes.motd.clean;
                    const beVersion = beRes.version.name ? beRes.version.name : interaction.client.translate.commands.mcServer.do_not_have;
                    const beMaxPlayers = beRes.players.max.toString();
                    const beOnlinePlayers = beRes.players.online ? beRes.players.online.toString() : interaction.client.translate.commands.mcServer.do_not_have;
                    const beMode = beRes.gameMode ? beRes.gameMode.toString() : interaction.client.translate.commands.mcServer.do_not_have;
                    const beHost = beRes.srvRecord.host;
                    const bePort = beRes.srvRecord.port.toString();

                    serverInfo.addFields(
                        { "name": interaction.client.translate.commands.mcServer.edition, "value": beEdition, "inline": true },
                        { "name": interaction.client.translate.commands.mcServer.address, "value": beHost, "inline": true },
                        { "name": interaction.client.translate.commands.mcServer.port, "value": bePort, "inline": true },
                        { "name": interaction.client.translate.commands.mcServer.motd, "value": beMotd, "inline": true },
                        { "name": interaction.client.translate.commands.mcServer.version, "value": beVersion, "inline": true },
                        { "name": interaction.client.translate.commands.mcServer.maximum_player_count, "value": beMaxPlayers, "inline": true },
                        { "name": interaction.client.translate.commands.mcServer.player_in_server, "value": beOnlinePlayers, "inline": true },
                        { "name": interaction.client.translate.commands.mcServer.mode, "value": beMode, "inline": true }
                    );

                    await interaction.editReply({ "embeds": [serverInfo] });
                }).catch(async () => {
                    await interaction.editReply({ "embeds": [serverError] });
                });
                break;
            case "je":
            case "java":
            case "java edition":
                status(inputIP, inputPort ? inputPort.value : 25565).then(async (jeRes) => {
                    const jeVersion = jeRes.version.name ? jeRes.version.name : interaction.client.translate.commands.mcServer.do_not_have;
                    const jeOnlinePlayers = jeRes.players.online ? jeRes.players.online.toString() : interaction.client.translate.commands.mcServer.do_not_have;
                    const jeMaxPlayers = jeRes.players.max.toString();
                    const jeMotd = jeRes.motd.clean;

                    const jeFavicon = jeRes.favicon.split(",").slice(1).join(",");
                    const imageStream = Buffer.from(jeFavicon, "base64");
                    const attachment = new AttachmentBuilder(imageStream, { "name": "favicon.png" });

                    const jeHost = jeRes.srvRecord.host;
                    const jePort = jeRes.srvRecord.port.toString();

                    serverInfo.setThumbnail("attachment://favicon.png")
                        .addFields(
                            { "name": interaction.client.translate.commands.mcServer.edition, "value": "MCJE", "inline": true },
                            { "name": interaction.client.translate.commands.mcServer.address, "value": jeHost, "inline": true },
                            { "name": interaction.client.translate.commands.mcServer.port, "value": jePort, "inline": true },
                            { "name": interaction.client.translate.commands.mcServer.version, "value": jeVersion, "inline": true },
                            { "name": interaction.client.translate.commands.mcServer.player_in_server, "value": jeOnlinePlayers, "inline": true },
                            { "name": interaction.client.translate.commands.mcServer.maximum_player_count, "value": jeMaxPlayers, "inline": true },
                            { "name": interaction.client.translate.commands.mcServer.motd, "value": jeMotd, "inline": true }
                        );

                    await interaction.editReply({ "embeds": [serverInfo], "files": [attachment] });
                }).catch(async () => {
                    await interaction.editReply({ "embeds": [serverError] });
                });
                break;
        }
    }
}