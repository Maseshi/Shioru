const { getDatabase, ref, child, onValue, set } = require("firebase/database");
const catchError = require("./catchError");

module.exports = (client, message, mentioned, args) => {
    const db = getDatabase();
    const childRef = ref(db, "Shioru/data");
    const argument = message.content.replace(/^<@!?\d{1,20}> ?/i, '');

    // When the bot calls and asks some questions.
    if (argument) {
        message.channel.sendTyping();

        onValue(child(child(child(childRef, "words/messages"), client.config.lang.code), argument)).then(async (snapshot) => {
            if (snapshot.exists()) {
                const answer = snapshot.val().answer;
                const command = snapshot.val().command;
                const script = snapshot.val().script;

                if (command) {
                    client.commands.get(command).run(client, message, args);
                }
                if (answer && script) {
                    const randomWords = Math.floor(Math.random() * answer.length);

                    // Script format on database: ((client, message, answer) => {})
                    // Script format when converted: ((client, message, answer) => {})(client, message, answer[randomWords])
                    const answerScript = await eval(script)(client, message, answer[randomWords]);

                    message.channel.send(answerScript);
                }
                if (!script && answer) {
                    const randomWords = Math.floor(Math.random() * answer.length);

                    message.channel.send(answer[randomWords]);
                }
            } else {
                set(child(child(child(childRef, "words/messages"), client.config.lang.code), argument), {
                    "answer": [
                        client.translate.extras.chatSystem.empty_answer
                    ],
                    "command": false,
                    "script": false
                });
                return message.channel.send(client.translate.extras.chatSystem.do_not_understand);
            }
        }).catch((error) => {
            catchError(client, message, "chatSystem", error);
        })
    }

    // When the bot is called by tagging.
    if (!argument && mentioned) {
        message.channel.sendTyping();

        onValue(child(child(childRef, "words/tags"), client.config.lang.code)).then((snapshot) => {
            if (snapshot.exists()) {
                const tags = snapshot.val();

                const randomWords = Math.floor(Math.random() * tags.length);

                return message.channel.send(tags[randomWords]);
            } else {
                set(child(child(childRef, "words/tags"), client.config.lang.code), [
                    client.translate.extras.chatSystem.was_mentioned
                ]).then(() => {
                    module.exports(client, message, args);
                });
            }
        }).catch((error) => {
            catchError(client, message, "chatSystem", error);
        });
    }
}