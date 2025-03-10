const { Collection, PermissionsBitField } = require("discord.js");
const { readdirSync } = require("node:fs");
const { join } = require("node:path");

module.exports = (client) => {
  client.contexts = new Collection();
  client.temp.contexts = new Collection();

  client.logger.info("Verifying and loading all contexts...");

  const contextsPath = join(__dirname, "..", "contexts");
  const contextFiles = readdirSync(contextsPath).filter((file) =>
    file.endsWith(".js"),
  );

  for (const file of contextFiles) {
    const filePath = join(contextsPath, file);
    const contextName = file.split(".")[0];
    const context = require(filePath);

    client.logger.debug(
      `Checking details of ${contextName} context at (${filePath})`,
    );

    if (typeof context.data !== "object") {
      client.logger.warn(
        {
          path: filePath,
          type: "context",
          reason: 'You have a missing "data" or "data" is not a object.',
        },
        `Unable to load context ${contextName} successfully.`,
      );
    }
    if (typeof context.execute !== "function") {
      client.logger.warn(
        {
          path: filePath,
          type: "context",
          reason:
            'You have a missing "execute" or "execute" is not a function.',
        },
        `Unable to load context ${contextName} successfully.`,
      );
    }
    if (client.contexts.get(context.data.name)) {
      client.logger.warn(
        {
          path: filePath,
          type: "context",
          reason: `Found a context with a duplicate name as ${context.data.name}.`,
        },
        `Unable to load context ${context.data.name} successfully.`,
      );
    }

    client.contexts.set(context.data.name, context);
    client.temp.contexts.set(context.data.name, {
      type: context.data.type ?? 0,
      cooldown: context.cooldown ?? 3,
      name: context.data.name ?? "",
      permissions: context.permissions
        ? new PermissionsBitField(context.permissions).toArray()
        : [],
    });
  }
};
