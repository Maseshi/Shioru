const { createWriteStream, existsSync, mkdirSync } = require("fs");
const { format } = require("util");

module.exports = (info) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    const dir = "./source/logs/";

    if (!existsSync(dir)) mkdirSync(dir);

    const file = createWriteStream("./source/logs/debug_" + year + "-" + month + "-" + day + ".log", { "flags" : "w" });

    file.write(format(info) + "\n");
};