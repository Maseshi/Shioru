const { Events, PermissionsBitField, EmbedBuilder, AttachmentBuilder, ChannelType } = require("discord.js");
const { getDatabase, ref, update } = require("firebase/database");
const { updateApplicationCommands } = require("../utils/clientUtils")
const { settingsData } = require("../utils/databaseUtils");
const { catchError } = require("../utils/consoleUtils");

module.exports = {
    "name": Events.GuildCreate,
    "once": false,
    async execute(guild) {
        if (guild.client.mode === "start") {
            const guildSize = guild.client.guilds.cache.size;
            const userSize = guild.client.users.cache.size;

            update(ref(getDatabase(), "statistics/shioru/size"), {
                "guilds": guildSize,
                "users": userSize
            });

            settingsData(guild.client, guild);
        }

        await updateApplicationCommands(guild.client, true)

        const channels = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has(PermissionsBitField.Flags.SendMessages));
        const guildChannel = guild.channels.cache.get(channels ? channels.id : guild.systemChannelId);

        if (guildChannel) {
            const guildName = guild.name;
            const clientFetch = await guild.client.user.fetch();
            const clientColor = clientFetch.accentColor;
            const clientAvatar = guild.client.user.displayAvatarURL();
            const clientUsername = guild.client.user.username;
            const languageCode = guild.client.config.language.code;
            const attachment = new AttachmentBuilder("./source/assets/images/shioru-discord-cover-" + languageCode + ".png", { "name": "shioru-discord-cover.png" });
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

            guildChannel.send({
                "embeds": [guildCreateEmbed],
                "files": [attachment]
            }).catch((error) => {
                catchError(guild.client, guild.systemChannel, "guildCreate", error);
            });
        }
    }
};