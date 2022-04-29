const { readdirSync } = require("node:fs");
const Spinnies = require("spinnies");

module.exports = (client) => {
    const spinnies = new Spinnies({
        "spinnerColor": "blueBright",
        "succeedPrefix": "✅",
        "failPrefix": "⚠️"
    });

    spinnies.add("events-loading", {
        "text": "All events are starting to load."
    });

    readdirSync("./source/events/").forEach((dirs) => {
        const events = readdirSync("./source/events/" + dirs + "/").filter(files => files.endsWith(".js"));
        
        for (const file of events) {
            const eventName = file.split(".")[0];
            const pull = require("../events/" + dirs + "/" + file);
            
            if (pull.disabled) {
                spinnies.fail("events-loading", {
                    "text": "The " + eventName + " event is deprecated.",
                    "failColor": "yellowBright"
                });
                process.exit(0);
            } else {
                try {
                    spinnies.update("events-loading", {
                        "text": "Loading event " + eventName + " in category " + dirs
                    });

                    client.on(eventName, pull.bind())
                    delete require.cache[require.resolve("../events/" + dirs + "/" + file)];
                } catch (error) {
                    spinnies.fail("events-loading", {
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

    spinnies.succeed("events-loading", {
        "text": "All events are verified. Did not find any problems."
    });
};