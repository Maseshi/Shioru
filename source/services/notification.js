const { embedBuilder } = require("../utils/clientUtils");
const { getGuildData } = require("../utils/cacheUtils");
const { getGuild } = require("../repositories/guild");

const submitNotification = async (client, guild, eventName, embedData) => {
  if (!guild) return null;

  let guildData = getGuildData(client, guild.id);
  if (!guildData) {
    guildData = await getGuild(guild.id);
    if (!guildData) return null;
  }

  const notify = guildData.notification?.[eventName];
  if (!notify) return null;

  const guildChannel = guild.channels.cache.find(
    (channel) => channel.id === (notify.channelId ?? notify.id),
  );
  if (!guildChannel || !notify.enable) return null;

  if (notify.embed) {
    const embed = notify.embed;
    embedData = embedBuilder(
      client,
      embed.author.name,
      embed.author.url,
      embed.author.iconURL,
      embed.color,
      embed.title,
      embed.url,
      embed.description,
      embed.thumbnail,
      embed.fields[0].name,
      embed.fields[0].value,
      embed.fields[0].inline,
      embed.fields[1].name,
      embed.fields[1].value,
      embed.fields[1].inline,
      embed.image,
      embed.timestamp,
      embed.footer.text,
      embed.footer.iconURL,
    );
  }

  return guildChannel.send({
    content: notify.content ?? "",
    embeds: [embedData],
  });
};

module.exports = { submitNotification };
