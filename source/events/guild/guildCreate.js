const { EmbedBuilder, AttachmentBuilder, ChannelType } = require("discord.js");
const { settingsData } = require("../../utils/databaseUtils");
const { catchError } = require("../../utils/consoleUtils");

module.exports = async (client, guild) => {
    const guildID = client.config.testGuild;
    const data = client.interaction.map((commands) => commands.interaction.data);

    if (client.mode === "start") {
        settingsData(client, guild, module.exports, guild);
        if (client.temp.set !== 1) return;
        
        await client.application.commands.set(data);
    } else {
        await client.application.commands.set(data, guildID);
    }

    const channels = guild.channels.cache.find(channel => channel.type === ChannelType.GuildText && channel.permissionsFor(guild.members.me).has("SEND_MESSAGES"));
    const guildChannel = guild.channels.cache.get(channels ? channels.id : guild.systemChannelId);

    if (guildChannel) {
        const guildName = guild.name;
        const clientFetch = client.user.fetch();
        const clientColor = clientFetch.accentColor;
        const clientAvatar = client.user.displayAvatarURL();
        const clientUsername = client.user.username;
        const languageCode = client.config.language.default;
        const attachment = new AttachmentBuilder("./source/assets/images/shioru-discord-cover-" + languageCode + ".png", { "name": "shioru-discord-cover.png" });
        const guildCreateEmbed = new EmbedBuilder()
            .setTitle(client.translate.events.guildCreate.get_started)
            .setDescription(client.translate.events.guildCreate.description.replace("%s", guildName))
            .setColor(clientColor)
            .setTimestamp()
            .setFooter({ "text": client.translate.events.guildCreate.join_on, "iconURL": "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/microsoft/209/spiral-calendar-pad_1f5d3.png" })
            .setImage("attachment://shioru-discord-cover.png")
            .setAuthor({ "iconURL": clientAvatar, "name": clientUsername, "url": "https://shiorus.web.app/" })
            .addFields(
                [
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
            );

        guildChannel.send({
            "embeds": [guildCreateEmbed],
            "files": [attachment]
        }).catch((error) => {
            catchError(client, guild.systemChannel, "guildCreate", error);
        });
    }
};