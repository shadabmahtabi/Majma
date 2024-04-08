var socket = io();
const chatList = document.querySelector(".chatList");
let textarea = document.querySelector("#chatMsg");
let chatBtn = document.querySelector(".chatBtn");
let username = document.querySelector("#username").innerHTML;

socket.emit("username", username);

chatBtn.addEventListener("click", () => {
  let messages = textarea.value.trim();
  if (messages.length > 0) {
    sendMessages(messages);
    // console.log(messages)
    textarea.value = "";
  }
});

function sendMessages(msg) {
  let obj = {
    username: username,
    messages: msg,
  };

  appendMessage(obj, "outgoingMsg");
  scrollToBottom();

  socket.emit("messages", obj);
}

socket.on("messages", (data) => {
  appendMessage(data, "incomingMsg");
  scrollToBottom();
});

function appendMessage(msg, type) {
  let messageDiv = document.createElement("li");
  let className = type;
  messageDiv.classList.add(className);

  let contents = [
    className === "outgoingMsg"
      ? `
      <h3>${msg.messages}</h3>
  `
      : `
    <h5>${msg.username}</h5>
    <h3>${msg.messages}</h3>
`,
  ];

  messageDiv.innerHTML = contents;
  chatList.appendChild(messageDiv);
}

function scrollToBottom() {
  chatList.scrollTop = chatList.scrollHeight;
}

// ------------------------------------------------------
const sideBar = document.querySelector("#sideBar");

if (window.innerWidth < 500) {
  sideBar.style.display = "none";
}
