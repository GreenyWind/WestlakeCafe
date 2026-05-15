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
const apiKey = env.OPENAI_API_KEY ?? "";
const model = env.OPENAI_MODEL ?? "gpt-5.4";
const baseUrl = (env.OPENAI_BASE_URL ?? "https://api.openai.com/v1").replace(/\/+$/, "");
const endpoint = `${baseUrl}/responses`;

if (!apiKey) {
  console.error("OPENAI_API_KEY is empty. Fill it in .env before running this test.");
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
    instructions: "你是一个简洁的中文技术连通性测试助手。",
    input: "请只回复：AI provider connected.",
    reasoning: {
      effort: env.OPENAI_REASONING_EFFORT ?? "medium"
    },
    store: false,
    max_output_tokens: 200
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
const outputText =
  typeof data.output_text === "string"
    ? data.output_text
    : (data.output ?? [])
        .flatMap((item) => item.content ?? [])
        .map((content) => content.text)
        .filter(Boolean)
        .join("\n");

console.log(outputText || text.slice(0, 800));
