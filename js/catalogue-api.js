import { CATALOGUE_API_BASE_URL } from "./config.js";

export async function request(path, options = {}) {
  const url = `${CATALOGUE_API_BASE_URL}${path}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 8000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    const status = response.status;

    if (!response.ok) {
      throw new Error(`HTTP: ${status}`);
    }
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}
