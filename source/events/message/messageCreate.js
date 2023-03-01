const { ChannelType } = require("discord.js");
const { chatSystem, levelSystem, settingsData } = require("../../utils/databaseUtils");

module.exports = (client, message) => {
    const mentioned = message.content.startsWith("<@!" + client.user.id + ">") || message.content.startsWith("<@" + client.user.id + ">");
    const arguments = message.content.trim().split(/ +/g);

    if (message.author.bot) return;
    if (message.channel.type === ChannelType.DM) return;
    if (client.mode === "start") {
        settingsData(client, message.guild, module.exports, message);
        if (client.temp.set !== 1) return;

        levelSystem(client, message, "POST", 89);
    }
    if (mentioned) return chatSystem(client, message, mentioned, arguments);
};