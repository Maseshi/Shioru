const discord = require("discord.js");
const {
  success,
  error,
  warning
} = require("log-symbols");
const fs = require("fs");

module.exports = function (client) {
  ["commands", "aliases"].forEach(x => client[x] = new discord.Collection());
  let load = function (dir = "./commands/") {
    fs.readdirSync(dir).forEach(function (dirs) {
      let commands = fs.readdirSync(dir + dirs + "/").filter(files => files.endsWith(".js"));
      for (let file of commands) {
        const pull = require("." + dir + dirs + "/" + file);
        if (pull.help && typeof (pull.help.name) === "string" && typeof (pull.help.category) === "string") {
          if (client.commands.get(pull.help.name)) {
            console.warn(warning + " Two or more commands have the same name \u001b[4m" + pull.help.name + "\u001b[0m.");
          } else {
            client.commands.set(pull.help.name, pull);
            console.log(success + " Loaded command \u001b[32m" + pull.help.name + "\u001b[0m in category \u001b[34m" + pull.help.category + "\u001b[0m.");
          }
        } else {
          console.error(error + " Error loading command in \u001b[31m" + ("./" + dirs + "/" + file) + "\u001b[0m. you have a missing \u001b[4mhelp.name\u001b[0m or \u001b[4mhelp.name\u001b[0m is not a string. or you have a missing \u001b[4mhelp.category\u001b[0m or \u001b[4mhelp.category\u001b[0m is not a string");
          continue;
        }
        if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
          moduleAliases(pull);
        }
      }
    });
  };
  
  function moduleAliases(pull) {
    pull.help.aliases.forEach(function (alias) {
      if (client.aliases.get(alias)) {
        console.warn(warning + " Two commands or more commands have the same aliases \u001b[33m" + alias + "\u001b[0m");
      } else {
        client.aliases.set(alias, pull.help.name);
      }
    });
  }
  load();
};