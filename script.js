const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const ttlSelect = document.getElementById('ttl-select');

sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

function sendMessage() {
  const text = messageInput.value.trim();
  const ttl = parseInt(ttlSelect.value);
  if (!text) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = 'message';
  msgDiv.textContent = text;

  const timerSpan = document.createElement('span');
  timerSpan.className = 'timer';
  timerSpan.textContent = `${ttl}s`;
  msgDiv.appendChild(timerSpan);

  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  messageInput.value = '';

  let remaining = ttl;
  const interval = setInterval(() => {
    remaining--;
    timerSpan.textContent = `${remaining}s`;
    if (remaining <= 0) {
      clearInterval(interval);
      msgDiv.style.opacity = '0';
      setTimeout(() => chatBox.removeChild(msgDiv), 500);
    }
  }, 1000);
}
