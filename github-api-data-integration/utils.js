
export function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  const div = document.createElement("div");
  div.textContent = String(value);
  return div.innerHTML;
}

export function formatDate(isoString) {
  if (!isoString) return "N/A";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "N/A";
  const months = ["Jan","Feb","Mar","Apr","May","Jun",
                  "Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatNumber(n) {
  const num = Number(n);
  return Number.isFinite(num) ? num.toLocaleString("en-US") : "0";
}


export function sumStars(repos) {
  if (!Array.isArray(repos)) return 0;
  return repos.reduce((total, repo) => total + (repo.stargazers_count || 0), 0);
}


export function sumForks(repos) {
  if (!Array.isArray(repos)) return 0;
  return repos.reduce((total, repo) => total + (repo.forks_count || 0), 0);
}


export function normalizeUrl(url) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

/*
 * DOM helpers — thin wrappers to keep other modules terse & readable.
 */
export const $ = (selector, scope = document) => scope.querySelector(selector);

/* Clear a container without re-parsing HTML (safe + fast). */
export function clearNode(node) {
  if (node) node.replaceChildren();
}

export function validateUsername(value) {
  const trimmed = (value || "").trim();
  if (!trimmed) {
    return { valid: false, message: "Username is required." };
  }
  if (trimmed.length > 39) {
    return { valid: false, message: "Username can't exceed 39 characters." };
  }
  if (!/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(trimmed)) {
    return { valid: false, message: "Enter a valid GitHub username." };
  }
  return { valid: true, value: trimmed };
}
