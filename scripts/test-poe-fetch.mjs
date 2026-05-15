import fs from "node:fs";

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

try {
  const response = await fetch("https://api.poe.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.POE_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.POE_MODEL,
      messages: [{ role: "user", content: "Say hello in Chinese." }],
      stream: false
    })
  });
  const body = await response.text();
  console.log(
    JSON.stringify({
      ok: response.ok,
      status: response.status,
      bodyPreview: body.slice(0, 160)
    })
  );
} catch (error) {
  console.log(
    JSON.stringify({
      ok: false,
      name: error?.name,
      message: error?.message,
      cause: error?.cause
        ? {
            code: error.cause.code,
            message: error.cause.message
          }
        : null
    })
  );
}
