import { CATALOGUE_API_BASE_URL } from "./config.js";

export function createApiError(type, status, message) {
  return {
    type,
    status,
    message,
  };
}

export function classifyApiError(error, status = null) {
  if (error.name === "AbortError") {
    return createApiError(
      "timeout",
      null,
      "The request took too long. Please try again.",
    );
  }

  if (error instanceof SyntaxError) {
    return createApiError("parse", status, "The server returned invalid JSON.");
  }

  if (status !== null && (status < 200 || status >= 300)) {
    return createApiError(
      "http",
      status,
      `Request failed with status ${status}`,
    );
  }

  if (!navigator.onLine) {
    return createApiError(
      "offline",
      null,
      "You are currently offline. Check your internet connection.",
    );
  }

  return createApiError(
    "network",
    null,
    "A network error occurred. Please try again.",
  );
}

export async function request(path, options = {}) {
  const url = `${CATALOGUE_API_BASE_URL}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 8000);

  let status = null;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      signal: controller.signal,
    });

    status = response.status;

    if (!response.ok) {
      throw new Error(`HTTP: ${status}`);
    }

    return await response.json();
  } catch (error) {
    throw classifyApiError(error, status);
  } finally {
    clearTimeout(timeoutId);
  }
}
