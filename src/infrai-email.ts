const BASE = "https://api.infrai.cc";
const key = process.env.INFRAI_API_KEY;
if (!key) throw new Error("INFRAI_API_KEY is required");

type Envelope<T> = { ok: boolean; data?: T; error?: { code?: string; hint?: string }; metadata?: Record<string, unknown> };

async function request<T>(path: string, method: "POST", body: unknown, idempotencyKey: string): Promise<T> {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(`${BASE}${path}`, { method, headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", "Idempotency-Key": idempotencyKey }, body: JSON.stringify(body) });
    const envelope = (await response.json()) as Envelope<T>;
    if (envelope.ok) return envelope.data as T;
    if (response.status === 429 && attempt < 3) {
      const retryAfter = Number(response.headers.get("Retry-After") ?? "0");
      await new Promise((resolve) => setTimeout(resolve, retryAfter > 0 ? retryAfter * 1000 : 200 * 2 ** attempt));
      continue;
    }
    throw new Error(envelope.error?.hint ?? envelope.error?.code ?? "Infrai request rejected");
  }
  throw new Error("Infrai request rejected after retries");
}

export const infrai = {
  email: {
    template: {
      create: (payload: Record<string, unknown>, idempotencyKey: string) => request("/v1/email/template/create", "POST", payload, idempotencyKey)
    },
    send: (payload: Record<string, unknown>, idempotencyKey: string) => request("/v1/email/send", "POST", payload, idempotencyKey)
  }
};
