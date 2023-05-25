const { Events } = require("discord.js");
const { getDatabase, ref, child, update } = require("firebase/database");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.GuildDelete,
    "once": false,
    execute(guild) {
        const guildSize = guild.client.guilds.cache.size;
        const userSize = guild.client.users.cache.size;

        update(child(child(ref(getDatabase(), "statistics"), IDConvertor(guild.client.user.username)), "size"), {
            "guilds": guildSize,
            "users": userSize
        });
    }
};