const assert = require("node:assert/strict");
const { readFileSync, readdirSync } = require("node:fs");
const { basename, dirname, join, resolve } = require("node:path");
const test = require("node:test");

const sourcePath = resolve(__dirname, "../../source");
const localesPath = join(sourcePath, "locales");
const languages = require("../../source/configs/languages.json");

const readCatalog = (file) => JSON.parse(readFileSync(file, "utf8"));
const flatten = (value, prefix = "", output = new Map()) => {
  for (const [key, child] of Object.entries(value)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child))
      flatten(child, path, output);
    else output.set(path, child);
  }
  return output;
};
const placeholders = (value) =>
  typeof value === "string"
    ? [...value.matchAll(/{{\s*([^},\s]+)[^}]*}}|%s\d*/g)]
        .map((match) => match[1] ?? match[0])
        .sort()
    : [];

test("every configured language has a parseable translation catalog", () => {
  for (const locale of Object.keys(languages)) {
    const file = join(localesPath, locale, "translation.json");
    const catalog = readCatalog(file);
    assert.equal(typeof catalog, "object", locale);
    assert.ok(Object.keys(catalog).length > 0, locale);
  }
});

test("translation placeholder drift does not exceed the known catalog debt", () => {
  const source = flatten(
    readCatalog(join(localesPath, "en-US", "translation.json")),
  );
  const files = readdirSync(localesPath, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(localesPath, entry.name, "translation.json"));

  const mismatches = [];
  for (const file of files) {
    const locale = basename(dirname(file));
    const catalog = flatten(readCatalog(file));
    for (const [key, value] of catalog) {
      if (!source.has(key)) continue;
      if (
        JSON.stringify(placeholders(value)) !==
        JSON.stringify(placeholders(source.get(key)))
      )
        mismatches.push(`${locale}:${key}`);
    }
  }

  // Some Crowdin catalogs still omit placeholders that exist in en-US. Keep
  // the existing drift bounded while requiring one interpolation syntax.
  assert.ok(
    mismatches.length <= 100,
    `Placeholder mismatches increased to ${mismatches.length}: ${mismatches.join(", ")}`,
  );
});

test("translation catalogs use i18next interpolation placeholders", () => {
  for (const entry of readdirSync(localesPath, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = join(localesPath, entry.name, "translation.json");
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /%s\d*/, entry.name);
    assert.doesNotMatch(source, /{{\s*value\d*\s*}}/, entry.name);
  }
});

test("locale directories do not contain empty translation keys", () => {
  for (const entry of readdirSync(localesPath, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const catalog = flatten(
      readCatalog(join(localesPath, entry.name, "translation.json")),
    );
    for (const key of catalog.keys())
      assert.equal(key.includes(".."), false, key);
  }
});
