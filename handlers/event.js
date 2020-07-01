const {
    success,
    error,
    warning
} = require("log-symbols");
const fs = require("fs");

module.exports = function (client) {
    let load = function (dir = "./events/") {
        fs.readdirSync(dir).forEach(function (dirs) {
            let events = fs.readdirSync(dir + dirs + "/").filter(files => files.endsWith(".js"));
            for (let file of events) {
                let pull = require("." + dir + dirs + "/" + file);
                if (pull.disabled) {
                    console.warn(warning + " The " + pull.disabled + " event is deprecated.");
                } else {
                    let eventName = file.split(".")[0];
                    if (client.on(eventName, pull.bind(null, client))) {
                        delete require.cache[require.resolve("." + dir + dirs + "/" + file)];
                        console.log(success + " Loaded event \u001b[32m" + eventName + "\u001b[0m.");
                    } else {
                        console.error(warning + " Error loading event in \u001b[4m" + (dir + dirs + "/" + file) + "\u001b[0m.");
                    }
                }
            }
        });
    };
    load();
};