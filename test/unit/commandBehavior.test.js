const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

const translator = { t: (key) => key };

const makeExternalInteraction = (values, configs = {}) => {
  const edits = [];
  let deferred = 0;
  const interaction = {
    client: {
      configs,
      i18n: translator,
      user: {
        avatarURL: () => "https://example.com/avatar.png",
        displayAvatarURL: () => "https://example.com/avatar.png",
        username: "Shioru",
      },
    },
    deferReply: async () => {
      deferred += 1;
    },
    editReply: async (payload) => {
      edits.push(payload);
      return payload;
    },
    locale: "en",
    options: {
      getString: (name) => values[name] ?? null,
      getSubcommand: () => values.subcommand,
    },
    reply: async (payload) => {
      edits.push(payload);
      return payload;
    },
    user: { id: "user-id", username: "moderator" },
  };
  return {
    edits,
    get deferred() {
      return deferred;
    },
    interaction,
  };
};

describe("utility and external command behavior", () => {
  it("encoder uses defaults for encode and decode", async () => {
    const encoder = require("../../source/commands/utility/encoder");
    const encoded = makeExternalInteraction({
      subcommand: "encode",
      text: "hello",
    });
    const decoded = makeExternalInteraction({
      subcommand: "decode",
      text: "aGVsbG8=",
    });

    await encoder.execute(encoded.interaction);
    await encoder.execute(decoded.interaction);

    assert.equal(
      encoded.edits[0].embeds[0].data.fields[1].value,
      "```aGVsbG8=```",
    );
    assert.equal(
      decoded.edits[0].embeds[0].data.fields[1].value,
      "```hello```",
    );
    assert.equal(encoded.edits[0].ephemeral, true);
  });

  it("encoder respects explicit source and destination encodings", async () => {
    const state = makeExternalInteraction({
      from: "hex",
      subcommand: "decode",
      text: "6869",
      to: "utf-8",
    });

    await require("../../source/commands/utility/encoder").execute(
      state.interaction,
    );

    assert.equal(state.edits[0].embeds[0].data.fields[1].value, "```hi```");
  });

  it("weather stops before network access when the API token is missing", async () => {
    const state = makeExternalInteraction({ city: "Bangkok" });

    await require("../../source/commands/information/weather").execute(
      state.interaction,
    );

    assert.equal(state.deferred, 1);
    assert.deepEqual(state.edits, ["commands.weather.no_token_provider"]);
  });

  it("weather reports geocoding and weather-service failures", async (t) => {
    const responses = [
      { status: 429 },
      { json: async () => [{ lat: 13.75, lon: 100.5 }], status: 200 },
      { status: 503 },
    ];
    t.mock.method(global, "fetch", async () => responses.shift());
    const geoFailure = makeExternalInteraction(
      { city: "Bangkok", unit: "metric" },
      { open_weather_token: "token" },
    );
    const weatherFailure = makeExternalInteraction(
      { city: "Bangkok", unit: "metric" },
      { open_weather_token: "token" },
    );

    await require("../../source/commands/information/weather").execute(
      geoFailure.interaction,
    );
    await require("../../source/commands/information/weather").execute(
      weatherFailure.interaction,
    );

    assert.equal(geoFailure.edits[0], "commands.weather.no_result_found");
    assert.equal(weatherFailure.edits[0], "commands.weather.error_with_code");
    assert.equal(fetch.mock.callCount(), 3);
  });

  it("anime reports an upstream API failure", async (t) => {
    t.mock.method(global, "fetch", async () => ({ status: 500 }));
    const state = makeExternalInteraction({
      query: "Frieren",
      search: "anime",
    });

    await require("../../source/commands/information/anime").execute(
      state.interaction,
    );

    assert.equal(state.deferred, 1);
    assert.deepEqual(state.edits, ["commands.anime.data_not_found"]);
  });
});

describe("moderation command behavior", () => {
  const makeKickInteraction = ({
    authorPosition = 10,
    kickable = true,
    memberPosition = 5,
  } = {}) => {
    const replies = [];
    let kickReason;
    const target = {
      id: "target-id",
      kickable,
      kick: async ({ reason }) => {
        kickReason = reason;
        return {
          user: {
            avatarURL: () => "https://example.com/member.png",
            username: "target",
          },
        };
      },
      roles: { highest: { position: memberPosition } },
    };
    const interaction = {
      client: { i18n: translator },
      editReply: async (payload) => replies.push(payload),
      guild: { members: { fetch: async () => target } },
      member: { roles: { highest: { position: authorPosition } } },
      options: {
        getMember: () => target,
        getString: () => null,
      },
      reply: async (payload) => replies.push(payload),
      user: { username: "moderator" },
    };
    return {
      get kickReason() {
        return kickReason;
      },
      interaction,
      replies,
    };
  };

  it("kick enforces moderator and bot role hierarchy", async () => {
    const lowerModerator = makeKickInteraction({
      authorPosition: 1,
      memberPosition: 5,
    });
    const notKickable = makeKickInteraction({ kickable: false });

    await require("../../source/commands/manager/kick").execute(
      lowerModerator.interaction,
    );
    await require("../../source/commands/manager/kick").execute(
      notKickable.interaction,
    );

    assert.deepEqual(lowerModerator.replies, [
      "commands.kick.members_have_a_higher_role",
    ]);
    assert.deepEqual(notKickable.replies, [
      "commands.kick.members_have_a_higher_role_than_me",
    ]);
  });

  it("kick removes an eligible member with the default reason", async () => {
    const state = makeKickInteraction();

    await require("../../source/commands/manager/kick").execute(
      state.interaction,
    );

    assert.equal(state.kickReason, "commands.kick.no_reason");
    assert.equal(state.replies.length, 1);
    assert.equal(
      state.replies[0].embeds[0].data.title,
      "commands.kick.kicked_out",
    );
  });
});
