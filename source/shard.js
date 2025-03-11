/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Chaiwat Suwannarat
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const {
	ShardingManager,
	ShardEvents,
	EmbedBuilder,
	Colors,
} = require('discord.js');
const { webhookSend } = require('./utils/clientUtils');
const { startScreen, logger } = require('./utils/consoleUtils');
const {
	updateChecker,
	systemMetricsSubmitter,
	statisticsSubmitter,
} = require('./utils/servicesUtils');
const configs = require('./configs/data');

startScreen();

const child = logger.child({}, { msgPrefix: '[Shard] ' });
const mode = process.env.npm_lifecycle_event || 'start';
const logEmbed = new EmbedBuilder().setTimestamp();
const manager = new ShardingManager('./source/main.js', {
	respawn: true,
	shardList: 'auto',
	token: configs.token,
	totalShards: 'auto',
});

manager.on('shardCreate', (shard) => {
	const shardID = shard.id;
	const shardAt = shardID + 1;
	const shardTotal = manager.totalShards;

	if (mode !== 'dev') updateChecker();
	if (mode === 'start') systemMetricsSubmitter();
	if (mode === 'start') statisticsSubmitter(manager);

	logEmbed
		.setColor(Colors.Blue)
		.setTitle('🆙・Launching Shard')
		.setDescription('A shard has just been launched')
		.setFields([
			{
				name: '🆔 ID',
				value: shardID.toString(),
				inline: true,
			},
			{
				name: '🏷️ Total Shards',
				value: `${shardAt}/${shardTotal}`,
				inline: true,
			},
			{
				name: '📃 State',
				value: 'Starting Up...',
				inline: true,
			},
		]);
	webhookSend(configs.logger.shard, { embeds: [logEmbed] });
	child.info(`Launched shard id ${shardID} [${shardAt}/${shardTotal}]`);

	shard.on(ShardEvents.Death, (process) => {
		logEmbed
			.setColor(Colors.Red)
			.setTitle('⚠️・Shard Death')
			.setDescription('A shard has been closing unexpectedly')
			.setFields([
				{
					name: '🆔 ID',
					value: shardID.toString(),
					inline: true,
				},
				{
					name: '🏷️ Total Shards',
					value: `${shardAt}/${shardTotal}`,
					inline: true,
				},
				{
					name: '📃 State',
					value: 'Death',
					inline: true,
				},
			]);
		webhookSend(configs.logger.shard, { embeds: [logEmbed] });
		child.error(new Date(), `Closing shard id ${shardID} unexpectedly`);

		if (process.exitCode === null) {
			logEmbed
				.setColor(Colors.Red)
				.setTitle('⚠️・Shard Death')
				.setDescription('A shard exited with NULL error code!')
				.setFields([
					{
						name: '🆔 ID',
						value: shardID.toString(),
						inline: true,
					},
					{
						name: '🏷️ Total Shards',
						value: `${shardAt}/${shardTotal}`,
						inline: true,
					},
					{
						name: '📃 State',
						value: 'Death',
						inline: true,
					},
					{
						name: 'PID',
						value: process.pid,
						inline: true,
					},
					{
						name: 'Exit Code',
						value: process.exitCode,
						inline: true,
					},
				]);
			webhookSend(configs.logger.shard, { embeds: [logEmbed] });
			child.error(process, `Shard id ${shardID} exited with NULL error code!`);
		}
	});
	shard.on(ShardEvents.Disconnect, () => {
		logEmbed
			.setColor(Colors.Default)
			.setTitle('🔌・Shard Disconnect')
			.setDescription('A shard has disconnected from the event.')
			.setFields([
				{
					name: '🆔 ID',
					value: shardID.toString(),
					inline: true,
				},
				{
					name: '🏷️ Total Shards',
					value: `${shardAt}/${shardTotal}`,
					inline: true,
				},
				{
					name: '📃 State',
					value: 'Disconnect',
					inline: true,
				},
			]);
		webhookSend(configs.logger.shard, { embeds: [logEmbed] });
		child.warn(`Shard id ${shardID} has disconnected from the event.`);
	});
	shard.on(ShardEvents.Error, (error) => {
		logEmbed
			.setColor(Colors.Red)
			.setTitle('⚠️・Shard Error')
			.setDescription('A shard is having problems.')
			.setFields([
				{
					name: '🆔 ID',
					value: shardID.toString(),
					inline: true,
				},
				{
					name: '🏷️ Total Shards',
					value: `${shardAt}/${shardTotal}`,
					inline: true,
				},
				{
					name: '📃 State',
					value: 'Error',
					inline: true,
				},
			]);
		webhookSend(configs.logger.shard, { embeds: [logEmbed] });
		child.fatal(error, `Shard id ${shardID} is having problems.`);
	});
	shard.on(ShardEvents.Ready, () => {
		logEmbed
			.setColor(Colors.Green)
			.setTitle('✅・Shard Ready')
			.setDescription('A shard is ready')
			.setFields([
				{
					name: '🆔 ID',
					value: shardID.toString(),
					inline: true,
				},
				{
					name: '🏷️ Total Shards',
					value: `${shardAt}/${shardTotal}`,
					inline: true,
				},
				{
					name: '📃 State',
					value: 'Ready',
					inline: true,
				},
			]);
		webhookSend(configs.logger.shard, { embeds: [logEmbed] });
		child.info(`Shard ${shardID} is ready [${shardAt}/${shardTotal}]`);
	});
	shard.on(ShardEvents.Reconnecting, () => {
		logEmbed
			.setColor(Colors.Blue)
			.setTitle('⌛・Shard Reconnecting')
			.setDescription('Reconnecting shard')
			.setFields([
				{
					name: '🆔 ID',
					value: shardID.toString(),
					inline: true,
				},
				{
					name: '🏷️ Total Shards',
					value: `${shardAt}/${shardTotal}`,
					inline: true,
				},
				{
					name: '📃 State',
					value: 'Reconnecting',
					inline: true,
				},
			]);
		webhookSend(configs.logger.shard, { embeds: [logEmbed] });
		child.info(new Date(), `Reconnecting shard id ${shardID}`);
	});
	shard.on(ShardEvents.Resume, () => {
		logEmbed
			.setColor(Colors.Blue)
			.setTitle('▶️・Shard Resume')
			.setDescription('Shard is resuming.')
			.setFields([
				{
					name: '🆔 ID',
					value: shardID.toString(),
					inline: true,
				},
				{
					name: '🏷️ Total Shards',
					value: `${shardAt}/${shardTotal}`,
					inline: true,
				},
				{
					name: '📃 State',
					value: 'Resume',
					inline: true,
				},
			]);
		webhookSend(configs.logger.shard, { embeds: [logEmbed] });
		child.info(`Shard id ${shardID} is resuming`);
	});
	shard.on(ShardEvents.Spawn, (process) => {
		logEmbed
			.setColor(Colors.Red)
			.setTitle('🥚・Shard Spawn')
			.setDescription('The shard is starting to work.')
			.setFields([
				{
					name: '🆔 ID',
					value: shardID.toString(),
					inline: true,
				},
				{
					name: '🏷️ Total Shards',
					value: `${shardAt}/${shardTotal}`,
					inline: true,
				},
				{
					name: '📃 State',
					value: 'Spawn',
					inline: true,
				},
			]);
		webhookSend(configs.logger.shard, { embeds: [logEmbed] });
		child.info(
			process,
			`Spawning shard id ${shardID} [${shardAt}/${shardTotal}]`,
		);
	});
});

manager.spawn();
