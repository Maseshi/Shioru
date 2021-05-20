const discord = require("discord.js");

module.exports = function (client, guild) {
    let defaultChannel = "";

    guild.channels.cache.forEach(function(channel) {
        if (channel.type === "text" && defaultChannel === "") {
            if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;

                let attachment = new discord.MessageAttachment("./assets/images/ic_maseshi_banner.jpg", "ic_maseshi_banner.jpg");
                let guildName = guild.name;
                let avatar = client.user.displayAvatarURL();
                let username = client.user.username;

                channel.send({
                    "embed": {
                        "files": [ attachment ],
                        "title": client.lang.event_guild_guildCreate_embed_title,
                        "description": client.lang.event_guild_guildCreate_embed_description.replace("%guildName", guildName),
                        "color": 14684245,
                        "timestamp": new Date(),
                        "footer": {
                            "icon_url": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/spiral-calendar-pad_1f5d3.png",
                            "text": client.lang.event_guild_guildCreate_embed_footer_text
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
                                "name": client.lang.event_guild_guildCreate_embed_field_name_0,
                                "value": client.lang.event_guild_guildCreate_embed_field_value_0
                            },
                            {
                                "name": client.lang.event_guild_guildCreate_embed_field_name_1,
                                "value": client.lang.event_guild_guildCreate_embed_field_value_1
                            }
                        ]
                    }
                });
            }
        }
    });
};