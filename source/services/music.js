const { getGuildDjs } = require("./guildCache");

/**
 * Checks whether the interaction's user may control the guild's current queue
 * under the guild's DJ settings.
 *
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @param {object | undefined} queue The guild's current DisTube queue, if any.
 * @param {{ notOwner: string, notDj: string }} keys i18n keys for each denial.
 * @returns {string | null} The i18n key to reply with, or null when allowed.
 */
const getDjDenial = (interaction, queue, { notOwner, notDj }) => {
  if (!queue) return null;

  const djs = getGuildDjs(interaction.client, interaction.guildId);

  if (!djs.enable) return null;
  if (interaction.user.id !== queue.songs[0].user.id && !queue.autoplay)
    return notOwner;

  const isDj =
    djs.users.includes(interaction.user.id) ||
    interaction.member.roles.cache.some((role) => djs.roles.includes(role.id));

  if (djs.only && !isDj) return notDj;

  return null;
};

module.exports = { getDjDenial };
