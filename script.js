import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  onValue,
  remove,
  set,
  onDisconnect
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";




// 🌐 Translations object — full list of languages like Privnote.com
const translations = {
  en: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Type message...",
    inviteBtn: "Invite 🚀",
    messagesDisappear: "Messages disappear after 10 seconds",
    roomLinkCopied: "Room link copied! 🚀 Share it with friends!",
    typingIndicator: "is typing…",
    sendBtn: "Send", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} user${count !== 1 ? "s" : ""} in room`,
    newRoomBtn: "New ✨",
    newRoomTitle: "New Private Room ✨"

  },
  de: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Nachricht eingeben...",
    inviteBtn: "Einladen 🚀",
    messagesDisappear: "Nachrichten verschwinden nach 10 Sekunden",
    roomLinkCopied: "Raumlink kopiert! 🚀 Mit Freunden teilen!",
    typingIndicator: "schreibt…",
    sendBtn: "Senden", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} Benutzer${count !== 1 ? "" : ""} im Raum`,
    newRoomBtn: "Neu ✨",
    newRoomTitle: "Neuer privater Raum ✨"

  },
  es: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Escribe tu mensaje...",
    inviteBtn: "Invitar 🚀",
    messagesDisappear: "Los mensajes desaparecen después de 10 segundos",
    roomLinkCopied: "¡Enlace de la sala copiado! 🚀 Compártelo con amigos",
    typingIndicator: "está escribiendo…",
    sendBtn: "Enviar", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} Benutzer${count !== 1 ? "" : ""} im Raum`,
    newRoomBtn: "Neu ✨",
    newRoomTitle: "Neuer privater Raum ✨"

  },
  fr: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Tapez votre message...",
    inviteBtn: "Inviter 🚀",
    messagesDisappear: "Les messages disparaissent après 10 secondes",
    roomLinkCopied: "Lien de la salle copié ! 🚀 Partagez avec vos amis !",
    typingIndicator: "est en train d’écrire…",
    sendBtn: "Envoyer", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} utilisateur${count !== 1 ? "s" : ""} dans la salle`,
    newRoomBtn: "Nouveau ✨",
    newRoomTitle: "Nouvelle salle privée ✨"

  },
  it: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Scrivi un messaggio...",
    inviteBtn: "Invita 🚀",
    messagesDisappear: "I messaggi scompaiono dopo 10 secondi",
    roomLinkCopied: "Link della stanza copiato! 🚀 Condividilo con gli amici!",
    typingIndicator: "sta scrivendo…",
    sendBtn: "Invia", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} utilisateur${count !== 1 ? "s" : ""} dans la salle`,
    newRoomBtn: "Nouveau ✨",
    newRoomTitle: "Nouvelle salle privée ✨"

  },
  pt: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Digite sua mensagem...",
    inviteBtn: "Convidar 🚀",
    messagesDisappear: "As mensagens desaparecem após 10 segundos",
    roomLinkCopied: "Link da sala copiado! 🚀 Compartilhe com amigos!",
    typingIndicator: "está digitando…",
    sendBtn: "Enviar", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} usuário${count !== 1 ? "s" : ""} na sala`,
    newRoomBtn: "Novo ✨",
    newRoomTitle: "Nova sala privada ✨"

  },
  ru: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Введите сообщение...",
    inviteBtn: "Пригласить 🚀",
    messagesDisappear: "Сообщения исчезают через 10 секунд",
    roomLinkCopied: "Ссылка на комнату скопирована! 🚀 Поделитесь с друзьями!",
    typingIndicator: "печатает…",
    sendBtn: "Отправить", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} пользователь${count !== 1 ? "я" : ""} в комнате`,
    newRoomBtn: "Новая ✨",
    newRoomTitle: "Новая приватная комната ✨"

  },
  ja: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "メッセージを入力...",
    inviteBtn: "招待 🚀",
    messagesDisappear: "メッセージは10秒後に消えます",
    roomLinkCopied: "ルームリンクをコピーしました！🚀 友達と共有しよう！",
    typingIndicator: "が入力中…",
    sendBtn: "送信", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} 人が参加中`,
    newRoomBtn: "新規 ✨",
    newRoomTitle: "新しいプライベートルーム ✨"

  },
  ko: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "메시지를 입력하세요...",
    inviteBtn: "초대 🚀",
    messagesDisappear: "메시지는 10초 후에 사라집니다",
    roomLinkCopied: "방 링크가 복사되었습니다! 🚀 친구와 공유하세요!",
    typingIndicator: "입력 중…",
    sendBtn: "보내기", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} 人が参加中`,
    newRoomBtn: "新規 ✨",
    newRoomTitle: "新しいプライベートルーム ✨"

  },
  zh: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "输入消息...",
    inviteBtn: "邀请 🚀",
    messagesDisappear: "消息将在10秒后消失",
    roomLinkCopied: "房间链接已复制！🚀 与朋友分享！",
    typingIndicator: "正在输入…",
    sendBtn: "发送", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} 位用户在线`,
    newRoomBtn: "新建 ✨",
    newRoomTitle: "新的私人房间 ✨"

  },
  nl: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Typ een bericht...",
    inviteBtn: "Uitnodigen 🚀",
    messagesDisappear: "Berichten verdwijnen na 10 seconden",
    roomLinkCopied: "Kamplink gekopieerd! 🚀 Deel met vrienden!",
    typingIndicator: "is aan het typen…",
    sendBtn: "Verzenden", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} gebruiker${count !== 1 ? "s" : ""} in de kamer`,
    newRoomBtn: "Nieuw ✨",
    newRoomTitle: "Nieuwe privéruimte ✨"

  },
  tr: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Mesaj yazın...",
    inviteBtn: "Davet Et 🚀",
    messagesDisappear: "Mesajlar 10 saniye sonra kaybolur",
    roomLinkCopied: "Oda linki kopyalandı! 🚀 Arkadaşlarla paylaş!",
    typingIndicator: "yazıyor…",
    sendBtn: "Gönder", // ✅ NUEVO
    usersInRoom: (count) => `👥 Odada ${count} kullanıcı`,
    newRoomBtn: "Yeni ✨",
    newRoomTitle: "Yeni özel oda ✨"

  },
  ar: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "اكتب رسالتك...",
    inviteBtn: "دعوة 🚀",
    messagesDisappear: "الرسائل تختفي بعد 10 ثوانٍ",
    roomLinkCopied: "تم نسخ رابط الغرفة! 🚀 شاركه مع الأصدقاء!",
    typingIndicator: "يكتب…",
    sendBtn: "إرسال", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} مستخدم في الغرفة`,
    newRoomBtn: "جديد ✨",
    newRoomTitle: "غرفة خاصة جديدة ✨"

  },
  pl: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Wpisz wiadomość...",
    inviteBtn: "Zaproś 🚀",
    messagesDisappear: "Wiadomości znikają po 10 sekundach",
    roomLinkCopied: "Link do pokoju skopiowany! 🚀 Udostępnij znajomym!",
    typingIndicator: "pisze…",
    sendBtn: "Wyślij", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} użytkownik${count !== 1 ? "ów" : ""} w pokoju`,
    newRoomBtn: "Nowy ✨",
    newRoomTitle: "Nowy prywatny pokój ✨"

  },
  sv: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Skriv meddelande...",
    inviteBtn: "Bjud in 🚀",
    messagesDisappear: "Meddelanden försvinner efter 10 sekunder",
    roomLinkCopied: "Rums-länk kopierad! 🚀 Dela med vänner!",
    typingIndicator: "skriver…",
    sendBtn: "Skicka", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} användare i rummet`,
    newRoomBtn: "Ny ✨",
    newRoomTitle: "Nytt privat rum ✨"

  },
  fi: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Kirjoita viesti...",
    inviteBtn: "Kutsu 🚀",
    messagesDisappear: "Viestit katoavat 10 sekunnin kuluttua",
    roomLinkCopied: "Huoneen linkki kopioitu! 🚀 Jaa ystäville!",
    typingIndicator: "kirjoittaa…",
    sendBtn: "Lähetä", // ✅ NUEVO
    usersInRoom: (count) => `👥 ${count} käyttäjää huoneessa`,
    newRoomBtn: "Uusi ✨",
    newRoomTitle: "Uusi yksityinen huone ✨"

  }
};

// ✅ Default language
let currentLang = "en";

// Function to change language
function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;

  // Example: update static UI elements
  document.querySelector(".chat-header h2").textContent = translations[lang].appName;
  document.querySelector("#message-input").placeholder = translations[lang].messagePlaceholder;
  document.querySelector("#invite-btn").textContent = translations[lang].inviteBtn;
  document.getElementById("messages-ttl").textContent = translations[lang].messagesDisappear;
  document.querySelector("#send-btn").textContent = translations[lang].sendBtn; // ✅ NUEVO
  document.querySelector("#new-room-btn").textContent = translations[lang].newRoomBtn;
}


const languageSelect = document.getElementById("language-select");

// Cambiar idioma al seleccionar
languageSelect.addEventListener("change", (e) => {
  setLanguage(e.target.value);
});




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
const roomUsers = document.getElementById("room-users");


function showSystemMessage(text) {
  const div = document.createElement("div");
  div.style.textAlign = "center";
  div.style.fontSize = "12px";
  div.style.opacity = "0.6";
  div.style.margin = "8px 0";
  div.textContent = text;
  chatBox.appendChild(div);
}

const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
setLanguage("en"); // default language when user enters


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
const usersRef = ref(db, `rooms/${roomId}/users`);
const typingRef = ref(db, `rooms/${roomId}/typing`);

// ✅ REAL USER PRESENCE (NO DUPLICA EN REFRESH)
const userId = Math.random().toString(36).slice(2);

const userRef = ref(db, `rooms/${roomId}/users/${userId}`);

onValue(ref(db, ".info/connected"), (snap) => {
  if (snap.val() === true) {
    onDisconnect(userRef).remove();

    set(userRef, {
      name: identity.name,
      joinedAt: Date.now()
    });
  }
});


// ✅ live user counter
onValue(usersRef, (snap) => {
  const count = snap.exists() ? Object.keys(snap.val()).length : 1;
  roomUsers.textContent = translations[currentLang].usersInRoom(count);
});




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
  input.rows = 1;        // 🔥 fuerza colapso inmediato
  input.scrollTop = 0;  // limpia cualquier scroll interno
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
  const lines = input.value.split("\n").length;

  if (lines === 1) {
    input.style.height = "auto";
    input.rows = 1;
  } else {
    input.rows = lines;
  }
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
  // 💡 Array de colores limpios y contrastantes
  const colors = ["#2563eb", "#16a34a", "#db2777", "#f59e0b", "#8b5cf6", "#ef4444"];

  // Elegir un color aleatorio distinto del anterior (opcional)
  let randomColor;
  do {
    randomColor = colors[Math.floor(Math.random() * colors.length)];
  } while (chatBox.lastChild && chatBox.lastChild.style.background === randomColor);

  div.style.background = randomColor;
}


  div.innerHTML = `
    <strong>${msg.user.emoji} ${msg.user.name}</strong><br>
    ${msg.text}
    <span>${remaining}s</span>
  `;

  chatBox.appendChild(div);
// 🔥 AUTOSCROLL SIEMPRE AL FINAL
 chatBox.scrollTop = chatBox.scrollHeight;
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

  typingIndicator.textContent = `${data.user.emoji} ${data.user.name} ${translations[currentLang].typingIndicator}`;


  // auto-clear
  setTimeout(() => {
    typingIndicator.textContent = "";
  }, 2000);
});

/* ===== INVITE ROOM (Share Link) ===== */
const inviteBtn = document.getElementById("invite-btn");

inviteBtn.addEventListener("click", () => {
  const roomUrl = window.location.href;
  navigator.clipboard.writeText(roomUrl);

  showSystemMessage("🔗 Room link copied — share it to invite someone");

  setTimeout(() => {
    chatBox.lastChild?.remove();
  }, 3000);
});


// 🆕 CREATE NEW ROOM
const newRoomBtn = document.getElementById("new-room-btn");

newRoomBtn.addEventListener("click", () => {
  const newRoomId = generateRoomId();
  location.hash = "room=" + newRoomId;

  showSystemMessage("🆕 New private room created — invite someone to start chatting");

setTimeout(() => {
  chatBox.lastChild?.remove();
}, 3000);


  const title = document.getElementById("room-title");
  title.textContent = translations[currentLang].newRoomTitle;
  setTimeout(() => {
    title.textContent = "TimeWarp Messenger";
  }, 2000);

  newRoomBtn.disabled = true;
  setTimeout(() => newRoomBtn.disabled = false, 1000);
});







