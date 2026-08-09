const http = require("node:http");
const configs = require("../configs/data");
const { logger } = require("./logUtils");

const createHealthServer = (
  services,
  { now = Date.now, rateLimit = 60 * 1000, maxRequests = 10 } = {},
) => {
  const requestCounts = new Map();

  return http.createServer((req, res) => {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress;
    let device = requestCounts.get(ip);
    const requestedAt = now();

    if (!device || requestedAt - device.viewed > rateLimit) {
      device = { count: 1, viewed: requestedAt };
    } else {
      device.count += 1;
    }
    requestCounts.set(ip, device);

    if (device.count > maxRequests) {
      res.writeHead(429, { "Content-Type": "text/plain" });
      res.end("Too Many Requests");
      return;
    }

    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Services is running.");
    } else if (req.url === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(services));
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
    }
  });
};

const checkOpenAI = async () => {
  const apiKey = configs.openai.apiKey;
  const baseURL = configs.openai.baseURL;
  if (!apiKey)
    return {
      name: "Artificial Intelligence",
      status: "skipped",
      message: "No API key configured",
    };

  try {
    const response = await fetch(new URL("/v1/models", baseURL), {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    return response.ok
      ? { name: "Artificial Intelligence", status: "ok" }
      : {
          name: "Artificial Intelligence",
          status: "fail",
          message: `HTTP ${response.status}`,
        };
  } catch (error) {
    return {
      name: "Artificial Intelligence",
      status: "fail",
      message: error.message,
    };
  }
};

const checkDatabase = async () => {
  const url = configs.server.databaseURL;
  if (!url)
    return {
      name: "Realtime Database",
      status: "skipped",
      message: "No URL configured",
    };

  try {
    const response = await fetch(new URL("/information.json", url));
    return response.ok
      ? { name: "Realtime Database", status: "ok" }
      : {
          name: "Realtime Database",
          status: "fail",
          message: `HTTP ${response.status}`,
        };
  } catch (error) {
    return {
      name: "Realtime Database",
      status: "fail",
      message: error.message,
    };
  }
};

const checkTranslation = async () => {
  const url = configs.translation.baseURL;
  if (!url)
    return {
      name: "Translation",
      status: "skipped",
      message: "No URL configured",
    };

  try {
    const response = await fetch(new URL(url), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: new URLSearchParams({ sl: "auto", tl: "th", q: "Test" }).toString(),
    });
    return response.ok
      ? { name: "Translation", status: "ok" }
      : {
          name: "Translation",
          status: "fail",
          message: `HTTP ${response.status}`,
        };
  } catch (error) {
    return { name: "Translation", status: "fail", message: error.message };
  }
};

const checkWeather = async () => {
  const token = configs.open_weather_token;
  if (!token)
    return {
      name: "Weather",
      status: "skipped",
      message: "No token configured",
    };

  const geoURL = new URL("https://api.openweathermap.org/geo/1.0/direct");
  const dataURL = new URL("https://api.openweathermap.org/data/2.5/weather");

  try {
    geoURL.searchParams.append("q", "Bangkok");
    geoURL.searchParams.append("appid", token);
    const geoResponse = await fetch(geoURL);
    if (!geoResponse.ok)
      return {
        name: "Weather",
        status: "fail",
        message: "Unable to retrieve coordinates",
      };

    const [location] = await geoResponse.json();
    dataURL.searchParams.append("lat", location.lat);
    dataURL.searchParams.append("lon", location.lon);
    dataURL.searchParams.append("appid", token);
    const response = await fetch(dataURL);
    return response.ok
      ? { name: "Weather", status: "ok" }
      : { name: "Weather", status: "fail", message: `HTTP ${response.status}` };
  } catch (error) {
    return { name: "Weather", status: "fail", message: error.message };
  }
};

const healthCheckSubmitter = async () => {
  const child = logger.child({}, { msgPrefix: "[HCSu] " });
  child.info("Running health checks for external services...");

  const services = await Promise.all([
    checkOpenAI(),
    checkDatabase(),
    checkTranslation(),
    checkWeather(),
  ]);
  const port = process.env.PORT || 3000;
  const server = createHealthServer(services);
  server.listen(port, () => {
    child.info(`Health check HTTP server running on port ${port}.`);
  });
};

module.exports = { createHealthServer, healthCheckSubmitter };
