const discord = require("discord.js");
const { format } = require("node:util");
const { getApps } = require("firebase/app");
const { createWriteStream, existsSync, mkdirSync } = require("node:fs");
const packages = require("../../package.json");

/**
 * 8-bit: 256-color mode\
 * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
 * 
 * @param {Number} code Color codes in ANSI
 * @param {String} mode Supports 3 modes: **foreground**, **background** and **sgr**.
 */
const ansiColor = (code, mode) => {
    if (code === null) return console.log("[ansiColor] Please configure the color of ANSI.");
    if (!mode) return console.log("[ansiColor] Please confirm the ANSI mode, including 'foreground', 'background' and 'sgr'.");

    if (mode === "foreground") return "\x1b[38;5;" + code.toString() + "m";
    if (mode === "background") return "\x1b[48;5;" + code.toString() + "m";
    if (mode === "sgr") return "\x1b[" + code.toString() + "m";
}

/**
 * Detects errors and informs the user about them.
 * 
 * @param {Client} client 
 * @param {String} message 
 * @param {String} name The name of the command or event.
 * @param {Error} error 
 * @param {Boolean} private Set to `true` when you don't want to notify the user.
 * @returns error
 */
const catchError = async (client, message, name, error, private = false) => {
    if (!name) return console.log("[catchError] Please specify the name of the command or function.");
    if (!error) return console.log("[catchError] Please forward any errors that have occurred.");

    const clearStyle = ansiColor(0, "sgr");
    const boldStyle = ansiColor(1, "sgr");
    const whiteColor = ansiColor(15, "foreground");
    const redBackground = ansiColor(9, "background");

    if (message) {
        const ping = Date.now() - message.createdTimestamp;
        const api = Math.round(client.ws.ping);

        const catchErrorEmbed = new discord.EmbedBuilder()
            .setTitle(client.translate.utils.consoleUtils.an_error_occurred)
            .setDescription(
                client.translate.utils.consoleUtils.error_detail.replace("%s1", name)
                    .replace("%s2", packages.version)
                    .replace("%s3", new Date())
                    .replace("%s4", ((getApps().length === 0) ? client.translate.utils.consoleUtils.server_abnormal : client.translate.utils.consoleUtils.server_normal))
                    .replace("%s5", ping)
                    .replace("%s6", api)
                    .replace("%s7", error)
            )
            .setColor("Red")
            .setTimestamp()

        if ((message.author && message.author.id) === client.user.id) {
            if (!private) message.edit({
                "content": null,
                "embeds": [catchErrorEmbed],
                "ephemeral": true
            });
        } else {
            try {
                if (!private) await message.editReply({
                    "content": null,
                    "embeds": [catchErrorEmbed],
                    "ephemeral": true
                });
            } catch {
                try {
                    if (!private) message.reply({
                        "content": null,
                        "embeds": [catchErrorEmbed],
                        "ephemeral": true
                    });
                } catch {
                    try {
                        if (!private) message.send({
                            "content": null,
                            "embeds": [catchErrorEmbed],
                            "ephemeral": true
                        });
                    } catch {
                        try {
                            if (!private) message.channel.send({
                                "content": null,
                                "embeds": [catchErrorEmbed],
                                "ephemeral": true
                            });
                        } catch (err) {
                            logGenerator("catch", err)

                            console.group("\u001b[1m[" + timeConsole(new Date()) + "]\u001b[0m :: " + redBackground + whiteColor + boldStyle + "Catch Error" + clearStyle);
                            console.group(boldStyle + "Full Error:" + clearStyle);
                            console.error(err);
                            console.groupEnd();
                            console.info(boldStyle + "Package:" + clearStyle + " v" + packages.version);
                            console.info(boldStyle + "Discord.js:" + clearStyle + " v" + discord.version);
                            console.info(boldStyle + "Node.js: " + clearStyle + process.version);
                            console.groupEnd();
                        }
                    }
                }
            }
        }
    }

    logGenerator("catch", error);

    console.group("\u001b[1m[" + timeConsole(new Date()) + "]\u001b[0m :: " + redBackground + whiteColor + boldStyle + "Catch Error" + clearStyle);
    console.group(boldStyle + "Full Error:" + clearStyle);
    console.error(error);
    console.groupEnd();
    console.info(boldStyle + "Package:" + clearStyle + " v" + packages.version);
    console.info(boldStyle + "Discord.js:" + clearStyle + " v" + discord.version);
    console.info(boldStyle + "Node.js: " + clearStyle + process.version);
    console.groupEnd();
    return error;
}

/**
 * For quarantine logs as a temporary file
 * 
 * @param {String} name The name of the quarantined file or process name, e.g. **process**, **error**, **warn** etc.
 * @param {String} info log data
 * @example
 * logGenerator("debug", "[WS => Shard 0] [HeartbeatTimer] Sending a heartbeat.")
 */
const logGenerator = (name, info) => {
    if (!name) return console.log("[LogGenerator] No name provided!");
    if (!info) return console.log("[LogGenerator] No info provided!");

    const date = new Date();
    const at = timeConsole(date, "date");
    const when = timeConsole(date, "time");
    const directory = "./source/logs/";

    if (!existsSync(directory)) mkdirSync(directory);

    const file = createWriteStream(directory + name + "_" + at + ".log", {
        "flags": "a"
    });

    file.write(format("[%s]: %s\n", when, info));

    // After finishing the process, the new line will help to be easier to read.
    ["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "SIGTERM"].forEach((eventType) => {
        process.on(eventType, () => {
            process.stdin.resume();
            file.write("\n");
            process.exit();
        });
    });
}

/**
 * Calculated as the current time and tailored to the console time.
 * 
 * @param {Date} date time of occurrence
 * @param {String} format Three options are supported: **full**, **date** and **time**.
 */
const timeConsole = (date, format = "full") => {
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (format === "full") return year + "-" + month + "-" + day + "." + hours + ":" + minutes + ":" + seconds;
    if (format === "date") return year + "-" + month + "-" + day;
    if (format === "time") return hours + ":" + minutes + ":" + seconds;
};

module.exports = {
    ansiColor,
    catchError,
    logGenerator,
    timeConsole
}