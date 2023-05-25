/**
 * @license
 * MIT License
 * 
 * Copyright (c) 2020 Chaiwat Suwannarat
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const { ShardingManager, ShardEvents } = require("discord.js");
const { timeConsole } = require("./utils/consoleUtils");
const { resolve } = require("node:dns");
const config = require("./configs/data");

const consolePrefix = "[%s] - ";

console.log(consolePrefix.replace("%s", timeConsole(new Date())) + "Initialize multi-process sharding...");
console.log(consolePrefix.replace("%s", timeConsole(new Date())) + "Checking connection to server...");

resolve("discord.com", (error) => {
    if (error) return console.error(consolePrefix.replace("%s", timeConsole(new Date())) + "Unable to connect to Discord server");

    process.env.TERM = "xterm";
    process.env.CHECK_CONNECTION = true;

    console.log(consolePrefix.replace("%s", timeConsole(new Date())) + "Creating shading manager...");

    const manager = new ShardingManager("./source/main.js", {
        "totalShards": "auto",
        "mode": "process",
        "respawn": true,
        "shardArgs": [],
        "execArgv": [],
        "token": config.token
    });

    console.log(consolePrefix.replace("%s", timeConsole(new Date())) + "Create shardCreate event...");

    manager.on("shardCreate", (shard) => {
        const shardCount = (shard.id + 1);
        const shardTotal = manager.totalShards;

        console.info(consolePrefix.replace("%s", timeConsole(new Date())) + "Launched shard " + shardCount + "/" + shardTotal);

        shard.on(ShardEvents.Death, (process) => {
            console.error(consolePrefix.replace("%s", timeConsole(new Date())) + "Closing shard " + shardCount + "/" + shardTotal + " unexpectedly");

            if (process.exitCode === null) {
                console.group(consolePrefix.replace("%s", timeConsole(new Date())) + "Shard " + shardCount + "/" + shardTotal + " exited with NULL error code!");
                console.error(consolePrefix.replace("%s", timeConsole(new Date())) + "PID: " + process.pid);
                console.error(consolePrefix.replace("%s", timeConsole(new Date())) + "Exit code: " + process.exitCode);
                console.groupEnd();
            }
        });

        shard.on(ShardEvents.Disconnect, (event, id) => {
            console.group(consolePrefix.replace("%s", timeConsole(new Date())) + "Shard " + ((id ?? 0) + 1) + "/" + shardTotal + " has disconnected from the event.");
            console.warn(consolePrefix.replace("%s", timeConsole(new Date())) + "Code: " + event.code);
            console.warn(consolePrefix.replace("%s", timeConsole(new Date())) + "Reason: " + event.reason);
            console.warn(consolePrefix.replace("%s", timeConsole(new Date())) + "Clean: " + event.wasClean);
            console.groupEnd();
        });

        shard.on(ShardEvents.Ready, (id, unavailableGuilds) => {
            console.info(consolePrefix.replace("%s", timeConsole(new Date())) + "Shard " + ((id ?? 0) + 1) + "/" + shardTotal + " is ready");

            if (unavailableGuilds) {
                console.group(consolePrefix.replace("%s", timeConsole(new Date())) + "Found " + unavailableGuilds.size + " currently unavailable guilds.");
                console.info(consolePrefix.replace("%s", timeConsole(new Date())) + unavailableGuilds);
                console.groupEnd();
            }
        });

        shard.on(ShardEvents.Reconnecting, (id) => {
            console.info(consolePrefix.replace("%s", timeConsole(new Date())) + "Reconnecting shard " + ((id ?? 0) + 1) + "/" + shardTotal);
        });
    });

    console.log(consolePrefix.replace("%s", timeConsole(new Date())) + "Spawn shards...");

    manager.spawn();

    console.log(consolePrefix.replace("%s", timeConsole(new Date())) + "Successful to create multi-process sharding.");
});
