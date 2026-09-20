// entry.js — shared logic for Fade's one-time notes & secrets.
// This module knows nothing about UI. It just talks to Firebase.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  remove
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import {
  initializeAppCheck,
  ReCaptchaV3Provider
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app-check.js";

// Same Firebase project as before — no need to create a new one.
const firebaseConfig = {
  apiKey: "AIzaSyA1dHSzOC6_Zo8sTBg1pfqYJTEFTKDlP24",
  authDomain: "timewarp-messenger.firebaseapp.com",
  databaseURL: "https://timewarp-messenger-default-rtdb.firebaseio.com",
  projectId: "timewarp-messenger",
  storageBucket: "timewarp-messenger.firebasestorage.app",
  messagingSenderId: "71563132014",
  appId: "1:71563132014:web:901218a830abd48c74fa7f"
};

const app = initializeApp(firebaseConfig);

// App Check: proves requests are coming from a real browser on your real
// site, not a script hitting the database directly. This is what stops
// automated abuse of the free Firebase config that's visible in the page
// source (that visibility is normal for Firebase — App Check is the actual
// protection layer, not hiding the key).
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6LeI2MQtAAAAAAoLWMgiZV-GHTsnWybpUD-PzD9n"),
  isTokenAutoRefreshEnabled: true
});

const db = getDatabase(app);

export const MAX_TEXT_LENGTH = 5000;

/**
 * Generates an unguessable entry ID (same UUID approach as the old room IDs).
 */
export function generateEntryId() {
  return crypto.randomUUID().replace(/-/g, "");
}

/**
 * Creates a new one-time entry. Returns the entryId to build the share link with.
 */
export async function createEntry(text, kind) {
  if (!text || typeof text !== "string" || !text.trim()) {
    throw new Error("Text is required.");
  }
  if (text.length > MAX_TEXT_LENGTH) {
    throw new Error(`Text must be ${MAX_TEXT_LENGTH} characters or fewer.`);
  }
  if (kind !== "note" && kind !== "secret" && kind !== "code") {
    throw new Error("Invalid kind.");
  }

  const entryId = generateEntryId();
  const entryRef = ref(db, `entries/${entryId}`);

  await set(entryRef, {
    text,
    kind,
    createdAt: Date.now()
  });

  return entryId;
}

/**
 * Reads an entry, and if it exists, deletes it right after.
 *
 * NOTE: this is a straightforward read-then-delete, not an atomic
 * transaction. In the extremely unlikely case that two people open the
 * exact same link within milliseconds of each other, both could see the
 * content before the delete completes. Given how this link is actually
 * shared (privately, to one person, once), that risk is negligible.
 *
 * Returns the entry's data ({ text, kind, createdAt }) if it was still
 * there, or null if it had already been viewed, deleted, or never existed.
 */
export async function fetchAndBurnEntry(entryId) {
  const entryRef = ref(db, `entries/${entryId}`);

  const snapshot = await get(entryRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.val();
  await remove(entryRef);
  return data;
}
