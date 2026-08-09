const assert = require("node:assert/strict");
const { resolve } = require("node:path");
const test = require("node:test");
const { loadRepository } = require("../helpers/repositoryMocks");

const repositoryPath = (name) =>
  resolve(__dirname, `../../source/repositories/${name}.js`);

test("chat repository validates the global chat record", async () => {
  const chat = {
    conversations: [{ prompts: ["hello"], replies: ["Hi!"] }],
    alternatives: ["Continue"],
    system: "System",
  };
  const { calls, repository, values } = loadRepository(repositoryPath("chat"), {
    chat,
  });

  let watched;
  const unsubscribe = repository.onChat((value) => {
    watched = value;
  });
  await repository.setChat(chat);
  unsubscribe();

  assert.deepEqual(watched, chat);
  assert.equal(values.get("chat").system, "System");
  assert.deepEqual(
    calls.map(([operation]) => operation),
    ["listen", "set", "unsubscribe"],
  );
});

test("issue and information repositories validate writes", async () => {
  const issue = loadRepository(repositoryPath("issue"));
  const information = loadRepository(repositoryPath("information"));

  await issue.repository.pushIssue("bugs", {
    title: "Bug",
    description: "Description",
    user: "User",
    uid: "user-1",
    reportedAt: new Date("2026-01-01T00:00:00.000Z"),
    status: { read: false, close: false, comment: false },
  });
  await information.repository.updateInformation("commands", {
    ping: { description: "Ping" },
  });

  assert.equal(issue.calls[0][0], "push");
  assert.equal(information.calls[0][0], "update");
});

test("guild and user repositories own reads, updates, and removals", async () => {
  const guildValue = {
    joinedAt: "2026-01-01T00:00:00.000Z",
    createdAt: "2025-01-01T00:00:00.000Z",
    description: "",
    iconURL: "",
    preferredLocale: "en-US",
    memberCount: 1,
    name: "Guild",
    verified: false,
  };
  const guild = loadRepository(repositoryPath("guild"), {
    "guilds/guild-1": guildValue,
  });
  const user = loadRepository(repositoryPath("user"), {
    "users/user-1": { leveling: { exp: 10, level: 1 } },
  });

  assert.deepEqual(await guild.repository.getGuild("guild-1"), guildValue);
  let watchedGuild;
  const unsubscribe = guild.repository.onGuild("guild-1", (value) => {
    watchedGuild = value;
  });
  unsubscribe();
  await guild.repository.updateGuild("guild-1", { memberCount: 2 });
  await guild.repository.removeGuild("guild-1");
  assert.deepEqual(await user.repository.getUser("user-1"), {
    leveling: { exp: 10, level: 1 },
  });
  await user.repository.removeUser("user-1");

  assert.deepEqual(watchedGuild, guildValue);
  assert.deepEqual(
    guild.calls.map(([operation]) => operation),
    ["listen", "unsubscribe", "update", "remove"],
  );
  assert.deepEqual(
    user.calls.map(([operation]) => operation),
    ["remove"],
  );
});

test("statistics and leaderboard repositories own reads and queries", async () => {
  const statistics = loadRepository(repositoryPath("statistics"), {
    "statistics/size": { commands: 5, guilds: 2, users: 10 },
  });
  const leaderboard = loadRepository(repositoryPath("leaderboard"), {
    "leaderboards/guild-1": { "user-1": { exp: 10, level: 1 } },
  });

  assert.deepEqual(await statistics.repository.getStatistics("size"), {
    commands: 5,
    guilds: 2,
    users: 10,
  });
  await statistics.repository.incrementStatistics([
    "size/worked",
    "commands/ping",
  ]);
  const snapshot = await leaderboard.repository.getLeaderboard("guild-1", 5);

  assert.deepEqual(statistics.calls[0], [
    "update",
    "statistics",
    {
      "size/worked": { ".sv": { increment: 1 } },
      "commands/ping": { ".sv": { increment: 1 } },
    },
  ]);
  assert.equal(snapshot.exists(), true);
});
