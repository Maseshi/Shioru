const { getDatabase, ref, update } = require("firebase/database");

module.exports = (client, guild) => {
    if (client.mode === "start") {
        const guildSize = client.guilds.cache.size;
        const userSize = client.users.cache.size;

        update(ref(getDatabase(), "statistics/shioru/size"), {
            "guilds": guildSize,
            "users": userSize
        });
    }
};