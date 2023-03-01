const { format } = require("util");
const { getApps } = require("firebase/app");
const { createWriteStream, existsSync, mkdirSync } = require("node:fs");
const discord = require("discord.js");
const packages = require("../../package.json");

const asciiArt =    "███████╗██╗  ██╗██╗ ██████╗ ██████╗ ██╗   ██╗ %s1\n" +
                    "██╔════╝██║  ██║██║██╔═══██╗██╔══██╗██║   ██║ %s2\n" +
                    "███████╗███████║██║██║   ██║██████╔╝██║   ██║ %s3\n" +
                    "╚════██║██╔══██║██║██║   ██║██╔══██╗██║   ██║ %s4\n" +
                    "███████║██║  ██║██║╚██████╔╝██║  ██║╚██████╔╝ %s5\n" +
                    "╚══════╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝  %s6"

const ansiColor = (code, mode) => {
    // 8-bit: 256-color mode
    // foreground: ESC[38;5;#m
    // background: ESC[48;5;#m
    // https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit

    if (code === null) return console.log("[ansiColor] Please configure the color of ANSI.");
    if (!mode) return console.log("[ansiColor] Please confirm the ANSI mode, including 'foreground', 'background' and 'sgr'.");

    if (mode === "foreground") return "\033[38;5;" + code.toString() + "m";
    if (mode === "background") return "\033[48;5;" + code.toString() + "m";
    if (mode === "sgr") return "\x1b[" + code.toString() + "m";
}

const catchError = async (client, message, name, error) => {
    if (!name) return console.log("[catchError] Please specify the name of the command or function.");
    if (!error) return console.log("[catchError] Please forward any errors that have occurred.");

    const clearStyle = ansiColor(0, "sgr");
    const boldStyle = ansiColor(1, "sgr");
    const whiteColor = ansiColor(15, "foreground");
    const redBackground = ansiColor(9, "background");

    const dateTime = (date) => {
        const day = date.getDay();
        const month = date.getMonth();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        return "\u001b[1m[" + day + "-" + month + "-" + year + "." + hours + ":" + minutes + ":" + seconds + "]\u001b[0m"
    }

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
            message.edit({
                "content": null,
                "embeds": [catchErrorEmbed],
                "ephemeral": true
            });
        } else {
            try {
                message.channel.send({
                    "content": null,
                    "embeds": [catchErrorEmbed],
                    "ephemeral": true
                });
            } catch {
                try {
                    message.send({
                        "content": null,
                        "embeds": [catchErrorEmbed],
                        "ephemeral": true
                    });
                } catch {
                    try {
                        await message.editReply({
                            "content": null,
                            "embeds": [catchErrorEmbed],
                            "ephemeral": true
                        });
                    } catch (err) {
                        logGenerator("catch", err)

                        console.group(dateTime(new Date()) + " :: " + redBackground + whiteColor + boldStyle + "Catch Error" + clearStyle);
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

    logGenerator("catch", error);

    console.group(dateTime(new Date()) + " :: " + redBackground + whiteColor + boldStyle + "Catch Error" + clearStyle);
    console.group(boldStyle + "Full Error:" + clearStyle);
    console.error(error);
    console.groupEnd();
    console.info(boldStyle + "Package:" + clearStyle + " v" + packages.version);
    console.info(boldStyle + "Discord.js:" + clearStyle + " v" + discord.version);
    console.info(boldStyle + "Node.js: " + clearStyle + process.version);
    console.groupEnd();
}

const logGenerator = (name, info) => {
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

module.exports = {
    asciiArt,
    ansiColor,
    catchError,
    logGenerator
}