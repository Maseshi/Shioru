const vm = require("node:vm");

/**
 * Execute a user-defined script string in a sandboxed environment.
 * The script has access to a limited set of safe variables only.
 *
 * Available variables in sandbox:
 * - `username` — The message author's username.
 * - `userId` — The message author's ID.
 * - `channelName` — The channel name (or "DM" for direct messages).
 * - `guildName` — The server name (or "DM" for direct messages).
 * - `argument` — The user's message text (without the @mention).
 * - `answer` — The matched reply string from pattern matching.
 * - `Date` — The Date constructor for time operations.
 * - `Math` — The Math object for calculations.
 * - `JSON` — The JSON object for parsing/stringifying.
 *
 * @param {string} script - The script string to execute.
 * @param {Object} message - The Discord message object.
 * @param {string} answer - The matched reply from pattern matching.
 * @param {number} [timeout=3000] - Maximum execution time in milliseconds.
 * @returns {string|null} The script's return value as a string, or null on failure.
 */
const executeScript = (script, message, answer, timeout = 3000) => {
  if (!script || typeof script !== "string") return null;

  const sandbox = {
    username: message.author.username,
    userId: message.author.id,
    channelName: message.channel.name ?? "DM",
    guildName: message.guild?.name ?? "DM",
    argument: message.content.replace(/^<@!?\d{1,20}> ?/i, "").trim(),
    answer,
    Date,
    Math,
    JSON,
  };

  try {
    const context = vm.createContext(sandbox);
    const result = vm.runInContext(script, context, { timeout });
    return result != null ? String(result) : null;
  } catch {
    return null;
  }
};

/**
 * Calculate similarity between two strings using Levenshtein distance.
 * Returns a value between 0 (completely different) and 1 (identical).
 *
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @returns {number} A similarity score between 0 and 1.
 * @example similarity("hello", "helo"); // => 0.8
 */
const similarity = (a, b) => {
  if (a === b) return 1;
  if (!a.length || !b.length) return 0;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  const maxLen = Math.max(a.length, b.length);
  return 1 - matrix[b.length][a.length] / maxLen;
};

/**
 * Find the best matching reply for a given text using keyword and similarity matching.
 * The matching is done in three levels:
 * 1. **Exact match** — the text is identical to a prompt.
 * 2. **Keyword match** — a prompt exists as whole words within the text.
 * 3. **Similarity match** — a prompt is similar enough to handle typos.
 *
 * @param {Array<{prompts: string[], replies: string[], script?: string}>} conversations - The conversations data.
 * @param {string} text - The user's input text to match against.
 * @param {number} [threshold=0.75] - The minimum similarity score to consider a match.
 * @returns {{reply: string, script: string|null}|null} The matched reply and script, or null if no match.
 * @example findMatch([{ prompts: ["hello"], replies: ["Hello!"] }], "helo"); // => { reply: "Hello!", script: null }
 */
const findMatch = (conversations, text, threshold = 0.75) => {
  const textWords = text.split(/\s+/);
  let bestScore = 0;
  let bestIndex = -1;

  for (let x = 0; x < conversations.length; x++) {
    const entry = conversations[x];
    for (let y = 0; y < entry.prompts.length; y++) {
      const prompt = entry.prompts[y];
      if (!prompt) continue;

      // 1. Exact match
      if (prompt === text) {
        return {
          reply:
            entry.replies[Math.floor(Math.random() * entry.replies.length)],
          script: entry.script ?? null,
        };
      }

      // 2. Keyword match — check if prompt exists as whole words in text
      // Uses lookbehind/lookahead with \S to support non-Latin scripts (e.g. Thai)
      const escaped = prompt.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`(?<![\\S])${escaped}(?![\\S])`, "u");
      if (regex.test(text)) {
        const score = prompt.length / text.length;
        if (score > bestScore) {
          bestScore = score;
          bestIndex = x;
        }
        continue;
      }

      // 3. Similarity match — handle typos
      const promptWords = prompt.split(/\s+/);

      if (promptWords.length === 1) {
        for (const word of textWords) {
          const score = similarity(word, prompt);
          if (score >= threshold && score > bestScore) {
            bestScore = score;
            bestIndex = x;
          }
        }
      } else {
        const score = similarity(text, prompt);
        if (score >= threshold && score > bestScore) {
          bestScore = score;
          bestIndex = x;
        }
      }
    }
  }

  if (bestIndex >= 0) {
    const entry = conversations[bestIndex];
    return {
      reply: entry.replies[Math.floor(Math.random() * entry.replies.length)],
      script: entry.script ?? null,
    };
  }

  return null;
};

/**
 * Normalize user input text by removing filler words and normalizing common abbreviations.
 *
 * @param {string} text - The raw user input text.
 * @returns {string} The normalized text in lowercase.
 * @example normalizeText("pls tell me a story"); // => "tell me story"
 */
const normalizeText = (text) => {
  return text
    .replaceAll(/ a /g, " ")
    .replaceAll(/pls/g, "please")
    .replaceAll(/i feel /g, "")
    .replaceAll(/whats/g, "what is")
    .replaceAll(/please /g, "")
    .replaceAll(/ please/g, "")
    .replaceAll(/r u/g, "are you")
    .toLowerCase();
};

/**
 * Fetch recent messages from a channel and format them as conversation history
 * for the AI chat completion API.
 *
 * @param {Object} channel - The Discord channel to fetch messages from.
 * @param {string} botId - The bot's user ID to determine the assistant role.
 * @param {number} [limit=10] - The number of recent messages to fetch.
 * @returns {Promise<Array<{role: string, content: string}>>} Formatted conversation history.
 */
const fetchConversationHistory = async (channel, botId, limit = 10) => {
  const history = await channel.messages.fetch({ limit });
  return [...history.values()]
    .reverse()
    .filter((msg) => !msg.webhookId)
    .map((msg) => ({
      role: msg.author.id === botId ? "assistant" : "user",
      content: msg.content.replace(/^<@!?\d{1,20}> ?/i, ""),
    }))
    .filter((msg) => msg.content);
};

/**
 * Send a request to the AI chat completion API and return the response text.
 *
 * @param {Object} options - The options for the AI request.
 * @param {string} options.apiKey - The API key for authentication.
 * @param {string} options.baseURL - The base URL of the AI API.
 * @param {string} options.systemPrompt - The system prompt to set the AI's behavior.
 * @param {Array<{role: string, content: string}>} options.conversationHistory - The conversation history.
 * @param {string} [options.model="gpt-4o-mini"] - The AI model to use.
 * @param {number} [options.maxTokens=500] - The maximum number of tokens in the response.
 * @returns {Promise<string>} The AI's response text.
 * @throws {Error} If the API request fails or returns an invalid response.
 */
const fetchConversationResponse = async ({
  apiKey,
  baseURL,
  systemPrompt,
  conversationHistory,
  model = "gpt-4o-mini",
  maxTokens = 500,
}) => {
  const response = await fetch(new URL("/v1/chat/completions", baseURL), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API responded with status ${response.status}`);
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("AI API returned an empty or invalid response");
  }

  return reply;
};

/**
 * Send a reply to a Discord message, splitting into multiple messages
 * if the content exceeds Discord's 2000 character limit.
 *
 * @param {Object} message - The Discord message to reply to.
 * @param {string} text - The text to send as a reply.
 * @returns {Promise<void>}
 */
const sendReply = async (message, text) => {
  if (text.length <= 2000) {
    await message.reply(text);
  } else {
    const chunks = [];
    for (let i = 0; i < text.length; i += 2000) {
      chunks.push(text.slice(i, i + 2000));
    }
    await message.reply(chunks[0]);
    for (let i = 1; i < chunks.length; i++) {
      await message.channel.send(chunks[i]);
    }
  }
};

module.exports = {
  similarity,
  findMatch,
  executeScript,
  normalizeText,
  fetchConversationHistory,
  fetchConversationResponse,
  sendReply,
};
