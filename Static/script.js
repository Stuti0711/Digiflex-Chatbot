
        // API Endpoint
        const API_URL = "https://digiflex-chatbot.onrender.com//chat";  // Change this if deployed online

        // Get Elements
        const chatbotIcon = document.getElementById("chatbotIcon");
        const chatbotContainer = document.getElementById("chatbotContainer");
        const closeChat = document.getElementById("closeChat");
        const chatMessages = document.getElementById("chatMessages");
        const userMessageInput = document.getElementById("userMessage");
        const sendMessageButton = document.getElementById("sendMessage");
        const welcomeScreen = document.getElementById("welcomeScreen");
        const getStartedBtn = document.getElementById("getStartedBtn");
        const chatInput = document.getElementById("chatInput");
        const nameInputScreen = document.getElementById("nameInputScreen");
        const nameInput = document.getElementById("nameInput");
        const submitNameBtn = document.getElementById("submitNameBtn");

        // Store the username
        let userName = "";

        // Flag to track if chat has been initialized
        let chatInitialized = false;

        // Toggle Chatbot Window
        chatbotIcon.addEventListener("click", () => {
            if (chatbotContainer.style.display === "none") {
                chatbotContainer.style.display = "flex";

                // If chat hasn't been initialized yet, show welcome screen
                if (!chatInitialized) {
                    welcomeScreen.style.display = "flex";
                    nameInputScreen.style.display = "none";
                    chatMessages.style.display = "none";
                    chatInput.style.display = "none";
                } else {
                    // If chat was initialized but closed, just show the chat interface
                    welcomeScreen.style.display = "none";
                    nameInputScreen.style.display = "none";
                    chatMessages.style.display = "flex";
                    chatInput.style.display = "flex";
                }
            } else {
                chatbotContainer.style.display = "none";
            }
        });

        // Get Started Button
        getStartedBtn.addEventListener("click", () => {
            welcomeScreen.style.display = "none";
            nameInputScreen.style.display = "flex";
            chatMessages.style.display = "none";
            chatInput.style.display = "none";
        });

        // Submit Name Button
        submitNameBtn.addEventListener("click", () => {
            submitUserName();
        });

        // Handle name input enter key press
        nameInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                submitUserName();
            }
        });

        function submitUserName() {
            userName = nameInput.value.trim();
            if (!userName) {
                userName = "Friend"; // Default name if user doesn't enter anything
            }

            // Hide name input, show chat interface
            nameInputScreen.style.display = "none";
            chatMessages.style.display = "flex";
            chatInput.style.display = "flex";

            // Set chat as initialized
            chatInitialized = true;

            // Add personalized welcome message
            displayMessage(`Hello ${userName}! How can I help you today?`, "bot");
            userMessageInput.focus();
        }

        // Close Chatbot Window
        closeChat.addEventListener("click", () => {
            chatbotContainer.style.display = "none";
        });

        // Send User Message
        sendMessageButton.addEventListener("click", sendMessage);
        userMessageInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                sendMessage();
            }
        });

        async function sendMessage() {
            let userMessage = userMessageInput.value.trim();
            if (!userMessage) return;

            // Display User Message
            displayMessage(userMessage, "user");
            userMessageInput.value = "";

            // Show typing indicator
            const typingIndicator = document.createElement("div");
            typingIndicator.className = "typing-indicator";
            typingIndicator.innerHTML = "<span></span><span></span><span></span>";
            chatMessages.appendChild(typingIndicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            // Call Flask API
            try {
                let response = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        message: userMessage,
                        userName: userName // Send username with the message
                    })
                });

                // Remove typing indicator
                chatMessages.removeChild(typingIndicator);

                let data = await response.json();
                displayMessage(data.response, "bot");
            } catch (error) {
                // Remove typing indicator
                chatMessages.removeChild(typingIndicator);
                displayMessage("❌ Error: Unable to connect to chatbot.", "bot");
            }
        }

        function displayMessage(text, sender) {
            let messageDiv = document.createElement("div");
            messageDiv.textContent = text;
            messageDiv.classList.add(sender, "message");

            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight; // Keep the latest message in view
        }

        // Handle window resize
        window.addEventListener("resize", () => {
            // If chat is open, adjust scroll
            if (chatbotContainer.style.display === "flex" && chatMessages.style.display === "flex") {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        });

        // Handle clicks outside the chatbot to close it (optional)
        document.addEventListener("click", (e) => {
            if (chatbotContainer.style.display === "flex" &&
                !chatbotContainer.contains(e.target) &&
                e.target !== chatbotIcon) {
                chatbotContainer.style.display = "none";
            }
        });
