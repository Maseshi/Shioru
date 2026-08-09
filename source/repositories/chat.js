const { getDatabase, ref } = require("firebase/database");
const {
  trackedOnValue: onValue,
  trackedSet: set,
} = require("../utils/metricsUtils");
const { ChatSchema } = require("../schemas/chat");

const getChatRef = () => ref(getDatabase(), "chat");

const setChat = (value) => set(getChatRef(), ChatSchema.parse(value));

const onChat = (callback, onError) =>
  onValue(
    getChatRef(),
    (snapshot) =>
      callback(snapshot.exists() ? ChatSchema.parse(snapshot.val()) : null),
    onError,
  );

module.exports = { onChat, setChat };
