const { readdirSync } = require("node:fs");
const { join } = require("node:path");

module.exports = (client) => {
  client.logger.info("Verifying and loading all events...");

  const eventsPath = join(__dirname, "..", "events");
  const eventFiles = readdirSync(eventsPath).filter((file) =>
    file.endsWith(".js"),
  );

  for (const file of eventFiles) {
    const filePath = join(eventsPath, file);
    const event = require(filePath);

    // Check event information
    client.logger.debug(
      `Checking details of ${event.name} event at (${filePath})`,
    );

    if (typeof event?.name !== "string") {
      client.logger.warn(
        {
          path: filePath,
          type: "event",
          reason: 'You have a missing "name" or "name" is not a string.',
        },
        `Unable to load context ${event.name} successfully.`,
      );
    }
    if (typeof event?.once !== "boolean") {
      client.logger.warn(
        {
          path: filePath,
          type: "event",
          reason: 'You have a missing "once" or "once" is not a boolean.',
        },
        `Unable to load context ${event.name} successfully.`,
      );
    }
    if (typeof event?.execute !== "function") {
      client.logger.warn(
        {
          path: filePath,
          type: "event",
          reason:
            'You have a missing "execute" or "execute" is not a function.',
        },
        `Unable to load context ${event.name} successfully.`,
      );
    }

    const executeEvent = (...args) =>
      Promise.resolve(event.execute(...args)).catch((error) => {
        client.logger.error(
          { err: error, event: event.name },
          "Failed to execute event.",
        );
      });

    if (event.once) client.once(event.name, executeEvent);
    else client.on(event.name, executeEvent);
  }
};
