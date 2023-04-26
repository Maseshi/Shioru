const { readdirSync } = require("node:fs");
const { join } = require("node:path");

module.exports = (client) => {
  client.console.add("commands-loading", {
    "text": "Preparing to load all commands...",
    "failColor": "yellowBright"
  });

  const foldersPath = join(__dirname, "../commands");
  const commandFolders = readdirSync(foldersPath);

  for (const [folderIndex, folder] of commandFolders.entries()) {
    const commandsPath = join(foldersPath, folder);
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    for (const [fileIndex, file] of commandFiles.entries()) {
      const filePath = join(commandsPath, file);
      const command = require(filePath);

      client.console.update("commands-loading", {
        "text": "Loading " + command.name + " command information at (" + filePath + ")"
      });

      if (!command.length) {
        client.console.update("commands-loading", {
          "text": "Empty file unload and skip loading at (" + filePath + ")"
        });
      }
      if (typeof command.enable !== "boolean") {
        client.console.fail("commands-loading", {
          "text": "Error loading application (/) command name " + command.name + "."
        });
        console.group();
        console.warn("Path: " + filePath);
        console.warn("Type: Command");
        console.warn("Reason: You have a missing ENABLE or ENABLE is not a boolean.");
        console.groupEnd();
        return process.exit();
      }
      if (typeof command.name !== "string") {
        client.console.fail("commands-loading", {
          "text": "Error loading application (/) command name " + command.name + "."
        });
        console.group();
        console.warn("Path: " + filePath);
        console.warn("Type: Command");
        console.warn("Reason: You have a missing NAME or NAME is not a string.");
        console.groupEnd();
        return process.exit();
      }
      if (typeof command.description !== "string") {
        client.console.fail("commands-loading", {
          "text": "Error loading application (/) command name " + command.name + "."
        });
        console.group();
        console.warn("Path: " + filePath);
        console.warn("Type: Command");
        console.warn("Reason: You have a missing DESCRIPTION or DESCRIPTION is not a string.");
        console.groupEnd();
        return process.exit();
      }
      if (typeof command.category !== "string") {
        client.console.fail("commands-loading", {
          "text": "Error loading application (/) command name " + command.name + "."
        });
        console.group();
        console.warn("Path: " + filePath);
        console.warn("Type: Command");
        console.warn("Reason: You have a missing CATEGORY or CATEGORY is not a string.");
        console.groupEnd();
        return process.exit();
      }

      if (command.function.command) {
        client.console.update("commands-loading", {
          "text": "Loading " + command.name + " command at (" + filePath + ")"
        });

        if (typeof command.function.command.data !== "object") {
          client.console.fail("commands-loading", {
            "text": "Error loading application (/) command name " + command.name + "."
          });
          console.group();
          console.warn("Path: " + filePath);
          console.warn("Type: ChatInputCommand");
          console.warn("Reason: You have a missing function.command.data or function.command.data is not a object.");
          console.groupEnd();
          return process.exit();
        }
        if (typeof command.function.command.data.name !== "string") {
          client.console.fail("commands-loading", {
            "text": "Error loading application (/) command name " + command.name + "."
          });
          console.group();
          console.warn("Path: " + filePath);
          console.warn("Type: ChatInputCommand");
          console.warn("Reason: You have a missing function.command.data.name or function.command.data.name is not a string.");
          console.groupEnd();
          return process.exit();
        }
        if (typeof command.function.command.data.description !== "string") {
          client.console.fail("commands-loading", {
            "text": "Error loading application (/) command name " + command.name + "."
          });
          console.group();
          console.warn("Path: " + filePath);
          console.warn("Type: ChatInputCommand");
          console.warn("Reason: You have a missing function.command.data.description or function.command.data.description is not a string.");
          console.groupEnd();
          return process.exit();
        }
        if (typeof command.function.command.execute !== "function") {
          client.console.fail("commands-loading", {
            "text": "Error loading application (/) command name " + command.name + "."
          });
          console.group();
          console.warn("Path: " + filePath);
          console.warn("Type: ChatInputCommand");
          console.warn("Reason: You have a missing function.command.execute or function.command.execute is not a function.");
          console.groupEnd();
          return process.exit();
        }
        if (client.commands.get(command.name)) {
          client.console.fail("commands-loading", {
            "text": "Unable to continue loading commands.",
            "failColor": "redBright"
          });
          console.group();
          console.warn("Path: " + filePath);
          console.warn("Type: ChatInputCommand");
          console.warn("Reason: Found a command with a duplicate name as " + command.name + ".");
          console.groupEnd();
          return process.exit();
        }

        client.commands.set(command.name, command);
      }

      if (command.function.context) {
        client.console.update("commands-loading", {
          "text": "Loading " + command.name + " context at (" + filePath + ")"
        });

        if (typeof command.function.context.data !== "object") {
          client.console.fail("commands-loading", {
            "text": "Error loading application (/) context name " + command.name + "."
          });
          console.group();
          console.warn("Path: " + filePath);
          console.warn("Type: ContextMenuCommand");
          console.warn("Reason: You have a missing function.context.data or function.context.data is not a object.");
          console.groupEnd();
          return process.exit();
        }
        if (typeof command.function.context.data.name !== "string") {
          client.console.fail("commands-loading", {
            "text": "Error loading application (/) context name " + command.name + "."
          });
          console.group();
          console.warn("Path: " + filePath);
          console.warn("Type: ContextMenuCommand");
          console.warn("Reason: You have a missing function.context.data.name or function.context.data.name is not a string.");
          console.groupEnd();
          return process.exit();
        }
        if (typeof command.function.context.execute !== "function") {
          client.console.fail("commands-loading", {
            "text": "Error loading application (/) context name " + command.name + "."
          });
          console.group();
          console.warn("Path: " + filePath);
          console.warn("Type: ContextMenuCommand");
          console.warn("Reason: You have a missing function.context.execute or function.context.execute is not a function.");
          console.groupEnd();
          return process.exit();
        }
        if (client.contexts.get(command.name)) {
          client.console.fail("commands-loading", {
            "text": "Unable to continue loading contexts.",
            "failColor": "redBright"
          });
          console.group();
          console.warn("Path: " + filePath);
          console.warn("Type: ContextMenuCommand");
          console.warn("Reason: Found a context with a duplicate name as " + command.name + ".");
          console.groupEnd();
          return process.exit();
        }

        client.contexts.set(command.name, command);
      }

      if ((folderIndex === (commandFolders.length - 1)) && (fileIndex === (commandFiles.length - 1))) {
        client.console.succeed("commands-loading", {
          "text": "All application commands are verified. Did not find any problems."
        });
      }
    }
  }
};