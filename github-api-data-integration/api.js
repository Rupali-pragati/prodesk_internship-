const API_ROOT = "https://api.github.com";

/* ---------- Typed errors: one class per failure category ---------- */
export class NotFoundError extends Error {
  constructor(msg = "User not found") { super(msg); this.name = "NotFoundError"; }
}
export class RateLimitError extends Error {
  constructor(msg = "API rate limit exceeded") { super(msg); this.name = "RateLimitError"; }
}
export class NetworkError extends Error {
  constructor(msg = "Network request failed") { super(msg); this.name = "NetworkError"; }
}
export class ParseError extends Error {
  constructor(msg = "Could not parse server response") { super(msg); this.name = "ParseError"; }
}

/**
 * Performs a GitHub API request and maps HTTP errors.
 */
async function request(url) {
  let response;

  // (1) Network-level failures (offline, DNS, CORS) reject the promise.
  try {
    response = await fetch(url, {
      headers: { Accept: "application/vnd.github+json" },
      // NOTE: To raise the 60/hr unauthenticated limit, add a token:
      // headers: { Authorization: `Bearer ${TOKEN}`, ... }
    });
  } catch {
    throw new NetworkError();
  }

  // (2) HTTP-level failures → typed errors.
  if (!response.ok) {
    if (response.status === 404) throw new NotFoundError();
    if (response.status === 403 && response.headers.get("X-RateLimit-Remaining") === "0") {
      throw new RateLimitError();
    }
    if (response.status === 403) throw new RateLimitError();
    throw new Error(`Request failed with status ${response.status}`);
  }

  // (3) Body parsing — guard against invalid JSON.
  try {
    return await response.json();
  } catch {
    throw new ParseError();
  }
}

export async function fetchUserProfile(username) {
  const user = await request(`${API_ROOT}/users/${encodeURIComponent(username)}`);

  // Endpoint chaining: prefer the API-provided repos_url, fall back safely.
  const reposUrl = user.repos_url
    ? `${user.repos_url}?per_page=100&sort=updated&direction=desc`
    : `${API_ROOT}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;

  const repos = await request(reposUrl);

  return { user, repos: Array.isArray(repos) ? repos : [] };
}

export async function fetchBattle(usernameA, usernameB) {
  return Promise.all([
    fetchUserProfile(usernameA),
    fetchUserProfile(usernameB),
  ]);
}
