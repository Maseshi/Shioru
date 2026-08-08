const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

const commandPath = (name) => `../../source/commands/music/${name}`;

const makeQueue = (overrides = {}) => ({
  autoplay: false,
  paused: false,
  previousSongs: [{ name: "previous" }],
  songs: [
    {
      duration: 120,
      formattedDuration: "2:00",
      name: "first",
      user: { id: "owner" },
    },
    { name: "second", user: { id: "owner" } },
    { name: "third", user: { id: "owner" } },
  ],
  volume: 50,
  ...overrides,
});

const makeInteraction = ({
  djs = { enable: false, only: false, roles: [], users: [] },
  meChannel = null,
  options = {},
  player = {},
  queue = makeQueue(),
  userId = "owner",
  voiceChannel = null,
} = {}) => {
  const calls = [];
  const replies = [];
  const defaultPlayer = {
    addRelatedSong: async (...args) => {
      calls.push(["addRelatedSong", ...args]);
      return { formattedDuration: "3:00", name: "related" };
    },
    getQueue: () => queue,
    jump: (...args) => calls.push(["jump", ...args]),
    pause: (...args) => calls.push(["pause", ...args]),
    previous: (...args) => calls.push(["previous", ...args]),
    resume: (...args) => calls.push(["resume", ...args]),
    seek: (...args) => calls.push(["seek", ...args]),
    setRepeatMode: (...args) => {
      calls.push(["setRepeatMode", ...args]);
      return args[1];
    },
    setVolume: (...args) => calls.push(["setVolume", ...args]),
    shuffle: (...args) => calls.push(["shuffle", ...args]),
    skip: (...args) => calls.push(["skip", ...args]),
    stop: (...args) => calls.push(["stop", ...args]),
    toggleAutoplay: (...args) => {
      calls.push(["toggleAutoplay", ...args]);
      return true;
    },
    voices: {
      get: () => null,
      join: (...args) => calls.push(["join", ...args]),
    },
    ...player,
  };
  const interaction = {
    client: {
      configs: { djs, metrics: { enabled: false, label: "music-test" } },
      guildSettings: new Map(),
      i18n: { t: (key) => key },
      player: defaultPlayer,
      temp: { listeners: new Map() },
    },
    guild: { members: { me: { voice: { channel: meChannel } } } },
    guildId: "guild-id",
    member: {
      roles: { cache: [] },
      voice: { channel: voiceChannel },
    },
    options: {
      getChannel: (name) => options[name] ?? null,
      getInteger: (name) => options[name] ?? null,
    },
    reply: async (payload) => {
      replies.push(payload);
      return payload;
    },
    user: { id: userId },
  };
  interaction.client.guildSettings.set(interaction.guildId, { djs });

  return { calls, interaction, replies };
};

describe("music command behavior", () => {
  const queueCommands = [
    "autoplay",
    "jump",
    "pause",
    "previous",
    "related",
    "remove",
    "repeat",
    "resume",
    "seek",
    "shuffle",
    "skip",
    "stop",
    "volume",
  ];

  for (const name of queueCommands) {
    it(`${name} rejects when there is no active queue`, async () => {
      const { interaction, replies } = makeInteraction({ queue: null });

      await require(commandPath(name)).execute(interaction);

      assert.deepEqual(replies, [`commands.${name}.no_queue`]);
    });
  }

  const simpleSuccesses = [
    ["autoplay", "toggleAutoplay", "commands.autoplay.on"],
    ["pause", "pause", "commands.pause.paused"],
    ["previous", "previous", "commands.previous.previous"],
    ["resume", "resume", "commands.resume.resumed", { paused: true }],
    ["shuffle", "shuffle", "commands.shuffle.now_shuffle"],
    ["skip", "skip", "commands.skip.skipped"],
    ["stop", "stop", "commands.stop.stopped"],
  ];

  for (const [name, method, reply, queueOverrides = {}] of simpleSuccesses) {
    it(`${name} invokes the player and confirms success`, async () => {
      const state = makeInteraction({ queue: makeQueue(queueOverrides) });

      await require(commandPath(name)).execute(state.interaction);

      assert.equal(state.calls[0][0], method);
      assert.equal(state.replies.at(-1), reply);
    });
  }

  it("pause and resume reject commands that would not change state", async () => {
    const paused = makeInteraction({ queue: makeQueue({ paused: true }) });
    const playing = makeInteraction({ queue: makeQueue({ paused: false }) });

    await require(commandPath("pause")).execute(paused.interaction);
    await require(commandPath("resume")).execute(playing.interaction);

    assert.deepEqual(paused.replies, ["commands.pause.not_paused"]);
    assert.deepEqual(playing.replies, ["commands.resume.now_playing"]);
  });

  it("DJ mode protects the queue owner and DJ-only operations", async () => {
    const protectedQueue = makeInteraction({
      djs: { enable: true, only: false, roles: [], users: [] },
      userId: "other-user",
    });
    const djOnly = makeInteraction({
      djs: { enable: true, only: true, roles: [], users: [] },
      queue: makeQueue({ autoplay: true }),
      userId: "other-user",
    });

    await require(commandPath("skip")).execute(protectedQueue.interaction);
    await require(commandPath("skip")).execute(djOnly.interaction);

    assert.deepEqual(protectedQueue.replies, ["commands.skip.not_owner"]);
    assert.deepEqual(djOnly.replies, ["commands.skip.not_a_dj"]);
    assert.equal(protectedQueue.calls.length, 0);
    assert.equal(djOnly.calls.length, 0);
  });

  it("volume reports the current value and applies a requested value", async () => {
    const current = makeInteraction();
    const changed = makeInteraction({ options: { percent: 75 } });

    await require(commandPath("volume")).execute(current.interaction);
    await require(commandPath("volume")).execute(changed.interaction);

    assert.equal(current.replies[0], "commands.volume.this_volume");
    assert.equal(changed.calls[0][0], "setVolume");
    assert.equal(changed.calls[0][2], 75);
    assert.equal(changed.replies[0], "commands.volume.adjusted");
  });

  it("seek validates duration, seeks, and handles player errors", async () => {
    const tooFar = makeInteraction({ options: { second: 120 } });
    const valid = makeInteraction({ options: { second: 30 } });
    const failed = makeInteraction({
      options: { second: 30 },
      player: {
        seek: () => {
          throw new Error("queue ended");
        },
      },
    });

    await require(commandPath("seek")).execute(tooFar.interaction);
    await require(commandPath("seek")).execute(valid.interaction);
    await require(commandPath("seek")).execute(failed.interaction);

    assert.equal(tooFar.replies[0], "commands.seek.too_much");
    assert.equal(valid.calls[0][0], "seek");
    assert.equal(valid.calls[0][2], 30);
    assert.equal(failed.replies[0], "commands.seek.no_queue");
  });

  it("jump validates the queue index and handles player errors", async () => {
    const tooFar = makeInteraction({ options: { number: 4 } });
    const valid = makeInteraction({ options: { number: 2 } });
    const failed = makeInteraction({
      options: { number: 2 },
      player: {
        jump: () => {
          throw new Error("cannot jump");
        },
      },
    });

    await require(commandPath("jump")).execute(tooFar.interaction);
    await require(commandPath("jump")).execute(valid.interaction);
    await require(commandPath("jump")).execute(failed.interaction);

    assert.equal(tooFar.replies[0], "commands.jump.too_much");
    assert.equal(valid.calls[0][0], "jump");
    assert.equal(failed.replies[0], "commands.jump.can_not_jump");
  });

  it("remove validates the queue index and removes the selected song", async () => {
    const tooFar = makeInteraction({ options: { number: 3 } });
    const valid = makeInteraction({ options: { number: 1 } });

    await require(commandPath("remove")).execute(tooFar.interaction);
    await require(commandPath("remove")).execute(valid.interaction);

    assert.equal(tooFar.replies[0], "commands.remove.too_much");
    assert.deepEqual(
      valid.interaction.client.player.getQueue().songs.map((song) => song.name),
      ["first", "third"],
    );
    assert.equal(valid.replies[0], "commands.remove.removed");
  });

  it("related adds a related song through the player", async () => {
    const state = makeInteraction();

    await require(commandPath("related")).execute(state.interaction);

    assert.equal(state.calls[0][0], "addRelatedSong");
    assert.equal(state.replies[0], "commands.related.added_related_song");
  });

  it("repeat passes the requested repeat mode to the player", async () => {
    const state = makeInteraction({ options: { mode: 2 } });

    await require(commandPath("repeat")).execute(state.interaction);

    assert.equal(state.calls[0][0], "setRepeatMode");
    assert.equal(state.calls[0][2], 2);
    assert.equal(state.replies[0], "commands.repeat.repeated");
  });

  it("join requires a voice channel and joins explicit or member channels", async () => {
    const missing = makeInteraction();
    const memberChannel = { id: "voice-one" };
    const fromMember = makeInteraction({ voiceChannel: memberChannel });
    const explicitChannel = { id: "voice-two" };
    const explicit = makeInteraction({ options: { channel: explicitChannel } });

    await require(commandPath("join")).execute(missing.interaction);
    await require(commandPath("join")).execute(fromMember.interaction);
    await require(commandPath("join")).execute(explicit.interaction);

    assert.equal(missing.replies[0], "commands.join.not_in_channel");
    assert.deepEqual(fromMember.calls[0], ["join", memberChannel]);
    assert.deepEqual(explicit.calls[0], ["join", explicitChannel]);
  });

  it("leave rejects missing connections and closes an active connection", async () => {
    const missing = makeInteraction();
    let left = false;
    const meChannel = { guild: { id: "guild-id" }, id: "voice-one" };
    const active = makeInteraction({
      meChannel,
      player: {
        voices: {
          get: () => ({
            leave: () => {
              left = true;
            },
          }),
        },
      },
    });

    await require(commandPath("leave")).execute(missing.interaction);
    await require(commandPath("leave")).execute(active.interaction);

    assert.equal(missing.replies[0], "commands.leave.not_in_any_channel");
    assert.equal(left, true);
    assert.equal(active.replies[0], "commands.leave.now_leave");
  });
});
