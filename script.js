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

/* ===== EMOJI PICKER COMPLETO TIPO WHATSAPP WEB ===== */

// Crear contenedor del picker
const emojiContainer = document.createElement("div");
emojiContainer.style.position = "absolute";
emojiContainer.style.bottom = "60px"; // ajusta según UI
emojiContainer.style.left = "10px";
emojiContainer.style.width = "350px";
emojiContainer.style.height = "300px";
emojiContainer.style.background = "#ffffff";
emojiContainer.style.border = "1px solid #ccc";
emojiContainer.style.borderRadius = "8px";
emojiContainer.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
emojiContainer.style.display = "none";
emojiContainer.style.zIndex = "100";
emojiContainer.style.overflow = "hidden";
document.body.appendChild(emojiContainer);

// Categorías
const categories = [
  { name: "Recientes", id: "recent" },
  { name: "Caras", id: "smileys" },
  { name: "Animales", id: "animals" },
  { name: "Comida", id: "food" },
  { name: "Actividades", id: "activities" },
  { name: "Viajes", id: "travel" },
  { name: "Objetos", id: "objects" },
  { name: "Símbolos", id: "symbols" },
  { name: "Banderas", id: "flags" }
];

// Contenedor para scroll horizontal de categorías
const categoryBar = document.createElement("div");
categoryBar.style.display = "flex";
categoryBar.style.overflowX = "auto";
categoryBar.style.borderBottom = "1px solid #ddd";
categoryBar.style.padding = "4px 0";
emojiContainer.appendChild(categoryBar);

// Crear botones de categorías
categories.forEach(cat => {
  const btn = document.createElement("button");
  btn.textContent = cat.name;
  btn.style.flex = "0 0 auto";
  btn.style.margin = "0 4px";
  btn.style.padding = "2px 8px";
  btn.style.fontSize = "12px";
  btn.style.cursor = "pointer";
  btn.style.border = "none";
  btn.style.background = "#f1f1f1";
  btn.style.borderRadius = "4px";
  categoryBar.appendChild(btn);

  btn.onclick = () => {
    renderCategory(cat.id);
  };
});

// Contenedor para emojis
const emojiGrid = document.createElement("div");
emojiGrid.style.padding = "6px";
emojiGrid.style.height = "calc(100% - 40px)";
emojiGrid.style.overflowY = "auto";
emojiGrid.style.display = "grid";
emojiGrid.style.gridTemplateColumns = "repeat(auto-fill, 32px)";
emojiGrid.style.gridGap = "4px";
emojiContainer.appendChild(emojiGrid);

// Botón para abrir/cerrar picker
const emojiBtn = document.createElement("button");
emojiBtn.textContent = "😀";
emojiBtn.style.fontSize = "18px";
emojiBtn.style.marginRight = "6px";
document.querySelector(".chat-input").prepend(emojiBtn);

emojiBtn.onclick = () => {
  emojiContainer.style.display =
    emojiContainer.style.display === "none" ? "block" : "none";
};

// Cargar todos los emojis (Unicode completo, WhatsApp style)
let allEmojis = {
  smileys: ["😀","😁","😂","🤣","😃","😄","😅","😆","😉","😊","😋","😎","😍","😘","🥰","😗","😙","😚","🙂","🤗","🤩","🤔","🤨","😐","😑","😶","🙄","😏","😣","😥","😮","🤐","😯","😪","😫","😴","😌","😛","😜","😝","🤤","😒","😓","😔","😕","🙃","🤑","😲","☹️","🙁","😖","😞","😟","😤","😢","😭","😦","😧","😨","😩","🤯","😬","😰","😱","🥵","🥶","😳","🤪","😵","😡","😠","🤬","😷","🤒","🤕","🤢","🤮","🤧","😇","🥳","🥴","🥺","🤠","🤡","🤥","🤫","🤭","🧐","🤓","😈","👿","👹","👺","💀","👻","👽","👾","🤖","💩"],
  animals: ["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐽","🐸","🐵","🙈","🙉","🙊","🐒","🐔","🐧","🐦","🐤","🐣","🐥","🦆","🦅","🦉","🦇","🐺","🐗","🐴","🦄","🐝","🐛","🦋","🐌","🐞","🐜","🪲","🕷","🕸","🦂","🐢","🐍","🦎","🦖","🦕","🐙","🦑","🦐","🦞","🦀","🐡","🐠","🐟","🐬","🐳","🐋","🦈","🐊","🐅","🐆","🦓","🦍","🦧","🐘","🦛","🦏","🐪","🐫","🦙","🦒","🐃","🐂","🐄","🐎","🐖","🐏","🐑","🦌","🐐","🦙","🐕","🐩","🦮","🐕‍🦺","🐈","🐓","🦃","🦚","🦜","🦢","🕊","🐇","🐁","🐀","🐿","🦔"],
  food: ["🍏","🍎","🍐","🍊","🍋","🍌","🍉","🍇","🍓","🫐","🍈","🍒","🍑","🥭","🍍","🥥","🥝","🍅","🍆","🥑","🥦","🥬","🥒","🌶","🫑","🌽","🥕","🫒","🥔","🍠","🥐","🥯","🍞","🥖","🥨","🧀","🥚","🍳","🧈","🥞","🧇","🥓","🥩","🍗","🍖","🦴","🌭","🍔","🍟","🍕","🥪","🥙","🫔","🌮","🌯","🥗","🥘","🥫","🍝","🍜","🍲","🍛","🍣","🍱","🥟","🦪","🍤","🍙","🍚","🍘","🥠","🥮","🍢","🍡","🍧","🍨","🍦","🥧","🧁","🍰","🎂","🍮","🍭","🍬","🍫","🍿","🧋","🥤","🍩","🍪"],
  activities: ["⚽","🏀","🏈","⚾","🥎","🎾","🏐","🏉","🥏","🎱","🪀","🏓","🏸","🥅","🏒","🏑","🏏","🥍","🏹","🎣","🛶","🥊","🥋","🥇","🥈","🥉","🏆","🏅","🎖","🏵","🎗","🎫","🎟","🎪","🤹","🎭","🩰","🎨","🎬","🎤","🎧","🎼","🎹","🥁","🎷","🎺","🎸","🪕","🎻","🎯","🎲","🧩"],
  travel: ["🚗","🚕","🚙","🚌","🚎","🏎","🚓","🚑","🚒","🚐","🛻","🚚","🚛","🚜","🛵","🏍","🛺","🚲","🛴","🛹","🛼","🚁","✈️","🛫","🛬","🛩","🛰","🚀","🛸","⛴","🛳","⛵","🛶","🚤","🛥","🏗","🏠","🏡","🏘","🏚","🏢","🏬","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏛","⛪","🕌","🕍","🛕","🕋","⛲","⛺","🌋","🗻","🏔","⛰","🗾","🏕","🏖","🏜","🏝","🏞","🏟","🏛","🏗","🧱"],
  objects: ["⌚","📱","📲","💻","⌨️","🖥","🖨","🖱","🖲","🕹","🗜","💽","💾","💿","📀","📼","📷","📸","📹","🎥","📽","🎞","📞","☎️","📟","📠","📺","📻","🎙","🎚","🎛","🧭","⏱","⏲","⏰","🕰","🛎","🔑","🗝","🪝","🛋","🛏","🛁","🚽","🚿","🛒","🧴","🧷","🧹","🧺","🪑","🪞","🪟","🛍","🎁","🎈","🎏","🎀"],
  symbols: ["❤️","🧡","💛","💚","💙","💜","🖤","🤍","🤎","💔","❣️","💕","💞","💓","💗","💖","💘","💝","💟","☮️","✝️","☪️","🕉","☸️","✡️","🔯","🕎","☯️","☦️","🛐","⛎","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","🆔","⚛️","🉑","☢️","☣️","📴","📳","🈶","🈚","🈸","🈺","🈷️","✴️","🆚","💮","♻️","✅","✔️","❌","❎","➕","➖","➗","✖️","☑️","🔘","⚪","⚫","🔴","🟠","🟡","🟢","🔵","🟣","🟤","🟥","🟧","🟨","🟩","🟦","🟪","🟫"],
  flags: ["🇦🇫","🇦🇽","🇦🇱","🇩🇿","🇦🇸","🇦🇩","🇦🇴","🇦🇮","🇦🇶","🇦🇬","🇦🇷","🇦🇲","🇦🇼","🇦🇺","🇦🇹","🇦🇿","🇧🇸","🇧🇭","🇧🇩","🇧🇧","🇧🇾","🇧🇪","🇧🇿","🇧🇯","🇧🇲","🇧🇹","🇧🇴","🇧🇦","🇧🇼","🇧🇷","🇮🇴","🇻🇬","🇧🇳","🇧🇬","🇧🇫","🇧🇮","🇨🇻","🇰🇭","🇨🇲","🇨🇦","🇰🇾","🇨🇫","🇹🇩","🇨🇱","🇨🇳","🇨🇽","🇨🇨","🇨🇴","🇰🇲","🇨🇬","🇨🇩","🇨🇰","🇨🇷","🇨🇮","🇭🇷","🇨🇺","🇨🇼","🇨🇾","🇨🇿","🇩🇰","🇩🇯","🇩🇲","🇩🇴","🇪🇨","🇪🇬","🇸🇻","🇬🇶","🇪🇷","🇪🇪","🇪🇹","🇫🇰","🇫🇴","🇫🇯","🇫🇮","🇫🇷","🇬🇫","🇵🇫","🇹🇫","🇬🇦","🇬🇲","🇬🇪","🇩🇪","🇬🇭","🇬🇮","🇬🇷","🇬🇱","🇬🇩","🇬🇵","🇬🇺","🇬🇹","🇬🇬","🇬🇳","🇬🇼","🇬🇾","🇭🇹","🇭🇳","🇭🇰","🇭🇺","🇮🇸","🇮🇳","🇮🇩","🇮🇷","🇮🇶","🇮🇪","🇮🇲","🇮🇱","🇮🇹","🇯🇲","🇯🇵","🇯🇪","🇯🇴","🇰🇿","🇰🇪","🇰🇮","🇽🇰","🇰🇼","🇰🇬","🇱🇦","🇱🇻","🇱🇧","🇱🇸","🇱🇷","🇱🇾","🇱🇮","🇱🇹","🇱🇺","🇲🇴","🇲🇬","🇲🇼","🇲🇾","🇲🇻","🇲🇱","🇲🇹","🇲🇭","🇲🇶","🇲🇷","🇲🇺","🇾🇹","🇲🇽","🇫🇲","🇲🇩","🇲🇨","🇲🇳","🇲🇪","🇲🇸","🇲🇦","🇲🇿","🇲🇲","🇳🇦","🇳🇷","🇳🇵","🇳🇱","🇳🇨","🇳🇿","🇳🇮","🇳🇪","🇳🇬","🇳🇺","🇳🇫","🇰🇵","🇲🇵","🇳🇴","🇴🇲","🇵🇰","🇵🇼","🇵🇸","🇵🇦","🇵🇬","🇵🇾","🇵🇪","🇵🇭","🇵🇳","🇵🇱","🇵🇹","🇵🇷","🇶🇦","🇷🇪","🇷🇴","🇷🇺","🇷🇼","🇼🇸","🇸🇲","🇸🇹","🇸🇦","🇸🇳","🇷🇸","🇸🇨","🇸🇱","🇸🇬","🇸🇽","🇸🇰","🇸🇮","🇸🇧","🇸🇴","🇿🇦","🇰🇷","🇸🇸","🇪🇸","🇱🇰","🇸🇩","🇸🇷","🇸🇿","🇸🇪","🇨🇭","🇸🇾","🇹🇼","🇹🇯","🇹🇿","🇹🇭","🇹🇱","🇹🇬","🇹🇰","🇹🇴","🇹🇹","🇹🇳","🇹🇷","🇹🇲","🇹🇨","🇹🇻","🇺🇬","🇺🇦","🇦🇪","🇬🇧","🇺🇸","🇺🇾","🇺🇿","🇻🇺","🇻🇦","🇻🇪","🇻🇳","🇼🇫","🇪🇭","🇾🇪","🇿🇲","🇿🇼"]
};

// Contenedor para últimos usados
let recentEmojis = JSON.parse(sessionStorage.getItem("recentEmojis") || "[]");

function renderCategory(categoryId) {
  emojiGrid.innerHTML = "";
  let list = categoryId === "recent" ? recentEmojis : allEmojis[categoryId];
  if (!list || list.length === 0) return;
  list.forEach(emoji => {
    const span = document.createElement("span");
    span.textContent = emoji;
    span.style.fontSize = "20px";
    span.style.cursor = "pointer";
    span.onclick = () => {
      input.value += emoji;
      input.focus();

      // Guardar en recientes
      recentEmojis = recentEmojis.filter(e => e !== emoji);
      recentEmojis.unshift(emoji);
      if (recentEmojis.length > 20) recentEmojis.pop();
      sessionStorage.setItem("recentEmojis", JSON.stringify(recentEmojis));
      if (categoryId === "recent") renderCategory("recent");
    };
    emojiGrid.appendChild(span);
  });
}

// Mostrar categoría por defecto
renderCategory("smileys");

