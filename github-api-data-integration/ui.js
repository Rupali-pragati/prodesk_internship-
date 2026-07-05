import {
  escapeHtml, formatDate, formatNumber,
  sumStars, sumForks, normalizeUrl,
} from "./utils.js";

/* Fallback avatar (data URI) for the "missing avatar" edge case. */
const FALLBACK_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96'>
       <rect width='100%' height='100%' fill='#d0d7de'/>
       <text x='50%' y='55%' font-size='40' text-anchor='middle' fill='#57606a'
         font-family='monospace'>?</text></svg>`
  );

/* The single result container all states render into. */
const region = document.getElementById("result");

/* Small helper: set/clear the busy flag for assistive tech. */
function setBusy(isBusy) {
  region.setAttribute("aria-busy", String(isBusy));
}

/*Generic states*/

export function showLoading(message = "Fetching data from GitHub…") {
  setBusy(true);
  region.innerHTML = `
    <div class="state-box" role="status">
      <div class="spinner" aria-hidden="true"></div>
      <p class="state-msg">${escapeHtml(message)}</p>
    </div>`;
}

/* 404 — the mandatory "User Not Found" state. */
export function showNotFound() {
  setBusy(false);
  region.innerHTML = `
    <div class="state-box">
      <div class="state-icon danger" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6" stroke-linecap="round"/></svg>
      </div>
      <h2 class="state-title">User Not Found</h2>
      <p class="state-desc">We couldn't find a GitHub profile with that username. Check the spelling and try again.</p>
    </div>`;
}

/* Generic error with a variant (rate-limit / network / parse). */
export function showError({ title, description, variant = "warn" }) {
  setBusy(false);
  region.innerHTML = `
    <div class="state-box">
      <div class="state-icon ${variant === "network" ? "muted" : "warn"}" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h2 class="state-title">${escapeHtml(title)}</h2>
      <p class="state-desc">${escapeHtml(description)}</p>
    </div>`;
}

export function clearResult() {
  setBusy(false);
  region.replaceChildren();
}

/*Building blocks*/

/* Meta row (join date + portfolio URL). Portfolio hidden when absent. */
function metaBlock(user) {
  const joined = `
    <span class="meta-item">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/></svg>
      Joined ${escapeHtml(formatDate(user.created_at))}
    </span>`;

  // Portfolio / blog URL — only rendered if present (missing-URL edge case).
  let portfolio = "";
  if (user.blog && user.blog.trim()) {
    const href = normalizeUrl(user.blog.trim());
    portfolio = `
      <a class="meta-item" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>
        ${escapeHtml(user.blog.trim())}
      </a>`;
  }

  const location = user.location
    ? `<span class="meta-item">
         <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/></svg>
         ${escapeHtml(user.location)}</span>`
    : "";

  return `<div class="profile-meta">${joined}${location}${portfolio}</div>`;
}

/* Stat tiles. */
function statsBlock(user, repos) {
  const tiles = [
    ["Repositories", user.public_repos],
    ["Total Stars", sumStars(repos)],
    ["Forks", sumForks(repos)],
    ["Followers", user.followers],
  ];
  return `<div class="stats">${tiles.map(([label, value]) => `
    <div class="stat">
      <div class="stat-num">${formatNumber(value)}</div>
      <div class="stat-label">${escapeHtml(label)}</div>
    </div>`).join("")}</div>`;
}

/* Single repo row with a clickable link (opens in a new tab). */
function repoRow(repo) {
  const desc = repo.description
    ? `<div class="repo-desc">${escapeHtml(repo.description)}</div>` : "";
  const lang = repo.language
    ? `<span class="tag tag-lang">${escapeHtml(repo.language)}</span>` : "";
  return `
    <div class="repo">
      <div class="repo-main">
        <a class="repo-name" href="${escapeHtml(repo.html_url)}" target="_blank" rel="noopener noreferrer">
          ${escapeHtml(repo.name)}
        </a>
        ${desc}
      </div>
      <div class="repo-meta">
        ${lang}
        <span class="tag tag-star">★ ${formatNumber(repo.stargazers_count)}</span>
        <span class="tag tag-fork">⑂ ${formatNumber(repo.forks_count)}</span>
      </div>
    </div>`;
}

/* Repositories block — handles the empty-list edge case. */
function reposBlock(repos) {
  const top5 = repos.slice(0, 5); // Phase 2: latest 5
  if (top5.length === 0) {
    return `
      <div class="repos">
        <h3 class="repos-title">Latest Repositories</h3>
        <p class="state-msg">This user has no public repositories.</p>
      </div>`;
  }
  const note = repos.length > 5
    ? `<p class="repos-note">Showing 5 of ${formatNumber(repos.length)} repositories</p>` : "";
  return `
    <div class="repos">
      <h3 class="repos-title">Latest Repositories</h3>
      <div class="repo-list">${top5.map(repoRow).join("")}</div>
      ${note}
    </div>`;
}

/*Single profile */

export function renderProfile({ user, repos }) {
  setBusy(false);
  const avatar = user.avatar_url || FALLBACK_AVATAR;
  const bio = user.bio
    ? `<p class="profile-bio">${escapeHtml(user.bio)}</p>`
    : `<p class="profile-bio is-empty">This developer hasn't written a bio.</p>`;

  region.innerHTML = `
    <article class="profile-card">
      <div class="profile-head">
        <img class="avatar" src="${escapeHtml(avatar)}" alt="Avatar of ${escapeHtml(user.login)}"
             onerror="this.src='${FALLBACK_AVATAR}'" width="96" height="96" />
        <div class="profile-id">
          <h2 class="profile-name">${escapeHtml(user.name || user.login)}</h2>
          <a class="profile-login" href="${escapeHtml(user.html_url)}" target="_blank" rel="noopener noreferrer">@${escapeHtml(user.login)}</a>
          ${bio}
          ${metaBlock(user)}
        </div>
      </div>
      ${statsBlock(user, repos)}
    </article>
    ${reposBlock(repos)}`;
}

/*Battle (Phase 3)*/

/* Compact mini-repo list inside a battle card. */
function miniRepos(repos) {
  const top5 = repos.slice(0, 5);
  if (top5.length === 0) return "";
  return `
    <details class="mini-repos">
      <summary>Top repositories</summary>
      <div class="mini-list">
        ${top5.map(r => `
          <a class="mini-repo" href="${escapeHtml(r.html_url)}" target="_blank" rel="noopener noreferrer">
            <span>${escapeHtml(r.name)}</span>
            <span class="tag tag-star">★ ${formatNumber(r.stargazers_count)}</span>
          </a>`).join("")}
      </div>
    </details>`;
}

/* One battle card. `outcome` = "win" | "lose" | "tie". */
function battleCard({ user, repos }, outcome) {
  const stars = sumStars(repos);
  const cardClass = outcome === "win" ? "winner" : outcome === "lose" ? "loser" : "";
  const flag =
    outcome === "win"
      ? `<span class="verdict-flag win">🏆 Winner</span>`
      : outcome === "lose"
      ? `<span class="verdict-flag lose">✕ Runner-up</span>`
      : `<span class="verdict-flag tie">= Tie</span>`;

  const avatar = user.avatar_url || FALLBACK_AVATAR;

  return `
    <article class="profile-card battle-card ${cardClass}">
      ${flag}
      <div class="profile-head">
        <img class="avatar sm" src="${escapeHtml(avatar)}" alt="Avatar of ${escapeHtml(user.login)}"
             onerror="this.src='${FALLBACK_AVATAR}'" width="60" height="60" />
        <div class="profile-id">
          <h3 class="profile-name" style="font-size:1.1rem">${escapeHtml(user.name || user.login)}</h3>
          <a class="profile-login" href="${escapeHtml(user.html_url)}" target="_blank" rel="noopener noreferrer">@${escapeHtml(user.login)}</a>
        </div>
      </div>
      <div class="battle-stats">
        <div class="stat"><div class="stat-num">${formatNumber(user.public_repos)}</div><div class="stat-label">Repos</div></div>
        <div class="stat"><div class="stat-num">${formatNumber(stars)}</div><div class="stat-label">Stars</div></div>
        <div class="stat"><div class="stat-num">${formatNumber(user.followers)}</div><div class="stat-label">Followers</div></div>
      </div>
      ${miniRepos(repos)}
    </article>`;
}

/*
 * renderBattle(dataA, dataB)
 * Phase 3: compare total stars
 */
export function renderBattle(dataA, dataB) {
  setBusy(false);
  const starsA = sumStars(dataA.repos);
  const starsB = sumStars(dataB.repos);

  let outcomeA = "tie", outcomeB = "tie";
  if (starsA > starsB) { outcomeA = "win"; outcomeB = "lose"; }
  else if (starsB > starsA) { outcomeA = "lose"; outcomeB = "win"; }

  let verdict;
  if (starsA === starsB) {
    verdict = `
      <div class="verdict">
        <div class="verdict-emoji" aria-hidden="true">🤝</div>
        <div class="verdict-title">It's a tie!</div>
        <p class="verdict-sub">Both developers have <strong>${formatNumber(starsA)}</strong> total stars.</p>
      </div>`;
  } else {
    const winner = starsA > starsB ? dataA.user : dataB.user;
    const hi = Math.max(starsA, starsB);
    const lo = Math.min(starsA, starsB);
    const pct = ((hi / (hi + lo)) * 100).toFixed(1);
    verdict = `
      <div class="verdict">
        <div class="verdict-emoji" aria-hidden="true">🏆</div>
        <div class="verdict-title win">${escapeHtml(winner.name || winner.login)} wins!</div>
        <p class="verdict-sub"><strong>${formatNumber(hi)}</strong> total stars vs <strong>${formatNumber(lo)}</strong></p>
        <div class="verdict-bar" role="img" aria-label="Winner holds ${pct} percent of combined stars">
          <span style="width:${pct}%"></span>
        </div>
      </div>`;
  }

  region.innerHTML = `
    <div class="battle-grid">
      ${battleCard(dataA, outcomeA)}
      ${battleCard(dataB, outcomeB)}
    </div>
    ${verdict}`;
}
