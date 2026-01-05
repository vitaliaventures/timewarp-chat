import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  remove
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const MESSAGE_TTL = 10; // ⏱️ regla absoluta del sistema

/* ===== USER IDENTITY (EPHEMERAL) ===== */
const animals = ["Fox", "Panda", "Tiger", "Octopus", "Wolf", "Eagle", "Bear", "Owl"];
const colors = ["Red", "Blue", "Green", "Purple", "Orange", "Pink"];
const animalEmoji = {
  Fox: "🦊",
  Panda: "🐼",
  Tiger: "🐯",
  Octopus: "🐙",
  Wolf: "🐺",
  Eagle: "🦅",
  Bear: "🐻",
  Owl: "🦉"
};

function generateIdentity() {
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const id = Math.floor(Math.random() * 900 + 100);

  return {
    name: `${color} ${animal} ${id}`,
    emoji: animalEmoji[animal]
  };
}

const identity = generateIdentity();
console.log("Your identity:", identity.emoji, identity.name);

/* 🔥 FIREBASE CONFIG 🔥 */
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

/* UI */
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");

/* ===== ROOM FROM URL ===== */
function generateRoomId() {
  return Math.random().toString(36).substring(2, 10);
}

let roomId = location.hash.replace("#room=", "");
if (!roomId) {
  roomId = generateRoomId();
  location.hash = "room=" + roomId;
}

const roomRef = ref(db, "rooms/" + roomId);
const typingRef = ref(db, `rooms/${roomId}/typing`);

/* ===== SHARE ROOM BUTTON ===== */
const shareBtn = document.createElement("button");
shareBtn.id = "share-btn";
shareBtn.textContent = "Share Room";
shareBtn.style.fontSize = "12px";
shareBtn.style.marginLeft = "10px";
document.querySelector(".chat-header").appendChild(shareBtn);

shareBtn.onclick = () => {
  const link = window.location.href;
  navigator.clipboard.writeText(link).then(() => {
    alert("Room link copied! Share it with your friends.");
  });
};

/* SEND MESSAGE LOGIC */
function sendMessage() {
  if (!input.value) return;

  push(roomRef, {
    text: input.value,
    ttl: MESSAGE_TTL,
    createdAt: Date.now(),
    user: identity
  });

  input.value = "";
  input.style.height = "auto";
  input.rows = 1;
  input.scrollTop = 0;
  remove(typingRef);
}

let lastMsgTime = 0;
sendBtn.onclick = () => {
  const now = Date.now();
  if (now - lastMsgTime < 3000) showConfetti();
  lastMsgTime = now;
  sendMessage();
};

/* ENTER = send / SHIFT+ENTER = newline */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();
    const start = input.selectionStart;
    const end = input.selectionEnd;
    input.value = input.value.substring(0, start) + "\n" + input.value.substring(end);
    input.selectionStart = input.selectionEnd = start + 1;
    return;
  }
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});

/* AUTO-EXPAND TEXTAREA */
input.addEventListener("input", () => {
  const lines = input.value.split("\n").length;
  input.rows = lines === 1 ? 1 : lines;
});

/* TYPING INDICATOR */
let typingTimeout = null;
input.addEventListener("input", () => {
  push(typingRef, { user: identity, at: Date.now() });
  if (typingTimeout) clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => remove(typingRef), 1500);
});

/* RECEIVE MESSAGES */
onChildAdded(roomRef, snap => {
  const msg = snap.val();
  const msgRef = snap.ref;

  const now = Date.now();
  const elapsed = Math.floor((now - msg.createdAt) / 1000);
  let remaining = msg.ttl - elapsed;

  if (remaining <= 0) {
    remove(msgRef);
    return;
  }

  const div = document.createElement("div");
  div.className = "message";
  if (msg.user.name === identity.name) div.style.background = "#2563eb";

  // GIF rendering
  let content = msg.text;
  if (msg.text.startsWith("http") && msg.text.endsWith(".gif")) {
    content = `<img src="${msg.text}" style="max-width:200px;">`;
  }

  div.innerHTML = `<strong>${msg.user.emoji} ${msg.user.name}</strong><br>${content}<span>${remaining}s</span>`;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  const span = div.querySelector("span");
  const timer = setInterval(() => {
    remaining--;
    span.textContent = remaining + "s";
    if (remaining <= 0) {
      clearInterval(timer);
      div.remove();
      remove(msgRef);
    }
  }, 1000);
});

/* TYPING INDICATOR DISPLAY */
const typingIndicator = document.getElementById("typing-indicator");
onChildAdded(typingRef, snap => {
  const data = snap.val();
  if (!data || data.user.name === identity.name) return;
  typingIndicator.textContent = `${data.user.emoji} ${data.user.name} is typing…`;
  setTimeout(() => typingIndicator.textContent = "", 2000);
});

/* ===== GAMIFICATION: CONFETTI AL ENVIAR RÁPIDO ===== */
function showConfetti() {
  const confetti = document.createElement("div");
  confetti.textContent = "🎉";
  confetti.style.position = "absolute";
  confetti.style.top = Math.random() * 80 + "%";
  confetti.style.left = Math.random() * 80 + "%";
  confetti.style.fontSize = "24px";
  document.body.appendChild(confetti);
  setTimeout(() => confetti.remove(), 1000);
}

/* ===== EMOJI BUTTON SIMPLE ===== */
const emojiBtn = document.createElement("button");
emojiBtn.textContent = "😀";
emojiBtn.style.fontSize = "18px";
document.querySelector(".chat-input").prepend(emojiBtn);

emojiBtn.onclick = () => {
  input.value += "😀";
  input.focus();
};
