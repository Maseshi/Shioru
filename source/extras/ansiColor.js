module.exports = (code, mode) => {
    // 8-bit: 256-color mode
    // foreground: ESC[38;5;#m
    // background: ESC[48;5;#m
    // https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit

    if (code === null) return console.log("[ansiColor] Please configure the color of ANSI.");
    if (!mode) return console.log("[ansiColor] Please confirm the ANSI mode, including 'foreground', 'background' and 'sgr'.");

    if (mode === "foreground") return "\033[38;5;" + code.toString() + "m";
    if (mode === "background") return "\033[48;5;" + code.toString() + "m";
    if (mode === "sgr") return "\x1b[" + code.toString() + "m";
}