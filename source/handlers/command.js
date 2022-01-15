const { Collection } = require("discord.js");
const { readdirSync } = require("fs");
const Spinnies = require("spinnies");

module.exports = (client) => {
  const spinnies = new Spinnies();

  spinnies.add("commands-loading", {
    "text": "Loading Commands"
  });

  ["commands", "aliases"].forEach(dirs => client[dirs] = new Collection());
  
  readdirSync("./source/commands/").forEach((dirs) => {
    const commands = readdirSync("./source/commands/" + dirs + "/").filter(files => files.endsWith(".js"));
    
    for (const file of commands) {
      const pull = require("../commands/" + dirs + "/" + file);
     
      if (pull.help && typeof (pull.help.name) === "string" && typeof (pull.help.category) === "string") {
        if (client.commands.get(pull.help.name)) {
          spinnies.fail("commands-loading", {
            "text": "Two or more commands have the same name " + pull.help.name,
            "failColor": "yellowBright",
            "failPrefix": "⚠️"
          });
          process.exit(0);
        } else {
          spinnies.update("commands-loading", {
            "text": "Loading command " + pull.help.name + " in category " + pull.help.category
          });

          client.commands.set(pull.help.name, pull);
        } 
      } else {
        spinnies.fail("commands-loading", {
          "text": "Error loading command in " + ("./source/commands/" + dirs + "/" + file) + ". you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string"
        });
        process.exit(1);
      }
      
      if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
        pull.help.aliases.forEach((alias) => {
          if (client.aliases.get(alias)) {
            spinnies.fail("commands-loading", {
              "text": "Two commands or more commands have the same aliases " + alias,
              "failColor": "yellowBright",
              "failPrefix": "⚠️"
            });
            process.exit(0);
          } else {
            client.aliases.set(alias, pull.help.name);
          }
        });
      }
    }
  });

  spinnies.succeed("commands-loading", {
    "text": "All commands are verified. Did not find any problems."
  });
};