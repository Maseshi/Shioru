const logGenerator = require("../../extras/logGenerator");

module.exports = (error) => {
    logGenerator("error", error);
};