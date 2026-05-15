import { execFile } from "node:child_process";
import https from "node:https";
import { repository } from "@/lib/repository";
import type { AIConversationMessage, AIQuestionResponse, AIPolishResponse, TopicDetail } from "@/lib/types";
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
    `## 摘要`,
    `这个 topic 属于${topic.primaryDiscipline.name}，相关 tag 包括：${tags}。讨论主线可以先概括为：${truncate(topic.body, 260)}`,
    "## 外领域读者先看什么",
    "先判断发帖人关心的是研究问题、方法、评价指标、机制解释，还是应用边界。",
    "## 可以怎么参与",
    "可以围绕关键概念、隐含假设、证据强度、跨领域类比这几个角度提出问题。"
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
    "请为下面这个校内学术 topic 生成一份外领域博士生可读的摘要和讨论导读。",
    "目标不是宣传这个 topic，而是降低跨领域参与门槛。",
    "",
    "请严格按下面结构输出：",
    "## 一句话摘要",
    "用 1-2 句话概括这个 topic 想讨论什么。",
    "",
    "## 讨论脉络",
    "用 3-5 条短 bullet 说明：研究/问题背景、发帖人关心的核心点、已有回复里出现的方向。",
    "",
    "## 外领域读者需要补的背景",
    "解释 3-5 个必要概念。不要假装读过论文全文，只能基于 topic 和通用背景知识。",
    "",
    "## 可能值得追问",
    "给出 3-5 个可直接拿去参与讨论的问题。",
    "",
    "## 需要谨慎的地方",
    "列出哪些判断依赖原文、数据或领域知识，目前仅凭帖子不能确定。",
    "",
    topicContext(topic)
  ].join("\n");
}

async function callModel(system: string, user: string, options?: { maxTokens?: number }) {
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
    return callChatCompletions(system, user, { maxTokens: options?.maxTokens });
  }

  throw new Error(`UNSUPPORTED_AI_PROVIDER:${AI_PROVIDER}`);
}

function chatCompletionsEndpoint() {
  return `${CHAT_BASE_URL.replace(/\/+$/, "")}/chat/completions`;
}

async function callChatCompletions(system: string, user: string, options?: { maxTokens?: number }) {
  if (!CHAT_API_KEY) {
    throw new Error("AI_API_KEY_MISSING");
  }

  const requestBody: Record<string, unknown> = {
    model: CHAT_MODEL,
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
  return "你是一个常驻 topic 页面的学术问答助手。请跟随用户连续提问，主要基于 topic 上下文回答；如果需要补充通用背景，请明确说明这是背景知识而不是帖子中出现的信息。用中文回答，避免空泛鼓励。";
}

function systemPolishPrompt() {
  return "你是一个帮助博士生把模糊直觉澄清成清晰、礼貌、可讨论发言的学术写作伙伴。先追问和澄清，再在用户需要时形成回复草稿。不要替用户夸大结论，不要编造证据。用中文回答。";
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

export const aiService = {
  async generateTopicGuide(topicId: string) {
    const topic = await repository.getTopicDetail(topicId);
    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    const content = isRealProvider()
      ? await callModel(systemGuidePrompt(), guidePrompt(topic), { maxTokens: 1600 })
      : mockGuide(topic);

    return repository.upsertAIGuide(topicId, content, modelLabel());
  },

  async answerQuestion(
    topicId: string,
    question: string,
    messages: AIConversationMessage[] = []
  ): Promise<AIQuestionResponse> {
    const topic = await repository.getTopicDetail(topicId);
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
    const topic = await repository.getTopicDetail(topicId);
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
