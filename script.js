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
    usersLive: "live",
    newRoomBtn: "New ✨",
    newRoomSystem: "🆕 New private room created — invite someone to start chatting",
    invitedToChat: "You were invited to chat",
    destroyRoomBtn: "Destroy ❌",
    destroyConfirm: "Are you sure you want to destroy this room? This will make it inactive for everyone.",
    roomDestroyedMsg: "🚨 This room has been destroyed. It is now inactive.",
    roomDestroyedOverlay: "💀 Room destroyed. It is now inactive.",
    roomExpired: "⛔ This room has expired"

  },
  de: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Nachricht eingeben...",
    inviteBtn: "Einladen 🚀",
    messagesDisappear: "Nachrichten verschwinden nach 10 Sekunden",
    roomLinkCopied: "Raumlink kopiert! 🚀 Mit Freunden teilen!",
    typingIndicator: "schreibt…",
    sendBtn: "Senden", // ✅ NUEVO
    usersLive: "live",
    newRoomBtn: "Neu ✨",
    newRoomSystem: "🆕 Neuer privater Raum erstellt — lade jemanden zum Chatten ein",
    invitedToChat: "Du wurdest zum Chat eingeladen",
    destroyRoomBtn: "Zerstören ❌",
    destroyConfirm: "Bist du sicher, dass du diesen Raum zerstören möchtest? Er wird für alle inaktiv.",
    roomDestroyedMsg: "🚨 Dieser Raum wurde zerstört. Er ist jetzt inaktiv.",
    roomDestroyedOverlay: "💀 Raum zerstört. Jetzt inaktiv.",
    roomExpired: "⛔ Dieser Raum ist abgelaufen"

  },
  es: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Escribe tu mensaje...",
    inviteBtn: "Invitar 🚀",
    messagesDisappear: "Los mensajes desaparecen después de 10 segundos",
    roomLinkCopied: "¡Enlace de la sala copiado! 🚀 Compártelo con amigos",
    typingIndicator: "está escribiendo…",
    sendBtn: "Enviar", // ✅ NUEVO
    usersLive: "live",
    newRoomBtn: "Nuevo ✨",
    newRoomSystem: "🆕 Nueva sala privada creada — invita a alguien para empezar a chatear",
    invitedToChat: "Te invitaron a chatear",
    destroyRoomBtn: "Destruir ❌",
    destroyConfirm: "¿Seguro que deseas destruir esta sala? Será inactiva para todos.",
    roomDestroyedMsg: "🚨 Esta sala ha sido destruida. Ahora está inactiva.",
    roomDestroyedOverlay: "💀 Sala destruida. Ahora está inactiva.",
    roomExpired: "⛔ Esta sala ha expirado"


  },
  fr: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Tapez votre message...",
    inviteBtn: "Inviter 🚀",
    messagesDisappear: "Les messages disparaissent après 10 secondes",
    roomLinkCopied: "Lien de la salle copié ! 🚀 Partagez avec vos amis !",
    typingIndicator: "est en train d’écrire…",
    sendBtn: "Envoyer", // ✅ NUEVO
    usersLive: "en direct",
    newRoomBtn: "Nouveau ✨",
    newRoomSystem: "🆕 Nouvelle salle privée créée — invitez quelqu’un à discuter",
    invitedToChat: "Vous avez été invité à discuter",
    destroyRoomBtn: "Détruire ❌",
    destroyConfirm: "Êtes-vous sûr de vouloir détruire cette salle ? Elle deviendra inactive pour tous.",
    roomDestroyedMsg: "🚨 Cette salle a été détruite. Elle est maintenant inactive.",
    roomDestroyedOverlay: "💀 Salle détruite. Désormais inactive.",
    roomExpired: "⛔ Cette salle a expiré"

  },
  it: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Scrivi un messaggio...",
    inviteBtn: "Invita 🚀",
    messagesDisappear: "I messaggi scompaiono dopo 10 secondi",
    roomLinkCopied: "Link della stanza copiato! 🚀 Condividilo con gli amici!",
    typingIndicator: "sta scrivendo…",
    sendBtn: "Invia", // ✅ NUEVO
    usersLive: "in diretta",
    newRoomBtn: "Nuovo ✨",
    newRoomSystem: "🆕 Nuova stanza privata creata — invita qualcuno a iniziare la chat",
    invitedToChat: "Sei stato invitato a chattare",
    destroyRoomBtn: "Distruggi ❌",
    destroyConfirm: "Sei sicuro di voler distruggere questa stanza? Diventerà inattiva per tutti.",
    roomDestroyedMsg: "🚨 Questa stanza è stata distrutta. Ora è inattiva.",
    roomDestroyedOverlay: "💀 Stanza distrutta. Ora inattiva.",
    roomExpired: "⛔ Questa stanza è scaduta"

  },
  pt: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Digite sua mensagem...",
    inviteBtn: "Convidar 🚀",
    messagesDisappear: "As mensagens desaparecem após 10 segundos",
    roomLinkCopied: "Link da sala copiado! 🚀 Compartilhe com amigos!",
    typingIndicator: "está digitando…",
    sendBtn: "Enviar", // ✅ NUEVO
    usersLive: "ao vivo",
    newRoomBtn: "Novo ✨",
    newRoomSystem: "🆕 Nova sala privada criada — convide alguém para começar a conversar",
    invitedToChat: "Você foi convidado para conversar",
    destroyRoomBtn: "Destruir ❌",
    destroyConfirm: "Tem certeza de que deseja destruir esta sala? Ela ficará inativa para todos.",
    roomDestroyedMsg: "🚨 Esta sala foi destruída. Agora está inativa.",
    roomDestroyedOverlay: "💀 Sala destruída. Agora inativa.",
    roomExpired: "⛔ Esta sala expirou"

  },
  ru: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Введите сообщение...",
    inviteBtn: "Пригласить 🚀",
    messagesDisappear: "Сообщения исчезают через 10 секунд",
    roomLinkCopied: "Ссылка на комнату скопирована! 🚀 Поделитесь с друзьями!",
    typingIndicator: "печатает…",
    sendBtn: "Отправить", // ✅ NUEVO
    usersLive: "онлайн",
    newRoomBtn: "Новый ✨",
    newRoomSystem: "🆕 Создана новая приватная комната — пригласите кого-нибудь начать чат",
    invitedToChat: "Вас пригласили в чат",
    destroyRoomBtn: "Удалить ❌",
    destroyConfirm: "Вы уверены, что хотите Удалить эту комнату? Она станет неактивной для всех.",
    roomDestroyedMsg: "🚨 Эта комната была уничтожена. Теперь она неактивна.",
    roomDestroyedOverlay: "💀 Комната уничтожена. Теперь неактивна.",
    roomExpired: "⛔ Эта комната больше не активна"

     
  },
  ja: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "メッセージを入力...",
    inviteBtn: "招待 🚀",
    messagesDisappear: "メッセージは10秒後に消えます",
    roomLinkCopied: "ルームリンクをコピーしました！🚀 友達と共有しよう！",
    typingIndicator: "が入力中…",
    sendBtn: "送信", // ✅ NUEVO
    usersLive: "接続中",
    newRoomBtn: "新規 ✨",
    newRoomSystem: "🆕 新しいプライベートルームが作成されました — 誰かを招待してチャットを始めましょう",
    invitedToChat: "チャットに招待されました",
    destroyRoomBtn: "削除 ❌",
    destroyConfirm: "このルームを削除してもよろしいですか？全員に対して無効になります。",
    roomDestroyedMsg: "🚨 このルームは削除され、現在は無効です。",
    roomDestroyedOverlay: "💀 ルームは削除されました。",
    roomExpired: "⛔ このルームは期限切れです"

  },
  ko: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "메시지를 입력하세요...",
    inviteBtn: "초대 🚀",
    messagesDisappear: "메시지는 10초 후에 사라집니다",
    roomLinkCopied: "방 링크가 복사되었습니다! 🚀 친구와 공유하세요!",
    typingIndicator: "입력 중…",
    sendBtn: "보내기", // ✅ NUEVO
    usersLive: "접속 중",
    newRoomBtn: "새로 ✨",
    newRoomSystem: "🆕 새로운 비공개 방이 생성되었습니다 — 누군가를 초대해 채팅을 시작하세요",
    invitedToChat: "채팅에 초대되었습니다",
    destroyRoomBtn: "삭제 ❌",
    destroyConfirm: "이 방을 삭제하시겠습니까? 모든 사용자에게 비활성화됩니다.",
    roomDestroyedMsg: "🚨 이 방은 삭제되었으며 현재 비활성 상태입니다.",
    roomDestroyedOverlay: "💀 방이 삭제되었습니다.",
    roomExpired: "⛔ 이 방은 만료되었습니다"

  },
  zh: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "输入消息...",
    inviteBtn: "邀请 🚀",
    messagesDisappear: "消息将在10秒后消失",
    roomLinkCopied: "房间链接已复制！🚀 与朋友分享！",
    typingIndicator: "正在输入…",
    sendBtn: "发送", // ✅ NUEVO
    usersLive: "在线",
    newRoomBtn: "新建 ✨",
    newRoomSystem: "🆕 已创建新的私人房间 — 邀请他人开始聊天",
    invitedToChat: "您被邀请加入聊天",
    destroyRoomBtn: "销毁 ❌",
    destroyConfirm: "确定要销毁这个房间吗？它将对所有人失效。",
    roomDestroyedMsg: "🚨 此房间已被销毁，现在处于非活动状态。",
    roomDestroyedOverlay: "💀 房间已销毁。",
    roomExpired: "⛔ 此房间已失效"
  },
  nl: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Typ een bericht...",
    inviteBtn: "Uitnodigen 🚀",
    messagesDisappear: "Berichten verdwijnen na 10 seconden",
    roomLinkCopied: "Kamplink gekopieerd! 🚀 Deel met vrienden!",
    typingIndicator: "is aan het typen…",
    sendBtn: "Verzenden", // ✅ NUEVO
    usersLive: "live",
    newRoomBtn: "Nieuw ✨",
    newRoomSystem: "🆕 Nieuwe privéruimte aangemaakt — nodig iemand uit om te chatten",
    invitedToChat: "Je bent uitgenodigd om te chatten",
    destroyRoomBtn: "Vernietigen ❌",
    destroyConfirm: "Weet je zeker dat je deze kamer wilt vernietigen? Deze wordt voor iedereen inactief.",
    roomDestroyedMsg: "🚨 Deze kamer is vernietigd. Hij is nu inactief.",
    roomDestroyedOverlay: "💀 Kamer vernietigd. Nu inactief.",
    roomExpired: "⛔ Deze kamer is verlopen"

  },
  tr: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Mesaj yazın...",
    inviteBtn: "Davet Et 🚀",
    messagesDisappear: "Mesajlar 10 saniye sonra kaybolur",
    roomLinkCopied: "Oda linki kopyalandı! 🚀 Arkadaşlarla paylaş!",
    typingIndicator: "yazıyor…",
    sendBtn: "Gönder", // ✅ NUEVO
    usersLive: "canlı",
    newRoomBtn: "Yeni ✨",
    newRoomSystem: "🆕 Yeni özel oda oluşturuldu — sohbet etmeye başlamak için birini davet et",
    invitedToChat: "Sohbete davet edildiniz",
    destroyRoomBtn: "Yok Et ❌",
    destroyConfirm: "Bu odayı yok etmek istediğine emin misin? Herkes için devre dışı kalacak.",
    roomDestroyedMsg: "🚨 Bu oda yok edildi. Artık aktif değil.",
    roomDestroyedOverlay: "💀 Oda yok edildi.",
    roomExpired: "⛔ Bu oda süresi doldu"

  },
  ar: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "اكتب رسالتك...",
    inviteBtn: "دعوة 🚀",
    messagesDisappear: "الرسائل تختفي بعد 10 ثوانٍ",
    roomLinkCopied: "تم نسخ رابط الغرفة! 🚀 شاركه مع الأصدقاء!",
    typingIndicator: "يكتب…",
    sendBtn: "إرسال", // ✅ NUEVO
    usersLive: "متصل",
    newRoomBtn: "جديد ✨",
    newRoomSystem: "🆕 تم إنشاء غرفة خاصة جديدة — ادعُ شخصًا لبدء الدردشة",
    invitedToChat: "لقد تم دعوتك للدردشة",
    destroyRoomBtn: "تدمير ❌",
    destroyConfirm: "هل أنت متأكد من تدمير هذه الغرفة؟ ستصبح غير نشطة للجميع.",
    roomDestroyedMsg: "🚨 تم تدمير هذه الغرفة وأصبحت غير نشطة.",
    roomDestroyedOverlay: "💀 تم تدمير الغرفة.",
    roomExpired: "⛔ انتهت صلاحية هذه الغرفة"

  },
  pl: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Wpisz wiadomość...",
    inviteBtn: "Zaproś 🚀",
    messagesDisappear: "Wiadomości znikają po 10 sekundach",
    roomLinkCopied: "Link do pokoju skopiowany! 🚀 Udostępnij znajomym!",
    typingIndicator: "pisze…",
    sendBtn: "Wyślij", // ✅ NUEVO
    usersLive: "na żywo",
    newRoomBtn: "Nowy ✨",
    newRoomSystem: "🆕 Utworzono nowy prywatny pokój — zaproś kogoś, aby rozpocząć czat",
    invitedToChat: "Zostałeś zaproszony do czatu",
    destroyRoomBtn: "Zniszcz ❌",
    destroyConfirm: "Czy na pewno chcesz zniszczyć ten pokój? Będzie nieaktywny dla wszystkich.",
    roomDestroyedMsg: "🚨 Ten pokój został zniszczony. Jest teraz nieaktywny.",
    roomDestroyedOverlay: "💀 Pokój zniszczony.",
    roomExpired: "⛔ Ten pokój wygasł"

  },
  sv: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Skriv meddelande...",
    inviteBtn: "Bjud in 🚀",
    messagesDisappear: "Meddelanden försvinner efter 10 sekunder",
    roomLinkCopied: "Rums-länk kopierad! 🚀 Dela med vänner!",
    typingIndicator: "skriver…",
    sendBtn: "Skicka", // ✅ NUEVO
    usersLive: "live",
    newRoomBtn: "Ny ✨",
    newRoomSystem: "🆕 Ny privat chattrum skapat — bjud in någon för att börja chatta",
    invitedToChat: "Du blev inbjuden att chatta",
    destroyRoomBtn: "Förstör ❌",
    destroyConfirm: "Är du säker på att du vill förstöra detta rum? Det blir inaktivt för alla.",
    roomDestroyedMsg: "🚨 Detta rum har förstörts och är nu inaktivt.",
    roomDestroyedOverlay: "💀 Rummet förstört.",
    roomExpired: "⛔ Detta rum har gått ut"

  },
  fi: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Kirjoita viesti...",
    inviteBtn: "Kutsu 🚀",
    messagesDisappear: "Viestit katoavat 10 sekunnin kuluttua",
    roomLinkCopied: "Huoneen linkki kopioitu! 🚀 Jaa ystäville!",
    typingIndicator: "kirjoittaa…",
    sendBtn: "Lähetä", // ✅ NUEVO
    usersLive: "live",
    newRoomBtn: "Uusi ✨",
    newRoomSystem: "🆕 Uusi yksityinen huone luotu — kutsu joku aloittamaan keskustelu",
    invitedToChat: "Sinut on kutsuttu keskustelemaan",
    destroyRoomBtn: "Tuhoa ❌",
    destroyConfirm: "Haluatko varmasti tuhota tämän huoneen? Se muuttuu passiiviseksi kaikille.",
    roomDestroyedMsg: "🚨 Tämä huone on tuhottu ja on nyt passiivinen.",
    roomDestroyedOverlay: "💀 Huone tuhottu.",
    roomExpired: "⛔ Tämä huone on vanhentunut"

  }
};





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
  document.querySelector("#destroy-room-btn").textContent = translations[lang].destroyRoomBtn;
  document.body.dir = (lang === "ar") ? "rtl" : "ltr";
  typingIndicator.textContent = "";
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

// --- Sala
let roomId = location.hash.replace("#room=","");
if(!roomId){ roomId = crypto.randomUUID().replace(/-/g, ""); location.hash="room="+roomId; }
let roomRef = ref(db,`rooms/${roomId}`);
let messagesRef = ref(db,`rooms/${roomId}/messages`);
let metaRef = ref(db,`rooms/${roomId}/meta`);

onValue(metaRef, snap => {
  const meta = snap.val();
  if(meta?.destroyed){
    document.body.innerHTML = `
  <div style="
    background:#000;
    color:#fff;
    height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:1.3rem;
    text-align:center;
  ">
    ${translations[currentLang].roomDestroyedOverlay}
  </div>
`;

  }
});


let typingRef = ref(db,`rooms/${roomId}/typing`);
let userRef = ref(db,`rooms/${roomId}/users/${identity.name}`);
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
  return div; // 🔥 ESTA LÍNEA
}

// --- Send
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const MESSAGE_TTL = 10;
function sendMessage(){
  if(!input.value) return;
  push(messagesRef,{
  text: input.value,
  ttl: MESSAGE_TTL,
  createdAt: Date.now(),
  user: identity
});

  input.value=""; input.style.height="auto"; input.rows=1; input.scrollTop=0;
  remove(typingRef);
}
sendBtn.onclick=sendMessage;



function spawnConfetti() {
  for(let i=0;i<30;i++){
    const conf = document.createElement("div");
    conf.textContent = ["🎉","✨","💥","🚀","🏆","🔥","💎"][Math.floor(Math.random()*4)];
    conf.style.position="fixed";
    conf.style.left = Math.random()*100 + "%";
    conf.style.top = "-30px";
    conf.style.fontSize = Math.random()*24 + 14 + "px";
    conf.style.opacity = Math.random();
    conf.style.zIndex="9999";
    document.body.appendChild(conf);
    const fall = setInterval(()=>{
      const top = parseFloat(conf.style.top);
      if(top>window.innerHeight){ conf.remove(); clearInterval(fall);}
      else conf.style.top = top + 5 + "px";
    },30);
  }
}
spawnConfetti();



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
onChildAdded(messagesRef,snap=>{
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
const inviteBtn = document.getElementById("invite-btn");

inviteBtn.addEventListener("click", () => {
  const roomUrl = window.location.href;

  const inviteMessage = `${translations[currentLang].invitedToChat}:\n${roomUrl}`;

  navigator.clipboard.writeText(inviteMessage).catch(console.error);

  showSystemMessage(inviteMessage);
  setTimeout(() => chatBox.lastChild?.remove(), 3000);
});




// --- New Room + Destroy Room
const newRoomBtn = document.getElementById("new-room-btn");
const destroyRoomBtn = document.getElementById("destroy-room-btn");

function generateRoomId() {
  return crypto.randomUUID().replace(/-/g, "");
}


newRoomBtn.addEventListener("click", () => {
  const newRoomId = generateRoomId();
  location.hash = "room=" + newRoomId;
// Limpiar UI de la sala anterior
chatBox.innerHTML = "";
typingIndicator.textContent = "";

// Mensaje sistema claro (auto borrar en 3s)
const sysMsg = showSystemMessage(translations[currentLang].newRoomSystem);
setTimeout(() => {
  sysMsg?.remove();
}, 3000);


  
// ---- RE-INICIALIZAR REFERENCIAS PARA LA NUEVA SALA ----
  roomRef = ref(db,"rooms/"+newRoomId);
  messagesRef = ref(db,`rooms/${newRoomId}/messages`);
  metaRef = ref(db,`rooms/${newRoomId}/meta`);
  typingRef = ref(db,`rooms/${newRoomId}/typing`);
  userRef = ref(db,`rooms/${newRoomId}/users/${identity.name}`);
  set(userRef,{name:identity.name,emoji:identity.emoji,joinedAt:Date.now()});
  onDisconnect(userRef).remove();

  // Reiniciar contador de usuarios para la nueva sala
  onValue(ref(db,`rooms/${newRoomId}/users`),snapshot=>{
    const users = snapshot.val()||{};
    currentUserCount = Object.keys(users).length;
    updateUsersLiveText();
  });
   // ---- FIN RE-INICIALIZAR REFERENCIAS ----
  
  // Flash de pantalla
  const flash = document.createElement("div");
  flash.style.position = "fixed";
  flash.style.top = 0;
  flash.style.left = 0;
  flash.style.width = "100%";
  flash.style.height = "100%";
  flash.style.background = "linear-gradient(135deg, #ff0080, #7928ca)";
  flash.style.opacity = "0.8";
  flash.style.zIndex = "9999";
  flash.style.pointerEvents = "none";
  flash.style.transition = "opacity 0.6s ease-out";
  document.body.appendChild(flash);
  setTimeout(() => { flash.style.opacity = "0"; }, 100);
  setTimeout(() => { flash.remove(); }, 700);

  // Banner animado
  const banner = document.createElement("div");
  banner.id = "new-room-banner";
  banner.textContent = translations[currentLang].newRoomSystem;
  document.body.appendChild(banner);
  setTimeout(() => { banner.style.top = "20px"; }, 50);
  setTimeout(() => {
    banner.style.top = "-60px";
    setTimeout(() => banner.remove(), 500);
  }, 2500);

  // Confetti emojis
  const emojis = ["🎉","✨","💥","🚀"];
  for(let i=0;i<30;i++){
    const conf = document.createElement("div");
    conf.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    conf.style.position = "fixed";
    conf.style.left = Math.random()*100 + "%";
    conf.style.top = "-30px";
    conf.style.fontSize = Math.random()*24 + 14 + "px";
    conf.style.opacity = Math.random();
    conf.style.zIndex = "9999";
    document.body.appendChild(conf);

    const fall = setInterval(()=>{
      const top = parseFloat(conf.style.top);
      if(top > window.innerHeight){ conf.remove(); clearInterval(fall);}
      else conf.style.top = top + 5 + "px";
    },30);
  }

  // Evitar doble click
  newRoomBtn.disabled = true;
  setTimeout(() => newRoomBtn.disabled = false, 1000);
});

// --- Destroy Room
destroyRoomBtn.addEventListener("click", async () => {

  // 🔒 Bloquear si ya fue destruida
  if (destroyRoomBtn.disabled) return;

  if (!confirm(translations[currentLang].destroyConfirm)) return;
destroyRoomBtn.disabled = true; // 🔒 inmediato

  try {
    // Elimina toda la sala en Firebase
    await set(metaRef, {
  destroyed: true,
  destroyedAt: Date.now()
});
remove(typingRef);


    // Mostrar mensaje de destrucción
    showSystemMessage(translations[currentLang].roomDestroyedMsg);

    // Deshabilitar todos los inputs y botones
    input.disabled = true;
    sendBtn.disabled = true;
    inviteBtn.disabled = true;
    newRoomBtn.disabled = true;
    destroyRoomBtn.disabled = true;


  } catch(err) {
    console.error("Failed to destroy room:", err);
  }
});




