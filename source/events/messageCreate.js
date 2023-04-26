const { Events, ChannelType } = require("discord.js");
const { getDatabase, ref, child, set, remove } = require("firebase/database");
const { chatSystem, levelSystem, settingsData } = require("../utils/databaseUtils");

module.exports = {
    "name": Events.MessageCreate,
    "once": false,
    async execute(message) {
        if (message.author.bot) return;
        if (message.channel.type === ChannelType.DM) return;

        // Automatic settings data on database
        if (message.client.mode === "start") {
            settingsData(message.client, message.guild);
            levelSystem(message.client, message, "POST", { "amount": 89, "type": "exp" });
        }

        // Detect if user mention bot
        const mentioned = message.content.startsWith("<@!" + message.client.user.id + ">") || message.content.startsWith("<@" + message.client.user.id + ">");
        const arguments = message.content.trim().split(/ +/g);

        if (mentioned) chatSystem(message.client, message, mentioned, arguments);

        // Auto remove AFK status
        const guildID = message.guild.id;
        const afkSnapshot = message.client.api.guilds[guildID].afk ?? "";
        const afkRef = child(child(ref(getDatabase(), "projects/shioru/guilds"), guildID), "afk");

        if (afkSnapshot && afkSnapshot[message.author.id]) {
            await message.channel.sendTyping();

            try {
                await message.member.setNickname(afkSnapshot[message.author.id].nickname);
            } catch (error) {
                console.log(error);
            }

            await remove(afkRef, message.author.id);
            await message.reply({ "content": message.client.translate.events.messageCreate.afk_user_come_back, "ephemeral": true });
        } else {
            const members = message.mentions.users.first();

            if (!members) return;
            if (!afkSnapshot[members.id]) return;

            await message.channel.sendTyping();

            const member = message.guild.members.cache.get(members.id);
            const reason = afkSnapshot[members.id].message || message.client.translate.events.messageCreate.no_reason_for_afk;

            if (message.content.includes(members)) {
                message.reply(message.client.translate.events.messageCreate.that_user_is_afk.replace("%s1", member.user.tag).replace("%s2", reason));
            }
        }
    }
};