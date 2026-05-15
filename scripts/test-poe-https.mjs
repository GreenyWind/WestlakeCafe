import fs from "node:fs";
import https from "node:https";

const text = fs.readFileSync(".env", "utf8");
const env = Object.fromEntries(
  text
    .split(/\r?\n/)
    .filter((line) => line.includes("="))
    .map((line) => {
      const [key, ...rest] = line.split("=");
      return [key, rest.join("=").replace(/^"|"$/g, "")];
    })
);

const body = JSON.stringify({
  model: env.POE_MODEL,
  messages: [{ role: "user", content: "Say hello in Chinese." }],
  stream: false
});

const result = await new Promise((resolve) => {
  const request = https.request(
    {
      protocol: "https:",
      hostname: "api.poe.com",
      port: 443,
      path: "/v1/chat/completions",
      method: "POST",
      family: 4,
      headers: {
        Authorization: `Bearer ${env.POE_API_KEY}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      },
      timeout: 60000
    },
    (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
      response.on("end", () => {
        resolve({
          ok: response.statusCode >= 200 && response.statusCode < 300,
          status: response.statusCode,
          bodyPreview: Buffer.concat(chunks).toString("utf8").slice(0, 160)
        });
      });
    }
  );

  request.on("timeout", () => {
    request.destroy(new Error("timeout"));
  });
  request.on("error", (error) => {
    resolve({
      ok: false,
      name: error.name,
      message: error.message,
      code: error.code
    });
  });
  request.write(body);
  request.end();
});

console.log(JSON.stringify(result));
