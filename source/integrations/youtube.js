const { DisTubeError } = require("distube");
const { json } = require("@distube/yt-dlp");

const getYtDlpStreamURL = async (song, extract = json) => {
  if (!song?.url)
    throw new DisTubeError(
      "YTDLP_PLUGIN_INVALID_SONG",
      "Cannot get stream URL from an invalid song.",
    );

  const info = await extract(song.url, {
    dumpSingleJson: true,
    format: "ba/ba*",
    noWarnings: true,
    preferFreeFormats: true,
    simulate: true,
    skipDownload: true,
  }).catch((error) => {
    throw new DisTubeError("YTDLP_ERROR", `${error.stderr || error}`);
  });

  if (Array.isArray(info.entries))
    throw new DisTubeError(
      "YTDLP_ERROR",
      "Cannot get a stream URL for an entire playlist.",
    );
  if (!info.url)
    throw new DisTubeError("YTDLP_ERROR", "No playable stream URL found.");

  return info.url;
};

const useYtDlpForStreams = (youtubePlugin, ytDlpPlugin) => {
  if (typeof youtubePlugin?.getStreamURL !== "function")
    throw new TypeError("A YouTube extractor plugin is required.");
  if (typeof ytDlpPlugin?.getStreamURL !== "function")
    throw new TypeError("A yt-dlp playable extractor plugin is required.");

  youtubePlugin.getStreamURL = (song) => ytDlpPlugin.getStreamURL(song);
  return youtubePlugin;
};

module.exports = { getYtDlpStreamURL, useYtDlpForStreams };
