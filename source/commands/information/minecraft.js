const { EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require("discord.js");
const { get } = require("axios").default;

module.exports = {
    "enable": true,
    "name": "minecraft",
    "description": "Check server or skin status in Minecraft.",
    "category": "information",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "minecraft",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "มายคราฟ"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "ตรวจสอบสถานะเซิร์ฟเวอร์หรือสกินใน Minecraft."
        },
        "options": [
            {
                "type": 1,
                "name": "status",
                "name_localizations": {
                    "th": "สถานะ"
                },
                "description": "Explore Minecraft Server Info",
                "description_localizations": {
                    "th": "สำรวจข้อมูลเซิร์ฟเวอร์ Minecraft"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "ip",
                        "description": "IP address of Minecraft server",
                        "description_localizations": {
                            "th": "ที่อยู่ IP ของเซิร์ฟเวอร์ Minecraft (ตัวอย่าง: 127.0.0.1:25565)"
                        },
                        "required": true
                    }
                ]
            },
            {
                "type": 1,
                "name": "skin",
                "name_localizations": {
                    "th": "สกิน"
                },
                "description": "Get the player's skin.",
                "description_localizations": {
                    "th": "รับสกินของผู้เล่นดังกล่าว"
                },
                "options": [
                    {
                        "type": 3,
                        "name": "name",
                        "description": "Player's name",
                        "description_localizations": {
                            "th": "ชื่อของผู้เล่น"
                        },
                        "required": true
                    }
                ]
            }
        ]
    },
    async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        const clientUsername = interaction.client.user.username;
        const clientAvatar = interaction.client.user.displayAvatarURL();

        switch (subCommand) {
            case "status":
                const inputIP = interaction.options.getString("ip");

                const statusEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ "name": clientUsername, "iconURL": clientAvatar })
                    .setDescription("```" + interaction.client.translate.commands.minecraft.server_available + "```")
                    .setTimestamp()
                    .setFooter({ "text": interaction.client.translate.commands.minecraft.last_check, "iconURL": "https://em-content.zobj.net/thumbs/120/microsoft/319/three-oclock_1f552.png" });
                const statusErrorEmbed = new EmbedBuilder()
                    .setColor("Red")
                    .setAuthor({ "name": clientUsername, "iconURL": clientAvatar })
                    .setDescription("```" + interaction.client.translate.commands.minecraft.server_unavailable + "```")
                    .setTimestamp()
                    .setFooter({ "text": interaction.client.translate.commands.minecraft.last_check, "iconURL": "https://em-content.zobj.net/thumbs/120/microsoft/319/three-oclock_1f552.png" });

                try {
                    const response = await get("https://api.mcsrvstat.us/2/" + inputIP);

                    if (!response.data.online) return await interaction.reply({ "embeds": [statusErrorEmbed] });

                    const host = response.data.hostname;
                    const ip = response.data.ip;
                    const icon = response.data.icon ? new AttachmentBuilder(new Buffer.from(response.data.icon.split(",")[1], "base64"), { "name": "icon.png" }) : "";
                    const port = response.data.port.toString();
                    const version = response.data.version ?? interaction.client.translate.commands.minecraft.do_not_have;
                    const maxPlayers = response.data.players.max.toString();
                    const onlinePlayers = response.data.players.online ? response.data.players.online.toString() : interaction.client.translate.commands.minecraft.do_not_have;
                    const motd = response.data.motd.clean.join("\n");

                    statusEmbed.setThumbnail(response.data.icon ? "attachment://icon.png" : null)
                        .addFields(
                            { "name": interaction.client.translate.commands.minecraft.address, "value": host, "inline": true },
                            { "name": interaction.client.translate.commands.minecraft.ip, "value": ip, "inline": true },
                            { "name": interaction.client.translate.commands.minecraft.port, "value": port, "inline": true },
                            { "name": interaction.client.translate.commands.minecraft.version, "value": version, "inline": true },
                            { "name": interaction.client.translate.commands.minecraft.maximum_player_count, "value": maxPlayers, "inline": true },
                            { "name": interaction.client.translate.commands.minecraft.player_in_server, "value": onlinePlayers, "inline": true },
                            { "name": interaction.client.translate.commands.minecraft.motd, "value": "```" + motd + "```", "inline": false },
                        );

                    await interaction.reply({ "embeds": [statusEmbed], "files": [response.data.icon ? icon : null] });
                } catch (error) {
                    await interaction.reply({ "embeds": [statusErrorEmbed] });
                }
                break;
            case "skin":
                const inputName = interaction.options.getString("name");

                const skin = new AttachmentBuilder("https://minotar.net/armor/body/" + inputName + "/700.png", { "name": "skin.png" });

                const skinEmbed = new EmbedBuilder()
                    .setColor("Green")
                    .setAuthor({ "name": clientUsername, "iconURL": clientAvatar })
                    .setTitle(interaction.client.translate.commands.minecraft.skin_of)
                    .setImage("attachment://skin.png")
                    .setTimestamp();

                await interaction.reply({ "embeds": [skinEmbed], "files": [skin] });
                break;
        }
    }
}