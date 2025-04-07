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
            generateBotResponse(message); // 💬 Now connected to Flask backend
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

    // Function to get bot response from Flask API
    function generateBotResponse(userInput) {
        fetch("https://digiflex-chatbot.onrender.com/", { // ✅ Replace with your backend URL
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: userInput,
                format: "default"
            })
        })
        .then(response => response.json())
        .then(data => {
            const botReply = data.response || "🤖 Sorry, I couldn't process that.";
            displayMessage(botReply, "bot");
        })
        .catch(error => {
            console.error("API Error:", error);
            displayMessage("❌ Error: Unable to connect to chatbot.", "bot");
        });
    }

    // Close chatbot
    closeChat.addEventListener("click", function () {
        chatbotContainer.style.display = "none";
    });
});
