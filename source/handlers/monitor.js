const http = require("http");
const port = process.env.PORT || 3000;

module.exports = (client) => {
    http.createServer((req, res) => {
        res.writeHead(200, {"Content-Type": "text/html"});
        res.write("Copyright (c) 2020-2022 Chaiwat Suwannarat. All rights reserved.");
        res.end();
    }).listen(port, () => {
        console.log("Remote monitoring is now available at http://localhost:" + port + "/");
    });
};