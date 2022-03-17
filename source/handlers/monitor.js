const { info } = require("log-symbols");
const http = require("http");
const port = 8080;

module.exports = (client) => {
    http.createServer((req, res) => {
        res.write("Copyright (c) 2020-2022 Maseshi(Chaiwat Suwannarat). All rights reserved.");
        res.end();
    }).listen(port, () => {
        console.log(info + " Remote monitoring is now available at http://localhost:" + port);
    });
};