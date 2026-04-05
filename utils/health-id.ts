const HEALTH_ID_PATTERN = /\bHEALTH-[A-Z0-9]{8}\b/i;

const pickHealthIdFromObject = (value: unknown): string | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidateKeys = ["healthId", "healthID", "health_id", "id"];
  for (const key of candidateKeys) {
    const candidate = (value as Record<string, unknown>)[key];
    if (typeof candidate === "string") {
      const match = candidate.match(HEALTH_ID_PATTERN);
      if (match?.[0]) {
        return match[0].toUpperCase();
      }
    }
  }

  return null;
};

const pickHealthIdFromQueryString = (payload: string): string | null => {
  const queryMatch = payload.match(/(?:healthId|healthID|health_id)=([^&\s]+)/i);
  if (!queryMatch?.[1]) {
    return null;
  }

  let decoded = queryMatch[1];
  try {
    decoded = decodeURIComponent(queryMatch[1]);
  } catch {
    decoded = queryMatch[1];
  }
  const idMatch = decoded.match(HEALTH_ID_PATTERN);
  return idMatch?.[0] ? idMatch[0].toUpperCase() : null;
};

export const extractHealthIdFromPayload = (rawPayload: string): string | null => {
  const payload = String(rawPayload || "").trim();
  if (!payload) {
    return null;
  }

  const directMatch = payload.match(HEALTH_ID_PATTERN);
  if (directMatch?.[0]) {
    return directMatch[0].toUpperCase();
  }

  try {
    const parsed = JSON.parse(payload);
    const fromObject = pickHealthIdFromObject(parsed);
    if (fromObject) {
      return fromObject;
    }
  } catch {
    // Non-JSON QR payloads are valid; continue with string parsing.
  }

  const fromQuery = pickHealthIdFromQueryString(payload);
  if (fromQuery) {
    return fromQuery;
  }

  return null;
};

export const normalizeHealthIdInput = (input: string): string => {
  const extracted = extractHealthIdFromPayload(input);
  if (extracted) {
    return extracted;
  }
  return String(input || "").trim().toUpperCase();
};
