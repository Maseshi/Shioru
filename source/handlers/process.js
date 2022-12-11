const discord = require("discord.js");
const packages = require("../../package.json");
const { ansiColor, logGenerator } = require("../utils/consoleUtils");

module.exports = (client) => {
    const consoleDateTime = (date) => {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return "\u001b[1m[" + year + "-" + month + "-" + day + "." + hours + ":" + minutes + ":" + seconds + "]\u001b[0m"
    };

    const clearStyle = ansiColor(0, "sgr")
    const boldStyle = ansiColor(1, "sgr")
    const whiteColor = ansiColor(15, "foreground")
    const blackColor = ansiColor(0, "foreground")
    const grayBackground = ansiColor(7, "background");
    const orangeBackground = ansiColor(208, "background");
    const yellowBackground = ansiColor(11, "background");
    const redBackground = ansiColor(9, "background");

    // Limit the creation of events in the process.
    process.setMaxListeners(0);

    process.on("SIGINT", () => {
        console.log(orangeBackground + whiteColor + " Bot is about to shut down. " + clearStyle);
        if (client.mode === "start") process.exit(1);
    });

    process.on('SIGUSR1', () => {
        console.log(yellowBackground + whiteColor + " Bot is about to restart. " + clearStyle);
    });
    
    process.on('SIGUSR2', () => {
        console.log(yellowBackground + whiteColor + " Bot is about to restart. " + clearStyle);
    });

    process.on("rejectionHandled", (promise) => {
        logGenerator("process", promise);

        console.group(consoleDateTime(new Date()) + " :: " + redBackground + whiteColor + boldStyle + "Rejection Handled" + clearStyle);
            console.group(boldStyle + "Full Error:" + clearStyle);
                console.error(promise);
            console.groupEnd();
            console.log(boldStyle + "Promise: " + clearStyle + promise);
            console.info(boldStyle + "Package:" + clearStyle + " v" + packages.version);
            console.info(boldStyle + "Discord.js:" + clearStyle + " v" + discord.version);
            console.info(boldStyle + "Node.js: " + clearStyle + process.version);
        console.groupEnd();
    });

    process.on("uncaughtException", (err, origin) => {
        logGenerator("process", (err + "\n" + origin));

        console.group(consoleDateTime(new Date()) + " :: " + redBackground + whiteColor + boldStyle + "Uncaught Exception" + clearStyle);
            console.group(boldStyle + "Full Error:" + clearStyle);
                console.error(err);
                console.error(origin);
            console.groupEnd();
            console.log(boldStyle + "Error: " + clearStyle + err)
            console.log(boldStyle + "Origin: " + clearStyle + origin);
            console.info(boldStyle + "Package:" + clearStyle + " v" + packages.version);
            console.info(boldStyle + "Discord.js:" + clearStyle + " v" + discord.version);
            console.info(boldStyle + "Node.js: " + clearStyle + process.version);
        console.groupEnd();
    });

    process.on("uncaughtExceptionMonitor", (err, origin) => {
        logGenerator("process", (err + "\n" + origin));

        console.group(consoleDateTime(new Date()) + " :: " + redBackground + whiteColor + boldStyle + "Uncaught Exception Monitor" + clearStyle);
            console.group(boldStyle + "Full Error:" + clearStyle);
                console.error(err);
                console.error(origin);
            console.groupEnd();
            console.log(boldStyle + "Error: " + clearStyle + err)
            console.log(boldStyle + "Origin: " + clearStyle + origin);
            console.info(boldStyle + "Package:" + clearStyle + " v" + packages.version);
            console.info(boldStyle + "Discord.js:" + clearStyle + " v" + discord.version);
            console.info(boldStyle + "Node.js: " + clearStyle + process.version);
        console.groupEnd();
    });

    process.on("unhandledRejection", (reason, promise) => {
        logGenerator("process", (reason + "\n" + promise));

        console.group(consoleDateTime(new Date()) + " :: " + redBackground + whiteColor + boldStyle + "Unhandled Rejection" + clearStyle);
            console.group(boldStyle + "Full Error:" + clearStyle);
                console.error(reason);
                console.error(promise);
            console.groupEnd();
            console.log(boldStyle + "Reason: " + clearStyle + reason);
            console.log(boldStyle + "Promise: " + clearStyle + promise);
            console.info(boldStyle + "Package:" + clearStyle + " v" + packages.version);
            console.info(boldStyle + "Discord.js:" + clearStyle + " v" + discord.version);
            console.info(boldStyle + "Node.js: " + clearStyle + process.version);
        console.groupEnd();
    });

    process.on("exit", (code) => {
        console.log(grayBackground + blackColor + " Bot is about to shut down with the code: " + code + " " + clearStyle);
    });
};