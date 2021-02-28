module.exports.run = async function (client, message, args) {
    let guildCreatedAt = message.guild.createdAt;
    let guildCreatedAtFormat = new Date(guildCreatedAt);

    let guildIcon = message.guild.iconURL();
    let guildTier = message.guild.premiumTier;
    let guildName = message.guild.name;
    let guildVerified = message.guild.verified;
    let guildID = message.guild.id;
    let guildOwner = message.guild.owner;
    let guildRegion = message.guild.region;
    let guildVerificationLevel = message.guild.verificationLevel;

    if (guildVerificationLevel == "NONE") {
        guildVerificationLevel = client.lang.command_information_server_guildVerificationLevel.NONE;
    }
    if (guildVerificationLevel == "LOW") {
        guildVerificationLevel = client.lang.command_information_server_guildVerificationLevel.LOW;
    }
    if (guildVerificationLevel == "MEDIUM") {
        guildVerificationLevel = client.lang.command_information_server_guildVerificationLevel.MEDIUM;
    }
    if (guildVerificationLevel == "HIGH") {
        guildVerificationLevel = client.lang.command_information_server_guildVerificationLevel.HIGH;
    }
    if (guildVerificationLevel == "VERY_HIGH") {
        guildVerificationLevel = client.lang.command_information_server_guildVerificationLevel.VERY_HIGH;
    }

    let guildMemberCount = message.guild.memberCount;
    let guildRolesSize = message.guild.roles.cache.size;
    let guildChannelsSize = message.guild.channels.cache.size;
    let guildEmojiSize = message.guild.emojis.cache.size;
    message.channel.send({
        "embed": {
            "title": client.lang.command_information_server_embed_info_title,
            "color": 4886754,
            "timestamp": guildCreatedAtFormat,
            "footer": {
                "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/hammer_1f528.png",
                "text": client.lang.command_information_server_embed_info_footer_text
            },
            "thumbnail": {
                "url": guildIcon
            },
            "fields": [
                {
                    "name": client.lang.command_information_server_embed_info_fields_0_name,
                    "value": guildName,
                    "inline": true
                },
                {
                    "name": client.lang.command_information_server_embed_info_fields_1_name,
                    "value": guildVerified,
                    "inline": true
                },
                {
                    "name": client.lang.command_information_server_embed_info_fields_2_name,
                    "value": guildID,
                    "inline": true
                },
                {
                    "name": client.lang.command_information_server_embed_info_fields_3_name,
                    "value": guildOwner,
                    "inline": true
                },
                {
                    "name": client.lang.command_information_server_embed_info_fields_4_name,
                    "value": guildRegion,
                    "inline": true
                },
                {
                    "name": client.lang.command_information_server_embed_info_fields_5_name,
                    "value": guildVerificationLevel,
                    "inline": true
                },
                {
                    "name": client.lang.command_information_server_embed_info_fields_6_name,
                    "value": guildTier,
                    "inline": true
                },
                {
                    "name": client.lang.command_information_server_embed_info_fields_7_name,
                    "value": guildMemberCount,
                    "inline": true
                },
                {
                    "name": client.lang.command_information_server_embed_info_fields_8_name,
                    "value": guildRolesSize,
                    "inline": true
                },
                {
                    "name": client.lang.command_information_server_embed_info_fields_9_name,
                    "value": guildChannelsSize,
                    "inline": true
                },
                {
                    "name": client.lang.command_information_server_embed_info_fields_10_name,
                    "value": guildEmojiSize,
                    "inline": true
                }
            ]
        }
    });
};

module.exports.help = {
    "name": "server",
    "description": "Get server information",
    "usage": "server",
    "category": "guild",
    "aliases": ["serverInfo", "si", "เกี่ยวกับเซิร์ฟเวอร์"]
};