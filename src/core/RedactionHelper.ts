const SENSITIVE_KEYS = ['password', 'token', 'username', 'secret', 'auth', 'url'];

export function redact(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(redact);
  }

  const redacted: any = {};
  for (const key in data) {
    if (SENSITIVE_KEYS.some(s => key.toLowerCase().includes(s))) {
      redacted[key] = '********';
    } else if (typeof data[key] === 'object') {
      redacted[key] = redact(data[key]);
    } else {
      redacted[key] = data[key];
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
