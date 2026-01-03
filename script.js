import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

/* ===== USER IDENTITY (AUTO) ===== */

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

let rawIdentity = localStorage.getItem("tw_identity");
let identity;

try {
  identity = JSON.parse(rawIdentity);
} catch (e) {
  identity = null;
}

if (!identity || typeof identity === "string") {
  identity = generateIdentity();
  localStorage.setItem("tw_identity", JSON.stringify(identity));
}

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
const ttlSelect = document.getElementById("ttl-select");

/* ROOM */
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


/* SEND */
sendBtn.onclick = () => {
  if (!input.value) return;

  push(roomRef, {
    text: input.value,
    ttl: Number(ttlSelect.value),
    createdAt: Date.now(),
    user: identity
  });

  input.value = "";
};


/* RECEIVE */
onChildAdded(roomRef, snap => {
  const msg = snap.val();

  const div = document.createElement("div");
  div.className = "message";

  if (msg.user.name === identity.name) {
    div.style.background = "#2563eb"; // azul = yo
  }

  div.innerHTML = `
    <strong>${msg.user.emoji} ${msg.user.name}</strong><br>
    ${msg.text}
    <span>${msg.ttl}s</span>
  `;

  chatBox.appendChild(div);

  const span = div.querySelector("span");
  let remaining = msg.ttl;

  const timer = setInterval(() => {
    remaining--;
    span.textContent = remaining + "s";

    if (remaining <= 0) {
      clearInterval(timer);
      div.remove();
    }
  }, 1000);
});
