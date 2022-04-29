const levelSystem = require("../../extras/levelSystem");

module.exports.run = async (client, message, args) => {
    const inputMember = args.join(" ");
    let authorAvatar = message.author.displayAvatarURL();
    let authorID = message.author.id;
    let memberBot = false;

    if (inputMember) {
        const member = message.guild.members.cache.find(members => (members.user.username === inputMember) || (members.user.id === inputMember) || (members.user.tag === inputMember));

        if (!member) return message.reply(client.translate.commands.leveling.can_not_find_user);

        authorAvatar = member.user.avatarURL();
        authorID = member.user.id;
    }
    if (memberBot) return message.reply(client.translate.commands.leveling.bot_do_not_have_level);

    const data = await levelSystem(client, message, "GET", authorID);

    if (!data) return message.reply(client.translate.commands.leveling.user_no_data);

    const exp = data.exp;
    const level = data.level;
    const nextEXP = data.nextEXP;

    message.channel.send({
        "embeds": [
            {
                "title": client.translate.commands.leveling.your_experience,
                "color": 4886754,
                "thumbnail": {
                    "url": authorAvatar
                },
                "fields": [
                    {
                        "name": client.translate.commands.leveling.level,
                        "value": "```" + level + "```"
                    },
                    {
                        "name": client.translate.commands.leveling.experience,
                        "value": "```" + exp + "/" + nextEXP + "```"
                    }
                ]
            }
        ]
    });
};

module.exports.help = {
    "name": "leveling",
    "description": "See information about your level.",
    "usage": "leveling (member: id, username, tag)",
    "category": "information",
    "aliases": ["level", "lv", "เลเวล", "เวล"],
    "clientPermissions": ["SEND_MESSAGES"]
};

module.exports.interaction = {
    "data": {
        "name": module.exports.help.name,
        "name_localizations": {
            "en-US": "leveling",
            "th": "เลเวล"
        },
        "description": module.exports.help.description,
        "description_localizations": {
            "en-US": "See information about your level.",
            "th": "ดูข้อมูลเกี่ยวกับเลเวลของคุณ"
        },
        "options": [
            {
                "type": 6,
                "name": "member",
                "name_localizations": {
                    "th": "สมาชิก"
                },
                "description": "The name of the member you wish to view the level.",
                "description_localizations": {
                    "th": "ชื่อของสมาชิกที่คุณต้องการดูระดับของเขา"
                },
                "required": false
            }
        ]
    },
    async execute(interaction) {
        const inputMember = interaction.options.get("member");
        let authorAvatar = interaction.user.displayAvatarURL();
        let authorID = interaction.user.id;
        let memberBot = false;

        if (inputMember) {
            const member = interaction.guild.members.cache.find(members => (members.user.username === inputMember.value) || (members.user.id === inputMember.value) || (members.user.tag === inputMember.value));

            if (!member) return await interaction.editReply(interaction.client.translate.commands.leveling.can_not_find_user);

            authorAvatar = member.user.avatarURL();
            authorID = member.user.id;
            memberBot = member.user.bot;
        }
        if (memberBot) return await interaction.editReply(interaction.client.translate.commands.leveling.bot_do_not_have_level);

        const data = await levelSystem(interaction.client, interaction, "GET", authorID);

        if (!data) return await interaction.editReply(interaction.client.translate.commands.leveling.user_no_data);

        const exp = data.exp;
        const level = data.level;
        const nextEXP = data.nextEXP;

        await interaction.editReply({
            "embeds": [
                {
                    "title": interaction.client.translate.commands.leveling.your_experience,
                    "color": 4886754,
                    "thumbnail": {
                        "url": authorAvatar
                    },
                    "fields": [
                        {
                            "name": interaction.client.translate.commands.leveling.level,
                            "value": "```" + level + "```"
                        },
                        {
                            "name": interaction.client.translate.commands.leveling.experience,
                            "value": "```" + exp + "/" + nextEXP + "```"
                        }
                    ]
                }
            ]
        });
    }
}