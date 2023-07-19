const socket = io("http://localhost:8000");

// Get DOM elements in respective Js variables
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".container");

// Audio file that will play while recieving messages
let audio = new Audio("audio/notification.mp3");
audio.volume = 0.2;

// Function which will append messages to the container
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }

  // Update scroll
  messageContainer.scrollTop = messageContainer.scrollHeight;
};

// Ask new users their name and let the server know
const name = prompt("Enter your name to join");
if (name != null || name != undefined) {
  socket.emit("new-user-joined", name);
  append(`You joined the chat`, "right");
}

// If a new user joins, receive their name from server
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "left");
});

// If server sends a message, receive it
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

// If a user leaves the chat, append the info to the container
socket.on("left", (name) => {
  append(`${name} left the chat`, "left");
});

// If the form gets submitted, send server the message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});
