const { MessageAttachment } = require("discord.js");
const settingsData = require("../../extras/settingsData");
const catchError = require("../../extras/catchError");

module.exports = async (guild) => {
    const client = guild.client;

    if (client.mode === "start") {
        settingsData(client, guild, module.exports);
        if (client.config.worker !== 1) return;
    }

    const guildName = guild.name;
    const languageCode = client.config.lang.code;
    const clientAvatar = client.user.displayAvatarURL();
    const clientUsername = client.user.username;

    guild.channels.cache.forEach((channel) => {
        if (channel.type === "GUILD_TEXT" && channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
            const attachment = new MessageAttachment("./source/assets/images/shioru-discord-cover-" + languageCode + ".png", "shioru-discord-cover.png");

            channel.send({
                "embeds": [
                    {
                        "title": client.translate.events.guildCreate.get_started,
                        "description": client.translate.events.guildCreate.description.replace("%s", guildName),
                        "color": 14684245,
                        "timestamp": new Date(),
                        "footer": {
                            "text": client.translate.events.guildCreate.join_on,
                            "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/spiral-calendar-pad_1f5d3.png"
                        },
                        "image": {
                            "url": "attachment://shioru-discord-cover.png"
                        },
                        "author": {
                            "name": clientUsername,
                            "iconURL": clientAvatar
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
                "files": [attachment]
            }).catch((error) => {
                catchError(client, guild.systemChannel, "guildCreate", error);
            });
        }
    });
};