const { MessageAttachment } = require("discord.js");
const catchError = require("../../extras/catchError");

module.exports = function (client, guild) {
    guild.channels.cache.forEach(function(channel) {
        if (channel.type === "GUILD_TEXT" && channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
            let attachment = new MessageAttachment("https://maseshi.web.app/assets/images/maseshi_banner.jpg", "ic_maseshi_banner.jpg");
            let guildName = guild.name;
            let avatar = client.user.displayAvatarURL();
            let username = client.user.username;

            channel.send({
                "embeds": [
                    {
                        "title": client.translate.events.guildCreate.get_started,
                        "description": client.translate.events.guildCreate.description.replace("%s", guildName),
                        "color": 14684245,
                        "timestamp": new Date(),
                        "footer": {
                            "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/spiral-calendar-pad_1f5d3.png",
                            "text": client.translate.events.guildCreate.join_on
                        },
                        "image": {
                            "url": "attachment://ic_maseshi_banner.jpg"
                        },
                        "author": {
                            "name": username,
                            "icon_url": avatar
                        },
                        "fields": [
                            {
                                "name": client.translate.events.guildCreate.advice,
                                "value": client.translate.events.guildCreate.advice_detail
                            },
                            {
                                "name": client.translate.events.guildCreate.support_multiple_languages,
                                "value": client.translate.events.guildCreate.support_multiple_languages_detail
                            },
                            {
                                "name": client.translate.events.guildCreate.help_information_and_documentation,
                                "value": client.translate.events.guildCreate.help_information_and_documentation_detail
                            }
                        ]
                    }
                ],
                "files": [ attachment ]
            }).catch(function (error) {
                catchError(client, message, module.exports.help.name, error);
            });
        }
    });
};