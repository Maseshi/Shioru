const { Collection } = require("discord.js");
const { info, success, error, warning } = require("log-symbols");
const progress = require("progress-string");
const diff = require("ansi-diff-stream")();
const fs = require("fs");

module.exports = function (client) {
  diff.pipe(process.stdout);
  ["commands", "aliases"].forEach(dirs => client[dirs] = new Collection());
  fs.readdirSync("./source/commands/").forEach(function(dirs) {
    let commands = fs.readdirSync("./source/commands/" + dirs + "/").filter(files => files.endsWith(".js"));
    let total = commands.length, value = 0;
    for (let file of commands) {
      const pull = require("../commands/" + dirs + "/" + file);
      if (pull.help && typeof (pull.help.name) === "string" && typeof (pull.help.category) === "string") {
        if (client.commands.get(pull.help.name)) {
          diff.push(warning + " Two or more commands have the same name \u001b[4m" + pull.help.name + "\u001b[0m.\n");
          process.exit(0);
        } else {
          client.commands.set(pull.help.name, pull);
          let bar = progress({
            "width": 40,
            "total": total,
            "style": function (complete, incomplete) {
              return "[" + "█".repeat(complete.length) + "" + ".".repeat(incomplete.length) + "]" + " (" + value + "/" + total + ")";
            }
          });
          diff.write(info + " Loaded command \u001b[32m" + pull.help.name + "\u001b[0m in category \u001b[34m" + pull.help.category + "\u001b[0m.\n" + bar(++value));
          if (total === value) {
            diff.write(success + " All commands are verified. Did not find any problems.");
          }
        }
      } else {
        diff.push(error + " Error loading command in \u001b[31m" + ("./" + dirs + "/" + file) + "\u001b[0m. you have a missing \u001b[4mhelp.name\u001b[0m or \u001b[4mhelp.name\u001b[0m is not a string. or you have a missing \u001b[4mhelp.category\u001b[0m or \u001b[4mhelp.category\u001b[0m is not a string\n");
        process.exit(1);
      }
      if (pull.help.aliases && typeof (pull.help.aliases) === "object") {
        pull.help.aliases.forEach(function (alias) {
          if (client.aliases.get(alias)) {
            diff.push(warning + " Two commands or more commands have the same aliases \u001b[33m" + alias + "\u001b[\n");
            process.exit(0);
          } else {
            client.aliases.set(alias, pull.help.name);
          }
        });
      }
    }
  });
};