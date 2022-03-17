const { createWriteStream } = require("fs");
const { format } = require("util");

module.exports = (info) => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
    const file = createWriteStream(__dirname + "../../../logs/debug_" + year + "-" + month + "-" + day + ".log", { "flags" : "w" });

    file.write(format(info) + "\n");
};