import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  remove
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const MESSAGE_TTL = 10; // ⏱️ ABSOLUTE LAW

/* ===== IDENTITY ===== */

const animals = ["Fox", "Panda", "Tiger", "Wolf", "Eagle", "Bear", "Owl"];
const colors = ["Red", "Blue", "Green", "Purple", "Orange"];

const animalEmoji = {
  Fox: "🦊",
  Panda: "🐼",
  Tiger: "🐯",
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

/* ===== FIREBASE ===== */

const firebaseConfig = {
  apiKey: "AIzaSyA1dHSzOC6_Zo8sTBg1pfqYJTEFTKDlP24",
  authDomain: "timewarp-messenger.firebaseapp.com",
  databaseURL: "https://timewarp-messenger-default-rtdb.firebaseio.com",
  projectId: "timewarp-messenger",
  storageBucket: "timewarp-messenger.appspot.com",
  messagingSenderId: "71563132014",
  appId: "1:71563132014:web:901218a830abd48c74fa7f"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/* ===== UI ===== */

const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const typingIndicator = document.getElementById("typing-indicator");

/* ===== ROOM ===== */

function generateRoomId() {
  return Math.random().toString(36).substring(2, 10);
}

let roomId = location.hash.replace("#room=", "");
if (!roomId) {
  roomId = generateRoomId();
  location.hash = "room=" + roomId;
}

const roomRef = ref(db, `rooms/${roomId}`);
const typingRef = ref(db, `rooms/${roomId}/typing`);

/* ===== SEND ===== */

sendBtn.onclick = () => {
  if (!input.value.trim()) return;

  push(roomRef, {
    text: input.value,
    ttl: MESSAGE_TTL,
    createdAt: Date.now(),
    user: identity
  });

  input.value = "";
  remove(typingRef);
};

/* ===== TYPING ===== */

let typingTimeout;

input.addEventListener("input", () => {
  push(typingRef, { user: identity, at: Date.now() });

  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => remove(typingRef), 1500);
});

/* ===== RECEIVE ===== */

onChildAdded(roomRef, snap => {
  const msg = snap.val();
  const msgRef = snap.ref;

  let remaining = msg.ttl - Math.floor((Date.now() - msg.createdAt) / 1000);
  if (remaining <= 0) {
    remove(msgRef);
    return;
  }

  const div = document.createElement("div");
  div.className = "message";
  if (msg.user.name === identity.name) div.classList.add("self");

  div.innerHTML = `
    <strong>${msg.user.emoji} ${msg.user.name}</strong><br>
    ${msg.text}
    <span>${remaining}s</span>
  `;

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

/* ===== TYPING INDICATOR ===== */

onChildAdded(typingRef, snap => {
  const data = snap.val();
  if (!data || data.user.name === identity.name) return;

  typingIndicator.textContent = `${data.user.emoji} ${data.user.name} is typing…`;
  setTimeout(() => typingIndicator.textContent = "", 2000);
});
