const { MessageEmbed } = require("discord.js");

module.exports.run = function (client, message, args) {
    let input1 = args[0];

    let afkChannelId = message.guild.afkChannelId || client.translate.commands.guild.unknown;
    let afkTimeout = message.guild.afkTimeout.toString() || client.translate.commands.guild.unknown;
    let applicationId = message.guild.applicationId || client.translate.commands.guild.do_not_hav;
    let approximateMemberCount = message.guild.approximateMemberCount || client.translate.commands.guild.unknown;
    let approximatePresenceCount = message.guild.approximatePresenceCount || client.translate.commands.guild.unknown;
    let available = message.guild.available ? client.translate.commands.guild.available : client.translate.commands.guild.unavailable;
    let banner = message.guild.bannerURL() || client.translate.commands.guild.do_not_hav;
    let createdAt = dateFormat(message.guild.createAt) || client.translate.commands.guild.unknown;
    let createdTimestamp = dateFormat(message.guild.createdTimestamp) || client.translate.commands.guild.unknown;
    let defaultMessageNotification = message.guild.defaultMessageNotification || client.translate.commands.guild.unknown;
    let deleted = message.guild.deleted ? client.translate.commands.guild.yes : client.translate.commands.guild.no;
    let description = message.guild.description || client.translate.commands.guild.do_not_hav;
    let discoverySplash = message.guild.discoverySplashURL() || client.translate.commands.guild.do_not_hav;
    let explicitContentFilter = message.guild.explicitContentFilter || client.translate.commands.guild.unknown;
    let features = message.guild.features.join() || client.translate.commands.guild.do_not_hav;
    let icon = message.guild.iconURL() || client.translate.commands.guild.unknown;
    let id = message.guild.id || client.translate.commands.guild.unknown;
    let joinedAt = dateFormat(message.guild.joinedAt) || client.translate.commands.guild.unknown;
    let joinTimestamp = dateFormat(message.guild.joinTimestamp) || client.translate.commands.guild.unknown;
    let large = message.guild.large ? client.translate.commands.guild.yes : client.translate.commands.guild.no;
    let maximumMembers  = message.guild.maximumMembers.toString() || client.translate.commands.guild.unknown;
    let maximumPresences = message.guild.maximumPresences || client.translate.commands.guild.unknown;
    let memberCount = message.guild.memberCount.toString() || client.translate.commands.guild.unknown;
    let mfaLevel = message.guild.mfaLevel || client.translate.commands.guild.unknown;
    let name = message.guild.name || client.translate.commands.guild.unknown;
    let nameAcronym = message.guild.nameAcronym || client.translate.commands.guild.do_not_hav;
    let nsfwLevel = message.guild.nsfwLevel || client.translate.commands.guild.unknown;
    let ownerId = message.guild.ownerId || client.translate.commands.guild.unknown;
    let partnered = message.guild.partnered ? client.translate.commands.guild.yes : client.translate.commands.guild.none;
    let preferredLocale = message.guild.preferredLocale || client.translate.commands.guild.unknown;
    let premiumSubscriptionCount = message.guild.premiumSubscriptionCount.toString() || client.translate.commands.guild.unknown;
    let premiumTier = message.guild.premiumTier || client.translate.commands.guild.unknown;
    let publicUpdatesChannelId = message.guild.publicUpdatesChannelId || client.translate.commands.guild.unknown;
    let rulesChannelId = message.guild.rulesChannelId || client.translate.commands.guild.unknown;
    let splash = message.guild.splashURL() || client.translate.commands.guild.do_not_hav;
    let systemChannelId = message.guild.systemChannelId || client.translate.commands.guild.unknown;
    let vanityURLCode = message.guild.vanityURLCode || client.translate.commands.guild.do_not_hav;
    let vanityURLUses = message.guild.vanityURLUses || client.translate.commands.guild.unknown;
    let verificationLevel = message.guild.verificationLevel || client.translate.commands.guild.unknown;
    let verified = message.guild.verified ? client.translate.commands.guild.yes : client.translate.commands.guild.none;
    let widgetChannelId = message.guild.widgetChannelId || client.translate.commands.guild.unknown;
    let widgetEnabled = message.guild.widgetEnabled ? client.translate.commands.guild.on : client.translate.commands.guild.off;

    let cliAvatarURL = client.user.avatarURL();
    let cliUsername = client.user.username;

    let embed = new MessageEmbed()
    .setTitle(client.translate.commands.guild.server_info)
    .setDescription(client.translate.commands.guild.server_info_description)
    .setColor("BLUE")
    .setTimestamp()
    .setFooter(client.translate.commands.guild.info_datex, icon)
    .setThumbnail(icon)
    .setAuthor(cliUsername, cliAvatarURL, "https://maseshi.web.app/projects/shioru/")

    let info = [
        "afkChannelId",
        "afkTimeout",
        "applicationId",
        "approximateMemberCount",
        "approximatePresenceCount",
        "available",
        "banner",
        "createdAt",
        "createdTimestamp",
        "defaultMessageNotification",
        "deleted",
        "description",
        "discoverySplash",
        "explicitContentFilter",
        "features",
        "icon",
        "id",
        "joinedAt",
        "joinTimestamp",
        "large",
        "maximumMembers",
        "maximumPresences",
        "memberCount",
        "mfaLevel",
        "name",
        "nameAcronym",
        "nsfwLevel",
        "ownerId",
        "partnered",
        "preferredLocale",
        "premiumSubscriptionCount",
        "premiumTier",
        "publicUpdatesChannelId",
        "rulesChannelId",
        "splash",
        "systemChannelId",
        "vanityURLCode",
        "vanityURLUses",
        "verificationLevel",
        "verified",
        "widgetChannelId",
        "widgetEnabled"
    ];

    let infoList = [
        { "name": client.translate.commands.guild.afk_channel_id, "value": afkChannelId, "inline": true },
        { "name": client.translate.commands.guild.afk_timeout, "value": afkTimeout, "inline": true },
        { "name": client.translate.commands.guild.application_id, "value": applicationId, "inline": true },
        { "name": client.translate.commands.guild.approximate_member_count, "value": approximateMemberCount, "inline": true },
        { "name": client.translate.commands.guild.approximate_presence_count, "value": approximatePresenceCount, "inline": true },
        { "name": client.translate.commands.guild.guild_available, "value": available, "inline": true },
        { "name": client.translate.commands.guild.banner, "value": banner, "inline": true },
        { "name": client.translate.commands.guild.create_at, "value": createdAt, "inline": true },
        { "name": client.translate.commands.guild.create_timestamp, "value": createdTimestamp, "inline": true },
        { "name": client.translate.commands.guild.default_message_notification, "value": defaultMessageNotification, "inline": true },
        { "name": client.translate.commands.guild.deleted, "value": deleted, "inline": true },
        { "name": client.translate.commands.guild.description, "value": description, "inline": true },
        { "name": client.translate.commands.guild.discovery_splash, "value": discoverySplash, "inline": true },
        { "name": client.translate.commands.guild.explicit_content_filter, "value": explicitContentFilter, "inline": true },
        { "name": client.translate.commands.guild.features, "value": features, "inline": true },
        { "name": client.translate.commands.guild.icon, "value": icon, "inline": true },
        { "name": client.translate.commands.guild.id, "value": id, "inline": true },
        { "name": client.translate.commands.guild.joined_at, "value": joinedAt, "inline": true },
        { "name": client.translate.commands.guild.join_timestamp, "value": joinTimestamp, "inline": true },
        { "name": client.translate.commands.guild.large, "value": large, "inline": true },
        { "name": client.translate.commands.guild.maximum_members, "value": maximumMembers, "inline": true },
        { "name": client.translate.commands.guild.maximum_presences, "value": maximumPresences, "inline": true },
        { "name": client.translate.commands.guild.member_count, "value": memberCount, "inline": true },
        { "name": client.translate.commands.guild.mfs_level, "value": mfaLevel, "inline": true },
        { "name": client.translate.commands.guild.name, "value": name, "inline": true },
        { "name": client.translate.commands.guild.name_acronym, "value": nameAcronym, "inline": true },
        { "name": client.translate.commands.guild.nsfw_level, "value": nsfwLevel, "inline": true },
        { "name": client.translate.commands.guild.owner_id, "value": ownerId, "inline": true },
        { "name": client.translate.commands.guild.partnered, "value": partnered, "inline": true },
        { "name": client.translate.commands.guild.preferred_locale, "value": preferredLocale, "inline": true },
        { "name": client.translate.commands.guild.premium_subscription_count, "value": premiumSubscriptionCount, "inline": true },
        { "name": client.translate.commands.guild.premium_tier, "value": premiumTier, "inline": true },
        { "name": client.translate.commands.guild.public_updates_channel_id, "value": publicUpdatesChannelId, "inline": true },
        { "name": client.translate.commands.guild.rules_channel_id, "value": rulesChannelId, "inline": true },
        { "name": client.translate.commands.guild.splash, "value": splash, "inline": true },
        { "name": client.translate.commands.guild.system_channel_id, "value": systemChannelId, "inline": true },
        { "name": client.translate.commands.guild.vanity_url_code, "value": vanityURLCode, "inline": true },
        { "name": client.translate.commands.guild.vanity_url_uses, "value": vanityURLUses, "inline": true },
        { "name": client.translate.commands.guild.verification_level, "value": verificationLevel, "inline": true },
        { "name": client.translate.commands.guild.verified, "value": verified, "inline": true },
        { "name": client.translate.commands.guild.widget_channel_id, "value": widgetChannelId, "inline": true },
        { "name": client.translate.commands.guild.widget_enabled, "value": widgetEnabled, "inline": true }
    ];

    if (input1) {
        if (info.includes(input1)) {
            for (let i = 0; i < info.length; i++) {
                if (input1 === info[i]) {
                    embed.addFields(infoList[i]);
                    message.channel.send({ "embeds": [ embed ] });
                }
            }
        } else {
            message.reply(client.translate.commands.guild.specific_use.replace("%s", info.join()));
        }
    } else {
        embed.addFields(Array.from(infoList));
        message.channel.send({ "embeds": [ embed ] });
    }

    function dateFormat(data) {
        if (!data) return;
        let date = new Date(data);
        let days = [
            client.translate.commands.guild.sunday,
            client.translate.commands.guild.monday,
            client.translate.commands.guild.tuesday,
            client.translate.commands.guild.wednesday,
            client.translate.commands.guild.thursday,
            client.translate.commands.guild.friday,
            client.translate.commands.guild.saturday
        ];
        let months = [
            client.translate.commands.guild.january,
            client.translate.commands.guild.february,
            client.translate.commands.guild.march,
            client.translate.commands.guild.april,
            client.translate.commands.guild.may,
            client.translate.commands.guild.june,
            client.translate.commands.guild.july,
            client.translate.commands.guild.august,
            client.translate.commands.guild.september,
            client.translate.commands.guild.october,
            client.translate.commands.guild.november,
            client.translate.commands.guild.december
        ];
        let formatAt = client.translate.commands.guild.format_at
        .replace("%s1", days[date.getDay()])
        .replace("%s2", date.getDate())
        .replace("%s3", months[date.getMonth()])
        .replace("%s4", date.getFullYear())
        .replace("%s5", date.getHours())
        .replace("%s6", date.getMinutes());
        return formatAt;
    };
};

module.exports.help = {
    "name": "guild",
    "description": "Get guild information",
    "usage": "guild",
    "category": "information",
    "aliases": ["guildInfo", "gi", "เกี่ยวกับเซิร์ฟเวอร์"],
    "permissions": ["SEND_MESSAGES"]
};