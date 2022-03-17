const { getApps } = require("firebase/app");
const discord = require("discord.js");
const packages = require("../../package.json");

module.exports = (client, message, command, error) => {
    if (!error) return;

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

        if ((message && message.author && message.author.id) === client.user.id) {
            message.edit({
                "content": null,
                "embeds": [
                    {
                        "title": client.translate.extras.catchError.an_error_occurred,
                        "description": client.translate.extras.catchError.error_detail
                        .replace("%s1", command)
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
                            .replace("%s1", command)
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
                message.send({
                    "content": null,
                    "embeds": [
                        {
                            "title": client.translate.extras.catchError.an_error_occurred,
                            "description": client.translate.extras.catchError.error_detail
                            .replace("%s1", command)
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
            }
        }
    }

    console.group(dateTime(new Date()) + " :: \u001b[41;1mUnhandled Rejection/Catch\u001b[0m");
        console.group("\u001b[1mFull Error:\u001b[0m ");
            console.error(error);
        console.groupEnd();
        console.info("\u001b[1mPackage:\u001b[0m v" + packages.version);
        console.info("\u001b[1mDiscord.js:\u001b[0m v" + discord.version);
        console.info("\u001b[1mNode.js:\u001b[0m " + process.version);
    console.groupEnd();
};