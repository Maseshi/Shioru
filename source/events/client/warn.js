const { createWriteStream } = require("fs");
const { format } = require("util");

module.exports = (info) => {
    const date = new Date();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDay();
	const file = createWriteStream(__dirname + "../../../logs/warn_" + year + "-" + month + "-" + day + "_" + hours + "-" + minutes + ".log", { "flags" : "w" });

    file.write(format(info) + "\n");
};