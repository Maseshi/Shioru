const assert = require("node:assert/strict");
const test = require("node:test");
const {
  getYtDlpStreamURL,
  useYtDlpForStreams,
} = require("../../source/utils/youtubeUtils");

test("YouTube metadata and search delegate stream extraction to yt-dlp", async () => {
  const calls = [];
  const youtubePlugin = {
    getStreamURL: () => "legacy-stream",
    search: () => [],
  };
  const ytDlpPlugin = {
    getStreamURL: async (song) => {
      calls.push(song);
      return "yt-dlp-stream";
    },
  };
  const song = { url: "https://www.youtube.com/watch?v=video-id" };

  const plugin = useYtDlpForStreams(youtubePlugin, ytDlpPlugin);

  assert.equal(plugin, youtubePlugin);
  assert.equal(plugin.search, youtubePlugin.search);
  assert.equal(await plugin.getStreamURL(song), "yt-dlp-stream");
  assert.deepEqual(calls, [song]);
});

test("YouTube stream delegation validates both plugins", () => {
  assert.throws(() => useYtDlpForStreams({}, {}), TypeError);
  assert.throws(
    () => useYtDlpForStreams({ getStreamURL: () => null }, {}),
    TypeError,
  );
});

test("yt-dlp stream extraction omits deprecated options", async () => {
  const calls = [];
  const streamURL = await getYtDlpStreamURL(
    { url: "https://www.youtube.com/watch?v=video-id" },
    async (...args) => {
      calls.push(args);
      return { url: "https://stream.example/audio" };
    },
  );

  assert.equal(streamURL, "https://stream.example/audio");
  assert.equal(calls[0][0], "https://www.youtube.com/watch?v=video-id");
  assert.equal(calls[0][1].noCallHome, undefined);
  assert.equal(calls[0][1].format, "ba/ba*");
});

test("yt-dlp stream extraction rejects invalid songs and playlists", async () => {
  await assert.rejects(() => getYtDlpStreamURL(null), {
    code: "YTDLP_PLUGIN_INVALID_SONG",
  });
  await assert.rejects(
    () =>
      getYtDlpStreamURL({ url: "https://youtube.com/playlist" }, async () => ({
        entries: [],
      })),
    { code: "YTDLP_ERROR" },
  );
});
