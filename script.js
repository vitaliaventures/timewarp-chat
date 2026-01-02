// --- Firebase Configuration ---
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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// --- Elements ---
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const ttlSelect = document.getElementById('ttl-select');
const roomInput = document.getElementById('room-id-input');
const joinRoomBtn = document.getElementById('join-room-btn');

let roomId = null;

// --- Join Room ---
joinRoomBtn.addEventListener('click', () => {
  const id = roomInput.value.trim();
  if (!id) return alert("Enter a valid room ID");
  roomId = id;

  // Activar inputs
  messageInput.disabled = false;
  ttlSelect.disabled = false;
  sendBtn.disabled = false;
  roomInput.disabled = true;
  joinRoomBtn.disabled = true;

  // Escuchar mensajes de Firebase
  firebase.database().ref(`rooms/${roomId}`).on('child_added', snapshot => {
    const msg = snapshot.val();
    displayMessage(snapshot.key, msg);
  });
});

// --- Send message ---
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const text = messageInput.value.trim();
  const ttl = parseInt(ttlSelect.value);
  if (!text || !roomId) return;

  const msgRef = firebase.database().ref(`rooms/${roomId}`).push();
  msgRef.set({
    text,
    ttl,
    timestamp: Date.now()
  });
  messageInput.value = '';
}

// --- Display message & handle countdown ---
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
      firebase.database().ref(`rooms/${roomId}/${key}`).remove();
    }
  }, 1000);
}
