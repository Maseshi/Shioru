const { MessageEmbed } = require("discord.js");

module.exports.run = function (client, message, args) {
    let input1 = args[0];
    let input2 = args[1];

    let avatar = message.author.avatarURL() || client.translate.commands.user.unknown;
    let bot = message.author.bot ? client.translate.commands.user.yes : client.translate.commands.user.none;
    let createdAt = dateFormat(message.author.createdAt) || client.translate.commands.user.unknown;
    let createdTimestamp = dateFormat(message.author.createdTimestamp) || client.translate.commands.user.unknown;
    let defaultAvatarURL = message.author.defaultAvatarURL || client.translate.commands.user.unknown;
    let discriminator = message.author.discriminator || client.translate.commands.user.unknown;
    let id = message.author.id || client.translate.commands.user.unknown;
    let partial = message.author.partial ? client.translate.commands.user.yes : client.translate.commands.user.none;
    let system = message.author.system ? client.translate.commands.user.yes : client.translate.commands.user.none;
    let tag = message.author.tag || client.translate.commands.user.unknown;
    let username = message.author.username || client.translate.commands.user.unknown;

    let cliAvatarURL = client.user.avatarURL();
    let cliUsername = client.user.username;

    let embed = new MessageEmbed()
    .setTitle(client.translate.commands.user.user_info)
    .setDescription("")
    .setColor("BLUE")
    .setTimestamp()
    .setFooter(client.translate.commands.user.info_date, avatar)
    .setThumbnail(avatar)
    .setAuthor(cliUsername, cliAvatarURL, "https://maseshi.web.app/projects/shioru/")

    let member = message.guild.members.cache.find(members => 
        ((members.user.username === input1) || (members.user.username === input2)) ||
        ((members.user.id === input1) || (members.user.id === input2)) ||
        ((members.user.tag === input1) || (members.user.tag === input2))
    );
    if (member) {
        avatar = member.user.avatarURL() || client.translate.commands.user.unknown;
        bot = member.user.bot ? client.translate.commands.user.yes : client.translate.commands.user.none;
        createdAt = member.user.createdAt || client.translate.commands.user.unknown;
        createdTimestamp = member.user.createdTimestamp || client.translate.commands.user.unknown;
        defaultAvatarURL = member.user.defaultAvatarURL || client.translate.commands.user.unknown;
        discriminator = member.user.discriminator || client.translate.commands.user.unknown;
        id = member.user.id || client.translate.commands.user.unknown;
        partial = member.user.partial ? client.translate.commands.user.yes : client.translate.commands.user.none;
        system = member.user.system ? client.translate.commands.user.yes : client.translate.commands.user.none;
        tag = member.user.tag || client.translate.commands.user.unknown;
        username = member.user.username || client.translate.commands.user.unknown;
    }

    let info = [
        "avatarURL",
        "bot",
        "createAt",
        "createdTimestamp",
        "defaultAvatarURL",
        "discriminator",
        "id",
        "partial",
        "system",
        "tag",
        "username"
    ];
    let infoList = [
        { "name": client.translate.commands.user.avatar, "value": avatar, "inline": true },
        { "name": client.translate.commands.user.bot, "value": bot, "inline": true },
        { "name": client.translate.commands.user.created_at, "value": createdAt, "inline": true },
        { "name": client.translate.commands.user.created_timestamp, "value": createdTimestamp, "inline": true },
        { "name": client.translate.commands.user.default_avatar_url, "value": defaultAvatarURL, "inline": true },
        { "name": client.translate.commands.user.discriminator, "value": discriminator, "inline": true },
        { "name": client.translate.commands.user.id, "value": id, "inline": true },
        { "name": client.translate.commands.user.partial, "value": partial, "inline": true },
        { "name": client.translate.commands.user.system, "value": system, "inline": true },
        { "name": client.translate.commands.user.tag, "value": tag, "inline": true },
        { "name": client.translate.commands.user.username, "value": username, "inline": true }
    ];

    if (input1) {
        if (input2) {
            if (member) {
                embed.setFooter("ข้อมูลของเมื่อ", avatar).setThumbnail(avatar);
                
                if (info.includes(input1)) {
                    for (let i = 0; i < info.length; i++) {
                        if (input1 === info[i]) {
                            embed.addFields(infoList[i]);
                            message.channel.send({ "embeds": [ embed ] });
                        }
                    }
                } else {
                    message.reply(client.translate.commands.user.specific_use.replace("%s", info.join()));
                }
            } else {
                message.reply(client.translate.commands.user.can_not_find_user.replace("%s", client.config.owner));
            }
        } else {
            if (member) {
                embed.setFooter(client.translate.commands.user.info_date, avatar).setThumbnail(avatar);

                embed.addFields(Array.from(infoList));
                message.channel.send({ "embeds": [ embed ] });
            } else {
                if (info.includes(input1)) {
                    for (let i = 0; i < info.length; i++) {
                        if (input1 === info[i]) {
                            embed.addFields(infoList[i]);
                            message.channel.send({ "embeds": [ embed ] });
                        }
                    }
                } else {
                    message.reply(client.translate.commands.user.specific_use.replace("%s", info.join()));
                }
            }
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
    "name": "user",
    "description": "Get your user information",
    "usage": "user (info) (user)",
    "category": "guild",
    "aliases": [],
    "permissions": ["SEND_MESSAGES"]
};