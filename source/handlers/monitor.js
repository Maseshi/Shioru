const http = require("http");
const axios = require("axios");
const package = require("../../package.json")
const port = process.env.PORT || 3000;

module.exports = (client) => {
    // The following 4 are the actual values that pertain to your account and this specific metric.
    const apiKey = client.config.monitoring.config.apiKey;
    const pageId = client.config.monitoring.config.pageId;
    const metricId = client.config.monitoring.config.metricId;
    const enableApi = client.config.monitoring.enable_api;
    const enable = client.config.monitoring.enable;

    const apiBase = "https://api.statuspage.io/v1";
    const apiURL = apiBase + "/pages/" + pageId + "/metrics/" + metricId + "/data.json";

    // Need at least 1 data point for every 5 minutes.
    // Submit random data for the whole day.
    const totalPoints = 60 / 5 * 24;
    const epochInSeconds = Math.floor(new Date() / 1000);

    // This function gets called every second.
    const submitPoint = async (count) => {
        count = count + 1;

        if (count > totalPoints) return client.console.succeed("monitor-loading", {
            "text": "Done, the matrix has been updated."
        });

        const currentTimestamp = epochInSeconds - (count - 1) * 5 * 60;
        const randomValue = Math.floor(Math.random() * 1000);

        try {
            const response = await axios.post(apiURL,
                {
                    "timestamp": currentTimestamp,
                    "value": randomValue
                },
                {
                    "headers": {
                        "Authorization": "OAuth " + apiKey,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (response.status === 401) {
                return client.console.fail("monitor-loading", {
                    "text": "Error encountered. Please ensure that your page code and authorization key are correct.",
                    "failColor": "yellowBright"
                });
            }

            client.console.update("monitor-loading", {
                "text": "Testing processing submitted point " + count + " of " + totalPoints
            });

            setTimeout(() => {
                submitPoint(count);
            }, 1000);
        } catch (error) {
            client.console.fail("monitor-loading", {
                "text": "Error caught: " + error.message,
                "failColor": "redBright"
            });
        }
    }

    // Initial call to start submitting data.
    if (client.mode === "start" && enable) {
        client.console.add("monitor-loading");

        if (!apiKey) return client.console.fail("monitor-loading", {
            "text": "The monitor API Key was not found in the environment. Opt out of sending performance data.",
        });
        if (!pageId) return client.console.fail("monitor-loading", {
            "text": "The monitor page ID was not found in the environment. Opt out of sending performance data.",
        });
        if (!metricId) return client.console.fail("monitor-loading", {
            "text": "The monitor metric ID was not found in the environment. Opt out of sending performance data.",
        });

        client.console.update("monitor-loading", {
            "text": "Preparing to send data to matrix"
        });
        submitPoint(0);
    }

    // Create an API for data validation.
    if (enableApi) {
        const server = http.createServer((request, response) => {
            response.setHeader("Content-Type", "application/json");
            response.writeHead(200);
            response.end(
                JSON.stringify(package, (key, value) => {
                    if (key === "main") return undefined;
                    if (key === "scripts") return undefined;
                    if (key === "config") return undefined;
                    if (key === "dependencies") return undefined;
                    if (key === "devDependencies") return undefined;
                    if (key === "optionalDependencies") return undefined;
                    return value;
                })
            );
        });

        server.listen(port, () => {
            client.console.add("remote-monitor-loading", {
                "text": "Remote monitoring is now available at http://localhost:" + port + "/",
                "status": "non-spinnable"
            });
        });
    }
}