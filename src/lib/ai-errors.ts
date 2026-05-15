export function publicAIErrorMessage(error: unknown, fallback: string) {
  if (!(error instanceof Error)) {
    return fallback;
  }

  if (error.message === "POE_API_KEY_MISSING") {
    return "Poe API key 未配置，请先在 .env 中填写 POE_API_KEY。";
  }

  if (error.message === "OPENAI_API_KEY_MISSING") {
    return "OpenAI-compatible API key 未配置，请先在 .env 中填写 OPENAI_API_KEY。";
  }

  if (process.env.NODE_ENV === "development") {
    return `${fallback}（开发调试：${error.message}）`;
  }

  return fallback;
}
