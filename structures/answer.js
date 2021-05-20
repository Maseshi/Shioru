let firebase = require("firebase");

module.exports = function (client, message, args) {
    let arg = args.join(" ");
    
    let database = firebase.database();
    let ref = database.ref("Shioru/data");

    if (arg) {
        ref.child("words/default").child(arg).on("value", function(snapshot) {
            if (!snapshot.exists()) return console.log("\u001b[4m" + message.author.username + "\u001b[0m Couldn't find this word in the database: \u001b[34m" + arg + "\u001b[0m");

            message.channel.startTyping();

            let answer = snapshot.val().answer;
            let cmd = snapshot.val().cmd;

            if (!answer && cmd) {
                client.commands.get(cmd).run(client, message, args);
            } else if (answer) {
                let randomWords = Math.floor(Math.random() * answer.length);

                message.channel.send(answer[randomWords]).then(function() {
                    if (arg === cmd) {
                        client.commands.get(cmd).run(client, message, args);
                    }
                });
            }

            message.channel.stopTyping();
        });
    } else {
        ref.child("words/tags").on("value", function(snapshot) {
            if (snapshot.exists()) {
                message.channel.startTyping();

                let tag = snapshot.val();
                
                let randomWords = Math.floor(Math.random() * tag.length);
                message.channel.send(tag[randomWords]);

                message.channel.stopTyping();
            } else {
                ref.child("words").child("tags").set([
                    "What's wrong?"
                ], function (error) {
                    if (error) {
                      return console.log("I encountered a problem while setting up my data: " + error);
                    }
                });
            }
        });
    }
};