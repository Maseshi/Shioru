const { createWriteStream, existsSync, mkdirSync } = require("node:fs");
const { format } = require("util");

module.exports = (name, info) => {
    if (!name) return console.log("[LogGenerator] No name provided!");
    if (!info) return console.log("[LogGenerator] No info provided!");

    const directory = "./source/logs/";

    if (!existsSync(directory)) mkdirSync(directory);

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const at = year + "-" + month + "-" + day;
    const when = hours + ":" + minutes + ":" + seconds;
    const file = createWriteStream(directory + name + "_" + at + ".log", {
        "flags": "a"
    });

    file.write(format("[%s]: %s\n", when, info));

    // After finishing the process, the new line will help to be easier to read.
    ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException", "SIGTERM"].forEach((eventType) => {
        process.on(eventType, () => {
            process.stdin.resume();
            file.write("\n");
            process.exit();
        });
    });
}