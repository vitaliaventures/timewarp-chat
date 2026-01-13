import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  remove,
  onValue,
  set,
  onDisconnect,
  get      // 🔥 agrega esto
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { onChildChanged } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

// --- Traducciones y multilenguaje
// (Se mantiene igual que tu versión, con todos los idiomas)

// 🌐 Translations object — full list of languages like Privnote.com
const translations = {
  en: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Type message...",
    inviteBtn: "Invite 🚀",
    messagesDisappear: "Messages disappear automatically",
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
    roomExpired: "⛔ This room has expired",
    editedLabel: "(edited)",
    editMessage: "Edit message",
    deleteMessage: "Delete message"

  },
  de: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Nachricht eingeben...",
    inviteBtn: "Einladen 🚀",
    messagesDisappear: "Nachrichten verschwinden automatisch",
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
    roomExpired: "⛔ Dieser Raum ist abgelaufen",
    editedLabel: "(bearbeitet)",
    editMessage: "Nachricht bearbeiten",
    deleteMessage: "Nachricht löschen"


  },
  es: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Escribe tu mensaje...",
    inviteBtn: "Invitar 🚀",
    messagesDisappear: "Los mensajes desaparecen automáticamente",
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
    roomExpired: "⛔ Esta sala ha expirado",
    editedLabel: "(editado)",
    editMessage: "Editar mensaje",
    deleteMessage: "Eliminar mensaje"



  },
  fr: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Tapez votre message...",
    inviteBtn: "Inviter 🚀",
    messagesDisappear: "Les messages disparaissent automatiquement",
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
    roomExpired: "⛔ Cette salle a expiré",
    editedLabel: "(modifié)",
    editMessage: "Modifier le message",
    deleteMessage: "Supprimer le message"


  },
  it: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Scrivi un messaggio...",
    inviteBtn: "Invita 🚀",
    messagesDisappear: "I messaggi scompaiono automaticamente",
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
    roomExpired: "⛔ Questa stanza è scaduta",
    editedLabel: "(modificato)",
    editMessage: "Modifica messaggio",
    deleteMessage: "Elimina messaggio"


  },
  pt: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Digite sua mensagem...",
    inviteBtn: "Convidar 🚀",
    messagesDisappear: "As mensagens desaparecem automaticamente",
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
    roomExpired: "⛔ Esta sala expirou",
    editedLabel: "(editado)",
    editMessage: "Editar mensagem",
    deleteMessage: "Excluir mensagem"


  },
  ru: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Введите сообщение...",
    inviteBtn: "Пригласить 🚀",
    messagesDisappear: "Сообщения исчезают автоматически",
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
    roomExpired: "⛔ Эта комната больше не активна",
    editedLabel: "(отредактировано)",
    editMessage: "Редактировать сообщение",
    deleteMessage: "Удалить сообщение"


     
  },
  ja: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "メッセージを入力...",
    inviteBtn: "招待 🚀",
    messagesDisappear: "メッセージは自動的に消えます",
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
    roomExpired: "⛔ このルームは期限切れです",
    editedLabel: "（編集済み）",
    editMessage: "メッセージを編集",
    deleteMessage: "メッセージを削除"


  },
  ko: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "메시지를 입력하세요...",
    inviteBtn: "초대 🚀",
    messagesDisappear: "메시지는 자동으로 사라집니다",
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
    roomExpired: "⛔ 이 방은 만료되었습니다",
    editedLabel: "(편집됨)",
    editMessage: "메시지 편집",
    deleteMessage: "메시지 삭제"

  },
  zh: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "输入消息...",
    inviteBtn: "邀请 🚀",
    messagesDisappear: "消息会自动消失",
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
    roomExpired: "⛔ 此房间已失效",
    editedLabel: "（已编辑）",
    editMessage: "编辑消息",
    deleteMessage: "删除消息"

  },
  nl: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Typ een bericht...",
    inviteBtn: "Uitnodigen 🚀",
    messagesDisappear: "Berichten verdwijnen automatisch",
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
    roomExpired: "⛔ Deze kamer is verlopen",
    editedLabel: "(bewerkt)",
    editMessage: "Bericht bewerken",
    deleteMessage: "Bericht verwijderen"

  },
  tr: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Mesaj yazın...",
    inviteBtn: "Davet Et 🚀",
    messagesDisappear: "Mesajlar otomatik olarak kaybolur",
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
    roomExpired: "⛔ Bu oda süresi doldu",
    editedLabel: "(düzenlendi)",
    editMessage: "Mesajı düzenle",
    deleteMessage: "Mesajı sil"

  },
  ar: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "اكتب رسالتك...",
    inviteBtn: "دعوة 🚀",
    messagesDisappear: "تختفي الرسائل تلقائيًا",
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
    roomExpired: "⛔ انتهت صلاحية هذه الغرفة",
    editedLabel: "(تم التعديل)",
    editMessage: "تعديل الرسالة",
    deleteMessage: "حذف الرسالة"

  },
  pl: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Wpisz wiadomość...",
    inviteBtn: "Zaproś 🚀",
    messagesDisappear: "Wiadomości znikają automatycznie",
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
    roomExpired: "⛔ Ten pokój wygasł",
    editedLabel: "(edytowano)",
    editMessage: "Edytuj wiadomość",
    deleteMessage: "Usuń wiadomość"

  },
  sv: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Skriv meddelande...",
    inviteBtn: "Bjud in 🚀",
    messagesDisappear: "Meddelanden försvinner automatiskt",
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
    roomExpired: "⛔ Detta rum har gått ut",
    editedLabel: "(redigerad)",
    editMessage: "Redigera meddelande",
    deleteMessage: "Ta bort meddelande"

  },
  fi: {
    appName: "TimeWarp Messenger",
    messagePlaceholder: "Kirjoita viesti...",
    inviteBtn: "Kutsu 🚀",
    messagesDisappear: "Viestit katoavat automaattisesti",
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
    roomExpired: "⛔ Tämä huone on vanhentunut",
    editedLabel: "(muokattu)",
    editMessage: "Muokkaa viestiä",
    deleteMessage: "Poista viesti"

  }
};





let currentLang = "en";
const savedLang = localStorage.getItem("tw_lang");
if (savedLang && translations[savedLang]) {
  currentLang = savedLang;
}

let currentUserCount = 0;
let messagesListenerUnsub = null;
const typingIndicator = document.getElementById("typing-indicator");


function toArabicDigits(str) {
  const map = ["٠","١","٢","٣","٤","٥","٦","٧","٨","٩"];
  return str.replace(/\d/g, d => map[d]);
}


function fromArabicDigits(str) {
  const map = {
    "٠":"0","١":"1","٢":"2","٣":"3","٤":"4",
    "٥":"5","٦":"6","٧":"7","٨":"8","٩":"9"
  };
  return str.replace(/[٠-٩]/g, d => map[d]);
}




// --- Message TTL parser (mm:ss or ss)
function parseTTL() {
  let ttlInput = document.getElementById("ttl-input")?.value || "1:00";

  // 🔥 convertir números árabes → latinos antes de parsear
  ttlInput = fromArabicDigits(ttlInput);

  const parts = ttlInput.split(":").map(p => parseInt(p, 10));

  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
    return parts[0] * 60 + parts[1];
  }

  if (parts.length === 1 && !isNaN(parts[0])) {
    return parts[0];
  }

  return 60;
}






function updateActionMenuLanguage() {
  const editItem = document.querySelector('#msg-action-menu .menu-item[data-action="edit"]');
  const deleteItem = document.querySelector('#msg-action-menu .menu-item[data-action="delete"]');

  if (!editItem || !deleteItem) return;

  editItem.textContent = "✏️ " + translations[currentLang].editMessage;
  deleteItem.textContent = "🗑 " + translations[currentLang].deleteMessage;
}






// Función para cambiar idioma
function setLanguage(lang) {
  if (!translations[lang]) lang = "en"; // fallback
  currentLang = lang;
  localStorage.setItem("tw_lang", lang); // 🔥 GUARDAR IDIOMA


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
  updateActionMenuLanguage(); // 🔥 AQUÍ
  document.querySelectorAll(".edited-label").forEach(span => {
  span.textContent = translations[currentLang].editedLabel;
});

  const ttlInputEl = document.getElementById("ttl-input");

if (ttlInputEl) {
  if (lang === "ar") {
    ttlInputEl.value = toArabicDigits(ttlInputEl.value || "01:00");
    ttlInputEl.style.direction = "rtl";
    ttlInputEl.style.textAlign = "center";
  } else {
    ttlInputEl.value = fromArabicDigits(ttlInputEl.value || "01:00");
    ttlInputEl.style.direction = "ltr";
    ttlInputEl.style.textAlign = "center";
  }
}

const reactionBar = document.getElementById("reaction-bar");
if (reactionBar) {
  reactionBar.dir = "ltr";
  reactionBar.style.unicodeBidi = "isolate";
}
  
}

const languageSelect = document.getElementById("language-select");
languageSelect.addEventListener("change", e => setLanguage(e.target.value));
languageSelect.value = currentLang;
setLanguage(currentLang);
updateActionMenuLanguage();



function updateUsersLiveText() {
  const count =
    currentLang === "ar"
      ? toArabicDigits(String(currentUserCount))
      : currentUserCount;

  document.getElementById("room-users").textContent =
    `🔴 ${count} ${translations[currentLang].usersLive}`;
}


// --- Identidad efímera
const animals = ["Fox","Panda","Tiger","Octopus","Wolf","Eagle","Bear","Owl"];
const colors = ["Red","Blue","Green","Purple","Orange","Pink"];
const messageColors = [
  "#2563eb",
  "#16a34a",
  "#db2777",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444"
];
const animalEmoji = {Fox:"🦊",Panda:"🐼",Tiger:"🐯",Octopus:"🐙",Wolf:"🐺",Eagle:"🦅",Bear:"🐻",Owl:"🦉"};
let identity = JSON.parse(localStorage.getItem("tw_identity"));

if (!identity) {
  const animal = animals[Math.floor(Math.random()*animals.length)];
  const color = colors[Math.floor(Math.random()*colors.length)];
  const id = Math.floor(Math.random()*900+100);

  identity = {
    name: `${color} ${animal} ${id}`,
    emoji: animalEmoji[animal]
  };

  localStorage.setItem("tw_identity", JSON.stringify(identity));
}

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
attachMessagesListener(); // ← AGREGA ESTA LÍNEA
let metaRef = ref(db,`rooms/${roomId}/meta`);

onValue(metaRef, snap => {
  const meta = snap.val();
  if (meta?.destroyed) {

    document.body.innerHTML = `
      <div style="
        background:#000;
        color:#fff;
        height:100vh;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:24px;
        font-size:1.3rem;
        text-align:center;
      ">
        <div>${translations[currentLang].roomDestroyedOverlay}</div>

        <button id="new-room-from-destroyed" style="
          background:#2563eb;
          color:#fff;
          border:none;
          padding:14px 32px;
          font-size:1rem;
          border-radius:12px;
          cursor:pointer;
        ">
          ${translations[currentLang].newRoomBtn}
        </button>
      </div>
    `;

    document
      .getElementById("new-room-from-destroyed")
      .addEventListener("click", () => {
        const newRoomId = generateRoomId();
        location.hash = "room=" + newRoomId;
        location.reload(); // 🔥 reset limpio, cero listeners muertos
      });
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





function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;

  const time = `${m}:${s.toString().padStart(2, "0")}`;

  // 🔥 Arabic real numerals
  if (currentLang === "ar") {
    return toArabicDigits(time);
  }

  return time;
}


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
const MESSAGE_TTL = 60;
function sendMessage(){
  if(!input.value) return;
  push(messagesRef, {
  text: input.value,
  ttl: parseTTL(),
  createdAt: Date.now(),
  user: identity,
  color: messageColors[Math.floor(Math.random() * messageColors.length)]
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


// --- Typing indicator
onChildAdded(typingRef,snap=>{
  const data = snap.val();
  if(!data||data.user.name===identity.name) return;
  typingIndicator.textContent=`${data.user.emoji} ${data.user.name} ${translations[currentLang].typingIndicator}`;
  setTimeout(()=>typingIndicator.textContent="",2000);
});


// Listener para detectar ediciones de mensajes
onChildChanged(messagesRef, snap => {
  const msg = snap.val();
  const div = chatBox.querySelector(`[data-msg-key="${snap.key}"]`);
  if (!div) return; // si no encontramos el div, salimos

  if (msg.user?.name === identity.name) {
  div.style.background = msg.color || "#2563eb";
} else {
  div.style.background = "#2a2a2a";
}


  // --- Calcula tiempo restante basado en createdAt
  const now = Date.now();
  const elapsed = Math.floor((now - msg.createdAt) / 1000);
  let remaining = msg.ttl - elapsed;
  if (remaining < 0) remaining = 0;

  // Actualizamos texto y estructura
  div.innerHTML = `
    <strong>${msg.user.emoji} ${msg.user.name}</strong><br>
    ${msg.text} ${
  msg.edited
    ? `<span class="edited-label" style="font-size:0.8em;opacity:0.6">
         ${translations[currentLang].editedLabel}
       </span>`
    : ""
}


    <div class="msg-time">
      <span class="time-text">${formatTime(remaining)}</span>

      <div class="msg-menu" title="Message options">
        <div></div>
      </div>
    </div>

    <div class="countdown-track">
      <div class="countdown-fill"></div>
    </div>
  `;

  const menuBtn = div.querySelector(".msg-menu");
  menuBtn.addEventListener("click", e => {
    e.stopPropagation();
    activeMsgRef = snap.ref;
    activeMsgDiv = div;
    const rect = menuBtn.getBoundingClientRect();
    const menuWidth = actionMenu.offsetWidth || 200;
const viewportWidth = window.innerWidth;

const isRTL = document.body.dir === "rtl";

actionMenu.style.top = rect.bottom + 6 + "px";

if (isRTL) {
  actionMenu.style.left = "auto";
  actionMenu.style.right =
    (window.innerWidth - rect.right + 8) + "px";
} else {
  // LTR normal
  let left = rect.left - menuWidth + 10;

  if (left < 10) left = 10;
  if (left + menuWidth > viewportWidth - 10) {
    left = viewportWidth - menuWidth - 10;
  }

  actionMenu.style.right = "auto";
  actionMenu.style.left = left + "px";
}

actionMenu.style.display = "block";


  });

  // --- Reiniciar el countdown sin perder el tiempo ya transcurrido
  const span = div.querySelector(".time-text");
  const fill = div.querySelector(".countdown-fill");
  const total = msg.ttl;

  // Limpiar interval anterior si existía
  if (div.countdownTimer) clearInterval(div.countdownTimer);

  div.countdownTimer = setInterval(() => {
    remaining--;
    span.textContent = formatTime(remaining);

    const percent = (remaining / total) * 100;
    fill.style.width = percent + "%";

    if (percent > 30) fill.style.background = "#22c55e"; // green
    else if (percent > 10) fill.style.background = "#facc15"; // yellow
    else fill.style.background = "#ef4444"; // red

    if (remaining <= 0) {
      clearInterval(div.countdownTimer);
      div.remove();
      remove(snap.ref);
    }
  }, 1000);
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



const actionMenu = document.getElementById("msg-action-menu");
let activeMsgRef = null;
let activeMsgDiv = null;

document.addEventListener("click", () => {
  actionMenu.style.display = "none";
});






function attachMessagesListener() {
  if (messagesListenerUnsub) messagesListenerUnsub();

  messagesListenerUnsub = onChildAdded(messagesRef, snap => {
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
    div.dataset.msgKey = snap.key;
    if (msg.user?.name === identity.name) {
  div.style.background = msg.color || "#2563eb"; // your color
} else {
  div.style.background = "#2a2a2a"; // others = gray
}




    div.innerHTML = `
  <strong>${msg.user.emoji} ${msg.user.name}</strong><br>
  ${msg.text} ${
  msg.edited
    ? `<span class="edited-label" style="font-size:0.8em;opacity:0.6">
         ${translations[currentLang].editedLabel}
       </span>`
    : ""
}



  <div class="msg-time">
    <span class="time-text">${formatTime(remaining)}</span>

    <div class="msg-menu" title="Message options">
      <div></div>
    </div>
  </div>

  <div class="countdown-track">
    <div class="countdown-fill"></div>
  </div>
`;







    const menuBtn = div.querySelector(".msg-menu");

menuBtn.addEventListener("click", e => {
  e.stopPropagation(); // evita que document click cierre el menú

  activeMsgRef = msgRef;
  activeMsgDiv = div;

  const rect = menuBtn.getBoundingClientRect();

  const menuWidth = actionMenu.offsetWidth || 200;
const viewportWidth = window.innerWidth;

const isRTL = document.body.dir === "rtl";

actionMenu.style.top = rect.bottom + 6 + "px";

if (isRTL) {
  // 🔥 RTL DESKTOP + MOBILE FIX (anclar al botón, no al viewport)
  actionMenu.style.left = "auto";
  actionMenu.style.right = (window.innerWidth - rect.left - 20) + "px";
} else {
  // LTR normal
  let left = rect.left - menuWidth + 10;

  if (left < 10) left = 10;
  if (left + menuWidth > viewportWidth - 10) {
    left = viewportWidth - menuWidth - 10;
  }

  actionMenu.style.right = "auto";
  actionMenu.style.left = left + "px";
}

actionMenu.style.display = "block";


});

// --- en actionMenu
actionMenu.addEventListener("click", e => {
  e.stopPropagation(); // ✅ muy importante
  const action = e.target.dataset.action;
  if (!activeMsgRef) return;

  if (action === "edit") {
    get(activeMsgRef).then(snap => {
      const oldData = snap.val();
      if (!oldData) return;

      // 🔹 ocultar menú antes de mostrar prompt
      actionMenu.style.display = "none";

      const newText = prompt("Edit message:", oldData.text);
      if (newText !== null && newText !== oldData.text) {
        set(activeMsgRef, {
  ...oldData,
  text: newText,
  edited: true,
  editedAt: Date.now() // 🔥 clave
});

      }
    }).catch(console.error);
  }

  if (action === "delete") {
    activeMsgDiv.style.opacity = "0.3";
    setTimeout(() => {
      remove(activeMsgRef);
      activeMsgDiv.remove();
    }, 150);
    actionMenu.style.display = "none";
  }
});





    


    

    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;

    const span = div.querySelector(".time-text");
const fill = div.querySelector(".countdown-fill");
const total = msg.ttl;

    const timer = setInterval(() => {
    remaining--;

    span.textContent = formatTime(remaining);

    const percent = (remaining / total) * 100;
fill.style.width = percent + "%";

// Urgency colors
if (percent > 30) {
  fill.style.background = "#22c55e"; // green
} else if (percent > 10) {
  fill.style.background = "#facc15"; // yellow
} else {
  fill.style.background = "#ef4444"; // red
}


    if (remaining <= 0) {
    clearInterval(timer);
    div.remove();
    remove(msgRef);
  }
}, 1000);
  });
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
  attachMessagesListener();
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


;




