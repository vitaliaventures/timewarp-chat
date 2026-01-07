import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  remove,
  onValue,
  set,
  onDisconnect
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

// --- Traducciones y multilenguaje
// (Se mantiene igual que tu versión, con todos los idiomas)

let currentLang = "en";
let currentUserCount = 0;

// Función para cambiar idioma
function setLanguage(lang) {
  if (!translations[lang]) lang = "en"; // fallback
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
  document.getElementById("room-users").textContent =
    `🔴 ${currentUserCount} ${translations[currentLang].usersLive}`;
}

// --- Identidad efímera
const animals = ["Fox","Panda","Tiger","Octopus","Wolf","Eagle","Bear","Owl"];
const colors = ["Red","Blue","Green","Purple","Orange","Pink"];
const animalEmoji = {Fox:"🦊",Panda:"🐼",Tiger:"🐯",Octopus:"🐙",Wolf:"🐺",Eagle:"🦅",Bear:"🐻",Owl:"🦉"};
const identity = (() => {
  const animal = animals[Math.floor(Math.random()*animals.length)];
  const color = colors[Math.floor(Math.random()*colors.length)];
  const id = Math.floor(Math.random()*900+100);
  return {name:`${color} ${animal} ${id}`, emoji: animalEmoji[animal]};
})();
console.log("Your identity:", identity.emoji, identity.name);

// --- Firebase
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

// --- Sala
let roomId = location.hash.replace("#room=","");
if(!roomId){ roomId = Math.random().toString(36).substring(2,10); location.hash="room="+roomId; }
const roomRef = ref(db,"rooms/"+roomId);
const typingRef = ref(db,`rooms/${roomId}/typing`);
const userRef = ref(db,`rooms/${roomId}/users/${identity.name}`);
set(userRef,{name:identity.name,emoji:identity.emoji,joinedAt:Date.now()});
onDisconnect(userRef).remove();

// --- Contador de usuarios
const usersRef = ref(db,`rooms/${roomId}/users`);
onValue(usersRef,snapshot=>{
  const users = snapshot.val()||{};
  currentUserCount = Object.keys(users).length;
  updateUsersLiveText();
});

// --- Chat UI
const chatBox = document.getElementById("chat-box");
function showSystemMessage(text){
  const div = document.createElement("div");
  div.style.textAlign="center";
  div.style.fontSize="12px";
  div.style.opacity="0.6";
  div.style.margin="6px 0";
  div.textContent=text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// --- Send
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

// --- Enter / Shift+Enter
input.addEventListener("keydown",e=>{
  if(e.key==="Enter"&&!e.shiftKey){ e.preventDefault(); sendMessage(); }
  if(e.key==="Enter"&&e.shiftKey){ e.preventDefault();
    const start=input.selectionStart,end=input.selectionEnd;
    input.value=input.value.substring(0,start)+"\n"+input.value.substring(end);
    input.selectionStart=input.selectionEnd=start+1;
  }
});

// --- Auto-expand textarea
input.addEventListener("input",()=>{
  const lines=input.value.split("\n").length;
  input.rows=lines>1?lines:1;
});

// --- Typing indicator
let typingTimeout=null;
input.addEventListener("input",()=>{
  push(typingRef,{user:identity,at:Date.now()});
  if(typingTimeout) clearTimeout(typingTimeout);
  typingTimeout=setTimeout(()=>remove(typingRef),1500);
});

// --- Receive messages (virtual scroll friendly)
onChildAdded(roomRef,snap=>{
  const msg=snap.val(),msgRef=snap.ref;
  const now=Date.now(),elapsed=Math.floor((now-msg.createdAt)/1000);
  let remaining=msg.ttl-elapsed;
  if(remaining<=0){ remove(msgRef); return; }

  const div=document.createElement("div"); div.className="message";
  if(msg.user.name===identity.name){
    const colors=["#2563eb","#16a34a","#db2777","#f59e0b","#8b5cf6","#ef4444"];
    let randomColor; do{ randomColor=colors[Math.floor(Math.random()*colors.length)]; }while(chatBox.lastChild&&chatBox.lastChild.style.background===randomColor);
    div.style.background=randomColor;
  }
  div.innerHTML=`<strong>${msg.user.emoji} ${msg.user.name}</strong><br>${msg.text}<span>${remaining}s</span>`;
  chatBox.appendChild(div);

  // autoscroll eficiente
  requestAnimationFrame(()=> chatBox.scrollTop=chatBox.scrollHeight);

  const span=div.querySelector("span");
  const timer=setInterval(()=>{
    remaining--; span.textContent=remaining+"s";
    if(remaining<=0){ clearInterval(timer); div.remove(); remove(msgRef); }
  },1000);
});

// --- Typing indicator
const typingIndicator = document.getElementById("typing-indicator");
onChildAdded(typingRef,snap=>{
  const data = snap.val();
  if(!data||data.user.name===identity.name) return;
  typingIndicator.textContent=`${data.user.emoji} ${data.user.name} ${translations[currentLang].typingIndicator}`;
  setTimeout(()=>typingIndicator.textContent="",2000);
});

// --- Invite
const inviteBtn=document.getElementById("invite-btn");
inviteBtn.addEventListener("click",()=>{
  const roomUrl=window.location.href;
  const fullText=`${translations[currentLang].invitedToChat}: ${roomUrl}`;
  navigator.clipboard.writeText(fullText).catch(err=>console.error(err));
  showSystemMessage(fullText);
  setTimeout(()=> chatBox.lastChild?.remove(),3000);
});

// --- New Room
const newRoomBtn=document.getElementById("new-room-btn");
newRoomBtn.addEventListener("click",()=>{
  const newRoomId=Math.random().toString(36).substring(2,10);
  location.hash="room="+newRoomId;
  showSystemMessage(translations[currentLang].newRoomSystem);
  newRoomBtn.disabled=true;
  setTimeout(()=>newRoomBtn.disabled=false,1000);
});
