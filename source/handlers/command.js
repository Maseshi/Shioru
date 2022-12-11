const { Collection } = require("discord.js");
const { readdirSync } = require("node:fs");
const { ansiColor } = require("../utils/consoleUtils");

module.exports = (client) => {
  const clearStyle = ansiColor(0, "sgr");
  const GrayStyle = ansiColor(8, "foreground");

  client.console.add("commands-loading", {
    "text": "All commands are starting to load."
  });

  ["commands", "aliases"].forEach(dirs => client[dirs] = new Collection());

  readdirSync("./source/commands/").forEach((dirs) => {
    const commands = readdirSync("./source/commands/" + dirs + "/").filter(files => files.endsWith(".js"));

    for (const file of commands) {
      const pull = require("../commands/" + dirs + "/" + file);

      if (pull.command) {
        if (pull.command.enable) {
          if (typeof pull.name === "string" && typeof pull.description === "string" && typeof pull.category === "string") {
            if (client.commands.get(pull.name)) {
              client.console.fail("commands-loading", {
                "text": "Two or more commands have the same name " + pull.name,
                "failColor": "yellowBright"
              });
              process.exit(0);
            } else {
              client.console.update("commands-loading", {
                "text": "Loading command " + pull.name + " in category " + pull.category
              });

              client.commands.set(pull.name, pull);
            }
          } else {
            client.console.fail("commands-loading", {
              "text": "Error loading command in " + ("./source/commands/" + dirs + "/" + file) + ". you have a missing name or name is not a string. or you have a missing description or description is not a string. or you have a missing category or category is not a string.",
            });
            process.exit(1);
          }

          if (pull.command.aliases && typeof (pull.command.aliases) === "object") {
            pull.command.aliases.forEach((alias) => {
              if (client.aliases.get(alias)) {
                client.console.fail("commands-loading", {
                  "text": "Two commands or more commands have the same aliases " + alias,
                  "failColor": "yellowBright"
                });
                process.exit(0);
              } else {
                client.aliases.set(alias, pull.name);
              }
            });
          }
        } else {
          console.group();
            console.warn(GrayStyle + pull.name + " command is now disabled by default." + clearStyle);
          console.groupEnd();
        }
      } else {
        client.console.fail("commands-loading", {
          "text": "Error loading command in " + ("./source/commands/" + dirs + "/" + file) + ". The command hasn't been defined yet.",
          "failColor": "yellowBright"
        });
        process.exit(0);
      }
    }
  });

  client.console.succeed("commands-loading", {
    "text": "All commands are verified. Did not find any problems."
  });
};