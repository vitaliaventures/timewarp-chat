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

function generateIdentity() {
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const id = Math.floor(Math.random() * 900 + 100);
  return `${color} ${animal} ${id}`;
}

let identity = localStorage.getItem("tw_identity");

if (!identity) {
  identity = generateIdentity();
  localStorage.setItem("tw_identity", identity);
}

console.log("Your identity:", identity);




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
const roomId = prompt("Room ID (same on both devices):");
const roomRef = ref(db, "rooms/" + roomId);

/* SEND */
sendBtn.onclick = () => {
  if (!input.value.trim()) return;

  push(roomRef, {
    text: input.value,
    ttl: Number(ttlSelect.value),
    createdAt: Date.now()
  });

  input.value = "";
};

/* RECEIVE */
onChildAdded(roomRef, snap => {
  const msg = snap.val();

  const now = Date.now();
  const elapsed = Math.floor((now - msg.createdAt) / 1000);
  let remaining = msg.ttl - elapsed;

  // Si ya murió, no lo mostramos
  if (remaining <= 0) return;

  const div = document.createElement("div");
  div.className = "message";

  const span = document.createElement("span");
  span.textContent = remaining + "s";

  div.textContent = msg.text;
  div.appendChild(span);
  chatBox.appendChild(div);

  const timer = setInterval(() => {
    remaining--;
    span.textContent = remaining + "s";

    if (remaining <= 0) {
      clearInterval(timer);
      div.remove();
    }
  }, 1000);
});
