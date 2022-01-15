const { getApps } = require("firebase/app");
const packages = require("../../package.json");

module.exports = (client, message, command, error) => {
    if (!error) return;
    if (message) {
        const ping = Date.now() - message.createdTimestamp;
        const api = Math.round(client.ws.ping);

        if (message.author.id === client.user.id) {
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
        }
    }

    console.error(error);
};