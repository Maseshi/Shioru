const discord = require("discord.js");
const { webhookSend } = require("../utils/clientUtils");
const packages = require("../../package.json");

module.exports = (client) => {
	const systemReports = () => {
		const cpuUsage = `${(process.cpuUsage().user / 1024 / 1024).toFixed(2)}%`;
		const memoryUsage = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%/${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)}%`;

		return {
			usage: {
				cpu: cpuUsage,
				memory: memoryUsage,
			},
			version: {
				package: packages.version,
				discord: discord.version,
				node: process.version,
			},
		};
	};

	const webhookLogEmbed = new discord.EmbedBuilder()
		.setColor(discord.Colors.Red)
		.setTitle("⚠️・Error")
		.setTimestamp();
	const usageEmbedFields = [
		{
			name: "CPU",
			value: systemReports().usage.cpu,
			inline: true,
		},
		{
			name: "Memory",
			value: systemReports().usage.memory,
			inline: true,
		},
	];
	const versionEmbedFields = [
		{
			name: "Package",
			value: systemReports().version.package,
			inline: true,
		},
		{
			name: "discord.js",
			value: systemReports().version.node,
			inline: true,
		},
		{
			name: "Node.js",
			value: systemReports().version.discord,
			inline: true,
		},
	];

	// Limit the creation of events in the process.
	process.setMaxListeners(0);
	process.on("SIGINT", () => {
		client.logger.trace("Bot is about to shut down.");
	});
	process.on("SIGUSR1", () => {
		client.logger.trace("Bot is about to restart.");
	});
	process.on("SIGUSR2", () => {
		client.logger.trace("Bot is about to restart.");
	});
	process.on("rejectionHandled", (promise) => {
		webhookLogEmbed.setDescription(`\`\`\`${promise}\`\`\``).setFields([
			{
				name: "Event",
				value: "rejectionHandled",
				inline: true,
			},
			...usageEmbedFields,
			...versionEmbedFields,
		]);
		webhookSend(client.configs.logger.error, {
			embeds: [webhookLogEmbed],
		});
		client.logger.fatal(systemReports(), "Rejection Handled");
		client.logger.fatal(promise);
	});
	process.on("uncaughtException", (err, origin) => {
		webhookLogEmbed
			.setDescription(`Error:\`\`\`${err}\`\`\`\nOrigin:\`\`\`${origin}\`\`\``)
			.setFields([
				{
					name: "Event",
					value: "uncaughtException",
					inline: true,
				},
				...versionEmbedFields,
			]);
		webhookSend(client.configs.logger.error, {
			embeds: [webhookLogEmbed],
		});
		client.logger.fatal(systemReports(), "Uncaught Exception");
		client.logger.fatal(err);
		client.logger.fatal(origin);

		if (client.mode === "dev") process.exit(1);
	});
	process.on("uncaughtExceptionMonitor", (err, origin) => {
		webhookLogEmbed
			.setDescription(`Error:\`\`\`${err}\`\`\`\nOrigin:\`\`\`${origin}\`\`\``)
			.setFields([
				{
					name: "Event",
					value: "uncaughtExceptionMonitor",
					inline: true,
				},
				...versionEmbedFields,
			]);
		webhookSend(client.configs.logger.error, {
			embeds: [webhookLogEmbed],
		});
		client.logger.fatal(systemReports(), "Uncaught Exception Monitor");
		client.logger.fatal(err);
		client.logger.fatal(origin);
	});
	process.on("unhandledRejection", (reason, promise) => {
		webhookLogEmbed
			.setDescription(
				`Reason:\`\`\`${reason}\`\`\`\nPromise:\`\`\`${promise}\`\`\``,
			)
			.setFields([
				{
					name: "Event",
					value: "unhandledRejection",
					inline: true,
				},
				...versionEmbedFields,
			]);
		webhookSend(client.configs.logger.error, {
			embeds: [webhookLogEmbed],
		});
		client.logger.fatal(systemReports(), "Unhandled Rejection");
		client.logger.fatal(reason);
		client.logger.fatal(promise);

		if (client.mode === "dev") process.exit(1);
	});
	process.on("exit", (code) => {
		client.logger.trace(code, `Bot is about to shut down with the code`);
	});
};
