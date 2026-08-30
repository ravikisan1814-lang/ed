import type {
  AIGenerateRequest,
  AIGenerateResponse,
  AIProvider,
  AIProviderName,
} from "./types";
import { AIProviderError } from "./errors";
import { agnesProvider } from "./providers/agnes";

export * from "./types";
export * from "./errors";

/** Registry of available providers. Add new providers here to expose them. */
export const AI_PROVIDERS: Record<AIProviderName, AIProvider> = {
  agnes: agnesProvider,
};

export const AI_PROVIDER_NAMES = Object.keys(AI_PROVIDERS) as AIProviderName[];

function resolveProvider(request: AIGenerateRequest): AIProvider {
  const name = (request.provider ?? process.env.AI_DEFAULT_PROVIDER ?? "agnes") as AIProviderName;
  const provider = AI_PROVIDERS[name];
  if (!provider) {
    throw new AIProviderError(
      `Unknown provider "${String(name)}". Available: ${AI_PROVIDER_NAMES.join(", ")}.`
    );
  }
  return provider;
}

/** Entry point for the AI abstraction. All providers hang off this. */
export async function generateAI(
  request: AIGenerateRequest
): Promise<AIGenerateResponse> {
  const provider = resolveProvider(request);
  return provider.generate(request);
}

/** Only Agnes is configured — no failover needed. */
export async function generateAIWithFailover(
  request: Omit<AIGenerateRequest, "provider">
): Promise<AIGenerateResponse> {
  return generateAI({ ...request, provider: "agnes" });
}
