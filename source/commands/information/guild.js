const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { dateFormat } = require("../../utils/miscUtils");

module.exports = {
    "enable": true,
    "name": "guild",
    "description": "Get information about the server.",
    "category": "information",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "guild [info(String)]",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "กิลด์"
        },
        "description": module.exports.description,
        "description_localizations": {
            "th": "รับข้อมูลเกี่ยวกับเซิร์ฟเวอร์"
        },
        "options": [
            {
                "type": 3,
                "name": "info",
                "name_localizations": {
                    "th": "ข้อมูล"
                },
                "description": "The information you want to be specific, for example afkChannelId.",
                "description_localizations": {
                    "th": "ข้อมูลที่คุณต้องการเฉพาะเช่น afkChannelId"
                },
                "required": false
            }
        ]
    },
    async execute(interaction) {
        const inputInfo = interaction.options.getString("info") ?? "";

        const afkChannelId = interaction.guild.afkChannelId || interaction.client.translate.commands.guild.unknown;
        const afkTimeout = interaction.guild.afkTimeout.toString() || interaction.client.translate.commands.guild.unknown;
        const applicationId = interaction.guild.applicationId || interaction.client.translate.commands.guild.do_not_have;
        const approximateMemberCount = interaction.guild.approximateMemberCount || interaction.client.translate.commands.guild.unknown;
        const approximatePresenceCount = interaction.guild.approximatePresenceCount || interaction.client.translate.commands.guild.unknown;
        const available = interaction.guild.available ? interaction.client.translate.commands.guild.available : interaction.client.translate.commands.guild.unavailable;
        const banner = interaction.guild.bannerURL() || interaction.client.translate.commands.guild.do_not_have;
        const createdAt = dateFormat(interaction.guild.createAt) || interaction.client.translate.commands.guild.unknown;
        const createdTimestamp = dateFormat(interaction.guild.createdTimestamp) || interaction.client.translate.commands.guild.unknown;
        const defaultMessageNotification = interaction.guild.defaultMessageNotification || interaction.client.translate.commands.guild.unknown;
        const description = interaction.guild.description || interaction.client.translate.commands.guild.do_not_have;
        const discoverySplash = interaction.guild.discoverySplashURL() || interaction.client.translate.commands.guild.do_not_have;
        const explicitContentFilter = interaction.guild.explicitContentFilter.toString() || interaction.client.translate.commands.guild.unknown;
        const features = interaction.guild.features.join() || interaction.client.translate.commands.guild.do_not_have;
        const icon = interaction.guild.iconURL() || interaction.client.translate.commands.guild.unknown;
        const id = interaction.guild.id || interaction.client.translate.commands.guild.unknown;
        const joinedAt = dateFormat(interaction.guild.joinedAt) || interaction.client.translate.commands.guild.unknown;
        const joinTimestamp = dateFormat(interaction.guild.joinTimestamp) || interaction.client.translate.commands.guild.unknown;
        const large = interaction.guild.large ? interaction.client.translate.commands.guild.yes : interaction.client.translate.commands.guild.no;
        const maximumMembers = interaction.guild.maximumMembers.toString() || interaction.client.translate.commands.guild.unknown;
        const maximumPresences = interaction.guild.maximumPresences || interaction.client.translate.commands.guild.unknown;
        const memberCount = interaction.guild.memberCount.toString() || interaction.client.translate.commands.guild.unknown;
        const mfaLevel = interaction.guild.mfaLevel || interaction.client.translate.commands.guild.unknown;
        const name = interaction.guild.name || interaction.client.translate.commands.guild.unknown;
        const nameAcronym = interaction.guild.nameAcronym || interaction.client.translate.commands.guild.do_not_have;
        const nsfwLevel = interaction.guild.nsfwLevel || interaction.client.translate.commands.guild.unknown;
        const ownerId = interaction.guild.ownerId || interaction.client.translate.commands.guild.unknown;
        const partnered = interaction.guild.partnered ? interaction.client.translate.commands.guild.yes : interaction.client.translate.commands.guild.none;
        const preferredLocale = interaction.guild.preferredLocale || interaction.client.translate.commands.guild.unknown;
        const premiumSubscriptionCount = interaction.guild.premiumSubscriptionCount.toString() || interaction.client.translate.commands.guild.unknown;
        const premiumTier = interaction.guild.premiumTier || interaction.client.translate.commands.guild.unknown;
        const publicUpdatesChannelId = interaction.guild.publicUpdatesChannelId || interaction.client.translate.commands.guild.unknown;
        const rulesChannelId = interaction.guild.rulesChannelId || interaction.client.translate.commands.guild.unknown;
        const splash = interaction.guild.splashURL() || interaction.client.translate.commands.guild.do_not_have;
        const systemChannelId = interaction.guild.systemChannelId || interaction.client.translate.commands.guild.unknown;
        const vanityURLCode = interaction.guild.vanityURLCode || interaction.client.translate.commands.guild.do_not_have;
        const vanityURLUses = interaction.guild.vanityURLUses || interaction.client.translate.commands.guild.unknown;
        const verificationLevel = interaction.guild.verificationLevel || interaction.client.translate.commands.guild.unknown;
        const verified = interaction.guild.verified ? interaction.client.translate.commands.guild.yes : interaction.client.translate.commands.guild.none;
        const widgetChannelId = interaction.guild.widgetChannelId || interaction.client.translate.commands.guild.unknown;
        const widgetEnabled = interaction.guild.widgetEnabled ? interaction.client.translate.commands.guild.on : interaction.client.translate.commands.guild.off;

        const clientUsername = interaction.client.user.username;
        const clientAvatarURL = interaction.client.user.avatarURL();
        const guildIcon = interaction.guild.iconURL();
        const embed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.guild.server_info)
            .setDescription(interaction.client.translate.commands.guild.server_info_description)
            .setColor("Blue")
            .setTimestamp()
            .setFooter({ "text": interaction.client.translate.commands.guild.info_date, "iconURL": guildIcon || "" })
            .setThumbnail(guildIcon || "")
            .setAuthor({ "name": clientUsername, "iconURL": clientAvatarURL });

        const info = [
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

        const infoList = [
            { "name": interaction.client.translate.commands.guild.afk_channel_id, "value": afkChannelId, "inline": true },
            { "name": interaction.client.translate.commands.guild.afk_timeout, "value": afkTimeout, "inline": true },
            { "name": interaction.client.translate.commands.guild.application_id, "value": applicationId, "inline": true },
            { "name": interaction.client.translate.commands.guild.approximate_member_count, "value": approximateMemberCount, "inline": true },
            { "name": interaction.client.translate.commands.guild.approximate_presence_count, "value": approximatePresenceCount, "inline": true },
            { "name": interaction.client.translate.commands.guild.guild_available, "value": available, "inline": true },
            { "name": interaction.client.translate.commands.guild.banner, "value": banner, "inline": true },
            { "name": interaction.client.translate.commands.guild.create_at, "value": createdAt, "inline": true },
            { "name": interaction.client.translate.commands.guild.create_timestamp, "value": createdTimestamp, "inline": true },
            { "name": interaction.client.translate.commands.guild.default_message_notification, "value": defaultMessageNotification, "inline": true },
            { "name": interaction.client.translate.commands.guild.description, "value": description, "inline": true },
            { "name": interaction.client.translate.commands.guild.discovery_splash, "value": discoverySplash, "inline": true },
            { "name": interaction.client.translate.commands.guild.explicit_content_filter, "value": explicitContentFilter, "inline": true },
            { "name": interaction.client.translate.commands.guild.features, "value": features, "inline": true },
            { "name": interaction.client.translate.commands.guild.icon, "value": icon, "inline": true },
            { "name": interaction.client.translate.commands.guild.id, "value": id, "inline": true },
            { "name": interaction.client.translate.commands.guild.joined_at, "value": joinedAt, "inline": true },
            { "name": interaction.client.translate.commands.guild.join_timestamp, "value": joinTimestamp, "inline": true },
            { "name": interaction.client.translate.commands.guild.large, "value": large, "inline": true },
            { "name": interaction.client.translate.commands.guild.maximum_members, "value": maximumMembers, "inline": true },
            { "name": interaction.client.translate.commands.guild.maximum_presences, "value": maximumPresences, "inline": true },
            { "name": interaction.client.translate.commands.guild.member_count, "value": memberCount, "inline": true },
            { "name": interaction.client.translate.commands.guild.mfa_level, "value": mfaLevel, "inline": true },
            { "name": interaction.client.translate.commands.guild.name, "value": name, "inline": true },
            { "name": interaction.client.translate.commands.guild.name_acronym, "value": nameAcronym, "inline": true },
            { "name": interaction.client.translate.commands.guild.nsfw_level, "value": nsfwLevel, "inline": true },
            { "name": interaction.client.translate.commands.guild.owner_id, "value": ownerId, "inline": true },
            { "name": interaction.client.translate.commands.guild.partnered, "value": partnered, "inline": true },
            { "name": interaction.client.translate.commands.guild.preferred_locale, "value": preferredLocale, "inline": true },
            { "name": interaction.client.translate.commands.guild.premium_subscription_count, "value": premiumSubscriptionCount, "inline": true },
            { "name": interaction.client.translate.commands.guild.premium_tier, "value": premiumTier, "inline": true },
            { "name": interaction.client.translate.commands.guild.public_updates_channel_id, "value": publicUpdatesChannelId, "inline": true },
            { "name": interaction.client.translate.commands.guild.rules_channel_id, "value": rulesChannelId, "inline": true },
            { "name": interaction.client.translate.commands.guild.splash, "value": splash, "inline": true },
            { "name": interaction.client.translate.commands.guild.system_channel_id, "value": systemChannelId, "inline": true },
            { "name": interaction.client.translate.commands.guild.vanity_url_code, "value": vanityURLCode, "inline": true },
            { "name": interaction.client.translate.commands.guild.vanity_url_uses, "value": vanityURLUses, "inline": true },
            { "name": interaction.client.translate.commands.guild.verification_level, "value": verificationLevel, "inline": true },
            { "name": interaction.client.translate.commands.guild.verified, "value": verified, "inline": true },
            { "name": interaction.client.translate.commands.guild.widget_channel_id, "value": widgetChannelId, "inline": true },
            { "name": interaction.client.translate.commands.guild.widget_enabled, "value": widgetEnabled, "inline": true }
        ];

        if (inputInfo) {
            if (info.includes(inputInfo)) {
                for (let i = 0; i < info.length; i++) {
                    if (inputInfo === info[i]) {
                        embed.addFields(infoList[i]);
                        await interaction.reply({ "embeds": [embed] });
                    }
                }
            } else {
                await interaction.reply(interaction.client.translate.commands.guild.specific_use.replace("%s", info.join(", ")));
            }
        } else {
            embed.addFields(Array.from(infoList).slice(0, 25));
            await interaction.reply({ "embeds": [embed] });
        }
    }
}