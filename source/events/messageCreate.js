const { Events, ChannelType } = require('discord.js');
const { getDatabase, ref, child, get, remove } = require('firebase/database');
const { fetchLevel, initializeData } = require('../utils/databaseUtils');
const { catchError } = require('../utils/consoleUtils');

module.exports = {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {
		if (message.webhookId) return;
		if (message.author.bot) return;

		// Settings data on database
		if (message.channel.type !== ChannelType.DM) {
			initializeData(message.client, message.guild);
			fetchLevel(message.client, message, 'POST', {
				amount: 89,
				type: 'exp',
			});
		}

		// When the bot is called
		if (
			!message.mentions.everyone &&
			message.mentions.has(message.client.user.id)
		) {
			const prompts = message.client.configs.constants.prompts;
			const replies = message.client.configs.constants.replies;
			const alternatives = message.client.configs.constants.alternatives;
			const scripts = message.client.configs.constants.scripts;
			const argument = message.content.replace(/^<@!?\d{1,20}> ?/i, '');

			// When a bot is called but doesn't type anything
			if (message.content && !argument) {
				message.channel.sendTyping();
				message.reply(
					alternatives[Math.floor(Math.random() * alternatives.length)],
				);
			}

			// When the bot calls and asks some questions.
			if (argument) {
				message.channel.sendTyping();

				try {
					const compare = (
						promptsArray,
						repliesArray,
						scriptsArray,
						textString,
					) => {
						let reply, command, script;

						for (let x = 0; x < promptsArray.length; x++) {
							for (let y = 0; y < promptsArray[x].length; y++) {
								if (promptsArray[x][y] === textString) {
									const repliesX = repliesArray[x];
									const scriptsX = scriptsArray[x] ?? null;
									reply = repliesX[Math.floor(Math.random() * repliesX.length)];
									script = scriptsX
										? scriptsX[Math.floor(Math.random() * scriptsX.length)]
										: null;
									break;
								}
							}
						}

						return { reply, command, script };
					};

					// Remove all characters except word characters, space, and digits
					// 'tell me a story' -> 'tell me story'
					// 'i feel happy' -> 'happy'
					const text = argument
						.replaceAll(/ a /g, ' ')
						.replaceAll(/pls/g, 'please')
						.replaceAll(/i feel /g, '')
						.replaceAll(/whats/g, 'what is')
						.replaceAll(/please /g, '')
						.replaceAll(/ please/g, '')
						.replaceAll(/r u/g, 'are you')
						.toLowerCase();
					const compared = compare(prompts, replies, scripts, text);

					if (compared.reply && !compared.script) {
						// Answer the questions normally.
						message.reply(compared.reply);
					} else if (compared.reply && compared.script) {
						// Answer the questions with a script.
						// Script format on database: ((client, message, answer) => { ... })
						// Script format after converted: ((client, message, answer) => { ... })(client, message, answer[randomWords])
						const answerScript = await eval(compared.script)(
							message.client,
							message,
							compared.reply,
						);

						message.reply(answerScript);
					} else {
						// If the bot doesn't have any answer, it will use the AI.
						const apiKey = message.client.configs.openai.apiKey;
						const baseURL = message.client.configs.openai.baseURL;
						const clientUsername = message.client.user.username;
						const systemConstants = message.client.configs.constants.system;

						const response = await fetch(
							new URL('/v1/chat/completions', baseURL),
							{
								method: 'POST',
								headers: {
									Authorization: `Bearer ${apiKey}`,
									'Content-Type': 'application/json',
								},
								body: JSON.stringify({
									model: 'gpt-4o-mini',
									messages: [
										{
											role: 'system',
											content:
												systemConstants ??
												`From now on, you are ${clientUsername}.`,
										},
										{ role: 'user', content: argument },
									],
								}),
							},
						);
						const data = await response.json();

						message.reply(data.choices[0].message.content);
					}
				} catch (error) {
					message.reply(
						message.client.i18n.t('commands.ask.can_not_answer_at_this_time'),
					);
					catchError(message.client, message, 'chat', error, true);
				}
			}
		}

		// Remove AFK status
		if (message.channel.type !== ChannelType.DM) {
			const guildRef = child(ref(getDatabase(), 'guilds'), message.guild.id);
			const guildSnapshot = await get(guildRef);

			if (guildSnapshot.exists()) {
				const afkData = guildSnapshot.val().afk;

				if (afkData && afkData[message.author.id]) {
					message.channel.sendTyping();

					try {
						await message.member.setNickname(
							afkData[message.author.id].nickname,
						);
					} catch (error) {
						catchError(message.client, message, 'afk', error);
					}

					await remove(child(child(guildRef, 'afk'), message.author.id));
					await message.reply({
						content: message.client.i18n.t(
							'events.messageCreate.afk_user_come_back',
						),
						ephemeral: true,
					});
				} else {
					const members = message.mentions.users.first();

					if (!members) return;
					if (!afkData) return;
					if (!afkData[members.id]) return;

					message.channel.sendTyping();

					const member = message.guild.members.cache.get(members.id);
					const reason =
						afkData[members.id].message ||
						message.client.i18n.t('events.messageCreate.no_reason_for_afk');

					if (message.content.includes(members)) {
						message.reply(
							message.client.i18n
								.t('events.messageCreate.that_user_is_afk')
								.replace('%s1', member.user.tag)
								.replace('%s2', reason),
						);
					}
				}
			}
		}
	},
};
