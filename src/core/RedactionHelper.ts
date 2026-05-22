const SENSITIVE_KEYS = ['password', 'token', 'username', 'secret', 'auth', 'url'];

export function redact(data: unknown): unknown {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(redact);
  }

  const dataObj = data as Record<string, unknown>;
  const redacted: Record<string, unknown> = {};
  for (const key in dataObj) {
    if (SENSITIVE_KEYS.some(s => key.toLowerCase().includes(s))) {
      redacted[key] = '********';
    } else if (typeof dataObj[key] === 'object') {
      redacted[key] = redact(dataObj[key]);
    } else {
      redacted[key] = dataObj[key];
    }
  }
  return redacted;
}

export function redactValue(name: string, value: string): string {
  if (SENSITIVE_KEYS.some(s => name.toLowerCase().includes(s))) {
    return '********';
  }
  return value;
}

export function redactUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.protocol}//********${parsed.pathname}${parsed.search}`;
  } catch {
    return '********';
  }
}
