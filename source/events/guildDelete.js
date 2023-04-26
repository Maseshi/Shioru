const { Events } = require("discord.js");
const { getDatabase, ref, update } = require("firebase/database");

module.exports = {
    "name": Events.GuildDelete,
    "once": false,
    execute(guild) {
        if (guild.client.mode === "start") {
            const guildSize = guild.client.guilds.cache.size;
            const userSize = guild.client.users.cache.size;

            update(ref(getDatabase(), "statistics/shioru/size"), {
                "guilds": guildSize,
                "users": userSize
            });
        }
    }
};