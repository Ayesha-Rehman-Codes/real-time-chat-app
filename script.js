document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    const clearChatBtn = document.getElementById('clearChatBtn');

    const botReplies = {
        hello: "Hi there! Welcome to Internee.pk support. How can I help you today?",
        hi: "Hello! Hope you are doing great. What are we building today?",
        project: "That sounds amazing! Frontend development requires practice, keep it up!",
        internship: "Internee.pk offers incredible tasks to build a modern software portfolio 💻",
        bug: "Don't worry about bugs! Check your event listeners and console logs carefully.",
        thank: "You're most welcome, Always happy to boost your coding journey. Keep crushing it! 🚀",
    bye: "Goodbye! Good luck with your Internee.pk task submission! 👋",
        default: "That's interesting! Tell me more about your coding journey or tasks."
    };

    let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

    function getFormattedTimestamp() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function appendMessageElement(text, sender, timestamp) {
        const messageNode = document.createElement('div');
        messageNode.classList.add('message', sender);

        const textContent = document.createTextNode(text);
        messageNode.appendChild(textContent);

        const timeSpan = document.createElement('span');
        timeSpan.classList.add('timestamp');
        timeSpan.textContent = timestamp;
        messageNode.appendChild(timeSpan);

        chatMessages.appendChild(messageNode);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function loadChatHistory() {
        chatMessages.innerHTML = '';
        if (chatHistory.length === 0) {
            appendMessageElement("Hello! I am your real-time companion. Type something below!", 'received', getFormattedTimestamp());
        } else {
            chatHistory.forEach(msg => {
                appendMessageElement(msg.text, msg.sender, msg.time);
            });
        }
    }

    function saveMessageToStorage(text, sender, time) {
        chatHistory.push({ text, sender, time });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }

    function triggerBotResponse(userMessage) {

        const typingNode = document.createElement('div');
        typingNode.classList.add('typing-indicator');
        typingNode.id = 'botTyping';
        typingNode.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
        chatMessages.appendChild(typingNode);
        scrollToBottom();

        const cleanInput = userMessage.toLowerCase().trim();
        let replyText = botReplies.default;

        for (const key in botReplies) {
            const regex = new RegExp(`\\b${key}\\b`, 'i');
            if (regex.test(cleanInput)) {
                replyText = botReplies[key];
                break;
            }
        }

    setTimeout(() => {
        const indicator = document.getElementById('botTyping');
        if (indicator) indicator.remove();

        const botTime = getFormattedTimestamp();
        appendMessageElement(replyText, 'received', botTime);
        saveMessageToStorage(replyText, 'received', botTime);
    }, 1200);
}

    chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (!text) return;

    const currentTime = getFormattedTimestamp();

    appendMessageElement(text, 'sent', currentTime);
    saveMessageToStorage(text, 'sent', currentTime);
    messageInput.value = '';

    triggerBotResponse(text);
});

clearChatBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to delete all chat history?")) {
        localStorage.removeItem('chatHistory');
        chatHistory = [];
        loadChatHistory();
    }
});

loadChatHistory();
});