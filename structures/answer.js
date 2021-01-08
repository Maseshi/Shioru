let firebase = require("firebase");

module.exports = async function (client, message, args, mh) {
    let mhs = mh.join(" ").toLowerCase();
    let database = firebase.database();
    let ref = database.ref("Shioru/Words/");

    if (mhs !== "") {
        args = "";
        ref.child("List").once("value").then(function(snapshot) {
            if (snapshot.exists()) {
                ref.child("List").child(mhs).once("value").then(function (dataSnapshot) {
                    if (dataSnapshot.exists()) {
                        let answer = dataSnapshot.val().Answer;
                        let cmdWords = dataSnapshot.val().CMD;

                        if (!answer && cmdWords) {
                            message.channel.startTyping();
                            client.commands.get(cmdWords).run(client, message, args);
                            message.channel.stopTyping();
                        } else if (answer) {
                            message.channel.startTyping();
                            let randomWords = Math.floor(Math.random() * answer.length);

                            message.channel.send(answer[randomWords])
                            .then(function() {
                                if (mhs === cmdWords) {
                                    client.commands.get(cmdWords).run(client, message, args);
                                }
                                message.channel.stopTyping();
                            });
                        }
                    } else {
                        return console.log("\u001b[4m" + message.author.username + "\u001b[0m Couldn't find this word in the database: \u001b[34m" + mhs + "\u001b[0m");
                    }
                });
            } else {
                ref.child("List").set({
                    "hi": {
                        "Answer": [
                            "Hello",
                            "Hi"
                        ],
                        "CMD": null
                    },
                    "good afternoon": {
                        "Answer": [
                            "Good afternoon as well!!",
                            "Good afternoon"
                        ],
                        "CMD": null
                    },
                    "play music": {
                        "Answer": [
                            "Please use the \"play\" command instead."
                        ],
                        "CMD": null
                    },
                    "how to use commands": {
                        "Answer": null,
                        "CMD": "help"
                    }
                }, function (error) {
                    if (error) {
                      console.log("I encountered a problem while setting up my data: " + error);
                    }
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
    } else {
        ref.child("Tag").once("value").then(function(snapshot) {
            if (snapshot.exists()) {
                message.channel.startTyping();
                let tag = snapshot.val();

                let randomWords = Math.floor(Math.random() * tag.length);
                message.channel.send(tag[randomWords])
                .then(function() {
                    message.channel.stopTyping();
                });
            } else {
                ref.child("Tag").set([
                    "What's wrong?"
                ], function (error) {
                    if (error) {
                      console.log("I encountered a problem while setting up my data: " + error);
                    }
                });
            }
        });
    }
};