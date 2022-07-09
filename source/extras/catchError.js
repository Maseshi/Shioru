const { getApps } = require("firebase/app");
const discord = require("discord.js");
const packages = require("../../package.json");
const logGenerator = require("./logGenerator")
const ansiColor = require("./ansiColor")

module.exports = async (client, message, name, error) => {
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

        if ((message.author && message.author.id) === client.user.id) {
            message.edit({
                "content": null,
                "embeds": [
                    {
                        "title": client.translate.extras.catchError.an_error_occurred,
                        "description": client.translate.extras.catchError.error_detail
                            .replace("%s1", name)
                            .replace("%s2", packages.version)
                            .replace("%s3", new Date())
                            .replace("%s4", ((getApps().length === 0) ? client.translate.extras.catchError.server_abnormal : client.translate.extras.catchError.server_normal))
                            .replace("%s5", ping)
                            .replace("%s6", api)
                            .replace("%s7", error),
                        "color": 13632027,
                        "timestamp": new Date()
                    }
                ]
            });
        } else {
            try {
                message.channel.send({
                    "content": null,
                    "embeds": [
                        {
                            "title": client.translate.extras.catchError.an_error_occurred,
                            "description": client.translate.extras.catchError.error_detail
                                .replace("%s1", name)
                                .replace("%s2", packages.version)
                                .replace("%s3", new Date())
                                .replace("%s4", ((getApps().length === 0) ? client.translate.extras.catchError.server_abnormal : client.translate.extras.catchError.server_normal))
                                .replace("%s5", ping)
                                .replace("%s6", api)
                                .replace("%s7", error),
                            "color": 13632027,
                            "timestamp": new Date()
                        }
                    ]
                });
            } catch {
                try {
                    message.send({
                        "content": null,
                        "embeds": [
                            {
                                "title": client.translate.extras.catchError.an_error_occurred,
                                "description": client.translate.extras.catchError.error_detail
                                    .replace("%s1", name)
                                    .replace("%s2", packages.version)
                                    .replace("%s3", new Date())
                                    .replace("%s4", ((getApps().length === 0) ? client.translate.extras.catchError.server_abnormal : client.translate.extras.catchError.server_normal))
                                    .replace("%s5", ping)
                                    .replace("%s6", api)
                                    .replace("%s7", error),
                                "color": 13632027,
                                "timestamp": new Date()
                            }
                        ]
                    });
                } catch {
                    try {
                        await message.editReply({
                            "content": null,
                            "embeds": [
                                {
                                    "title": client.translate.extras.catchError.an_error_occurred,
                                    "description": client.translate.extras.catchError.error_detail
                                        .replace("%s1", name)
                                        .replace("%s2", packages.version)
                                        .replace("%s3", new Date())
                                        .replace("%s4", ((getApps().length === 0) ? client.translate.extras.catchError.server_abnormal : client.translate.extras.catchError.server_normal))
                                        .replace("%s5", ping)
                                        .replace("%s6", api)
                                        .replace("%s7", error),
                                    "color": 13632027,
                                    "timestamp": new Date()
                                }
                            ]
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

    logGenerator("catch", error)

    console.group(dateTime(new Date()) + " :: " + redBackground + whiteColor + boldStyle + "Catch Error" + clearStyle);
        console.group(boldStyle + "Full Error:" + clearStyle);
            console.error(error);
        console.groupEnd();
        console.info(boldStyle + "Package:" + clearStyle + " v" + packages.version);
        console.info(boldStyle + "Discord.js:" + clearStyle + " v" + discord.version);
        console.info(boldStyle + "Node.js: " + clearStyle + process.version);
    console.groupEnd();
};