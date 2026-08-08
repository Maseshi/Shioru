const assert = require("node:assert/strict");
const test = require("node:test");
const {
  executeScript,
  fetchConversationHistory,
  fetchConversationResponse,
  findMatch,
  normalizeText,
  sendReply,
  similarity,
} = require("../../source/utils/chatUtils");

test("similarity and matching handle exact, keyword, typo, and no-match input", () => {
  assert.equal(similarity("hello", "hello"), 1);
  assert.equal(similarity("", "hello"), 0);
  assert.equal(similarity("hello", "helo"), 0.8);

  const conversations = [
    { prompts: ["hello"], replies: ["Hi"], script: "answer" },
    { prompts: ["good morning"], replies: ["Morning"] },
  ];
  assert.deepEqual(findMatch(conversations, "hello"), {
    reply: "Hi",
    script: "answer",
  });
  assert.equal(
    findMatch(conversations, "a good morning to you").reply,
    "Morning",
  );
  assert.equal(findMatch(conversations, "helo").reply, "Hi");
  assert.equal(findMatch(conversations, "unrelated"), null);
});

test("normalizeText expands abbreviations and removes filler", () => {
  assert.equal(normalizeText("pls tell me a story"), "tell me story");
  assert.equal(normalizeText("WHATS your name please"), "what is your name");
  assert.equal(normalizeText("r u okay"), "are you okay");
});

test("executeScript exposes only the intended message context and times out", () => {
  const message = {
    author: { id: "user-1", username: "Maseshi" },
    channel: { name: "general" },
    guild: { name: "Shioru" },
    content: "<@123> argument",
  };

  assert.equal(
    executeScript(
      "`${username}:${userId}:${channelName}:${guildName}:${argument}:${answer}`",
      message,
      "matched",
    ),
    "Maseshi:user-1:general:Shioru:argument:matched",
  );
  assert.equal(executeScript("typeof process", message, ""), "undefined");
  assert.equal(executeScript("while (true) {}", message, "", 5), null);
  assert.equal(executeScript(null, message, ""), null);
});

test("fetchConversationHistory orders, filters, and labels Discord messages", async () => {
  const messages = new Map([
    ["3", { author: { id: "user" }, content: "latest", webhookId: null }],
    ["2", { author: { id: "bot" }, content: "<@123> answer", webhookId: null }],
    ["1", { author: { id: "hook" }, content: "ignored", webhookId: "webhook" }],
  ]);
  const channel = {
    messages: {
      fetch: async (options) => {
        assert.deepEqual(options, { limit: 3 });
        return messages;
      },
    },
  };

  assert.deepEqual(await fetchConversationHistory(channel, "bot", 3), [
    { role: "assistant", content: "answer" },
    { role: "user", content: "latest" },
  ]);
});

test("fetchConversationResponse sends the expected request and validates replies", async (t) => {
  const calls = [];
  t.mock.method(global, "fetch", async (url, options) => {
    calls.push({ url: url.toString(), options });
    return {
      ok: true,
      json: async () => ({ choices: [{ message: { content: "Hello" } }] }),
    };
  });

  const reply = await fetchConversationResponse({
    apiKey: "secret",
    baseURL: "https://example.com/base",
    systemPrompt: "Be helpful",
    conversationHistory: [{ role: "user", content: "Hi" }],
  });
  assert.equal(reply, "Hello");
  assert.equal(calls[0].url, "https://example.com/v1/chat/completions");
  assert.equal(calls[0].options.headers.Authorization, "Bearer secret");
  assert.deepEqual(JSON.parse(calls[0].options.body).messages, [
    { role: "system", content: "Be helpful" },
    { role: "user", content: "Hi" },
  ]);

  global.fetch.mock.mockImplementationOnce(async () => ({
    ok: false,
    status: 503,
  }));
  await assert.rejects(
    fetchConversationResponse({
      apiKey: "secret",
      baseURL: "https://example.com",
      systemPrompt: "",
      conversationHistory: [],
    }),
    /status 503/,
  );

  global.fetch.mock.mockImplementationOnce(async () => ({
    ok: true,
    json: async () => ({ choices: [] }),
  }));
  await assert.rejects(
    fetchConversationResponse({
      apiKey: "secret",
      baseURL: "https://example.com",
      systemPrompt: "",
      conversationHistory: [],
    }),
    /empty or invalid/,
  );
});

test("sendReply splits messages at Discord's content limit", async () => {
  const replies = [];
  const sends = [];
  const message = {
    reply: async (content) => replies.push(content),
    channel: { send: async (content) => sends.push(content) },
  };

  await sendReply(message, "a".repeat(4500));
  assert.deepEqual(
    replies.map((value) => value.length),
    [2000],
  );
  assert.deepEqual(
    sends.map((value) => value.length),
    [2000, 500],
  );
});
