const assert = require("node:assert/strict");
const test = require("node:test");
const {
  containsURL,
  currencyFormatter,
  matchEmotes,
  newID,
  newLines,
  newTitle,
} = require("../../source/utils/miscUtils");

test("currencyFormatter shortens large numbers", () => {
  assert.equal(currencyFormatter(0, 2), "0");
  assert.equal(currencyFormatter(999, 2), "999");
  assert.equal(currencyFormatter(12_345, 2), "12.35k");
  assert.equal(currencyFormatter(1_000_000, 1), "1M");
});

test("containsURL detects supported URLs inside text", () => {
  assert.equal(containsURL("Visit https://example.com/docs?q=test"), true);
  assert.equal(containsURL("Upload to ftp://files.example.com/file.zip"), true);
  assert.equal(containsURL("This sentence has no URL"), false);
});

test("matchEmotes extracts Discord and Unicode emoji", () => {
  assert.deepEqual(matchEmotes("Hello 👋 <:wave:123456789>"), [
    "👋",
    "<:wave:123456789>",
  ]);
  assert.equal(matchEmotes("No emotes"), null);
});

test("string helpers format values", () => {
  assert.equal(newLines("one", "two", "three"), "one\ntwo\nthree");
  assert.equal(newTitle("hello WORLD"), "Hello World");
  assert.equal(newID("Hello.World:Value"), "hello-world-value");
});
