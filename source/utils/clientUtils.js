const { REST, Routes } = require("discord.js");
const { ansiColor } = require("./consoleUtils");
const { get } = require("axios").default;
const packages = require("../../package.json");

/**
 * Check for updates via Github and notify when new updates are available.
 * 
 * @param {Client} client 
 */
const checkForUpdates = async (client) => {
    const clearStyle = ansiColor(0, "sgr");
    const greenColor = ansiColor(10, "foreground");
    const blueBrightColor = ansiColor(33, "foreground");

    if (!client.config.check_update.enable) return;
    if (!client.config.check_update.releases_url) {
        return client.console.add("check-update-loading", {
            "text": "The releases_url value was not found in the environment. Cancel check for updates.",
            "status": "non-spinnable"
        });
    }

    client.console.add("check-update-loading", {
        "text": "Checking for new version"
    });

    try {
        const response = await get(client.config.check_update.releases_url);

        if (response.status !== 200) {
            return client.console.update("check-update-loading", {
                "text": "Unable to detect latest version at this time.",
                "status": "non-spinnable"
            });
        }
        if (response.data) {
            if (packages.version >= response.data.tag_name) {
                client.console.update("check-update-loading", {
                    "text": "Currently using the latest version.",
                    "status": "non-spinnable"
                });
            } else {
                client.console.update("check-update-loading", {
                    "text": [
                        ".",
                        ". Update is available " + packages.version + " -> " + greenColor + response.data.tag_name + clearStyle,
                        ". Run " + blueBrightColor + "npm pull" + clearStyle + " to update",
                        "."
                    ].join("\n"),
                    "status": "non-spinnable"
                });
            }
        }
    } catch (error) {
        client.console.fail("check-update-loading", {
            "text": "Failed to check for new updates\n" + error
        });
    }
}

/**
 * Update information of all application commands both **global** and **guild**.
 * 
 * @param {Client} client 
 * @param {Boolean} reload If set to `true`, no messages will be displayed on the console.
 */
const updateApplicationCommands = async (client, reload = false) => {
    const token = client.config.token;
    const guildID = client.config.test.guild;
    const clientID = client.user.id;
    const rest = new REST({ "version": "10" }).setToken(token);

    if (!reload) {
        client.console.add("app-commands-loading", {
            "text": "Starting to refresh all application (/) commands."
        });
    }

    try {
        const command = await client.commands.map((commands) => commands.function.command.data);
        const context = await client.contexts.map((commands) => commands.function.context.data);
        const data = command.concat(context);

        if (client.mode === "start" || !client.config.test.application_commands) {
            await rest.put(
                Routes.applicationCommands(clientID),
                { "body": data }
            );
        } else {
            if (!guildID) return client.console.fail("app-commands-loading", {
                "text": "The test_guild key was not found in the environment. You may not be able to see recent commands."
            });

            await rest.put(
                Routes.applicationGuildCommands(clientID, guildID),
                { "body": data }
            );
        }
        if (!reload) {
            client.console.update("app-commands-loading", {
                "text": "Application commands is ready to use.",
                "status": "non-spinnable"
            });
        }
    } catch (error) {
        if (!reload) {
            client.console.fail("app-commands-loading", {
                "text": "Application commands could not be completely reloaded.\n" + error
            });
        }
    }
}

const BitwisePermissionFlags = {
    0x0000000000000001: "Create Invite",
    0x0000000000000002: "Kick Members",
    0x0000000000000004: "Ban Members",
    0x0000000000000008: "Administrator",
    0x0000000000000010: "Manage Channels",
    0x0000000000000020: "Manage Server",
    0x0000000000000040: "Add Reactions",
    0x0000000000000080: "View Audit Log",
    0x0000000000000100: "Priority Speaker",
    0x0000000000000200: "Video",
    0x0000000000000400: "Read Text Channels & See Voice Channels",
    0x0000000000000800: "Send Messages",
    0x0000000000001000: "Send TTS Messages",
    0x0000000000002000: "Manage Messages",
    0x0000000000004000: "Embed Links",
    0x0000000000008000: "Attach Files",
    0x0000000000010000: "Read Message History",
    0x0000000000020000: "Mention @everyone, @here, and All Roles",
    0x0000000000040000: "Use External Emojis",
    0x0000000000080000: "View Server Insights",
    0x0000000000100000: "Connect",
    0x0000000000200000: "Speak",
    0x0000000000400000: "Mute Members",
    0x0000000000800000: "Deafen Members",
    0x0000000001000000: "Move Members",
    0x0000000002000000: "Use Voice Activity",
    0x0000000004000000: "Change Nickname",
    0x0000000008000000: "Manage Nicknames",
    0x0000000010000000: "Manage Roles",
    0x0000000020000000: "Manage Webhooks",
    0x0000000040000000: "Manage Emojis & Stickers",
    0x0000000080000000: "Use Application Commands",
    0x0000000100000000: "Request to Speak",
    0x0000000200000000: "Manage Events",
    0x0000000400000000: "Manage Threads",
    0x0000000800000000: "Create Public Threads",
    0x0000001000000000: "Create Private Threads",
    0x0000002000000000: "Use External Stickers",
    0x0000004000000000: "Send Messages in Threads",
    0x0000008000000000: "Use Embedded Activities",
    0x0000010000000000: "Moderate Members",
    0x0000020000000000: "View Creator Monetization Analytics",
    0x0000040000000000: "Use Soundboard"
}

module.exports = {
    checkForUpdates,
    updateApplicationCommands,
    BitwisePermissionFlags
}