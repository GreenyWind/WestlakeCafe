import { execFile } from "node:child_process";
import https from "node:https";
import { repository } from "@/lib/repository";
import type { AIQuestionResponse, AIPolishResponse, TopicDetail } from "@/lib/types";
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

function mockGuide(topic: TopicDetail) {
  const tags = topic.tags.map((tag) => tag.name).join("、") || "暂无 tag";

  return [
    `这个 topic 属于${topic.primaryDiscipline.name}，相关 tag 包括：${tags}。`,
    `外领域读者可以先抓住讨论主线：${truncate(topic.body, 260)}`,
    "建议从三个角度参与：它试图解决什么问题、使用了哪些关键概念、哪些假设可能需要其他领域的人来质疑。",
    "当前 AI 导读为 mock 版本。配置 AI_PROVIDER 后可调用真实模型。"
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
    "请为下面这个校内学术 topic 生成外领域读者可读的导读。",
    "输出结构必须包含：",
    "1. 这个 topic 在讨论什么",
    "2. 为什么值得讨论",
    "3. 外领域读者需要先知道的背景",
    "4. 关键概念解释",
    "5. 可以参与讨论的切入问题",
    "6. 需要谨慎看待的假设或争议点",
    "",
    topicContext(topic)
  ].join("\n");
}

function questionPrompt(topic: TopicDetail, question: string) {
  return [
    "Topic 上下文如下：",
    topicContext(topic),
    "",
    `用户问题：${question}`,
    "",
    "请回答，并尽量帮助外领域博士生理解。回答末尾给出 2-3 个可以继续追问的问题。"
  ].join("\n");
}

function polishPrompt(topic: TopicDetail, input: string) {
  return [
    "Topic 上下文如下：",
    topicContext(topic),
    "",
    "用户的粗略想法如下：",
    input,
    "",
    "请输出：",
    "1. 一段可直接发到讨论区的回复草稿",
    "2. 三条简短修改建议",
    "回复草稿要保持谦逊、具体、可回应。"
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

  throw new Error(`UNSUPPORTED_AI_PROVIDER:${AI_PROVIDER}`);
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
  return "你是一个帮助博士生跨领域阅读和讨论论文/问题的学术导读助手。请用中文回答，准确、克制，不编造来源。不要自称 AI。";
}

function systemQuestionPrompt() {
  return "你是一个常驻 topic 页面的学术问答助手。请主要基于用户提供的 topic 上下文回答；如果需要补充通用背景，请明确说明这是背景知识而不是帖子中出现的信息。用中文回答。";
}

function systemPolishPrompt() {
  return "你是一个帮助博士生把模糊直觉整理成清晰、礼貌、可讨论发言的写作助手。不要替用户夸大结论，不要编造证据。用中文回答。";
}

function isRealProvider() {
  return AI_PROVIDER === "poe" || AI_PROVIDER === "openai" || AI_PROVIDER === "openai-responses";
}

function modelLabel() {
  if (AI_PROVIDER === "poe") {
    return `poe:${POE_MODEL}`;
  }

  if (AI_PROVIDER === "openai" || AI_PROVIDER === "openai-responses") {
    return `openai-responses:${OPENAI_MODEL}`;
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

  async answerQuestion(topicId: string, question: string): Promise<AIQuestionResponse> {
    const topic = await repository.getTopicDetail(topicId);
    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    if (!isRealProvider()) {
      return mockAnswer(topic, question);
    }

    return {
      answer: await callModel(systemQuestionPrompt(), questionPrompt(topic, question), {
        maxTokens: 1400
      }),
      citations: ["topic.body", "topic.aiGuide", "topic.visibleReplies"]
    };
  },

  async polishReply(topicId: string, input: string): Promise<AIPolishResponse> {
    const topic = await repository.getTopicDetail(topicId);
    if (!topic) {
      throw new Error("TOPIC_NOT_FOUND");
    }

    if (!isRealProvider()) {
      return mockPolish(topic, input);
    }

    return {
      polished: await callModel(systemPolishPrompt(), polishPrompt(topic, input), {
        maxTokens: 1200
      }),
      suggestions: [
        "检查是否准确表达了你的不确定性。",
        "必要时补一句自己的学科背景。",
        "发布前删掉不想公开的个人化表述。"
      ]
    };
  }
};
