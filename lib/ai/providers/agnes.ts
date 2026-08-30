import type { AIGenerateRequest, AIGenerateResponse, AIProvider } from "../types";
import { AIProviderConfigError, AIProviderError } from "../errors";

const AGNES_ENDPOINT =
  process.env.AGNES_API_URL ?? "https://api.agnes-ai.com/api/v1/chat/completions";
const REQUEST_TIMEOUT_MS = 60_000;

interface AgnesResponse {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
    total_tokens?: number;
  };
  error?: { message?: string };
}

export const agnesProvider: AIProvider = {
  name: "agnes",
  defaultModel: process.env.AGNES_MODEL ?? "agnes",

  async generate(request: AIGenerateRequest): Promise<AIGenerateResponse> {
    const apiKey = process.env.AGNES_API_KEY;
    if (!apiKey) {
      throw new AIProviderConfigError("AGNES_API_KEY is not configured.");
    }

    const model = request.model ?? this.defaultModel;
    const body: Record<string, unknown> = {
      model,
      messages: request.messages,
    };
    if (request.temperature !== undefined) body.temperature = request.temperature;
    if (request.maxTokens !== undefined) body.max_tokens = request.maxTokens;

    const res = await fetch(AGNES_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!res.ok) {
      const detail = (await res.text()).slice(0, 500);
      throw new AIProviderError(`Agnes AI API error (${res.status}): ${detail}`);
    }

    const data = (await res.json()) as AgnesResponse;
    if (data.error?.message) {
      throw new AIProviderError(`Agnes AI API error: ${data.error.message}`);
    }

    return {
      provider: "agnes",
      model,
      content: data.choices?.[0]?.message?.content ?? "",
      usage: {
        promptTokens: data.usage?.prompt_tokens ?? 0,
        completionTokens: data.usage?.completion_tokens ?? 0,
        totalTokens: data.usage?.total_tokens ?? 0,
      },
    };
  },
};
