const { EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require("discord.js");
const { statusBedrock, status } = require("minecraft-server-util");

module.exports = {
    "enable": true,
    "name": "mcServer",
    "description": "Explore Minecraft server information",
    "category": "information",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "mcServer <platform> <ip> (port)",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
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