const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const ttlInput = document.getElementById("ttl-input");

function parseTTL(value) {
  const [m, s] = value.split(":").map(Number);
  return (m * 60 + s) * 1000;
}

function addMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message";
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;

  const ttl = parseTTL(ttlInput.value || "01:00");
  setTimeout(() => msg.remove(), ttl);
}

sendBtn.addEventListener("click", () => {
  if (!input.value.trim()) return;
  addMessage(input.value.trim());
  input.value = "";
});

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendBtn.click();
  }
});
