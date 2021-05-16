let firebase = require("firebase");

module.exports = async function (client, message, args, mt) {
    let mention = mt.join(" ").toLowerCase();
    
    let database = firebase.database();
    let ref = database.ref("Shioru/data");

    if (mention) {
        ref.child("words").child("default").child(mention).once("value").then(function(snapshot) {
            if (snapshot.exists()) {
                let answer = dataSnapshot.val().answer;
                let cmd = dataSnapshot.val().cmd;

                if (!answer && cmd) {
                    message.channel.startTyping();
                    client.commands.get(cmd).run(client, message, args);
                    message.channel.stopTyping();
                } else if (answer) {
                    message.channel.startTyping();
                    let randomWords = Math.floor(Math.random() * answer.length);

                    message.channel.send(answer[randomWords])
                    .then(function() {
                        if (mention === cmd) {
                            client.commands.get(cmd).run(client, message, args);
                        }
                    });
                    message.channel.stopTyping();
                }
            } else {
                return console.log("\u001b[4m" + message.author.username + "\u001b[0m Couldn't find this word in the database: \u001b[34m" + mhs + "\u001b[0m");
            }
        }).catch(function (error) {
            console.log(error);
        });
    } else {
        ref.child("words").child("tags").once("value").then(function(snapshot) {
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
        }).catch(function (error) {
            console.log(error);
        });
    }
};