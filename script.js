import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove, onValue, set, onDisconnect } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

const translations = { /* Same as before, all languages */ };

// ✅ Default language
let currentLang = "en";
let currentUserCount = 0;

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  document.querySelector(".chat-header h2").textContent = translations[lang].appName;
  document.querySelector("#message-input").placeholder = translations[lang].messagePlaceholder;
  document.querySelector("#invite-btn").textContent = translations[lang].inviteBtn;
  document.getElementById("messages-info").textContent = translations[lang].messagesDisappear;
  document.querySelector("#send-btn").textContent = translations[lang].sendBtn;
  document.querySelector("#new-room-btn").textContent = translations[lang].newRoomBtn;
  updateUsersLiveText();
}

const languageSelect = document.getElementById("language-select");
languageSelect.addEventListener("change", e => setLanguage(e.target.value));

function updateUsersLiveText() {
  document.getElementById("room-users").textContent = `🔴 ${currentUserCount} ${translations[currentLang].usersLive}`;
}

// ===== Identity =====
const animals = ["Fox","Panda","Tiger","Octopus","Wolf","Eagle","Bear","Owl"];
const colors = ["Red","Blue","Green","Purple","Orange","Pink"];
const animalEmoji = {Fox:"🦊",Panda:"🐼",Tiger:"🐯",Octopus:"🐙",Wolf:"🐺",Eagle:"🦅",Bear:"🐻",Owl:"🦉"};

function generateIdentity() {
  const animal = animals[Math.floor(Math.random()*animals.length)];
  const color = colors[Math.floor(Math.random()*colors.length)];
  const id = Math.floor(Math.random()*900+100);
  return {name:`${color} ${animal} ${id}`, emoji:animalEmoji[animal]};
}
const identity = generateIdentity();
console.log("Identity:", identity.emoji, identity.name);

// 🔥 Firebase
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  databaseURL: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ===== Room =====
function generateRoomId(){return Math.random().toString(36).substring(2,10);}
let roomId = location.hash.replace("#room=","") || generateRoomId();
if(!location.hash) location.hash = "room="+roomId;

const roomRef = ref(db,"rooms/"+roomId);
const typingRef = ref(db,`rooms/${roomId}/typing`);
const userRef = ref(db,`rooms/${roomId}/users/${identity.name}`);

set(userRef,{name:identity.name,emoji:identity.emoji,joinedAt:Date.now()});
onDisconnect(userRef).remove();

const usersRef = ref(db,`rooms/${roomId}/users`);
onValue(usersRef, snapshot => {
  const users = snapshot.val()||{};
  currentUserCount = Object.keys(users).length;
  updateUsersLiveText();
});

// ===== Messages =====
const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const MESSAGE_TTL = 10;

function sendMessage(){
  if(!input.value) return;
  push(roomRef,{text:input.value,ttl:MESSAGE_TTL,createdAt:Date.now(),user:identity});
  input.value=""; input.style.height="auto"; input.rows=1; input.scrollTop=0;
  remove(typingRef);
}
sendBtn.onclick=sendMessage;

input.addEventListener("keydown", e=>{
  if(e.key==="Enter" && e.shiftKey){e.preventDefault();
    const start=input.selectionStart,end=input.selectionEnd;
    input.value=input.value.substring(0,start)+"\n"+input.value.substring(end);
    input.selectionStart=input.selectionEnd=start+1;
    return;
  }
  if(e.key==="Enter" && !e.shiftKey){e.preventDefault(); sendMessage();}
});

input.addEventListener("input",()=>{
  const lines = input.value.split("\n").length;
  input.rows = lines>1?lines:1;
  push(typingRef,{user:identity,at:Date.now()});
  if(typingTimeout) clearTimeout(typingTimeout);
  typingTimeout=setTimeout(()=>remove(typingRef),1500);
});

let typingTimeout=null;
const typingIndicator = document.getElementById("typing-indicator");

onChildAdded(typingRef, snap=>{
  const data = snap.val();
  if(!data||data.user.name===identity.name) return;
  typingIndicator.textContent = `${data.user.emoji} ${data.user.name} ${translations[currentLang].typingIndicator}`;
  setTimeout(()=>{typingIndicator.textContent="";},2000);
});

// Virtualized messages for scalability
onChildAdded(roomRef, snap=>{
  const msg = snap.val(); if(!msg) return;
  const msgRef = snap.ref;
  const now=Date.now(),elapsed=Math.floor((now-msg.createdAt)/1000),remaining=msg.ttl-elapsed;
  if(remaining<=0){remove(msgRef); return;}
  const div=document.createElement("div"); div.className="message";
  if(msg.user.name===identity.name){div.style.background="#2563eb";}
  div.innerHTML=`<strong>${msg.user.emoji} ${msg.user.name}</strong><br>${msg.text}<span>${remaining}s</span>`;
  chatBox.appendChild(div);
  chatBox.scrollTop=chatBox.scrollHeight;
  const span=div.querySelector("span");
  let timer=setInterval(()=>{
    let r=parseInt(span.textContent);
    r--; span.textContent=r+"s";
    if(r<=0){clearInterval(timer); div.remove(); remove(msgRef);}
  },1000);
});

// Invite & New Room
document.getElementById("invite-btn").addEventListener("click", ()=>{
  const url=window.location.href;
  const text=`${translations[currentLang].invitedToChat}: ${url}`;
  navigator.clipboard.writeText(text).catch(console.error);
  const msgDiv=document.createElement("div");
  msgDiv.style.textAlign="center"; msgDiv.style.fontSize="12px"; msgDiv.style.opacity="0.6"; msgDiv.style.margin="8px 0";
  msgDiv.textContent=text; chatBox.appendChild(msgDiv); chatBox.scrollTop=chatBox.scrollHeight;
  setTimeout(()=>msgDiv.remove(),3000);
});

document.getElementById("new-room-btn").addEventListener("click",()=>{
  const newRoomId=generateRoomId(); location.hash="room="+newRoomId;
  const msgDiv=document.createElement("div");
  msgDiv.style.textAlign="center"; msgDiv.style.fontSize="12px"; msgDiv.style.opacity="0.6"; msgDiv.style.margin="8px 0";
  msgDiv.textContent=translations[currentLang].newRoomSystem; chatBox.appendChild(msgDiv);
  setTimeout(()=>msgDiv.remove(),3000);
});
