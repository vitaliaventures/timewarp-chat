import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onChildAdded,
  remove
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

/* 🔥 TU FIREBASE REAL 🔥 */
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
  if (!input.value) return;

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
  const key = snap.key;

  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `${msg.text} <span>${msg.ttl}s</span>`;
  chatBox.appendChild(div);

  let t = msg.ttl;
  const timer = setInterval(() => {
    t--;
    div.querySelector("span").textContent = t + "s";

    if (t <= 0) {
      clearInterval(timer);
      div.remove();
    }
  }, 1000);
});
