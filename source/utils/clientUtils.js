const { ansiColor } = require("./consoleUtils");
const fetch = require("node-fetch");
const packages = require("../../package.json");
const Spinnies = require("spinnies");

const checkForUpdates = async () => {
    const clearStyle = ansiColor(0, "sgr");
    const greenColor = ansiColor(10, "foreground");
    const blueBrightColor = ansiColor(33, "foreground");
    const spinnies = new Spinnies({
        "failColor": "yellowBright",
        "failPrefix": "⚠️"
    });

    spinnies.add("check-update-loading", {
        "text": "Checking for new version"
    });

    try {
        const response = await fetch("https://api.github.com/repos/Maseshi/Shioru/releases/latest");
        const data = await response.json();

        if (response.status !== 200) return spinnies.fail("check-update-loading", {
            "text": "Could not contact the server."
        });
        if (data) {
            if (packages.version.replace(/[^0-9]/g, "") >= data.tag_name.replace(/[^0-9]/g, "")) {
                spinnies.remove("check-update-loading");
                console.log("Currently using the latest version.");
            } else {
                spinnies.remove("check-update-loading");
                console.log(".");
                console.log(". Update is available " + packages.version + " -> " + greenColor + data.tag_name + clearStyle);
                console.log(". Run " + blueBrightColor + "npm pull" + clearStyle + " to update");
                console.log(".");
            }
        }
    } catch (error) {
        spinnies.fail("check-update-loading", {
            "failColor": "redBright",
            "text": "Failed to check for new updates"
        });
        console.group();
        console.error(error);
        console.groupEnd();
    }
}

const updateApplicationCommands = async (client) => {
    const guildID = client.config.testGuild;
    const spinnies = new Spinnies({
        "failColor": "yellowBright",
        "failPrefix": "⚠️"
    });

    spinnies.add("app-commands-loading", {
        "text": "Starting to refresh all application (/) commands."
    });

    try {
        const data = client.interaction.map((commands) => commands.interaction.data);

        if (client.mode === "start") {
            await client.application.commands.set(data);
        } else {
            await client.application.commands.set(data, guildID);
        }

        spinnies.remove("app-commands-loading");
        console.log("Application (/) commands is ready to use.            ");
    } catch (err) {
        spinnies.fail("app-commands-loading", {
            "text": "The application (/) commands could not be completely reloaded."
        });
        console.group();
        console.error(err);
        console.groupEnd();
    }
}

const permissions = {
    "ADMINISTRATOR": "Administrator",
    "VIEW_AUDIT_LOG": "View Audit Log",
    "VIEW_GUILD_INSIGHTS": "View Server Insights",
    "MANAGE_GUILD": "Manage Server",
    "MANAGE_ROLES": "Manage Roles",
    "MANAGE_CHANNELS": "Manage Channels",
    "KICK_MEMBERS": "Kick Members",
    "BAN_MEMBERS": "Ban Members",
    "CREATE_INSTANT_INVITE": "Create Invite",
    "CHANGE_NICKNAME": "Change Nickname",
    "MANAGE_NICKNAMES": "Manage Nicknames",
    "MANAGE_EMOJIS": "Manage Emojis",
    "MANAGE_WEBHOOKS": "Manage Webhooks",
    "VIEW_CHANNEL": "Read Text Channels & See Voice Channels",
    "SEND_MESSAGES": "Send Messages",
    "SEND_TTS_MESSAGES": "Send TTS Messages",
    "MANAGE_MESSAGES": "Manage Messages",
    "EMBED_LINKS": "Embed Links",
    "ATTACH_FILES": "Attach Files",
    "READ_MESSAGE_HISTORY": "Read Message History",
    "MENTION_EVERYONE": "Mention @everyone, @here, and All Roles",
    "USE_EXTERNAL_EMOJIS": "Use External Emojis",
    "ADD_REACTIONS": "Add Reactions",
    "CONNECT": "Connect",
    "SPEAK": "Speak",
    "STREAM": "Video",
    "MUTE_MEMBERS": "Mute Members",
    "DEAFEN_MEMBERS": "Deafen Members",
    "MOVE_MEMBERS": "Move Members",
    "USE_VAD": "Use Voice Activity",
    "PRIORITY_SPEAKER": "Priority Speaker"
}

module.exports = {
    checkForUpdates,
    updateApplicationCommands,
    permissions
}