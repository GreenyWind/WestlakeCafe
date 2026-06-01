import { execFile } from "node:child_process";
import https from "node:https";
import { repository } from "@/lib/repository";
import type {
  AIChatMode,
  AIChatResponse,
  AIConversationMessage,
  AIQuestionResponse,
  AIPolishResponse,
  TopicDetail
} from "@/lib/types";
import { truncate } from "@/lib/utils";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type PoeChatCompletion = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type ChatCompletionsResult = {
  choices?: Array<{
    message?: {
      content?: string | Array<{ text?: string; type?: string }>;
    };
  }>;
};

type ChatCompletionsStreamChunk = {
  choices?: Array<{
    delta?: {
      content?: string | Array<{ text?: string; type?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
};

type ResponsesAPIResult = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
};

const AI_PROVIDER = (process.env.AI_PROVIDER ?? "mock").toLowerCase();
const AI_TIMEOUT_MS = Number(process.env.AI_TIMEOUT_MS ?? 60000);

const POE_API_KEY = process.env.POE_API_KEY ?? "";
const POE_MODEL = process.env.POE_MODEL ?? "Claude-Sonnet-4.6";
const POE_BASE_URL = process.env.POE_BASE_URL ?? "https://api.poe.com/v1";
const POE_TRANSPORT = process.env.POE_TRANSPORT ?? "https";

const CHAT_API_KEY = process.env.AI_API_KEY ?? process.env.OPENAI_API_KEY ?? "";
const CHAT_MODEL = process.env.AI_MODEL ?? process.env.OPENAI_MODEL ?? "qwen-plus";
const CHAT_FAST_MODEL = process.env.AI_FAST_MODEL ?? "qwen-turbo";
const CHAT_QUALITY_MODEL = process.env.AI_QUALITY_MODEL ?? CHAT_MODEL;
const CHAT_BASE_URL =
  process.env.AI_BASE_URL ?? process.env.OPENAI_BASE_URL ?? "https://dashscope.aliyuncs.com/compatible-mode/v1";
const CHAT_TEMPERATURE = Number(process.env.AI_TEMPERATURE ?? 0.4);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-5.4";
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";
const OPENAI_REASONING_EFFORT = process.env.OPENAI_REASONING_EFFORT ?? "medium";
const OPENAI_DISABLE_RESPONSE_STORAGE = process.env.OPENAI_DISABLE_RESPONSE_STORAGE ?? "true";

function topicContext(topic: TopicDetail) {
  const tags = topic.tags.map((tag) => tag.name).join("、") || "暂无 tag";
  const visibleReplies = topic.replies
    .filter((reply) => !reply.deletedAt)
    .slice(-8)
    .map((reply, index) => `${index + 1}. ${reply.author.name}: ${truncate(reply.body, 260)}`)
    .join("\n");

  return [
    `标题：${topic.title}`,
    `类型：${topic.type}`,
    `主学科：${topic.primaryDiscipline.name}`,
    `标签：${tags}`,
    topic.paperTitle ? `论文标题：${topic.paperTitle}` : "",
    topic.paperUrl ? `论文链接：${topic.paperUrl}` : "",
    `正文：${truncate(topic.body, 2200)}`,
    visibleReplies ? `最近回复：\n${visibleReplies}` : "最近回复：暂无"
  ]
    .filter(Boolean)
    .join("\n");
}

function topicMainPostContext(topic: TopicDetail) {
  const tags = topic.tags.map((tag) => tag.name).join("、") || "暂无 tag";

  return [
    `标题：${topic.title}`,
    `类型：${topic.type}`,
    `主学科：${topic.primaryDiscipline.name}`,
    `标签：${tags}`,
    topic.paperTitle ? `论文标题：${topic.paperTitle}` : "",
    topic.paperUrl ? `论文链接：${topic.paperUrl}` : "",
    `主楼正文：${truncate(topic.body, 2600)}`
  ]
    .filter(Boolean)
    .join("\n");
}

function parseReplyReferences(input: string) {
  const result = new Set<number>();
  const patterns = [/@\s*(\d+)\s*楼/g, /#\s*(\d+)/g, /(?:^|[^\d])(\d+)\s*楼/g];

  for (const pattern of patterns) {
    for (const match of input.matchAll(pattern)) {
      const value = Number(match[1]);
      if (Number.isInteger(value) && value > 0) {
        result.add(value);
      }
    }
  }

  return Array.from(result).sort((a, b) => a - b);
}

function referencedRepliesContext(topic: TopicDetail, numbers: number[]) {
  const warnings: string[] = [];
  const included = numbers.flatMap((number) => {
    const reply = topic.replies[number - 1];

    if (!reply) {
      warnings.push(`${number}楼不存在，未加入上下文。`);
      return [];
    }

    if (reply.deletedAt) {
      warnings.push(`${number}楼已删除，未加入上下文。`);
      return [];
    }

    return [`${number}楼（${reply.author.name}）：${truncate(reply.body, 900)}`];
  });

  return {
    text: included.length ? included.join("\n\n") : "未引用具体楼层。",
    warnings
  };
}

function conversationContext(messages: AIConversationMessage[] = []) {
  if (!messages.length) {
    return "暂无历史对话";
  }

  return messages
    .slice(-10)
    .map((message, index) => {
      const speaker = message.role === "user" ? "用户" : "助手";
      return `${index + 1}. ${speaker}: ${truncate(message.content, 500)}`;
    })
    .join("\n");
}

function questionContext(topic: TopicDetail, messages: AIConversationMessage[], question: string) {
  return [
    "Topic 上下文如下：",
    topicContext(topic),
    "",
    "本页已有对话历史如下：",
    conversationContext(messages),
    "",
    `用户最新问题：${question}`,
    "",
    "请回答最新问题。要求：",
    "1. 优先基于 topic 正文、论文信息、AI 导读和已有回复回答。",
    "2. 如果使用通用背景知识，请明确说这是背景知识，不要说成帖子里已有的信息。",
    "3. 面向外领域博士生，先解释关键概念，再给判断或讨论方向。",
    "4. 结尾给出 2 个自然的继续追问方向。"
  ].join("\n");
}

function chatPrompt(topic: TopicDetail, input: string, messages: AIConversationMessage[], mode: AIChatMode) {
  const referencedReplyNumbers = parseReplyReferences(input);
  const referenced = referencedRepliesContext(topic, referencedReplyNumbers);
  const history = conversationContext(messages);

  if (mode === "ask") {
    return {
      prompt: [
        "Topic 主楼上下文如下：",
        topicMainPostContext(topic),
        "",
        "本页 AI 对话历史如下：",
        history,
        "",
        `用户最新问题：${input}`,
        "",
        "请回答用户的问题，重点帮助跨领域或刚进入该领域的读者理解专业术语、方法名、研究背景和概念边界。"
      ].join("\n"),
      referencedReplyNumbers,
      warnings: referenced.warnings
    };
  }

  if (mode === "clarify") {
    return {
      prompt: [
        "Topic 主楼上下文如下：",
        topicMainPostContext(topic),
        "",
        "用户引用的楼层如下：",
        referenced.text,
        "",
        "本页 AI 对话历史如下：",
        history,
        "",
        `用户最新想法：${input}`,
        "",
        "请帮助用户澄清想法。不要直接生成最终回复。"
      ].join("\n"),
      referencedReplyNumbers,
      warnings: referenced.warnings
    };
  }

  return {
    prompt: [
      "本页 AI 对话历史如下：",
      history,
      "",
      `用户最新要求：${input}`,
      "",
      "请主要基于上述 AI 对话历史，生成一段可以发布到讨论区的中文回复。必要时参考下面的 topic 主楼以避免脱离语境：",
      topicMainPostContext(topic)
    ].join("\n"),
    referencedReplyNumbers,
    warnings: referenced.warnings
  };
}

function draftingContext(topic: TopicDetail, messages: AIConversationMessage[], input: string, mode: "clarify" | "draft") {
  const shared = [
    "Topic 上下文如下：",
    topicContext(topic),
    "",
    "用户与助手关于如何发言的已有讨论如下：",
    conversationContext(messages),
    "",
    `用户最新补充：${input}`,
    ""
  ];

  if (mode === "clarify") {
    return [
      ...shared,
      "请先帮助用户澄清想法，而不是直接代写最终回复。要求：",
      "1. 用 2-4 句总结你理解到的用户观点。",
      "2. 指出还需要澄清的关键前提、概念或证据。",
      "3. 提出 2-3 个具体追问，帮助用户把直觉变成可讨论的问题。",
      "4. 不要编造论文中没有的信息。"
    ].join("\n");
  }

  return [
    ...shared,
    "请根据 topic 和这段讨论，生成一段可以发布到讨论区的中文回复。要求：",
    "1. 第一段说明自己的理解或问题，语气谦逊。",
    "2. 第二段提出一个具体、可回应的观点/疑问/补充视角。",
    "3. 如有必要，说明哪些地方仍不确定。",
    "4. 不要夸大结论，不要编造证据，不要写成 AI 代笔口吻。",
    "5. 输出末尾另起一行写「可再检查：」，列出 2-3 个发布前检查点。"
  ].join("\n");
}

function mockGuide(topic: TopicDetail) {
  const tags = topic.tags.map((tag) => tag.name).join("、") || "暂无 tag";

  return [
    "## 术语解释",
    `这个 topic 属于${topic.primaryDiscipline.name}，相关 tag 包括：${tags}。`,
    "## 一句话摘要",
    `讨论主线可以先概括为：${truncate(topic.body, 180)}`,
    "## 展开解释",
    "先判断发帖人关心的是研究问题、方法、评价指标、机制解释，还是应用边界。"
  ].join("\n\n");
}

function mockAnswer(topic: TopicDetail, question: string): AIQuestionResponse {
  return {
    answer: [
      `我会先基于当前 topic 来回答。这个讨论的核心是「${topic.title}」。`,
      `你的问题是：「${question}」`,
      `一个低门槛切入方式是：先把它放回 ${topic.primaryDiscipline.name} 的语境中，看发帖人真正关心的是机制、方法、评价指标还是应用边界。`,
      "如果你来自外领域，可以继续追问：这里的关键术语是什么意思、它和我熟悉的方法有什么相似/不同、这个结论依赖哪些假设。"
    ].join("\n\n"),
    citations: ["topic.body", "topic.aiGuide", "topic.recentReplies"]
  };
}

function mockPolish(topic: TopicDetail, input: string): AIPolishResponse {
  return {
    polished: [
      "我有一个可能的外领域视角，想先确认自己的理解是否准确。",
      `针对「${topic.title}」，我目前的直觉是：${input}`,
      "如果这个理解成立，或许可以进一步讨论它依赖的前提、可能失效的场景，以及是否有更直接的实验或数据能够区分不同解释。"
    ].join("\n\n"),
    suggestions: [
      "先说明自己的学科背景，降低误解成本。",
      "把直觉改写成可回应的问题。",
      "避免直接评价论文质量，优先指出想确认的假设。"
    ]
  };
}

function guidePrompt(topic: TopicDetail) {
  return [
    "请为下面这个校内学术 topic 生成一份简短的外领域读者概览。",
    "目标是降低跨领域阅读门槛，不要评价论文质量，不要猜测论文里没有的信息。",
    "",
    "请严格按下面结构输出：",
    "## 术语解释",
    "解释 3-5 个理解主楼必需的术语或背景。每个解释 1-2 句，优先解释帖子里真的出现的词。",
    "",
    "## 一句话摘要",
    "用 1-2 句话概括这个 topic 想讨论什么。",
    "",
    "## 展开解释",
    "用 3-5 条短 bullet 解释主楼的讨论背景、问题焦点和为什么外领域读者可能会关心。",
    "",
    topicContext(topic)
  ].join("\n");
}

async function callModel(system: string, user: string, options?: { maxTokens?: number; model?: string }) {
  if (AI_PROVIDER === "poe") {
    return callPoe(
      [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      { maxTokens: options?.maxTokens }
    );
  }

  if (AI_PROVIDER === "openai-responses" || AI_PROVIDER === "openai") {
    return callOpenAIResponses(system, user, { maxTokens: options?.maxTokens });
  }

  if (
    AI_PROVIDER === "openai-chat-compatible" ||
    AI_PROVIDER === "chat-completions" ||
    AI_PROVIDER === "dashscope" ||
    AI_PROVIDER === "deepseek" ||
    AI_PROVIDER === "siliconflow"
  ) {
    return callChatCompletions(system, user, { maxTokens: options?.maxTokens, model: options?.model });
  }

  throw new Error(`UNSUPPORTED_AI_PROVIDER:${AI_PROVIDER}`);
}

async function* streamModel(system: string, user: string, options?: { maxTokens?: number; model?: string }) {
  if (
    AI_PROVIDER === "openai-chat-compatible" ||
    AI_PROVIDER === "chat-completions" ||
    AI_PROVIDER === "dashscope" ||
    AI_PROVIDER === "deepseek" ||
    AI_PROVIDER === "siliconflow"
  ) {
    yield* callChatCompletionsStream(system, user, { maxTokens: options?.maxTokens, model: options?.model });
    return;
  }

  const output = await callModel(system, user, options);

  for (const chunk of chunkText(output)) {
    yield chunk;
  }
}

function chatCompletionsEndpoint() {
  return `${CHAT_BASE_URL.replace(/\/+$/, "")}/chat/completions`;
}

async function callChatCompletions(system: string, user: string, options?: { maxTokens?: number; model?: string }) {
  if (!CHAT_API_KEY) {
    throw new Error("AI_API_KEY_MISSING");
  }

  const requestBody: Record<string, unknown> = {
    model: options?.model ?? CHAT_MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    temperature: CHAT_TEMPERATURE,
    stream: false
  };

  if (options?.maxTokens) {
    requestBody.max_tokens = options.maxTokens;
  }

  const response = await fetch(chatCompletionsEndpoint(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CHAT_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(AI_TIMEOUT_MS)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`AI_CHAT_COMPLETIONS_ERROR:${response.status}:${truncate(text, 300)}`);
  }

  const data = JSON.parse(text) as ChatCompletionsResult;
  const outputText = extractChatCompletionsText(data);

  if (!outputText) {
    throw new Error(`AI_CHAT_COMPLETIONS_EMPTY_RESPONSE:${truncate(text, 300)}`);
  }

  return outputText;
}

async function* callChatCompletionsStream(
  system: string,
  user: string,
  options?: { maxTokens?: number; model?: string }
) {
  if (!CHAT_API_KEY) {
    throw new Error("AI_API_KEY_MISSING");
  }

  const requestBody: Record<string, unknown> = {
    model: options?.model ?? CHAT_MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user }
    ],
    temperature: CHAT_TEMPERATURE,
    stream: true
  };

  if (options?.maxTokens) {
    requestBody.max_tokens = options.maxTokens;
  }

  const response = await fetch(chatCompletionsEndpoint(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CHAT_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(AI_TIMEOUT_MS)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`AI_CHAT_COMPLETIONS_ERROR:${response.status}:${truncate(text, 300)}`);
  }

  if (!response.body) {
    throw new Error("AI_CHAT_COMPLETIONS_STREAM_UNAVAILABLE");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const chunk = parseChatCompletionsStreamLine(line);

      if (chunk === "[DONE]") {
        return;
      }

      if (chunk) {
        yield chunk;
      }
    }
  }

  buffer += decoder.decode();

  if (buffer.trim()) {
    const chunk = parseChatCompletionsStreamLine(buffer);

    if (chunk && chunk !== "[DONE]") {
      yield chunk;
    }
  }
}

function parseChatCompletionsStreamLine(line: string) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith(":")) {
    return "";
  }

  const payload = trimmed.startsWith("data:") ? trimmed.slice(5).trim() : trimmed;

  if (!payload) {
    return "";
  }

  if (payload === "[DONE]") {
    return "[DONE]" as const;
  }

  const data = JSON.parse(payload) as ChatCompletionsStreamChunk;

  if (data.error?.message) {
    throw new Error(`AI_CHAT_COMPLETIONS_STREAM_ERROR:${truncate(data.error.message, 300)}`);
  }

  return extractChatCompletionsDeltaText(data);
}

function extractChatCompletionsDeltaText(data: ChatCompletionsStreamChunk) {
  const content = data.choices?.[0]?.delta?.content;

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => item.text)
      .filter((value): value is string => Boolean(value))
      .join("");
  }

  return "";
}

function extractChatCompletionsText(data: ChatCompletionsResult) {
  const content = data.choices?.[0]?.message?.content;

  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => item.text)
      .filter((value): value is string => Boolean(value))
      .join("\n")
      .trim();
  }

  return "";
}

function chunkText(value: string) {
  const chunks: string[] = [];

  for (let index = 0; index < value.length; index += 18) {
    chunks.push(value.slice(index, index + 18));
  }

  return chunks;
}

function openAIResponsesEndpoint() {
  return `${OPENAI_BASE_URL.replace(/\/+$/, "")}/responses`;
}

async function callOpenAIResponses(system: string, user: string, options?: { maxTokens?: number }) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY_MISSING");
  }

  const requestBody: Record<string, unknown> = {
    model: OPENAI_MODEL,
    instructions: system,
    input: user,
    reasoning: {
      effort: OPENAI_REASONING_EFFORT
    },
    store: OPENAI_DISABLE_RESPONSE_STORAGE.toLowerCase() !== "true"
  };

  if (options?.maxTokens) {
    requestBody.max_output_tokens = options.maxTokens;
  }

  const response = await fetch(openAIResponsesEndpoint(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(requestBody),
    signal: AbortSignal.timeout(AI_TIMEOUT_MS)
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`OPENAI_RESPONSES_ERROR:${response.status}:${truncate(text, 300)}`);
  }

  const data = JSON.parse(text) as ResponsesAPIResult;
  const outputText = extractResponsesText(data);

  if (!outputText) {
    throw new Error(`OPENAI_EMPTY_RESPONSE:${truncate(text, 300)}`);
  }

  return outputText;
}

function extractResponsesText(data: ResponsesAPIResult) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const text = data.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .filter((value): value is string => Boolean(value))
    .join("\n")
    .trim();

  return text || "";
}

async function callPoe(messages: ChatMessage[], options?: { temperature?: number; maxTokens?: number }) {
  if (!POE_API_KEY) {
    throw new Error("POE_API_KEY_MISSING");
  }

  const data = await postPoeChatCompletion({
    model: POE_MODEL,
    messages,
    temperature: options?.temperature ?? 0.3,
    max_tokens: options?.maxTokens ?? 1200,
    stream: false
  });
  const content = data.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("POE_EMPTY_RESPONSE");
  }

  return content;
}

async function postPoeChatCompletion(payload: unknown): Promise<PoeChatCompletion> {
  if (POE_TRANSPORT.toLowerCase() === "powershell") {
    return postPoeWithPowerShell(payload);
  }

  const url = new URL(`${POE_BASE_URL}/chat/completions`);
  const body = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port || 443,
        path: `${url.pathname}${url.search}`,
        method: "POST",
        family: 4,
        headers: {
          Authorization: `Bearer ${POE_API_KEY}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
        },
        timeout: AI_TIMEOUT_MS
      },
      (response) => {
        const chunks: Buffer[] = [];

        response.on("data", (chunk) => {
          chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
        });

        response.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");

          if (!response.statusCode || response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`POE_API_ERROR:${response.statusCode}:${truncate(text, 300)}`));
            return;
          }

          try {
            resolve(JSON.parse(text) as PoeChatCompletion);
          } catch {
            reject(new Error(`POE_INVALID_JSON:${truncate(text, 300)}`));
          }
        });
      }
    );

    request.on("timeout", () => {
      request.destroy(new Error(`POE_TIMEOUT:${AI_TIMEOUT_MS}`));
    });

    request.on("error", (error) => {
      reject(new Error(`POE_NETWORK_ERROR:${error.message}`));
    });

    request.write(body);
    request.end();
  });
}

async function postPoeWithPowerShell(payload: unknown): Promise<PoeChatCompletion> {
  const body = JSON.stringify(payload);
  const encodedBody = Buffer.from(body, "utf8").toString("base64");
  const encodedKey = Buffer.from(POE_API_KEY, "utf16le").toString("base64");
  const encodedUrl = Buffer.from(`${POE_BASE_URL}/chat/completions`, "utf16le").toString("base64");
  const script = `
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
try {
  $body = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('${encodedBody}'))
  $key = [System.Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('${encodedKey}'))
  $url = [System.Text.Encoding]::Unicode.GetString([Convert]::FromBase64String('${encodedUrl}'))
  $bodyBytes = [System.Text.Encoding]::UTF8.GetBytes($body)
  [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
  $request = [System.Net.HttpWebRequest]::Create($url)
  $request.Method = "POST"
  $request.Timeout = ${AI_TIMEOUT_MS}
  $request.ReadWriteTimeout = ${AI_TIMEOUT_MS}
  $request.ContentType = "application/json; charset=utf-8"
  $request.Headers.Add("Authorization", "Bearer $key")
  $request.ContentLength = $bodyBytes.Length
  $stream = $request.GetRequestStream()
  $stream.Write($bodyBytes, 0, $bodyBytes.Length)
  $stream.Close()
  $response = $request.GetResponse()
  $responseStream = $response.GetResponseStream()
  $memory = New-Object System.IO.MemoryStream
  $responseStream.CopyTo($memory)
  $response.Close()
  [Console]::Out.Write("OK:" + [Convert]::ToBase64String($memory.ToArray()))
} catch {
  $status = $null
  $bodyText = ""
  if ($_.Exception.Response) {
    try {
      $status = [int]$_.Exception.Response.StatusCode
      $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream(), [System.Text.Encoding]::UTF8)
      $bodyText = $reader.ReadToEnd()
    } catch {}
  }
  $errorObject = @{ status = $status; message = $_.Exception.Message; body = $bodyText } | ConvertTo-Json -Compress
  [Console]::Out.Write("ERR:" + [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($errorObject)))
}
`;

  const encodedScript = Buffer.from(script, "utf16le").toString("base64");

  return new Promise((resolve, reject) => {
    execFile(
      "powershell.exe",
      ["-NoProfile", "-ExecutionPolicy", "Bypass", "-EncodedCommand", encodedScript],
      {
        timeout: AI_TIMEOUT_MS + 5000,
        encoding: "utf8",
        windowsHide: true,
        maxBuffer: 1024 * 1024 * 4
      },
      (error, stdout, stderr) => {
        if (error) {
          const cleanStderr = stderr.startsWith("#< CLIXML") ? "" : stderr;
          reject(new Error(`POE_POWERSHELL_ERROR:${truncate(cleanStderr || "PowerShell process failed", 300)}`));
          return;
        }

        const output = stdout.trim();

        if (output.startsWith("ERR:")) {
          const errorText = Buffer.from(output.slice(4), "base64").toString("utf8");
          reject(new Error(`POE_POWERSHELL_ERROR:${truncate(errorText, 300)}`));
          return;
        }

        if (!output.startsWith("OK:")) {
          reject(new Error(`POE_POWERSHELL_INVALID_OUTPUT:${truncate(output, 300)}`));
          return;
        }

        const decodedStdout = Buffer.from(output.slice(3), "base64").toString("utf8");

        try {
          resolve(JSON.parse(decodedStdout) as PoeChatCompletion);
        } catch {
          reject(new Error(`POE_POWERSHELL_INVALID_JSON:${truncate(decodedStdout, 300)}`));
        }
      }
    );
  });
}

function systemGuidePrompt() {
  return "你是一个帮助博士生跨领域阅读和讨论论文/问题的学术摘要助手。请用中文回答，准确、克制、结构清晰。只基于给定 topic 和明确标注的通用背景知识回答；不要编造论文细节，不要自称 AI。";
}

function systemQuestionPrompt() {
  return "你是 topic 页面里的跨领域学术解释助手。优先帮助用户理解专业术语、研究背景、方法名和概念边界。请先判断术语在当前 topic 所属领域中的含义，不要脱离学科语境泛泛解释。如果帖子信息不足，请明确说明不确定，并给出可能的理解分支。用中文回答。";
}

function systemClarifyPrompt() {
  return "你是帮助博士生澄清发言思路的学术讨论伙伴。请基于主楼和用户引用的楼层理解讨论语境，先复述用户想表达的直觉，再指出其中需要澄清的概念、假设、证据或对象，最后提出 2-3 个具体追问，帮助用户把想法收束成可讨论的问题。用中文回答。";
}

function systemDraftPrompt() {
  return "你是帮助用户把已有讨论整理成可发布回复的学术写作助手。请主要基于用户与助手的对话历史生成回复，语气谦逊、具体、可回应。不要替用户夸大结论，不要编造证据。如有不确定之处，请在回复中自然表达。用中文回答。";
}

function systemPolishPrompt() {
  return systemClarifyPrompt();
}

function isRealProvider() {
  return (
    AI_PROVIDER === "poe" ||
    AI_PROVIDER === "openai" ||
    AI_PROVIDER === "openai-responses" ||
    AI_PROVIDER === "openai-chat-compatible" ||
    AI_PROVIDER === "chat-completions" ||
    AI_PROVIDER === "dashscope" ||
    AI_PROVIDER === "deepseek" ||
    AI_PROVIDER === "siliconflow"
  );
}

function modelLabel() {
  if (AI_PROVIDER === "poe") {
    return `poe:${POE_MODEL}`;
  }

  if (AI_PROVIDER === "openai" || AI_PROVIDER === "openai-responses") {
    return `openai-responses:${OPENAI_MODEL}`;
  }

  if (
    AI_PROVIDER === "openai-chat-compatible" ||
    AI_PROVIDER === "chat-completions" ||
    AI_PROVIDER === "dashscope" ||
    AI_PROVIDER === "deepseek" ||
    AI_PROVIDER === "siliconflow"
  ) {
    return `chat-completions:${CHAT_MODEL}`;
  }

  return "mock-guide-v1";
}

function modelLabelFor(model: string) {
  if (
    AI_PROVIDER === "openai-chat-compatible" ||
    AI_PROVIDER === "chat-completions" ||
    AI_PROVIDER === "dashscope" ||
    AI_PROVIDER === "deepseek" ||
    AI_PROVIDER === "siliconflow"
  ) {
    return `chat-completions:${model}`;
  }

  return modelLabel();
}

export const aiService = {
  async generateTopicGuide(topicId: string, options: { persist?: boolean } = {}) {
    const topic = await repository.getTopicDetail(topicId, { incrementView: false });
    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    const persist = options.persist ?? true;
    const guideModel = CHAT_QUALITY_MODEL;
    const content = isRealProvider()
      ? await callModel(systemGuidePrompt(), guidePrompt(topic), { maxTokens: 1600, model: guideModel })
      : mockGuide(topic);

    if (!persist) {
      return {
        id: "temporary",
        topicId,
        content,
        model: modelLabelFor(guideModel),
        status: "COMPLETED" as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }

    return repository.upsertAIGuide(topicId, content, modelLabelFor(guideModel));
  },

  async streamTopicGuide(topicId: string) {
    const topic = await repository.getTopicDetail(topicId, { incrementView: false });
    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    const guideModel = CHAT_QUALITY_MODEL;
    const stream = isRealProvider()
      ? streamModel(systemGuidePrompt(), guidePrompt(topic), { maxTokens: 1600, model: guideModel })
      : (async function* () {
          for (const chunk of chunkText(mockGuide(topic))) {
            yield chunk;
          }
        })();

    return {
      model: modelLabelFor(guideModel),
      stream
    };
  },

  async markTopicGuideFailed(topicId: string) {
    await repository.markAIGuideFailed(topicId);
  },

  async chat(
    topicId: string,
    input: string,
    mode: AIChatMode,
    messages: AIConversationMessage[] = []
  ): Promise<AIChatResponse> {
    const topic = await repository.getTopicDetail(topicId, { incrementView: false });
    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    const { prompt, referencedReplyNumbers, warnings } = chatPrompt(topic, input, messages, mode);

    if (!isRealProvider()) {
      const mock =
        mode === "ask"
          ? mockAnswer(topic, input).answer
          : mockPolish(topic, input).polished;
      return {
        message: mock,
        mode,
        referencedReplyNumbers,
        warnings
      };
    }

    const system =
      mode === "ask" ? systemQuestionPrompt() : mode === "clarify" ? systemClarifyPrompt() : systemDraftPrompt();
    const model = mode === "draft" ? CHAT_QUALITY_MODEL : CHAT_FAST_MODEL;

    return {
      message: await callModel(system, prompt, {
        maxTokens: mode === "draft" ? 1400 : 1000,
        model
      }),
      mode,
      referencedReplyNumbers,
      warnings
    };
  },

  async streamChat(
    topicId: string,
    input: string,
    mode: AIChatMode,
    messages: AIConversationMessage[] = []
  ) {
    const topic = await repository.getTopicDetail(topicId, { incrementView: false });
    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    const { prompt, referencedReplyNumbers, warnings } = chatPrompt(topic, input, messages, mode);

    if (!isRealProvider()) {
      const mock =
        mode === "ask"
          ? mockAnswer(topic, input).answer
          : mockPolish(topic, input).polished;
      return {
        mode,
        referencedReplyNumbers,
        warnings,
        stream: (async function* () {
          for (const chunk of chunkText(mock)) {
            yield chunk;
          }
        })()
      };
    }

    const system =
      mode === "ask" ? systemQuestionPrompt() : mode === "clarify" ? systemClarifyPrompt() : systemDraftPrompt();
    const model = mode === "draft" ? CHAT_QUALITY_MODEL : CHAT_FAST_MODEL;

    return {
      mode,
      referencedReplyNumbers,
      warnings,
      stream: streamModel(system, prompt, {
        maxTokens: mode === "draft" ? 1400 : 1000,
        model
      })
    };
  },

  async answerQuestion(
    topicId: string,
    question: string,
    messages: AIConversationMessage[] = []
  ): Promise<AIQuestionResponse> {
    const topic = await repository.getTopicDetail(topicId, { incrementView: false });
    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    if (!isRealProvider()) {
      return mockAnswer(topic, question);
    }

    return {
      answer: await callModel(systemQuestionPrompt(), questionContext(topic, messages, question), {
        maxTokens: 1400
      }),
      citations: ["topic.body", "topic.aiGuide", "topic.visibleReplies"]
    };
  },

  async polishReply(
    topicId: string,
    input: string,
    messages: AIConversationMessage[] = [],
    mode: "clarify" | "draft" = "clarify"
  ): Promise<AIPolishResponse> {
    const topic = await repository.getTopicDetail(topicId, { incrementView: false });
    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    if (!isRealProvider()) {
      return mockPolish(topic, input);
    }

    return {
      polished: await callModel(systemPolishPrompt(), draftingContext(topic, messages, input, mode), {
        maxTokens: mode === "draft" ? 1400 : 1000
      }),
      suggestions:
        mode === "draft"
          ? [
              "检查是否准确表达了你的不确定性。",
              "必要时补一句自己的学科背景。",
              "发布前删掉不想公开的个人化表述。"
            ]
          : [
              "先补充你最想表达的判断或疑问。",
              "说明你不确定的点，方便 AI 帮你收束。",
              "澄清后再生成正式回复草稿。"
            ]
    };
  }
};
