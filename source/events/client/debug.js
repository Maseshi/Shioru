const logGenerator = require("../../extras/logGenerator");

module.exports = (client, info) => {
    logGenerator("debug", info);
};