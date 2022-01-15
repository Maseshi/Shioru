const { info } = require("log-symbols");
const express = require("express");
const app = express();
const port = 8080;

module.exports = (client) => {
    app.get("/", (req, res) => {
        res.send("Copyright (c) 2020-2022 Maseshi(Chaiwat Suwannarat). All rights reserved.")
    });
    
    app.listen(port, () => {
        console.log(info + " Remote monitoring is now available at http://localhost:" + port);
    });
};