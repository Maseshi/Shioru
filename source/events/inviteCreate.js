const { Events, EmbedBuilder } = require('discord.js');
const {
	submitNotification,
	initializeData,
} = require('../utils/databaseUtils');

module.exports = {
	name: Events.InviteCreate,
	once: false,
	async execute(invite) {
		const inviteCreateEmbed = new EmbedBuilder()
			.setTitle(invite.client.i18n.t('events.inviteCreate.invite_notification'))
			.setDescription(
				invite.client.i18n
					.t('events.inviteCreate.invite_create')
					.replace('%s1', invite.url)
					.replace('%s2', invite.expiresAt)
					.replace('%s3', invite.maxUses)
					.replace('%s4', invite.code),
			)
			.setTimestamp()
			.setColor('Yellow');

		await initializeData(invite.client, invite.guild);
		await submitNotification(
			invite.client,
			invite.guild,
			Events.InviteCreate,
			inviteCreateEmbed,
		);
	},
};
