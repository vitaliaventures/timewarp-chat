// --- 🔹 Import Firebase modules 🔹 ---
// --- 🔹 Firebase Configuration y compat 🔹 ---
const firebaseConfig = {
  apiKey: "AIzaSyA1dHSzOC6_Zo8sTBg1pfqYJTEFTKDlP24",
  authDomain: "timewarp-messenger.firebaseapp.com",
  databaseURL: "https://timewarp-messenger-default-rtdb.firebaseio.com",
  projectId: "timewarp-messenger",
  storageBucket: "timewarp-messenger.firebasestorage.app",
  messagingSenderId: "71563132014",
  appId: "1:71563132014:web:901218a830abd48c74fa7f",
  measurementId: "G-PPWR2ZSXJD"
};

// Inicializar Firebase (versión compat)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();


// --- 🔹 Firebase Configuration 🔹 ---
const firebaseConfig = {
  apiKey: "AIzaSyA1dHSzOC6_Zo8sTBg1pfqYJTEFTKDlP24",
  authDomain: "timewarp-messenger.firebaseapp.com",
  databaseURL: "https://timewarp-messenger-default-rtdb.firebaseio.com",
  projectId: "timewarp-messenger",
  storageBucket: "timewarp-messenger.firebasestorage.app",
  messagingSenderId: "71563132014",
  appId: "1:71563132014:web:901218a830abd48c74fa7f",
  measurementId: "G-PPWR2ZSXJD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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

  const msgRef = push(ref(db, `rooms/${roomId}`));
  set(msgRef, {
    text,
    ttl,
    timestamp: Date.now()
  });
  messageInput.value = '';
}

// --- 🔹 Listen for new messages 🔹 ---
onChildAdded(ref(db, `rooms/${roomId}`), (snapshot) => {
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
      remove(ref(db, `rooms/${roomId}/${key}`));
    }
  }, 1000);
}
