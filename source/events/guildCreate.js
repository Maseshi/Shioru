const { Events, PermissionsBitField, EmbedBuilder, AttachmentBuilder, ChannelType } = require("discord.js");
const { getDatabase, ref, child, update } = require("firebase/database");
const { updateApplicationCommands } = require("../utils/clientUtils")
const { settingsData } = require("../utils/databaseUtils");
const { catchError } = require("../utils/consoleUtils");
const { IDConvertor } = require("../utils/miscUtils");

module.exports = {
    "name": Events.GuildCreate,
    "once": false,
    async execute(guild) {
        settingsData(guild.client, guild);
        updateApplicationCommands(guild.client, true);

        const guildSize = guild.client.guilds.cache.size;
        const userSize = guild.client.users.cache.size;
        const channels = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages));
        const guildChannel = guild.channels.cache.get(channels ? channels.id : guild.systemChannelId);

        update(child(child(ref(getDatabase(), "statistics"), IDConvertor(guild.client.user.username)), "size"), {
            "guilds": guildSize,
            "users": userSize
        });

        if (guildChannel) {
            const guildName = guild.name;
            const languageCode = guild.client.config.language.code;
            const clientFetch = await guild.client.user.fetch();
            const clientColor = clientFetch.accentColor;
            const clientAvatar = guild.client.user.displayAvatarURL();
            const clientUsername = guild.client.user.username;
            const guildCreateEmbed = new EmbedBuilder()
                .setTitle(guild.client.translate.events.guildCreate.get_started)
                .setDescription(guild.client.translate.events.guildCreate.description.replace("%s", guildName))
                .setColor(clientColor)
                .setTimestamp()
                .setFooter({ "text": guild.client.translate.events.guildCreate.join_on, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/spiral-calendar-pad_1f5d3.png" })
                .setImage("attachment://shioru-discord-cover.png")
                .setAuthor({ "iconURL": clientAvatar, "name": clientUsername, "url": "https://shiorus.web.app/" })
                .addFields(
                    [
                        {
                            "name": guild.client.translate.events.guildCreate.advice,
                            "value": guild.client.translate.events.guildCreate.advice_detail
                        },
                        {
                            "name": guild.client.translate.events.guildCreate.support_multiple_languages,
                            "value": guild.client.translate.events.guildCreate.support_multiple_languages_detail
                        },
                        {
                            "name": guild.client.translate.events.guildCreate.help_information_and_documentation,
                            "value": guild.client.translate.events.guildCreate.help_information_and_documentation_detail
                        }
                    ]
                );

            try {
                guildChannel.send({
                    "embeds": [guildCreateEmbed],
                    "files": [
                        new AttachmentBuilder(
                            "./source/assets/images/shioru-discord-cover-" + languageCode + ".png",
                            { "name": "shioru-discord-cover.png" }
                        )
                    ]
                });
            } catch {
                try {
                    guildChannel.send({
                        "embeds": [guildCreateEmbed],
                        "files": [
                            new AttachmentBuilder(
                                "./source/assets/images/shioru-discord-cover-en-US.png",
                                { "name": "shioru-discord-cover.png" }
                            )
                        ]
                    });
                } catch (error) {
                    catchError(guild.client, guild.systemChannel, "guildCreate", error);
                }
            }
        }
    }
};