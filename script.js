const WIT_TOKEN = "4XVRATEOTV5VIZ63SDW4ZFCRHYYJUE5O"; // Replace with your token

function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (message === "") return;

  addMessage("user", message);
  input.value = "";
  getBotResponse(message);
}

function addMessage(sender, text) {
  const chatBox = document.getElementById("chat-box");
  const msgDiv = document.createElement("div");
  msgDiv.className = `message ${sender}`;
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTypingIndicator() {
  const chatBox = document.getElementById("chat-box");
  const typingDiv = document.createElement("div");
  typingDiv.className = "message bot typing";
  typingDiv.id = "typing-indicator";
  typingDiv.textContent = "...";
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTypingIndicator() {
  const typingDiv = document.getElementById("typing-indicator");
  if (typingDiv) typingDiv.remove();
}

function getBotResponse(message) {
  showTypingIndicator();

  fetch(`https://api.wit.ai/message?v=20250701&q=${encodeURIComponent(message)}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${WIT_TOKEN}`
    }
  })
    .then(res => res.json())
    .then(data => {
      removeTypingIndicator();

      const intent = data.intents?.[0]?.name || "fallback";
      let botReply = "";

      switch (intent) {
        case "greet":
          botReply = "Hello! How can I assist you today?";
          break;
        case "how_are_you":
          botReply = "I'm doing well, thank you! How about you?";
          break;
        case "bye":
          botReply = "Goodbye! Have a great day.";
          break;
        case "help":
          botReply = "I can help with greetings, saying goodbye, telling my name, and answering simple questions!";
          break;
        case "name":
          botReply = "I'm your AI chatbot, created by Raagesh!";
          break;
        case "thanks":
          botReply = "You're welcome!";
          break;
        default:
          botReply = "Sorry, I didn't understand that.";
      }

      addMessage("bot", botReply);
    })
    .catch(error => {
      removeTypingIndicator();
      console.error("Wit.ai error:", error);
      addMessage("bot", "Oops! Something went wrong.");
    });
}
