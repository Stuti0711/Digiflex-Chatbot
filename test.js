document.addEventListener("DOMContentLoaded", function () {
    const chatbotContainer = document.getElementById("chatbotContainer");
    const welcomeScreen = document.getElementById("welcomeScreen");
    const nameInputScreen = document.getElementById("nameInputScreen");
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const userMessageInput = document.getElementById("userMessage");
    const sendMessageButton = document.getElementById("sendMessage");
    const getStartedButton = document.getElementById("getStartedBtn");
    const submitNameButton = document.getElementById("submitNameBtn");
    const nameInput = document.getElementById("nameInput");
    const closeChat = document.getElementById("closeChat");

    let userName = "";

    // Show name input screen after clicking "Get Started"
    getStartedButton.addEventListener("click", function () {
        welcomeScreen.style.display = "none";
        nameInputScreen.style.display = "flex";
    });

    // Handle user name input and move to chat screen
    submitNameButton.addEventListener("click", function () {
        userName = nameInput.value.trim();
        if (userName) {
            nameInputScreen.style.display = "none";
            chatMessages.style.display = "flex";
            chatInput.style.display = "flex";
            displayMessage(`Hello ${userName}! How can I assist you today?`, "bot");
        }
    });

    // Send message on button click
    sendMessageButton.addEventListener("click", function () {
        sendMessage();
    });

    // Send message on Enter key press
    userMessageInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });

    // Function to send a message
    function sendMessage() {
        const message = userMessageInput.value.trim();
        if (message) {
            displayMessage(message, "user");
            userMessageInput.value = "";
            setTimeout(() => generateBotResponse(message), 1000);
        }
    }

    // Function to display a message
    function displayMessage(text, sender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", sender);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to generate bot responses (simple placeholder logic)
    function generateBotResponse(userInput) {
        let botReply;
        if (userInput.toLowerCase().includes("hello")) {
            botReply = `Hello ${userName}, how can I assist you today?`;
        } else if (userInput.toLowerCase().includes("help")) {
            botReply = "Sure! Let me know what you need help with.";
        } else {
            botReply = "I'm here to assist you! Can you please clarify your query?";
        }
        displayMessage(botReply, "bot");
    }

    // Close chatbot
    closeChat.addEventListener("click", function () {
        chatbotContainer.style.display = "none";
    });
});
