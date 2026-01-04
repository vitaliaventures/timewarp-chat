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

// ⚠️ NO localStorage — identidad solo vive en esta sesión
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
// Typing reference
const typingRef = ref(db, `rooms/${roomId}/typing`);


/* SEND (MISMA LÓGICA, SOLO EN FUNCIÓN) */
function sendMessage() {
  if (!input.value) return;

  push(roomRef, {
    text: input.value,
    ttl: MESSAGE_TTL,
    createdAt: Date.now(),
    user: identity
  });

  input.value = "";
  input.style.height = "auto"; // 👈 RESET A UNA LÍNEA
  remove(typingRef); // 👈 importante
}

sendBtn.onclick = sendMessage;

/* 👇 ENTER envía / SHIFT+ENTER salto de línea */
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.shiftKey) {
    e.preventDefault();

    const start = input.selectionStart;
    const end = input.selectionEnd;

    input.value =
      input.value.substring(0, start) +
      "\n" +
      input.value.substring(end);

    input.selectionStart = input.selectionEnd = start + 1;
    return;
  }

  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});



/* 🔥 AUTO-EXPAND TEXTAREA (tipo WhatsApp) */
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = input.scrollHeight + "px";
});




let typingTimeout = null;

input.addEventListener("input", () => {
  // aviso que estoy escribiendo
  push(typingRef, {
    user: identity,
    at: Date.now()
  });

  // reset timeout
  if (typingTimeout) clearTimeout(typingTimeout);

  typingTimeout = setTimeout(() => {
    // dejo de escribir (limpio todo)
    remove(typingRef);
  }, 1500);
});


/* RECEIVE */
onChildAdded(roomRef, snap => {
  const msg = snap.val();
  const msgRef = snap.ref;

  const now = Date.now();
  const elapsed = Math.floor((now - msg.createdAt) / 1000);
  let remaining = msg.ttl - elapsed;

  // ❌ ya expiró → eliminarlo del database
  if (remaining <= 0) {
    remove(msgRef);
    return;
  }

  const div = document.createElement("div");
  div.className = "message";

  if (msg.user.name === identity.name) {
    div.style.background = "#2563eb";
  }

  div.innerHTML = `
    <strong>${msg.user.emoji} ${msg.user.name}</strong><br>
    ${msg.text}
    <span>${remaining}s</span>
  `;

  chatBox.appendChild(div);

  const span = div.querySelector("span");

  const timer = setInterval(() => {
    remaining--;
    span.textContent = remaining + "s";

    if (remaining <= 0) {
      clearInterval(timer);
      div.remove();
      remove(msgRef); // 🔥 BORRADO DEFINITIVO
    }
  }, 1000);
});


const typingIndicator = document.getElementById("typing-indicator");

onChildAdded(typingRef, snap => {
  const data = snap.val();
  if (!data || data.user.name === identity.name) return;

  typingIndicator.textContent = `${data.user.emoji} ${data.user.name} is typing…`;

  // auto-clear
  setTimeout(() => {
    typingIndicator.textContent = "";
  }, 2000);
});
