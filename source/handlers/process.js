const discord = require("discord.js");
const packages = require("../../package.json");
const { createWriteStream, existsSync, mkdirSync } = require("fs");
const { format } = require("util");

module.exports = (client) => {
    const logDateTime = (date) => {
        const minutes = date.getMinutes();
        const hours = date.getHours();
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDay();

        return "_" + year + "-" + month + "-" + day + "_" + hours + "-" + minutes
    };
    const consoleDateTime = (date) => {
        const day = date.getDay();
        const month = date.getMonth();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        return "\u001b[1m[" + day + "-" + month + "-" + year + "." + hours + ":" + minutes + ":" + seconds + "]\u001b[0m"
    };

    process.on("unhandledRejection", (reason, promise) => {
        const dir = "./source/logs/";

        if (!existsSync(dir)) mkdirSync(dir);

        const file = createWriteStream("./source/logs/process" + logDateTime(new Date()) + ".log", { "flags" : "w" });

        console.group(consoleDateTime(new Date()) + " :: \u001b[41;1mUnhandled Rejection/Catch\u001b[0m");
            console.group("\u001b[1mFull Error:\u001b[0m ");
                console.error(reason);
                console.error(promise);
            console.groupEnd();
            console.log("\u001b[1mReason:\u001b[0m " + reason);
            console.log("\u001b[1mPromise:\u001b[0m " + promise);
            console.info("\u001b[1mPackage:\u001b[0m v" + packages.version);
            console.info("\u001b[1mDiscord.js:\u001b[0m v" + discord.version);
            console.info("\u001b[1mNode.js:\u001b[0m " + process.version);
        console.groupEnd();
        
        file.write(format(reason, promise) + "\n");
    });

    process.on("uncaughtException", (err, origin) => {
        const dir = "./source/logs/";

        if (!existsSync(dir)) mkdirSync(dir);

        const file = createWriteStream("./source/logs/process" + logDateTime(new Date()) + ".log", { "flags" : "w" });

        console.group(consoleDateTime(new Date()) + " :: \u001b[41;1mUncaught Exception/Catch\u001b[0m");
            console.group("\u001b[1mFull Error:\u001b[0m ");
                console.error(err);
                console.error(origin);
            console.groupEnd();
            console.log("\u001b[1mError:\u001b[0m " + err)
            console.log("\u001b[1mOrigin:\u001b[0m " + origin);
            console.info("\u001b[1mPackage:\u001b[0m v" + packages.version);
            console.info("\u001b[1mDiscord.js:\u001b[0m v" + discord.version);
            console.info("\u001b[1mNode.js:\u001b[0m " + process.version);
        console.groupEnd();

        file.write(format(err, origin) + "\n");
    });

    process.on("multipleResolves", (type, promise, reason) => {
        const dir = "./source/logs/";

        if (!existsSync(dir)) mkdirSync(dir);

        const file = createWriteStream("./source/logs/process" + logDateTime(new Date()) + ".log", { "flags" : "w" });

        switch (reason.toLocaleString()) {
            case "":
            case "Error: Cannot perform IP discovery - socket closed":
            return;
        }

        console.group(consoleDateTime(new Date()) + " :: \u001b[41;1mMultiple Resolves\u001b[0m");
            console.group("\u001b[1mFull Error:\u001b[0m ");
                console.error(type);
                console.error(promise);
                console.error(reason);
            console.groupEnd();
            console.log("\u001b[1mType:\u001b[0m " + type);
            console.log("\u001b[1mPromise:\u001b[0m " + promise);
            console.log("\u001b[1mReason:\u001b[0m " + reason);
            console.info("\u001b[1mPackage:\u001b[0m v" + packages.version);
            console.info("\u001b[1mDiscord.js:\u001b[0m v" + discord.version);
            console.info("\u001b[1mNode.js:\u001b[0m " + process.version);
        console.groupEnd();

        file.write(format(type, promise, reason) + "\n");
    });
};