const { Collection } = require("discord.js");
const { readdirSync } = require("node:fs");

module.exports = (client) => {
  client.console.add("commands-loading", {
    "text": "All commands are starting to load."
  });

  ["commands"].forEach(dirs => client[dirs] = new Collection());

  readdirSync("./source/commands/").forEach((dirs) => {
    const commands = readdirSync("./source/commands/" + dirs + "/").filter(files => files.endsWith(".js"));

    for (const file of commands) {
      const pull = require("../commands/" + dirs + "/" + file);

      // Check the required information.
      if (typeof pull.enable !== "boolean") {
        client.console.fail("commands-loading", {
          "text": "Error loading application (/) command in " + ("./source/commands/" + dirs + "/" + file) + ". you have a missing enable or enable is not a boolean.",
        });
        return process.exit(1);
      }
      if (typeof pull.name !== "string") {
        client.console.fail("commands-loading", {
          "text": "Error loading application (/) command in " + ("./source/commands/" + dirs + "/" + file) + ". you have a missing name or name is not a string.",
        });
        return process.exit(1);
      }
      if (typeof pull.description !== "string") {
        client.console.fail("commands-loading", {
          "text": "Error loading application (/) command in " + ("./source/commands/" + dirs + "/" + file) + ". you have a missing description or description is not a string.",
        });
        return process.exit(1);
      }
      if (typeof pull.category !== "string") {
        client.console.fail("commands-loading", {
          "text": "Error loading application (/) command in " + ("./source/commands/" + dirs + "/" + file) + ". you have a missing category or category is not a string.",
        });
        return process.exit(1);
      }

      // Check the required functions.
      if (typeof pull.function.command.data !== "object") {
        client.console.fail("commands-loading", {
          "text": "Error loading application (/) command in " + ("./source/commands/" + dirs + "/" + file) + ". you have a missing data or data is not a object.",
        });
        return process.exit(1);
      }
      if (typeof pull.function.command.data.name !== "string") {
        client.console.fail("commands-loading", {
          "text": "Error loading application (/) command in " + ("./source/commands/" + dirs + "/" + file) + ". you have a missing data.name or data.name is not a string."
        });
        return process.exit(1);
      }
      if (typeof pull.function.command.data.description !== "string") {
        client.console.fail("commands-loading", {
          "text": "Error loading application (/) command in " + ("./source/commands/" + dirs + "/" + file) + ". you have a missing data.description or data.description is not a string"
        });
        return process.exit(1);
      }
      if (typeof pull.function.command.execute !== "function") {
        client.console.fail("commands-loading", {
          "text": "Error loading application (/) command in " + ("./source/commands/" + dirs + "/" + file) + ". command could not be found or it may not be a function.",
          "failColor": "yellowBright"
        });
        return process.exit(0);
      }
      if (pull.function.context) {
        if (typeof pull.function.context.data !== "object") {
          client.console.fail("commands-loading", {
            "text": "Error loading application (/) context in " + ("./source/commands/" + dirs + "/" + file) + ". you have a missing data or data is not a object.",
          });
          return process.exit(1);
        }
        if (typeof pull.function.context.data.name !== "string") {
          client.console.fail("commands-loading", {
            "text": "Error loading application context in " + ("./source/commands/" + dirs + "/" + file) + ". you have a missing data.name or data.name is not a string."
          });
          return process.exit(1);
        }
        if (typeof pull.function.context.execute !== "function") {
          client.console.fail("commands-loading", {
            "text": "Error loading application context in " + ("./source/commands/" + dirs + "/" + file) + ". command could not be found or it may not be a function.",
            "failColor": "yellowBright"
          });
          return process.exit(0);
        }
      }

      // import all commands
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
    }
  });

  client.console.succeed("commands-loading", {
    "text": "All application commands are verified. Did not find any problems."
  });
};