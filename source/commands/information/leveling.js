const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { levelSystem } = require("../../utils/databaseUtils");

module.exports = {
    "enable": true,
    "name": "leveling",
    "description": "See information about your level.",
    "category": "information",
    "permissions": {
        "client": [PermissionsBitField.Flags.SendMessages]
    },
    "usage": "leveling [member]",
    "function": {
        "command": {}
    }
};

module.exports.function.command = {
    "data": {
        "name": module.exports.name,
        "name_localizations": {
            "th": "เลเวลลิ่ง"
        },
        "description": module.exports.description,
        "description_localizations": {
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
        const inputMember = interaction.options.getMember("member") ?? "";

        let author = interaction.user;
        let authorAvatar = author.displayAvatarURL();
        let authorFetch = await author.fetch();
        let memberBot = false;

        if (inputMember) {
            author = inputMember;
            authorAvatar = author.avatarURL();
            authorFetch = await author.fetch();
            memberBot = author.bot;
        }
        if (memberBot) return await interaction.reply(interaction.client.translate.commands.leveling.bot_do_not_have_level);

        const data = await levelSystem(interaction.client, interaction, "GET", { "member": author });

        if (!data) return await interaction.reply(interaction.client.translate.commands.leveling.user_no_data);

        const exp = data.exp;
        const level = data.level;
        const nextEXP = data.nextEXP;

        const levelingEmbed = new EmbedBuilder()
            .setTitle(interaction.client.translate.commands.leveling.your_experience)
            .setColor(authorFetch.accentColor)
            .setThumbnail(authorAvatar)
            .setTimestamp()
            .addFields(
                [
                    {
                        "name": interaction.client.translate.commands.leveling.level,
                        "value": "```" + level + "```"
                    },
                    {
                        "name": interaction.client.translate.commands.leveling.experience,
                        "value": "```" + exp + "/" + nextEXP + "```"
                    }
                ]
            );

        await interaction.reply({ "embeds": [levelingEmbed] });
    }
}