const { Collection } = require("discord.js");
const { readdirSync } = require("node:fs");
const ansiColor = require("../extras/ansiColor");
const Spinnies = require("spinnies");

module.exports = (client) => {
    const spinnies = new Spinnies({
        "spinnerColor": "blueBright",
        "succeedPrefix": "✅",
        "failPrefix": "⚠️"
    });
    let count = 0;

    const clearStyle = ansiColor(0, "sgr");
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
                if (pull.interaction.data && typeof pull.interaction.data.name === "string" && typeof pull.interaction.data.description === "string") {
                    if (client.interaction.get(pull.interaction.data.name)) {
                        spinnies.fail("interaction-loading", {
                            "text": "Two or more application (/) command have the same name " + pull.interaction.data.name,
                            "failColor": "yellowBright"
                        });
                        process.exit(0);
                    } else {
                        client.interaction.set(pull.interaction.data.name, pull);
                        spinnies.update("interaction-loading", {
                            "text": "Loaded application (/) commands: " + pull.interaction.data.name
                        });
                    }
                } else {
                    spinnies.fail("interaction-loading", {
                        "text": "Error loading application (/) command in " + ("./source/commands/" + dirs + "/" + file) + ". you have a missing data.name or data.name is not a string. or you have a missing data.description or data.description is not a string"
                    });
                    process.exit(1);
                }
            } else {
                ++count;
                spinnies.update("interaction-loading", {
                    "text": "The application (/) command named " + pull.help.name + " could not be loaded completely."
                });
                console.group();
                    console.warn(yellowStyle + pull.help.name + clearStyle + " doesn't support application (/) commands yet.");
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