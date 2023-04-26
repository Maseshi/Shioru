const { readdirSync } = require("node:fs");
const { join } = require("node:path");

module.exports = (client) => {
    client.console.add("events-loading", {
        "text": "Preparing to load all events...",
        "failColor": "yellowBright"
    });

    const eventsPath = join(__dirname, "../events");
    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith(".js"));

    for (const [fileIndex, file] of eventFiles.entries()) {
        const filePath = join(eventsPath, file);
        const event = require(filePath);

        if (!event.length) {
            client.console.update("events-loading", {
                "text": "Empty file unload and skip loading at (" + filePath + ")"
            });
        }
        if (typeof event.name !== "string") {
            client.console.fail("events-loading", {
                "text": "Error loading event name " + event.name + "."
            });
            console.group();
            console.warn("Path: " + filePath);
            console.warn("Type: Event");
            console.warn("Reason: You have a missing NAME or NAME is not a string.");
            console.groupEnd();
            return process.exit();
        }
        if (typeof event.once !== "boolean") {
            client.console.fail("events-loading", {
                "text": "Error loading event name " + event.name + "."
            });
            console.group();
            console.warn("Path: " + filePath);
            console.warn("Type: Event");
            console.warn("Reason: You have a missing ONCE or ONCE is not a boolean.");
            console.groupEnd();
            return process.exit();
        }

        if (event.once) {
            client.console.update("events-loading", {
                "text": "Loading event " + event.name + " at (" + filePath + ")"
            });

            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.console.update("events-loading", {
                "text": "Loading event " + event.name + " at (" + filePath + ")"
            });

            client.on(event.name, (...args) => event.execute(...args));
        }

        if (fileIndex === (eventFiles.length - 1)) {
            client.console.succeed("events-loading", {
                "text": "All events are verified. Did not find any problems."
            });
        }
    }
};