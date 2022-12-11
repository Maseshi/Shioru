const { REST, Routes } = require("discord.js");
const { ansiColor } = require("./consoleUtils");
const fetch = require("node-fetch");
const packages = require("../../package.json");

const checkForUpdates = async (client) => {
    const clearStyle = ansiColor(0, "sgr");
    const greenColor = ansiColor(10, "foreground");
    const blueBrightColor = ansiColor(33, "foreground");

    client.console.add("check-update-loading", {
        "text": "Checking for new version"
    });

    try {
        const response = await fetch("https://api.github.com/repos/Maseshi/Shioru/releases/latest");
        const data = await response.json();

        if (response.status !== 200) {
            return client.console.update("check-update-loading", {
                "text": "Unable to detect latest version at this time.",
                "status": "non-spinnable"
            });
        }
        if (data) {
            if (packages.version.replace(/[^0-9]/g, "") >= data.tag_name.replace(/[^0-9]/g, "")) {
                client.console.update("check-update-loading", {
                    "text": "Currently using the latest version.",
                    "status": "non-spinnable"
                });
            } else {
                client.console.update("check-update-loading", {
                    "text": ".\n" +
                        ". Update is available " + packages.version + " -> " + greenColor + data.tag_name + clearStyle + "\n" +
                        ". Run " + blueBrightColor + "npm pull" + clearStyle + " to update\n" +
                        ".",
                    "status": "non-spinnable"
                });
            }
        }
    } catch (error) {
        client.console.fail("check-update-loading", {
            "failColor": "redBright",
            "text": "Failed to check for new updates"
        });
        console.group();
        console.error(error);
        console.groupEnd();
    }
}

const updateApplicationCommands = async (client, reload = false) => {
    const interaction = client.interaction;
    const guildID = client.config.testGuild;
    const clientID = client.user.id;
    const token = client.config.token;
    const rest = new REST({ "version": "10" }).setToken(token);

    if (!reload) {
        client.console.add("app-commands-loading", {
            "text": "Starting to refresh all application (/) commands."
        });
    }

    try {
        const slash = await interaction.map((commands) => commands.interaction.slash.data);
        const context = await interaction.map((commands) => {
            if (commands.interaction.context) return commands.interaction.context.data;
        }).filter((element) => element !== undefined)
        const data = slash.concat(context);

        if (client.mode === "start") {
            await rest.put(
                Routes.applicationCommands(clientID),
                { "body": data }
            );
        } else {
            await rest.put(
                Routes.applicationGuildCommands(clientID, guildID),
                { "body": data }
            );
        }
        if (!reload) {
            client.console.update("app-commands-loading", {
                "text": "Application (/) commands is ready to use.",
                "status": "non-spinnable"
            });
        }
    } catch (error) {
        if (!reload) {
            client.console.update("app-commands-loading", {
                "text": "The application (/) commands could not be completely reloaded.",
                "status": "non-spinnable"
            });
        }

        console.group();
        console.error(error);
        console.groupEnd();
    }
}

const BitwisePermissionFlags = {
    0x1: "Create Invite",
    0x2: "Kick Members",
    0x4: "Ban Members",
    0x8: "Administrator",
    0x10: "Manage Channels",
    0x20: "Manage Server",
    0x40: "Add Reactions",
    0x80: "View Audit Log",
    0x100: "Priority Speaker",
    0x200: "Video",
    0x400: "Read Text Channels & See Voice Channels",
    0x800: "Send Messages",
    0x1000: "Send TTS Messages",
    0x2000: "Manage Messages",
    0x4000: "Embed Links",
    0x8000: "Attach Files",
    0x10000: "Read Message History",
    0x20000: "Mention @everyone, @here, and All Roles",
    0x40000: "Use External Emojis",
    0x80000: "View Server Insights",
    0x100000: "Connect",
    0x200000: "Speak",
    0x400000: "Mute Members",
    0x800000: "Deafen Members",
    0x1000000: "Move Members",
    0x2000000: "Use Voice Activity",
    0x4000000: "Change Nickname",
    0x8000000: "Manage Nicknames",
    0x10000000: "Manage Roles",
    0x20000000: "Manage Webhooks",
    0x40000000: "Manage Emojis & Stickers",
    0x80000000: "Use Application Commands",
    0x100000000: "Request to Speak",
    0x200000000: "Manage Events",
    0x400000000: "Manage Threads",
    0x800000000: "Create Public Threads",
    0x1000000000: "Create Private Threads",
    0x2000000000: "Use External Stickers",
    0x4000000000: "Send Messages in Threads",
    0x8000000000: "Use Embedded Activities",
    0x10000000000: "Moderate Members"
}

module.exports = {
    checkForUpdates,
    updateApplicationCommands,
    BitwisePermissionFlags
}