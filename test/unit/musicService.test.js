const assert = require("node:assert/strict");
const test = require("node:test");
const { getDjDenial } = require("../../source/services/music");

const keys = { notOwner: "not_owner", notDj: "not_a_dj" };

const makeQueue = (overrides = {}) => ({
  autoplay: false,
  songs: [{ user: { id: "owner" } }],
  ...overrides,
});

const makeInteraction = ({ djs, userId = "owner", roleIds = [] }) => ({
  client: {
    configs: { djs: { enable: false, only: false, roles: [], users: [] } },
    guildSettings: new Map([["guild", { djs }]]),
    temp: { listeners: new Map() },
  },
  guildId: "guild",
  member: { roles: { cache: roleIds.map((id) => ({ id })) } },
  user: { id: userId },
});

const djs = (overrides = {}) => ({
  enable: true,
  only: false,
  roles: [],
  users: [],
  ...overrides,
});

test("getDjDenial allows everything without a queue or with DJ disabled", () => {
  const interaction = makeInteraction({
    djs: djs({ enable: false, only: true }),
    userId: "other",
  });

  assert.equal(getDjDenial(interaction, undefined, keys), null);
  assert.equal(getDjDenial(interaction, makeQueue(), keys), null);
});

test("getDjDenial blocks non-owners unless autoplay is on", () => {
  const interaction = makeInteraction({ djs: djs(), userId: "other" });

  assert.equal(getDjDenial(interaction, makeQueue(), keys), "not_owner");
  assert.equal(
    getDjDenial(interaction, makeQueue({ autoplay: true }), keys),
    null,
  );
});

test("getDjDenial enforces DJ-only mode by user or role", () => {
  const settings = djs({ only: true, roles: ["dj-role"], users: ["dj-user"] });

  assert.equal(
    getDjDenial(makeInteraction({ djs: settings }), makeQueue(), keys),
    "not_a_dj",
  );
  assert.equal(
    getDjDenial(
      makeInteraction({ djs: settings, roleIds: ["dj-role"] }),
      makeQueue(),
      keys,
    ),
    null,
  );
  assert.equal(
    getDjDenial(
      makeInteraction({ djs: settings, userId: "dj-user" }),
      makeQueue({ songs: [{ user: { id: "dj-user" } }] }),
      keys,
    ),
    null,
  );
});
