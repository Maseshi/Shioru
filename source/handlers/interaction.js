const { Collection } = require("discord.js");
const { readdirSync } = require("node:fs");
const { ansiColor } = require("../utils/consoleUtils");
const Spinnies = require("spinnies");

module.exports = (client) => {
    let count = 0;
    const spinnies = new Spinnies({
        "spinnerColor": "blueBright",
        "succeedPrefix": "✅",
        "failPrefix": "⚠️"
    });
    const clearStyle = ansiColor(0, "sgr");
    const GrayStyle = ansiColor(8, "foreground");
    const yellowStyle = ansiColor(11, "foreground");

    spinnies.add("interaction-loading", {
        "text": "All application (/) commands are starting to load."
    });

    client.interaction = new Collection();

    readdirSync("./source/commands/").forEach((dirs) => {
        let commandFiles = readdirSync("./source/commands/" + dirs + "/").filter(files => files.endsWith(".js"));

        for (let file of commandFiles) {
            const pull = require("../commands/" + dirs + "/" + file);

            if (pull.interaction) {
                if (pull.interaction.enable) {
                    if (pull.interaction.slash && pull.interaction.slash.data) {
                        if (typeof pull.interaction.slash.data.name === "string" && typeof pull.interaction.slash.data.description === "string") {
                            if (client.interaction.get(pull.name)) {
                                spinnies.fail("interaction-loading", {
                                    "text": "Two or more application (/) command have the same name " + pull.name,
                                    "failColor": "yellowBright"
                                });
                                process.exit(0);
                            } else {
                                client.interaction.set(pull.name, pull);
                                spinnies.update("interaction-loading", {
                                    "text": "Loaded application (/) commands: " + pull.name
                                });
                            }
                        } else {
                            spinnies.fail("interaction-loading", {
                                "text": "Error loading application (/) command in " + ("./source/commands/" + dirs + "/" + file) + ". you have a missing interaction.slash.data.name or interaction.slash.data.name is not a string. or you have a missing interaction.slash.data.description or interaction.slash.data.description is not a string"
                            });
                            process.exit(1);
                        }
                    }
                } else {
                    console.group();
                    console.warn(GrayStyle + "The application (/) command named " + pull.name + " is now disabled by default." + clearStyle);
                    console.groupEnd();
                }
            } else {
                ++count;
                spinnies.update("interaction-loading", {
                    "text": "The application (/) command named " + pull.name + " could not be loaded completely."
                });
                console.group();
                console.warn(yellowStyle + pull.name + clearStyle + " doesn't support application (/) commands yet.");
                console.groupEnd();
            }
        }
    });

    if (count >= 1) {
        spinnies.fail("interaction-loading", {
            "text": count + " application (/) commands have been reported, please fix.",
            "failColor": "yellowBright"
        });
    } else {
        spinnies.succeed("interaction-loading", {
            "text": "All application (/) commands are verified. Did not find any problems."
        });
    }
};