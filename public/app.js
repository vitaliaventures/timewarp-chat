// app.js — Fade: create a one-time note/secret, and reveal-once viewing.
import { createEntry, fetchAndBurnEntry, MAX_TEXT_LENGTH } from "./entry.js";

const root = document.getElementById("app-root");

const pathParts = window.location.pathname.split("/").filter(Boolean);

// --- Route detection ---
// /n/<id>  -> view a note
// /s/<id>  -> view a secret
// anything else -> the create/home screen
let viewKind = null;
let viewId = null;

if (pathParts[0] === "n" && pathParts[1]) {
  viewKind = "note";
  viewId = pathParts[1];
} else if (pathParts[0] === "s" && pathParts[1]) {
  viewKind = "secret";
  viewId = pathParts[1];
}

function setNoIndex() {
  let metaRobots = document.querySelector('meta[name="robots"]');
  if (!metaRobots) {
    metaRobots = document.createElement("meta");
    metaRobots.name = "robots";
    document.head.appendChild(metaRobots);
  }
  metaRobots.content = "noindex,nofollow";
}

if (viewKind) {
  renderViewScreen(viewKind, viewId);
} else {
  renderCreateScreen();
}

// ================================
// CREATE SCREEN
// ================================
function renderCreateScreen() {
  root.innerHTML = `
    <div class="fade-card">
      <h1>Fade</h1>
      <p class="fade-tagline">Say it once. Then it's gone.</p>

      <div class="fade-tabs">
        <button type="button" class="fade-tab active" data-kind="note">📝 One-time note</button>
        <button type="button" class="fade-tab" data-kind="secret">🔑 One-time secret</button>
      </div>

      <p class="fade-kind-desc" id="kind-desc">
        Write a message. Get a link. The first person to open it sees it once — then it's deleted forever.
      </p>

      <textarea id="entry-text" maxlength="${MAX_TEXT_LENGTH}" placeholder="Type your note here..."></textarea>
      <div class="fade-counter"><span id="char-count">0</span> / ${MAX_TEXT_LENGTH}</div>

      <button type="button" id="create-btn" class="fade-btn-primary">Create one-time link</button>
      <p id="create-error" class="fade-error" style="display:none"></p>

      <div id="result-panel" style="display:none">
        <p class="fade-result-label">Your one-time link — share it with one person only:</p>
        <div class="fade-link-row">
          <input type="text" id="result-link" readonly>
          <button type="button" id="copy-btn" class="fade-btn-secondary">Copy</button>
        </div>
        <p class="fade-warning">⚠️ This link works once. After it's opened, the content is permanently deleted — there is no way to view it again.</p>
        <button type="button" id="create-another-btn" class="fade-btn-secondary">Create another</button>
      </div>
    </div>
  `;

  let currentKind = "note";
  const tabs = root.querySelectorAll(".fade-tab");
  const kindDesc = document.getElementById("kind-desc");
  const textarea = document.getElementById("entry-text");
  const charCount = document.getElementById("char-count");
  const createBtn = document.getElementById("create-btn");
  const createError = document.getElementById("create-error");
  const resultPanel = document.getElementById("result-panel");
  const resultLink = document.getElementById("result-link");
  const copyBtn = document.getElementById("copy-btn");
  const createAnotherBtn = document.getElementById("create-another-btn");

  const kindCopy = {
    note: "Write a message. Get a link. The first person to open it sees it once — then it's deleted forever.",
    secret: "Paste a password, API key, or other sensitive text. Get a link. It can be viewed exactly once, then it's gone."
  };

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentKind = tab.dataset.kind;
      kindDesc.textContent = kindCopy[currentKind];
      textarea.placeholder = currentKind === "secret"
        ? "Paste your password, key, or secret here..."
        : "Type your note here...";
    });
  });

  textarea.addEventListener("input", () => {
    charCount.textContent = textarea.value.length;
  });

  createBtn.addEventListener("click", async () => {
    createError.style.display = "none";
    const text = textarea.value;

    if (!text.trim()) {
      createError.textContent = "Please write something first.";
      createError.style.display = "block";
      return;
    }

    createBtn.disabled = true;
    createBtn.textContent = "Creating...";

    try {
      const entryId = await createEntry(text, currentKind);
      const prefix = currentKind === "secret" ? "s" : "n";
      const link = `${window.location.origin}/${prefix}/${entryId}`;

      resultLink.value = link;
      resultPanel.style.display = "block";
      textarea.value = "";
      charCount.textContent = "0";
      textarea.disabled = true;
      createBtn.style.display = "none";
    } catch (err) {
      console.error("Fade: createEntry failed", err);
      createError.textContent = err.message || "Something went wrong. Please try again.";
      createError.style.display = "block";
    } finally {
      createBtn.disabled = false;
      createBtn.textContent = "Create one-time link";
    }
  });

  copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(resultLink.value).then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 1500);
    });
  });

  createAnotherBtn.addEventListener("click", () => {
    renderCreateScreen();
  });
}

// ================================
// VIEW SCREEN (reveal-once)
// ================================
function renderViewScreen(kind, entryId) {
  setNoIndex();

  const label = kind === "secret" ? "one-time secret" : "one-time note";
  const icon = kind === "secret" ? "🔑" : "📝";

  root.innerHTML = `
    <div class="fade-card">
      <h1>Fade</h1>
      <div id="view-gate">
        <p class="fade-tagline">${icon} Someone sent you a ${label}.</p>
        <p class="fade-warning">
          Clicking below will permanently delete it from our servers. Only click when you're ready to read it —
          it cannot be viewed again after this, even by you.
        </p>
        <button type="button" id="reveal-btn" class="fade-btn-primary">Click to reveal</button>
        <p id="reveal-error" class="fade-error" style="display:none"></p>
      </div>
    </div>
  `;

  document.getElementById("reveal-btn").addEventListener("click", async () => {
    const revealBtn = document.getElementById("reveal-btn");
    const revealError = document.getElementById("reveal-error");
    revealBtn.disabled = true;
    revealBtn.textContent = "Retrieving...";
    revealError.style.display = "none";

    try {
      const data = await fetchAndBurnEntry(entryId);

      if (!data) {
        root.querySelector(".fade-card").innerHTML = `
          <h1>Fade</h1>
          <p class="fade-tagline">This link has already been used.</p>
          <p>This ${label} was already viewed, or it never existed. It cannot be recovered — ask the sender to create a new one.</p>
          <a href="/" class="fade-btn-secondary" style="display:inline-block;text-decoration:none;text-align:center;">Create your own</a>
        `;
        return;
      }

      root.querySelector(".fade-card").innerHTML = `
        <h1>Fade</h1>
        <p class="fade-tagline">${icon} Here it is — this only shows once:</p>
        <div class="fade-revealed-text">${escapeHtml(data.text)}</div>
        <p class="fade-warning">✅ This ${label} has now been permanently deleted from our servers.</p>
        <a href="/" class="fade-btn-secondary" style="display:inline-block;text-decoration:none;text-align:center;">Create your own</a>
      `;
    } catch (err) {
      console.error("Fade: fetchAndBurnEntry failed", err);
      revealBtn.disabled = false;
      revealBtn.textContent = "Click to reveal";
      revealError.textContent = "Something went wrong retrieving this — check the console for details, or try again.";
      revealError.style.display = "block";
    }
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML.replace(/\n/g, "<br>");
}
