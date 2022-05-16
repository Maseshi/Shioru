const logGenerator = require("../../extras/logGenerator");

module.exports = (client, error) => {
    logGenerator("error", error);
};