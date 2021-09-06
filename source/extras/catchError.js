const { apps } = require("firebase");
const packages = require("../../package.json");

module.exports = function (client, message, command, error) {
    if (!error) return;
    if (message) {
        let ping = Date.now() - message.createdTimestamp;
        let api = Math.round(client.ws.ping);

        if (message.type === "GUILD_TEXT") {
            message.send({
                "content": null,
                "embeds": [
                    {
                        "title": client.translate.extras.catchError.an_error_occurred,
                        "description": client.translate.extras.catchError.error_detail
                        .replace("%s1", command)
                        .replace("%s2", packages.version)
                        .replace("%s3", new Date())
                        .replace("%s4", ((apps.length === 0) ? "ผิดปกติ" : "ปกติ"))
                        .replace("%s5", ping)
                        .replace("%s6", api)
                        .replace("%s7", error),
                        "color": 13632027,
                        "timestamp": new Date()
                    }
                ]
            });
        } else {
            if (message.content) {
                message.edit({
                    "content": null,
                    "embeds": [
                        {
                            "title": client.translate.extras.catchError.an_error_occurred,
                            "description": client.translate.extras.catchError.error_detail
                            .replace("%s1", command)
                            .replace("%s2", packages.version)
                            .replace("%s3", new Date())
                            .replace("%s4", ((apps.length === 0) ? "ผิดปกติ" : "ปกติ"))
                            .replace("%s5", ping)
                            .replace("%s6", api)
                            .replace("%s7", error),
                            "color": 13632027,
                            "timestamp": new Date()
                        }
                    ]
                });
            } else {
                message.channel.send({
                    "content": null,
                    "embeds": [
                        {
                            "title": client.translate.extras.catchError.an_error_occurred,
                            "description": client.translate.extras.catchError.error_detail
                            .replace("%s1", command)
                            .replace("%s2", packages.version)
                            .replace("%s3", new Date())
                            .replace("%s4", ((apps.length === 0) ? "ผิดปกติ" : "ปกติ"))
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
    console.error(error);
};