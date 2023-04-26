const discord = require("discord.js");
const packages = require("../../package.json");
const { ansiColor, logGenerator, timeConsole } = require("../utils/consoleUtils");

module.exports = (client) => {
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
        console.info(orangeBackground + whiteColor + " Bot is about to shut down. " + clearStyle);
    });

    process.on("SIGUSR1", () => {
        console.info(yellowBackground + whiteColor + " Bot is about to restart. " + clearStyle);
    });
    
    process.on("SIGUSR2", () => {
        console.info(yellowBackground + whiteColor + " Bot is about to restart. " + clearStyle);
    });

    process.on("rejectionHandled", (promise) => {
        console.group(timeConsole(new Date()) + " :: " + redBackground + whiteColor + boldStyle + "Rejection Handled" + clearStyle);
            console.group(boldStyle + "Full Error:" + clearStyle);
                console.error(promise);
            console.groupEnd();
            console.log(boldStyle + "CPU:", (process.cpuUsage().user / 1024 / 1024).toFixed(2));
            console.log(boldStyle + "Memory:", ((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "/" + (process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)));
            console.log(boldStyle + "Package:", packages.version);
            console.log(boldStyle + "Discord.js:", discord.version);
            console.log(boldStyle + "Node.js:", process.version);
        console.groupEnd();

        logGenerator("process", promise);
    });

    process.on("uncaughtException", (err, origin) => {
        console.group(timeConsole(new Date()) + " :: " + redBackground + whiteColor + boldStyle + "Uncaught Exception" + clearStyle);
            console.group(boldStyle + "Full Error:" + clearStyle);
                console.error(err);
                console.error(origin);
            console.groupEnd();
            console.log(boldStyle + "Package:", packages.version);
            console.log(boldStyle + "Discord.js:", discord.version);
            console.log(boldStyle + "Node.js:", process.version);
        console.groupEnd();

        logGenerator("process", (err + "\n" + origin));
        
        if (client.mode === "dev") setImmediate(() => process.exit(1));
    });

    process.on("uncaughtExceptionMonitor", (err, origin) => {
        console.group(timeConsole(new Date()) + " :: " + redBackground + whiteColor + boldStyle + "Uncaught Exception Monitor" + clearStyle);
            console.group(boldStyle + "Full Error:" + clearStyle);
                console.error(err);
                console.error(origin);
            console.groupEnd();
            console.log(boldStyle + "Package:", packages.version);
            console.log(boldStyle + "Discord.js:", discord.version);
            console.log(boldStyle + "Node.js:", process.version);
        console.groupEnd();

        logGenerator("process", (err + "\n" + origin));
    });

    process.on("unhandledRejection", (reason, promise) => {
        console.group(timeConsole(new Date()) + " :: " + redBackground + whiteColor + boldStyle + "Unhandled Rejection" + clearStyle);
            console.group(boldStyle + "Full Error:" + clearStyle);
                console.error(reason);
                console.error(promise);
            console.groupEnd();
            console.log(boldStyle + "Package:", packages.version);
            console.log(boldStyle + "Discord.js:", discord.version);
            console.log(boldStyle + "Node.js:", process.version);
        console.groupEnd();

        logGenerator("process", (reason + "\n" + promise));

        if (client.mode === "dev") setImmediate(() => process.exit(1));
    });

    process.on("exit", (code) => {
        console.info(grayBackground + blackColor + " Bot is about to shut down with the code: " + code + " " + clearStyle);
    });
};