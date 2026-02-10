/**
 * Safe console logging for all axios requests/responses from the client.
 * - Only logs when console is available
 * - Redacts sensitive data (auth headers, password fields, API keys in URLs)
 * - Never throws (wrapped in try/catch)
 */
import axios from 'axios';

const SENSITIVE_HEADERS = ['authorization', 'cookie'];
const SENSITIVE_BODY_KEYS = ['password', 'passwordConf', 'confirmPassword', 'currentPassword', 'newPassword', 'token', 'apiKey', 'secret'];
const SENSITIVE_QUERY_PARAMS = ['key', 'api_key', 'apikey', 'token', 'secret'];

function safeLog(level, ...args) {
  try {
    if (typeof console === 'undefined' || typeof console[level] !== 'function') return;
    console[level](...args);
  } catch (_) {
    // no-op: never let logging break the app
  }
}

function redactUrl(url) {
  if (typeof url !== 'string') return url;
  try {
    const [path, query] = url.split('?');
    if (!query) return path;
    const params = new URLSearchParams(query);
    SENSITIVE_QUERY_PARAMS.forEach((param) => {
      if (params.has(param)) params.set(param, '[REDACTED]');
    });
    return `${path}?${params.toString()}`;
  } catch (_) {
    return url;
  }
}

function redactHeaders(headers) {
  if (!headers || typeof headers !== 'object') return headers;
  try {
    const out = { ...headers };
    const sensitive = SENSITIVE_HEADERS.map((h) => h.toLowerCase());
    Object.keys(out).forEach((key) => {
      if (sensitive.includes(key.toLowerCase())) out[key] = '[REDACTED]';
    });
    return out;
  } catch (_) {
    return headers;
  }
}

function redactBody(data) {
  if (data === undefined || data === null) return data;
  try {
    if (typeof data !== 'object') return data;
    if (Array.isArray(data)) return data;
    const sensitive = SENSITIVE_BODY_KEYS.map((k) => k.toLowerCase());
    const out = { ...data };
    Object.keys(out).forEach((key) => {
      if (sensitive.includes(key.toLowerCase())) out[key] = '[REDACTED]';
    });
    return out;
  } catch (_) {
    return data;
  }
}

// Request interceptor: log outgoing request (method, url, redacted headers/body)
axios.interceptors.request.use(
  (config) => {
    try {
      const url = config.url || '';
      const fullUrl = config.baseURL ? `${config.baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}` : url;
      safeLog('log', '[request]', config.method?.toUpperCase() || 'GET', redactUrl(fullUrl), {
        ...(config.headers && { headers: redactHeaders(config.headers) }),
        ...(config.params && Object.keys(config.params).length > 0 && { params: config.params }),
        ...(config.data != null && { body: redactBody(config.data) }),
      });
    } catch (_) {
      // no-op
    }
    return config;
  },
  (error) => {
    try {
      safeLog('warn', '[request error]', error?.message || error);
    } catch (_) {
      // no-op
    }
    return Promise.reject(error);
  }
);

// Response interceptor: log response status (and error details on failure)
axios.interceptors.response.use(
  (response) => {
    try {
      const status = response?.status;
      const url = response?.config?.url || response?.config?.baseURL || '';
      const fullUrl = response?.config?.baseURL
        ? `${response.config.baseURL.replace(/\/$/, '')}/${(response.config.url || '').replace(/^\//, '')}`
        : url;
      safeLog('log', '[response]', status, response?.config?.method?.toUpperCase() || 'GET', redactUrl(fullUrl));
    } catch (_) {
      // no-op
    }
    return response;
  },
  (error) => {
    try {
      const status = error?.response?.status;
      const url = error?.config?.url || error?.config?.baseURL || '';
      const fullUrl = error?.config?.baseURL
        ? `${error.config.baseURL.replace(/\/$/, '')}/${(error.config.url || '').replace(/^\//, '')}`
        : url;
      const method = error?.config?.method?.toUpperCase() || 'GET';
      safeLog(
        'warn',
        '[response error]',
        status ?? error?.message ?? 'Network error',
        method,
        redactUrl(fullUrl)
      );
      // Log response body for 4xx so validation/error messages are visible (redacted)
      const data = error?.response?.data;
      if (data != null && status >= 400 && status < 500 && typeof data === 'object') {
        safeLog('warn', '[response error body]', redactBody(data));
      }
    } catch (_) {
      // no-op
    }
    return Promise.reject(error);
  }
);
