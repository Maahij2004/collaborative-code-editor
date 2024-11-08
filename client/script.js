const socket = new WebSocket('ws://localhost:3000');
const editor = document.getElementById('editor');
const chatInput = document.getElementById('chat-input');
const chatBox = document.getElementById('chat-box');
const usernameInput = document.getElementById('username');
const joinButton = document.getElementById('joinButton');
const sendChatButton = document.getElementById('sendChatButton');
let username = '';
joinButton.addEventListener('click', () => {
    username = usernameInput.value.trim();
    if (username) {
        socket.send(JSON.stringify({ type: 'user-join', username }));
        editor.disabled = false;
    }
});
socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
        case 'load-document':
            editor.value = data.content;
            break;
        case 'update-document':
            editor.value = data.content;
            break;
        case 'update-user-list':
            updateUserList(data.users);
            break;
        case 'chat':
            addChatMessage(data.message);
            break;
    }
});
editor.addEventListener('input', () => {
    socket.send(JSON.stringify({ type: 'update-document', content: editor.value }));
});
sendChatButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        socket.send(JSON.stringify({ type: 'chat', username, message }));
        chatInput.value = '';
    }
});
function addChatMessage(message) {
    const msgElement = document.createElement('div');
    msgElement.textContent = message;
    chatBox.appendChild(msgElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}
function updateUserList(users) {
    const userList = document.getElementById('user-list');
    userList.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.textContent = user;
        userList.appendChild(userElement);
    });
}
