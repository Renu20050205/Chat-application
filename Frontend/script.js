// Connect to socket.io
const socket = io();

// DOM Elements
const form = document.getElementById('message-form');
const input = document.getElementById('message-input');
const messages = document.getElementById('messages');
const onlineUsers = document.getElementById('online-users');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const darkModeImg = document.getElementById('dark-mode-img');

// Prompt for username
const username = prompt("Enter your name:") || "Anonymous";
socket.emit("join", username);

// Receive message from server
socket.on("message", ({ user, message }) => {
  const li = document.createElement("li");
  li.innerHTML = `<strong>${user}:</strong> ${message}`;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
});

// Send message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim()) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

// Display online users
socket.on("online-users", (users) => {
  onlineUsers.innerHTML = "";
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user;
    onlineUsers.appendChild(li);
  });
});

// Dark mode toggle
if (darkModeToggle) {
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    darkModeImg.src = isDark
      ? "https://cdn-icons-png.flaticon.com/512/747/747545.png"
      : "https://cdn-icons-png.flaticon.com/512/581/581601.png";
  });
}