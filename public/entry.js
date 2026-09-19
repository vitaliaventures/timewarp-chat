// entry.js — shared logic for Fade's one-time notes & secrets.
// This module knows nothing about UI. It just talks to Firebase.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  runTransaction
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

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
  if (kind !== "note" && kind !== "secret") {
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
 * Reads an entry and deletes it in the SAME atomic operation, so two people
 * (or two tabs) opening the same link at once can never both see the content.
 *
 * IMPORTANT FIX: a page that has never touched this exact path before has an
 * empty local cache for it. Firebase's transaction can be invoked with `null`
 * on its very first pass simply because of that empty cache — NOT because
 * the data was actually deleted. To avoid mistaking "cache is empty" for
 * "already burned," we do a real `get()` first to warm the cache with the
 * true server value before starting the transaction.
 *
 * Returns the entry's data ({ text, kind, createdAt }) if it was still there,
 * or null if it had already been viewed, deleted, or never existed.
 */
export async function fetchAndBurnEntry(entryId) {
  const entryRef = ref(db, `entries/${entryId}`);

  // Warm the cache with a real server read first.
  await get(entryRef);

  let burned = null;

  const result = await runTransaction(entryRef, currentData => {
    if (currentData === null) {
      // Now that we've warmed the cache, a null here means it genuinely
      // doesn't exist (already burned, or never existed) — safe to abort.
      return undefined;
    }
    burned = currentData;
    return null; // this delete is what the security rules permit
  });

  if (!result.committed) {
    return null;
  }

  return burned;
}
