let firebase = require("firebase");

module.exports = async function (client, message, mh) {
    let mhs = mh.join(" ");
    let database = firebase.database();
    let ref = database.ref("Shioru/Words/");
    let rootRef = database.ref("Shioru/Words/").child(mhs);

    if (mhs !== "") {
        ref.once("value").then(function(snapshot) {
            if (snapshot.exists()) {
                rootRef.once("value").then(function (dataSnapshot) {
                    if (dataSnapshot.exists()) {
                        message.channel.startTyping();
                        let answer = dataSnapshot.val().Answer;
                        let randomWords = Math.floor(Math.random() * answer.length);
    
                        message.channel.send(answer[randomWords])
                        .then(function(msg) {
                            message.channel.stopTyping();
                        });
                    } else {
                        return console.log("\u001b[4m" + message.author.username + "\u001b[0m Couldn't find this word in the database: \u001b[34m" + mhs + "\u001b[0m");
                    }
                });
            } else {
                ref.set({
                    "Hi": {
                        "Answer": [
                            "Hello",
                            "Hi"
                        ]
                    },
                    "Good afternoon": {
                        "Answer": [
                            "Good afternoon as well!!",
                            "Good afternoon"
                        ]
                    }
                }, function (error) {
                    if (error) {
                      console.log("I encountered a problem while setting up my data: " + error);
                    } else {
                      return true;
                    }
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
    }
};