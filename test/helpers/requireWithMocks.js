const { resolve } = require("node:path");

const requireWithMocks = (target, mocks) => {
  const targetPath = require.resolve(resolve(target));
  const originalTarget = require.cache[targetPath];
  const originals = new Map();

  delete require.cache[targetPath];
  for (const [request, exports] of Object.entries(mocks)) {
    const dependencyPath = require.resolve(request);
    originals.set(dependencyPath, require.cache[dependencyPath]);
    require.cache[dependencyPath] = {
      id: dependencyPath,
      filename: dependencyPath,
      loaded: true,
      exports,
    };
  }

  try {
    return require(targetPath);
  } finally {
    if (originalTarget) require.cache[targetPath] = originalTarget;
    else delete require.cache[targetPath];

    for (const [dependencyPath, original] of originals) {
      if (original) require.cache[dependencyPath] = original;
      else delete require.cache[dependencyPath];
    }
  }
};

module.exports = { requireWithMocks };
