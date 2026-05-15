import fs from "node:fs";

function loadEnv() {
  if (!fs.existsSync(".env")) {
    return {};
  }

  return Object.fromEntries(
    fs
      .readFileSync(".env", "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=");
        const key = line.slice(0, index).trim();
        const value = line
          .slice(index + 1)
          .trim()
          .replace(/^"(.*)"$/, "$1");
        return [key, value];
      })
  );
}

const env = { ...process.env, ...loadEnv() };
const apiKey = env.AI_API_KEY || env.OPENAI_API_KEY || "";
const model = env.AI_MODEL || env.OPENAI_MODEL || "qwen-plus";
const baseUrl = (env.AI_BASE_URL || env.OPENAI_BASE_URL || "https://dashscope.aliyuncs.com/compatible-mode/v1").replace(
  /\/+$/,
  ""
);
const endpoint = `${baseUrl}/chat/completions`;

if (!apiKey) {
  console.error("AI_API_KEY is empty. Fill it in .env before running this test.");
  process.exit(1);
}

console.log(`Testing ${model} via ${endpoint}`);

const response = await fetch(endpoint, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model,
    messages: [
      {
        role: "system",
        content: "You are a concise API connectivity test assistant."
      },
      {
        role: "user",
        content: "Reply exactly: AI provider connected."
      }
    ],
    temperature: Number(env.AI_TEMPERATURE ?? 0.3),
    max_tokens: 80,
    stream: false
  }),
  signal: AbortSignal.timeout(Number(env.AI_TIMEOUT_MS ?? 60000))
});

const text = await response.text();

if (!response.ok) {
  console.error(`Request failed: HTTP ${response.status}`);
  console.error(text.slice(0, 800));
  process.exit(1);
}

const data = JSON.parse(text);
const content = data.choices?.[0]?.message?.content;
const outputText = Array.isArray(content)
  ? content
      .map((item) => item.text)
      .filter(Boolean)
      .join("\n")
  : content;

console.log(outputText || text.slice(0, 800));
