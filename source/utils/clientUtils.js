const { EmbedBuilder, WebhookClient, resolveColor } = require('discord.js');

/**
 * Update information of all application commands both **global** and **guild**.
 *
 * @param {Client} client
 * @param {Boolean} reload If set to `true`, no messages will be displayed on the console.
 */
const registeringCommands = async (client, reload = false) => {
	const guildID = client.configs.test_guild;

	try {
		const commands = client.commands.map((command) => command.data);
		const contexts = client.contexts.map((context) => context.data);
		const data = [...commands, ...contexts];

		if (!reload)
			client.logger.info(
				`Started refreshing ${data.length} application commands...`,
			);
		if (client.mode === 'start') {
			client.application.commands.set(data);

			if (!reload)
				client.logger.info(
					`Successfully reloaded ${data.length} application commands.`,
				);
		}
		if (client.mode !== 'start') {
			if (!guildID) return;

			const guild = await client.guilds.fetch(guildID);

			if (!guild)
				return client.logger.warn(
					'Unable to update command application in test guild.',
				);

			guild.commands.set(data);

			if (!reload)
				client.logger.info(
					`Successfully reloaded ${data.length} application commands in ${guild.name}.`,
				);
		}
	} catch (error) {
		if (!reload)
			client.logger.error(
				error,
				'Application commands could not be completely reloaded.',
			);
	}
};

const webhookSend = (configs, message) => {
	if (!configs.enable) return;
	if (!configs.webhookURL) return;

	const webhook = new WebhookClient({
		url: configs.webhookURL,
	});

	return webhook.send({
		username: configs.username ?? '',
		avatarURL: configs.avatarURL ?? '',
		...message,
	});
};

const changeLanguage = (client, language) => {
	if (client.i18n.language !== language) {
		client.i18n.changeLanguage(language);
	}
};

/**
 * The `embedBuilder` function is a JavaScript function that takes in various parameters to build and
 * customize an embed message for a Discord bot.
 * @param {Client} client - The `client` parameter is typically the instance of the Discord.js client that is
 * used to interact with the Discord API. It is used to access various functionalities and properties
 * of the client, such as the i18n (internationalization) module in this case.
 * @param {String} authorName - The name of the author of the embed.
 * @param {String} authorURL - The `authorURL` parameter is a string that represents the URL of the author's
 * name in the embed. It is an optional parameter and can be used to provide a link to the author's
 * profile or website.
 * @param {String} authorIconURL - The `authorIconURL` parameter is a string that represents the URL of the icon
 * for the author of the embed. It is an optional parameter and can be used to display an icon next to
 * the author's name in the embed.
 * @param {String} color - The `color` parameter is used to set the color of the embed. It accepts a hexadecimal
 * color code or a color name.
 * @param {String} title - The title of the embed.
 * @param {String} description - The `description` parameter is a string that represents the main content or
 * message of the embed. It can be used to provide additional information or context about the embed.
 * @param {String} url - The `url` parameter is a string that represents the URL that the embed's title should
 * link to.
 * @param {String} thumbnail - The `thumbnail` parameter is used to specify the URL of the thumbnail image to be
 * displayed in the embed.
 * @param {String} fieldName - The `fieldName` parameter is used to specify the name of a field in the embed. It
 * is typically used in conjunction with the `fieldValue` parameter to provide additional information
 * in the embed.
 * @param {String} fieldValue - The `fieldValue` parameter is the value of the field in the embed. It is the
 * content that will be displayed below the field name.
 * @param {Boolean} fieldInline - The `fieldInline` parameter is a boolean value that determines whether the
 * field should be displayed inline or not. If `fieldInline` is set to `true`, the field will be
 * displayed inline with other fields. If `fieldInline` is set to `false` or omitted, the field will
 * @param {String} image - The `image` parameter is used to specify the URL of the image to be displayed in the
 * embed.
 * @param {String} timestamp - The `timestamp` parameter is used to set the timestamp of the embed. It accepts a
 * valid timestamp value, such as a Date object or a string in ISO 8601 format.
 * @param {String} footerText - The `footerText` parameter is a string that represents the text to be displayed
 * in the footer of the embed. It is typically used to provide additional information or attribution.
 * @param {String} footerIconURL - The `footerIconURL` parameter is the URL of the icon that will be displayed
 * next to the footer text in the embed. It is an optional parameter, so you can leave it empty if you
 * don't want to include an icon.
 * @returns The function `embedBuilder` returns an object with two properties: `data` and `error`. The
 * `data` property contains the constructed embed object, while the `error` property indicates whether
 * any errors occurred during the construction of the embed.
 */
const embedBuilder = (
	client,
	authorName,
	authorURL,
	authorIconURL,
	color,
	title,
	url,
	description,
	thumbnail,
	firstFieldName,
	firstFieldValue,
	firstFieldInline,
	secondFieldName,
	secondFieldValue,
	secondFieldInline,
	image,
	timestamp,
	footerText,
	footerIconURL,
) => {
	const embed = new EmbedBuilder();

	try {
		if (authorName) {
			if (authorIconURL && !authorIconURL.startWith('http'))
				return {
					data: client.i18n.t('utils.clientUtils.is_not_a_link', {
						input: 'author_icon_url',
					}),
					error: true,
				};
			if (authorURL && !authorURL.startWith('http'))
				return {
					data: client.i18n.t('utils.clientUtils.is_not_a_link', {
						input: 'author_url',
					}),
					error: true,
				};

			embed.setAuthor({
				name: authorName,
				iconURL: authorIconURL,
				url: authorURL,
			});
		}
		if (color) {
			try {
				embed.setColor(resolveColor(color));
			} catch {
				return {
					data: client.i18n.t('utils.clientUtils.color_is_not_valid'),
					error: true,
				};
			}
		}
		if (title) embed.setTitle(title);
		if (url) {
			if (!url.startWith('http'))
				return {
					data: client.i18n.t('utils.clientUtils.is_not_a_link', {
						input: 'url',
					}),
					error: true,
				};

			embed.setURL(url);
		}
		if (description) embed.setDescription(description);
		if (thumbnail) {
			if (!thumbnail.startWith('http'))
				return {
					data: client.i18n.t('utils.clientUtils.is_not_a_link', {
						input: 'thumbnail',
					}),
					error: true,
				};

			embed.setThumbnail(thumbnail);
		}
		if (firstFieldName) {
			if (!firstFieldValue)
				return {
					data: client.i18n.t('utils.clientUtils.need_other_input', {
						input: 'thumbnail',
					}),
					error: true,
				};

			embed.addFields({
				name: firstFieldName,
				value: firstFieldValue,
				inline: firstFieldInline,
			});
		}
		if (secondFieldName) {
			if (!secondFieldValue)
				return {
					data: client.i18n.t('utils.clientUtils.need_other_input', {
						input: 'thumbnail',
					}),
					error: true,
				};

			embed.addFields({
				name: secondFieldName,
				value: secondFieldValue,
				inline: secondFieldInline,
			});
		}
		if (image) {
			if (!image.startWith('http'))
				return {
					data: client.i18n.t('utils.clientUtils.is_not_a_link', {
						input: 'image',
					}),
					error: true,
				};

			embed.setImage(image);
		}
		if (timestamp) {
			try {
				embed.setTimestamp(timestamp);
			} catch {
				return {
					data: client.i18n.t('utils.clientUtils.timestamp_is_not_valid'),
					error: true,
				};
			}
		}
		if (footerText) {
			embed.setFooter({
				text: footerText,
				iconURL: footerIconURL,
			});
		}

		return {
			data: embed,
			error: false,
		};
	} catch (error) {
		return {
			data: error,
			error: true,
		};
	}
};

const usageBuilder = (command) => {
	const optionTypes = {
		3: '(String)',
		4: '(Integer)',
		5: '(Boolean)',
		6: '(User)',
		7: '(Channel)',
		8: '(Role)',
		9: '(Mentionable)',
		10: '(Number)',
		11: '(Attachment)',
	};
	let usage = command.data.name;

	const buildOption = (option) => {
		let usageOption = '';

		usageOption += !option.type ? '' : option.required ? '<' : '[';
		usageOption += option.name;
		usageOption += !option.type ? '' : optionTypes[option.type];
		usageOption +=
			option.options && option.options.length
				? ': ' + option.options.map(buildOption).join(', ')
				: '';
		usageOption += !option.type ? '' : option.required ? '>' : ']';

		return usageOption;
	};

	usage +=
		command.data.options && command.data.options.length
			? ': ' + command.data.options.map(buildOption).join(', ')
			: '';

	return usage;
};

module.exports = {
	registeringCommands,
	webhookSend,
	changeLanguage,
	embedBuilder,
	usageBuilder,
};
