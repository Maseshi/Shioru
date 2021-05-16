const download = require("download-github-repo");

module.exports.run = async function (client, message, args) {
    if (message.member.id === client.config.owner) {
        try {
            download("Maseshi/Shioru");
            message.channel.send(client.lang.command_system_update_success);
        } catch (err) {
            message.channel.send(client.errors.genericError + err.stack).catch();
        }
    }
};

module.exports.help = {
    "name": "update",
    "description": "Updates the bot to the latest commit on the GitHub repository.",
    "usage": "update",
    "category": "only",
    "aliases": ["latest"],
    "permissions": "SEND_MESSAGES"
};