const { readdirSync } = require("fs");
const Spinnies = require("spinnies");

module.exports = (client) => {
    const spinnies = new Spinnies();

    spinnies.add("events-loading", {
        "text": "Loading Events"
    });

    readdirSync("./source/events/").forEach((dirs) => {
        const events = readdirSync("./source/events/" + dirs + "/").filter(files => files.endsWith(".js"));
        
        for (const file of events) {
            const pull = require("../events/" + dirs + "/" + file);
            
            if (pull.disabled) {
                spinnies.fail("events-loading", {
                    "text": "The " + pull.disabled + " event is deprecated.",
                    "failColor": "yellowBright",
                    "failPrefix": "⚠️"
                });
                process.exit(0);
            } else {
                try {
                    const eventName = file.split(".")[0];

                    spinnies.update("events-loading", {
                        "text": "Loading event " + eventName + " in category " + dirs
                    });

                    client.on(eventName, pull.bind(null, client))
                    delete require.cache[require.resolve("../events/" + dirs + "/" + file)];
                } catch (error) {
                    spinnies.fail("events-loading", {
                        "text": "Error loading event in " + ("./events/" + dirs + "/" + file)
                    });
                    console.log("Error: " + error);
                    process.exit(1);
                }
            }
        }
    });

    spinnies.succeed("events-loading", {
        "text": "All events are verified. Did not find any problems."
    });
};