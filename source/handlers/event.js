const { info, success, error, warning } = require("log-symbols");
const progress = require("progress-string");
const diff = require("ansi-diff-stream")();
const fs = require("fs");

module.exports = function (client) {
    diff.pipe(process.stdout);
    fs.readdirSync("./source/events/").forEach(function(dirs) {
        let events = fs.readdirSync("./source/events/" + dirs + "/").filter(files => files.endsWith(".js"));
        let total = events.length, value = 0;
        for (let file of events) {
            let pull = require("../events/" + dirs + "/" + file);
            if (pull.disabled) {
                diff.push(warning + " The " + pull.disabled + " event is deprecated.\n");
                process.exit(0);
            } else {
                let eventName = file.split(".")[0];
                if (client.on(eventName, pull.bind(null, client))) {
                    delete require.cache[require.resolve("../events/" + dirs + "/" + file)];
                    let bar = progress({
                        "width": 40,
                        "total": total,
                        "style": function (complete, incomplete) {
                          return "[" + "█".repeat(complete.length) + "" + ".".repeat(incomplete.length) + "]" + " (" + value + "/" + total + ")";
                        }
                    });
                    diff.write(info + " Loaded event \u001b[32m" + eventName + "\u001b[0m in category \u001b[34m" + dirs + "\u001b[0m.\n" + bar(++value));
                    if (total === value) {
                        diff.write(success + " All events are verified. Did not find any problems.");
                    }
                } else {
                    diff.push(error + " Error loading event in \u001b[4m" + ("./events/" + dirs + "/" + file) + "\u001b[0m.\n");
                    process.exit(1);
                }
            }
        }
    });
};