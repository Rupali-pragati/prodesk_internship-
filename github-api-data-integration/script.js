import {
  fetchUserProfile, fetchBattle,
  NotFoundError, RateLimitError, NetworkError, ParseError,
} from "./api.js";
import * as ui from "./ui.js";
import { validateUsername } from "./utils.js";

/*Element references*/
const tabSingle   = document.getElementById("tabSingle");
const tabBattle   = document.getElementById("tabBattle");
const panelSingle = document.getElementById("panelSingle");
const panelBattle = document.getElementById("panelBattle");

const singleForm  = document.getElementById("singleForm");
const singleInput = document.getElementById("singleInput");
const singleError = document.getElementById("singleError");

const battleForm  = document.getElementById("battleForm");
const battleInput1 = document.getElementById("battleInput1");
const battleInput2 = document.getElementById("battleInput2");
const battleError1 = document.getElementById("battleError1");
const battleError2 = document.getElementById("battleError2");

/* app state */
let requestToken = 0;

/*Validation helpers  */
function setFieldError(inputEl, errorEl, message) {
  errorEl.textContent = message || "";
  inputEl.classList.toggle("is-invalid", Boolean(message));
  inputEl.setAttribute("aria-invalid", message ? "true" : "false");
}

function clearFieldError(inputEl, errorEl) {
  setFieldError(inputEl, errorEl, "");
}

/* Map a typed API error → the correct UI state. Central error flow. */
function handleApiError(error) {
  if (error instanceof NotFoundError) {
    ui.showNotFound();
  } else if (error instanceof RateLimitError) {
    ui.showError({
      title: "Rate limit reached",
      description: "GitHub limits unauthenticated requests to 60/hour. Please wait a few minutes and try again.",
      variant: "warn",
    });
  } else if (error instanceof NetworkError) {
    ui.showError({
      title: "Connection problem",
      description: "We couldn't reach GitHub. Check your internet connection and try again.",
      variant: "network",
    });
  } else if (error instanceof ParseError) {
    ui.showError({
      title: "Unexpected response",
      description: "GitHub returned data we couldn't read. Please try again shortly.",
      variant: "warn",
    });
  } else {
    ui.showError({
      title: "Something went wrong",
      description: "An unexpected error occurred. Please try again.",
      variant: "warn",
    });
  }
}

/*Single search flow*/
async function runSingleSearch(rawUsername) {
  const result = validateUsername(rawUsername);
  if (!result.valid) {
    setFieldError(singleInput, singleError, result.message);
    singleInput.focus();
    return;
  }
  clearFieldError(singleInput, singleError);

  const token = ++requestToken;
  ui.showLoading("Fetching profile from GitHub…");

  try {
    const data = await fetchUserProfile(result.value);
    if (token !== requestToken) return;   // stale response guard
    ui.renderProfile(data);
  } catch (error) {
    if (token !== requestToken) return;
    handleApiError(error);
  }
}

/*Battle flow */
async function runBattle(rawA, rawB) {
  const a = validateUsername(rawA);
  const b = validateUsername(rawB);

  // Validate both fields independently so each shows its own message.
  setFieldError(battleInput1, battleError1, a.valid ? "" : a.message);
  setFieldError(battleInput2, battleError2, b.valid ? "" : b.message);
  if (!a.valid || !b.valid) {
    (a.valid ? battleInput2 : battleInput1).focus();
    return;
  }

  // Edge case: comparing a user against themselves.
  if (a.value.toLowerCase() === b.value.toLowerCase()) {
    setFieldError(battleInput2, battleError2, "Choose two different usernames.");
    battleInput2.focus();
    return;
  }

  const token = ++requestToken;
  ui.showLoading("Fetching both developers…");

  try {
    const [dataA, dataB] = await fetchBattle(a.value, b.value); // Promise.all()
    if (token !== requestToken) return;
    ui.renderBattle(dataA, dataB);
  } catch (error) {
    if (token !== requestToken) return;
    handleApiError(error);
  }
}

/*Mode switching (tabs) */
function activateMode(mode) {
  const single = mode === "single";

  tabSingle.classList.toggle("is-active", single);
  tabBattle.classList.toggle("is-active", !single);
  tabSingle.setAttribute("aria-selected", String(single));
  tabBattle.setAttribute("aria-selected", String(!single));

  panelSingle.classList.toggle("is-hidden", !single);
  panelBattle.classList.toggle("is-hidden", single);
  panelSingle.hidden = !single;
  panelBattle.hidden = single;

  // Reset transient UI when switching modes.
  ui.clearResult();
  clearFieldError(singleInput, singleError);
  clearFieldError(battleInput1, battleError1);
  clearFieldError(battleInput2, battleError2);
}

/* Event wiring*/
tabSingle.addEventListener("click", () => activateMode("single"));
tabBattle.addEventListener("click", () => activateMode("battle"));

singleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  runSingleSearch(singleInput.value);
});
battleForm.addEventListener("submit", (e) => {
  e.preventDefault();
  runBattle(battleInput1.value, battleInput2.value);
});

/* Clear validation feedback as the user types. */
singleInput.addEventListener("input", () => clearFieldError(singleInput, singleError));
battleInput1.addEventListener("input", () => clearFieldError(battleInput1, battleError1));
battleInput2.addEventListener("input", () => clearFieldError(battleInput2, battleError2));

