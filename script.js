// --- 🔹 Firebase Configuration 🔹 ---
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_AUTH_DOMAIN",
  databaseURL: "TU_DATABASE_URL",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_STORAGE_BUCKET",
  messagingSenderId: "TU_MESSAGING_ID",
  appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- 🔹 Elements 🔹 ---
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const ttlSelect = document.getElementById('ttl-select');

// --- 🔹 Sala única (para dos usuarios) 🔹 ---
let roomId = prompt("Enter chat room ID (any text)");

// --- 🔹 Send message 🔹 ---
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const text = messageInput.value.trim();
  const ttl = parseInt(ttlSelect.value);
  if (!text) return;

  const msgData = {
    text,
    ttl,
    timestamp: Date.now()
  };

  const newMsgKey = db.ref(`rooms/${roomId}`).push().key;
  db.ref(`rooms/${roomId}/${newMsgKey}`).set(msgData);
  messageInput.value = '';
}

// --- 🔹 Listen for new messages 🔹 ---
db.ref(`rooms/${roomId}`).on('child_added', snapshot => {
  const msg = snapshot.val();
  displayMessage(snapshot.key, msg);
});

// --- 🔹 Display message and handle countdown 🔹 ---
function displayMessage(key, msg) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message';
  msgDiv.textContent = msg.text;

  const timerSpan = document.createElement('span');
  timerSpan.className = 'timer';
  timerSpan.textContent = `${msg.ttl}s`;
  msgDiv.appendChild(timerSpan);

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  let remaining = msg.ttl;
  const interval = setInterval(() => {
    remaining--;
    timerSpan.textContent = `${remaining}s`;
    if (remaining <= 0) {
      clearInterval(interval);
      msgDiv.style.opacity = '0';
      setTimeout(() => chatBox.removeChild(msgDiv), 500);
      // Remove from Firebase
      db.ref(`rooms/${roomId}/${key}`).remove();
    }
  }, 1000);
}
