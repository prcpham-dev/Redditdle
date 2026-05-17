const API_BASE = import.meta.env.VITE_API_BASE ?? "";

/**
 * Loads today's 10-round puzzle from the Next.js API (backed by lib/reddit).
 */
export async function fetchDailyDataFromApi() {
  const response = await fetch(`${API_BASE}/api/daily`);

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(
      body.error ?? `Failed to load daily puzzle (${response.status})`,
    );
  }

  const data = await response.json();

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Daily puzzle response was empty");
  }

  return data;
}
