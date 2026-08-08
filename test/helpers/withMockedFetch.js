const withMockedFetch = async (responses, callback) => {
  const originalFetch = global.fetch;
  const implementations = Array.isArray(responses)
    ? [...responses]
    : [responses];
  const calls = [];

  global.fetch = async (...args) => {
    calls.push(args);
    const implementation = implementations.shift();

    if (typeof implementation === "function") return implementation(...args);
    return implementation;
  };

  try {
    return await callback(calls);
  } finally {
    global.fetch = originalFetch;
  }
};

module.exports = { withMockedFetch };
