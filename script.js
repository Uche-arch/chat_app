// Data
const friendsData = [
  {
    id: "alice",
    name: "Suzana Colin",
    email: "@suzana",
    avatar: "./img/Ellipse-37.png",
    last: "Working on a design",
  },
  {
    id: "bob",
    name: "Christina Ker",
    email: "@tinachris",
    avatar: "./img/Ellipse-37-2.png",
    last: "Sure, see you",
  },
  {
    id: "cathy",
    name: "Charles May",
    email: "@maythe",
    avatar: "./img/Ellipse-37-3.png",
    last: "Thanks!",
  },
  {
    id: "dan",
    name: "John Hope",
    email: "@hopj_ohn",
    avatar: "./img/Ellipse-37-4.png",
    last: "Let’s meet tomorrow",
  },
  {
    id: "ella",
    name: "Micheal Hopkins",
    email: "@hopkins",
    avatar: "./img/Ellipse-37-5.png",
    last: "Cool!",
  },
  {
    id: "bella",
    name: "Suzana Colin",
    email: "@suzana",
    avatar: "./img/Ellipse-37-6.png",
    last: "Awesome!",
  },
];

const app = document.getElementById("app");
const friendsEl = document.getElementById("friends");
const searchInput = document.getElementById("search");
const startNewBtn = document.getElementById("start-new");
const modalWrap = document.getElementById("modalWrap");
const modalFriend = document.getElementById("modalFriend");
const modalMsg = document.getElementById("modalMsg");
const modalSend = document.getElementById("modalSend");
const modalClose = document.getElementById("modalClose");
const main = document.getElementById("main");
const emptyState = document.getElementById("empty");
const chatView = document.getElementById("chat-view");
const messagesEl = document.getElementById("messages");
const chatAvatar = document.getElementById("chat-avatar");
const chatName = document.getElementById("chat-name");
const chatSub = document.getElementById("chat-sub");
const messageText = document.getElementById("messageText");
const sendChat = document.getElementById("sendChat");
const backBtn = document.getElementById("backBtn");

// Render friends list
function renderFriends(list) {
  friendsEl.innerHTML = "";
  if (list.length === 0) {
    friendsEl.innerHTML = '<div class="no-results">No friends found</div>';
    return;
  }
  list.forEach((f) => {
    const item = document.createElement("div");
    item.className = "friend";
    item.setAttribute("data-id", f.id);
    item.setAttribute("role", "button");
    item.innerHTML = `
  <div class="avatar">
    <img src="${f.avatar}" alt="${f.name}" />
  </div>
  <div class="friend-info" style="width: 100%">
<div class="friend-name" style="display: flex; justify-content: space-between; align-items: center;">
  <span>${f.name} <span style="color: #4F5665; font-weight: lighter; font-size: 13px;">${f.email}</span></span>
  <span style="font-size: 10px;">Dec 15</span>
</div>



    <div class="friend-last">${f.last}</div>
  </div>
`;
    friendsEl.appendChild(item);
  });
}
renderFriends(friendsData);

// Search filter for friends
searchInput.addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = friendsData.filter((f) => f.name.toLowerCase().includes(q));
  renderFriends(filtered);
});

// Modal handling
function openModal() {
  modalWrap.style.display = "block";
  modalWrap.setAttribute("aria-hidden", "false");
  modalFriend.focus();
}
function closeModal() {
  modalWrap.style.display = "none";
  modalWrap.setAttribute("aria-hidden", "true");
  modalFriend.value = "";
  modalMsg.value = "";
}

startNewBtn.addEventListener("click", openModal);
modalClose.addEventListener("click", closeModal);
modalWrap.addEventListener("click", (e) => {
  if (e.target === document.getElementById("modalBG")) closeModal();
});

modalSend.addEventListener("click", () => {
  // Behavior: when user sends from modal, everything refreshes and modal disappears -> go back to default empty state
  // (so we will simply close modal and reset chat view)
  closeModal();
  resetToDefault();
});

// Reset to default empty state
function resetToDefault() {
  // show empty state, hide chat-view
  emptyState.style.display = "flex";
  chatView.style.display = "none";
  // On small screens also ensure sidebar visible and main hidden
  if (window.matchMedia("(max-width:700px)").matches) {
    document.documentElement.classList.remove("show-chat");
  }
  // clear any chat messages
  messagesEl.innerHTML = "";
  messageText.value = "";
}

//  Friend click => open chat
friendsEl.addEventListener("click", (e) => {
  const node = e.target.closest(".friend");
  if (!node) return;
  const id = node.getAttribute("data-id");
  const friend = friendsData.find((f) => f.id === id);
  if (!friend) return;
  openChatWith(friend);
});

function openChatWith(friend) {
  // populate header

  chatAvatar.innerHTML = `<img src="${friend.avatar}" alt="${friend.name}" />`;
  chatName.textContent = friend.name;
  chatSub.textContent = "Online";

  // build initial messages: friend sent three messages, last one shows friend picture to left
  messagesEl.innerHTML = "";

  // message 1
  appendFriendMessage(friend, "Hey! How's it going?", false);
  appendFriendMessage(
    friend,
    "I wanted to share the design draft with you. Please reply",
    false
  );
  appendFriendMessage(friend, "🙄🙄🙄", true);

  // show chat view
  emptyState.style.display = "none";
  chatView.style.display = "flex";
  messagesEl.scrollTop = messagesEl.scrollHeight;

  // small screen: switch to chat-only view
  if (window.matchMedia("(max-width:700px)").matches) {
    document.documentElement.classList.add("show-chat");
  }
}

// Appending messages appropriately with images
function appendFriendMessage(friend, text, showAvatar) {
  const wrapper = document.createElement("div");
  wrapper.className = "msg-row";

  const left = document.createElement("div");
  left.className = "msg-left";

  // avatar container (always takes space, only visible if showAvatar)
  const av = document.createElement("div");
  av.className = "msg-avatar";
  if (showAvatar) {
    av.innerHTML = `<img src="${friend.avatar}" alt="${friend.name}"/>`;
    left.classList.add("show-avatar");
  }
  left.appendChild(av);

  // bubble
  const bubble = document.createElement("div");
  bubble.className = "message from-friend";
  bubble.textContent = text;

  left.appendChild(bubble);
  wrapper.appendChild(left);
  messagesEl.appendChild(wrapper);

  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function appendMyMessage(text) {
  const wrapper = document.createElement("div");
  wrapper.className = "msg-row";
  const right = document.createElement("div");
  right.className = "msg-right";
  const bubble = document.createElement("div");
  bubble.className = "message from-me";
  bubble.innerHTML = text;
  right.appendChild(bubble);
  wrapper.appendChild(right);
  messagesEl.appendChild(wrapper);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

// Chat send handling
sendChat.addEventListener("click", () => {
  const txt = messageText.value.trim();
  if (!txt) return;
  appendMyMessage(txt);
  messageText.value = "";
  messageText.focus();
});

//  allow Enter to send (Shift+Enter new line)
messageText.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendChat.click();
  }
});

// backBtn icon sets back to default
backBtn.addEventListener("click", () => {
  // Always reset to empty state
  resetToDefault();
});

// Initial state
resetToDefault();

// Clicking Enter on modal send
modalMsg.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    modalSend.click();
  }
});

//  Resize handling to ensure UI sync
window.addEventListener("resize", () => {
  // if large screen and chat is open ensure both visible
  if (!window.matchMedia("(max-width:700px)").matches) {
    document.documentElement.classList.remove("show-chat");
    // show main by default (no hide)
    main.style.display = "flex";
  }
});
