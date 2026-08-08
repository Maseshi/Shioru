const assert = require("node:assert/strict");
const { readdirSync } = require("node:fs");
const { join, resolve } = require("node:path");
const test = require("node:test");

const sourcePath = resolve(__dirname, "../../source");
const javascriptFiles = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory()
      ? javascriptFiles(path)
      : entry.name.endsWith(".js")
        ? [path]
        : [];
  });

test("all command modules expose valid and unique Discord command data", () => {
  const names = new Map();

  for (const file of javascriptFiles(join(sourcePath, "commands"))) {
    const command = require(file);
    assert.equal(typeof command, "object", file);
    assert.equal(typeof command.execute, "function", file);
    assert.equal(typeof command.data?.toJSON, "function", file);

    const data = command.data.toJSON();
    assert.equal(typeof data.name, "string", file);
    assert.ok(data.name.length > 0, file);
    assert.equal(names.has(data.name), false, `${data.name} is duplicated`);
    names.set(data.name, file);

    if (command.cooldown !== undefined) {
      assert.equal(Number.isFinite(command.cooldown), true, file);
      assert.ok(command.cooldown >= 0, file);
    }
  }

  assert.ok(names.size > 0);
});

test("all event modules expose a Discord event contract", () => {
  for (const file of javascriptFiles(join(sourcePath, "events"))) {
    const event = require(file);
    assert.equal(typeof event?.name, "string", file);
    assert.equal(typeof event?.once, "boolean", file);
    assert.equal(typeof event?.execute, "function", file);
  }
});

test("all context modules expose valid and unique command data", () => {
  const names = new Set();

  for (const file of javascriptFiles(join(sourcePath, "contexts"))) {
    const context = require(file);
    assert.equal(typeof context.execute, "function", file);
    assert.equal(typeof context.data?.toJSON, "function", file);
    const data = context.data.toJSON();
    assert.equal(names.has(data.name), false, `${data.name} is duplicated`);
    names.add(data.name);
  }

  assert.ok(names.size > 0);
});
