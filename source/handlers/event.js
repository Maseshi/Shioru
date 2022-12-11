const { readdirSync } = require("node:fs");

module.exports = (client) => {
    client.console.add("events-loading", {
        "text": "All events are starting to load."
    });

    readdirSync("./source/events/").forEach((dirs) => {
        const events = readdirSync("./source/events/" + dirs + "/").filter(files => files.endsWith(".js"));
        
        for (const file of events) {
            const eventName = file.split(".")[0];
            const pull = require("../events/" + dirs + "/" + file);
            
            if (pull.disabled) {
                client.console.fail("events-loading", {
                    "text": "The " + eventName + " event is deprecated.",
                    "failColor": "yellowBright"
                });
                process.exit(0);
            } else {
                try {
                    client.console.update("events-loading", {
                        "text": "Loading event " + eventName + " in category " + dirs
                    });

                    client.on(eventName, pull.bind(null, client))
                    delete require.cache[require.resolve("../events/" + dirs + "/" + file)];
                } catch (error) {
                    client.console.fail("events-loading", {
                        "text": "Error loading event in " + ("./events/" + dirs + "/" + file)
                    });
                    console.group();
                        console.error(error);
                    console.groupEnd();
                    process.exit(1);
                }
            }
        }
    });

    client.console.succeed("events-loading", {
        "text": "All events are verified. Did not find any problems."
    });
};