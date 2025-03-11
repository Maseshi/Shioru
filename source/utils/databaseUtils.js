const { EmbedBuilder } = require('discord.js');
const {
	getDatabase,
	ref,
	child,
	get,
	set,
	update,
	remove,
	increment,
} = require('firebase/database');
const { changeLanguage, embedBuilder } = require('./clientUtils');

/**
 * The `dataStructures` function returns different data dataStructures based on the value of the `select`
 * parameter.
 * @param {Client} client - The `client` parameter is an object that represents the client or bot that is using
 * this `dataStructures` function. It likely contains various configurations and constants that are used
 * within the function.
 * @param {String} select - The `select` parameter is used to determine which dataStructures to return. It can have
 * the following values:
 * @returns The function `dataStructures` returns an object based on the value of the `select` parameter.
 * The returned object has different properties and values depending on the value of `select`.
 */
const dataStructures = (client, select) => {
	switch (select) {
		case 'chat':
			return {
				prompts: [client.configs.constants.prompts],
				replies: [client.configs.constants.replies],
				alternatives: [client.configs.constants.alternatives],
				scripts: [client.configs.constants.scripts],
				system: '',
			};
		case 'user':
			return {
				leveling: {
					exp: 0,
					level: 0,
				},
				guilds: [],
			};
		case 'guild':
			return {
				joinedAt: '',
				createdAt: '',
				description: '',
				iconURL: '',
				preferredLocale: '',
				memberCount: 0,
				name: '',
				verified: false,
			};
		case 'language':
			return {
				type: 'USER',
				locale: 'en-US',
			};
		case 'notification':
			return {
				enable: false,
				channelId: '',
				toggledAt: '',
				content: '',
				embed: {
					createdAt: '',
					createBy: '',
					editor: [
						// {
						//   userId: '',
						//   editedAt: '',
						// },
					],
					author: {
						name: '',
						url: '',
						iconURL: '',
					},
					color: '',
					title: '',
					url: '',
					description: '',
					thumbnail: '',
					timestamp: '',
					image: '',
					felids: [
						{
							name: '',
							value: '',
							inline: false,
						},
						{
							name: '',
							value: '',
							inline: false,
						},
					],
					footer: {
						text: '',
						iconURL: '',
					},
				},
			};
		case 'djs': {
			return {
				enable: false,
				toggledAt: '',
				editedAt: '',
				only: false,
				roles: [],
				users: [],
			};
		}
	}
};

/**
 * The fetchLevel function is a JavaScript function that retrieves and updates user level and
 * experience data in a database, and can also send level up notifications.
 * @param {Client} client - The `client` parameter is the client object that represents the Discord bot. It is
 * used to access various functionalities and properties of the bot, such as the username and avatar.
 * @param {Message} message - The `message` parameter is an object that contains information about the message
 * that triggered the function. It typically includes properties such as the message content, author,
 * channel, and guild.
 * @param {String} method - The `method` parameter is a string that specifies the action to be performed. It can
 * have the following values: 'GET', 'GET/ALL', 'POST', 'PUT' and 'DELETE'
 * @param {GuildMember} member Optional: Members within the guild who wish to change their information
 * @param {String} amount Optional: The desired amount will change the value.
 * @param {String} type Optional: **exp** or **level**
 * @returns The function `fetchLevel` returns a callback object with the following properties:
 */
const fetchLevel = async (
	client,
	message,
	method,
	{ member = '', amount = 1, type = 'exp' } = {},
) => {
	if (!client)
		return client.logger.warn(
			'Please configure CLIENT for localization (required).',
		);
	if (!message)
		return client.logger.warn(
			'Please configure MESSAGE to make notifications and receive important basic information (required).',
		);
	if (!method)
		return client.logger.warn(
			'Please specify a METHOD to continue. (required).',
		);

	const callback = {
		status: 'padding',
		exp: 0,
		level: 0,
		levelup: 0,
		users: null,
	};

	const usersRef = ref(getDatabase(), 'users');
	const userRef = child(
		usersRef,
		member ? member.id : (message.member.id ?? message.user.id),
	);
	const userSnapshot = await get(userRef);

	if (!userSnapshot.exists()) {
		await set(userRef, dataStructures(client, 'user'));
		return fetchLevel(client, message, method, { member, amount, type });
	}

	const userVal = userSnapshot.val();
	const leveling = userVal.leveling;
	let exp = leveling.exp || 0;
	let level = leveling.level || 0;

	const base = 200;
	const levelup = level * level * base;

	switch (method) {
		case 'GET': {
			callback.status = 'success';
			callback.exp = exp;
			callback.level = level;
			callback.levelup = levelup;
			break;
		}
		case 'GET/ALL': {
			const usersSnapshot = await get(usersRef);

			if (usersSnapshot.exists()) {
				callback.status = 'success';
				callback.users = usersSnapshot;
			} else {
				callback.status = 'null';
			}
			break;
		}
		case 'POST': {
			if (!amount) {
				callback.status = 'error';
				return client.logger.warn('Please specify the amount of experience.');
			}

			try {
				if (type === 'exp')
					await update(
						child(child(userRef, 'leveling'), 'exp'),
						(exp += amount),
					);
				if (type === 'level')
					await update(
						child(child(userRef, 'leveling'), 'level'),
						(level += amount),
					);

				callback.status = 'success';
			} catch {
				callback.status = 'error';
			}
			break;
		}
		case 'PUT': {
			try {
				if (type === 'exp')
					await update(child(child(userRef, 'leveling'), 'exp'), amount);
				if (type === 'level')
					await update(child(child(userRef, 'leveling'), 'level'), amount);

				callback.status = 'success';
				callback.exp = exp;
				callback.level = level;
			} catch {
				callback.status = 'error';
			}
			break;
		}
		case 'DELETE': {
			if (!member)
				return client.logger.warn(
					'Please enter the user ID you wish to delete experience data for.',
				);
			if (!leveling) {
				callback.status = 'missing';
				return client.logger.warn(
					"The user's level information has disappeared.",
				);
			}

			try {
				await remove(child(userRef, 'leveling'));
				callback.status = 'success';
			} catch {
				callback.status = 'error';
			}
			break;
		}
	}

	// Check if user has level up
	if (exp >= levelup) {
		const authorUsername = message.member
			? message.member.username
			: message.user.username;
		const authorAvatar = message.member
			? message.member.displayAvatarURL()
			: message.user.displayAvatarURL();
		const levelSystemEmbed = new EmbedBuilder()
			.setTitle(client.i18n.t('utils.databaseUtils.congratulations'))
			.setDescription(
				client.i18n
					.t('utils.databaseUtils.level_up')
					.replace('%s1', authorUsername)
					.replace('%s2', level),
			)
			.setColor('Yellow')
			.setThumbnail(authorAvatar);

		await update(child(userRef, 'leveling'), {
			exp: (exp -= levelup),
			level: ++level,
		});

		submitNotification(client, message.guild, 'general', levelSystemEmbed);
	}

	return callback;
};

/**
 * Fetches statistics from the database based on the provided method and path.
 *
 * @param {string} method - The HTTP method to use (GET or POST).
 * @param {string} path - The path to the statistics data in the database.
 * @param {object} client - The client object representing the user.
 * @returns {Promise<any>} - A promise that resolves to the fetched statistics data.
 */
const fetchStatistics = async (method, path, client) => {
	const statisticsRef = child(ref(getDatabase(), 'statistics'), path);

	switch (method) {
		case 'GET': {
			switch (path) {
				case 'size': {
					const statisticsSnapshot = await get(statisticsRef);
					const statisticsVal = statisticsSnapshot.exists()
						? statisticsSnapshot.val()
						: null;

					return statisticsVal;
				}
			}
			break;
		}
		case 'POST': {
			switch (path) {
				case 'size': {
					const statisticsSnapshot = await get(statisticsRef);
					const statisticsVal = statisticsSnapshot.exists()
						? statisticsSnapshot.val()
						: null;
					const prevCommandSize = statisticsVal ? statisticsVal.commands : 0;
					const prevGuildSize = statisticsVal ? statisticsVal.guilds : 0;
					const prevUserSize = statisticsVal ? statisticsVal.users : 0;
					const commandSize = client.commands.size ?? 0;
					const guildSize = client.guilds.cache.size ?? 0;
					const userSize = client.users.cache.size ?? 0;

					if (prevCommandSize !== commandSize)
						update(statisticsRef, {
							commands: commandSize,
						});
					if (prevGuildSize !== guildSize)
						update(statisticsRef, {
							guilds: guildSize,
						});
					if (prevUserSize !== userSize)
						update(statisticsRef, {
							users: userSize,
						});
					break;
				}
				case 'size/worked': {
					set(statisticsRef, increment(1));
					break;
				}
				default: {
					if (path.startsWith('command') || path.startsWith('context')) {
						set(statisticsRef, increment(1));
						break;
					}

					client.logger.warn(`Unknown post path at ${path}`);
					break;
				}
			}
		}
	}
};

/**
 * The `submitNotification` function sends a notification to a specified channel in a guild with optional
 * embed data.
 * @param {Client} client - The `client` parameter is typically an instance of the Discord.js `Client` class. It
 * represents the bot or user that is connected to the Discord API.
 * @param {Guild} guild - The `guild` parameter represents the guild (server) where the notification will be
 * sent. It is an object that contains information about the guild, such as its ID, name, and other
 * properties.
 * @param {String} eventName - The `eventName` parameter is a string that represents the name of the event for
 * which the notification is being sent. It could be something like "userJoined", "messageDeleted",
 * etc.
 * @param {EmbedBuilder} embedData - The `embedData` parameter is an object that contains the data for creating an
 * embed message. It includes properties such as `author`, `color`, `title`, `description`,
 * `thumbnail`, `fields`, `image`, `timestamp`, `footer`, etc. These properties are used to customize
 * the
 * @returns The function `submitNotification` returns the result of the `GuildChannel` method call.
 */
const submitNotification = async (client, guild, eventName, embedData) => {
	const guildRef = child(ref(getDatabase(), 'guilds'), guild.id);
	const guildSnapshot = await get(guildRef);

	if (!guildSnapshot.exists()) return null;

	const guildData = guildSnapshot.val();
	const notification = guildData.notification;

	if (!notification) return null;

	const notify = notification[eventName];

	if (!notify) return null;

	const channelId = notify.id;
	const content = notify.content;
	const enable = notify.enable;
	const embed = notify.embed;

	const guildChannel = guild.channels.cache.find(
		(channel) => channel.id === channelId,
	);

	if (!guildChannel) return null;
	if (!enable) return null;
	if (embed) {
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
		content: content ?? '',
		embeds: [embedData],
	});
};

/**
 * The `initializeData` function initializes and updates data for a guild in a database based on the
 * provided client and guild information.
 * @param {Client} client - The `client` parameter is an object representing the Discord bot client. It is used
 * to interact with the Discord API and perform actions on behalf of the bot.
 * @param {Guild} guild - The `guild` parameter is an object that represents a Discord guild (server). It
 * contains various properties such as `id`, `joinedAt`, `createdAt`, `description`, `iconURL`,
 * `language`, `memberCount`, `name`, and `verified`. These properties are used to initialize or
 */
const initializeData = async (client, guild) => {
	const guildRef = child(ref(getDatabase(), 'guilds'), guild.id);
	const guildSnapshot = await get(guildRef);

	if (!guildSnapshot.exists()) {
		await set(
			guildRef,
			{
				joinedAt: guild.joinedAt ?? dataStructures(client, 'guild').joinedAt,
				createdAt: guild.createdAt ?? dataStructures(client, 'guild').createdAt,
				description:
					guild.description ?? dataStructures(client, 'guild').description,
				iconURL: guild.iconURL() ?? dataStructures(client, 'guild').iconURL,
				language: dataStructures(client, 'language'),
				preferredLocale:
					guild.preferredLocale ??
					dataStructures(client, 'guild').preferredLocale,
				memberCount:
					guild.memberCount ?? dataStructures(client, 'guild').memberCount,
				name: guild.name ?? dataStructures(client, 'guild').name,
				verified: guild.verified ?? dataStructures(client, 'guild').verified,
			},
			{ marge: true },
		);
		return initializeData(client, guild);
	}

	const guildData = guildSnapshot.val();

	if (!guildData.joinedAt || guildData.joinedAt !== guild.joinedAt)
		update(guildRef, {
			joinedAt: guild.joinedAt ?? dataStructures(client, 'guild').joinedAt,
		});
	if (!guildData.createdAt || guildData.createdAt !== guild.createdAt)
		update(guildRef, {
			createdAt: guild.createdAt ?? dataStructures(client, 'guild').createdAt,
		});
	if (!guildData.description || guildData.description !== guild.description)
		update(guildRef, {
			description:
				guild.description ?? dataStructures(client, 'guild').description,
		});
	if (!guildData.iconURL || guildData.iconURL !== guild.iconURL())
		update(guildRef, {
			iconURL: guild.iconURL() ?? dataStructures(client, 'guild').iconURL,
		});
	if (
		!guildData.preferredLocale ||
		guildData.preferredLocale !== guild.preferredLocale
	)
		update(guildRef, {
			preferredLocale:
				guild.preferredLocale ||
				dataStructures(client, 'guild').preferredLocale,
		});
	if (!guildData.memberCount || guildData.memberCount !== guild.memberCount)
		update(guildRef, {
			memberCount:
				guild.memberCount ?? dataStructures(client, 'guild').memberCount,
		});
	if (!guildData.name || guildData.name !== guild.name)
		update(guildRef, {
			name: guild.name ?? dataStructures(client, 'guild').name,
		});
	if (!guildData.verified || guildData.verified !== guild.verified)
		update(guildRef, {
			verified: guild.verified ?? dataStructures(client, 'guild').verified,
		});
	if (
		!guildData?.language ||
		typeof guildData?.language !== typeof dataStructures(client, 'language')
	)
		update(guildRef, {
			language: dataStructures(client, 'language'),
		});

	if (guildData?.language) {
		if (guildData.language?.type === 'CUSTOM')
			changeLanguage(client, guildData.language.locale);
		if (guildData.language?.type === 'GUILD')
			changeLanguage(client, guildData.preferredLocale);
	}
	if (guildData?.djs) {
		if (
			guildData.djs.roles &&
			client.configs.djs.roles.join() !== guildData.djs.roles.join()
		)
			client.configs.djs.roles = guildData.djs.roles;
		if (
			guildData.djs.users &&
			client.configs.djs.users.join() !== guildData.djs.users.join()
		)
			client.configs.djs.users = guildData.djs.users;
	}
};

module.exports = {
	dataStructures,
	fetchLevel,
	fetchStatistics,
	submitNotification,
	initializeData,
};
