const modelMessageInput = document.getElementById('model-message');
const userMessageInput = document.getElementById('user-message');
const apiKeyInput = document.getElementById('api-key');
const modelSelect = document.getElementById('model-select');
const temperatureInput = document.getElementById('temperature');
const sendBtn = document.getElementById('send-btn');
const chatContainer = document.getElementById('chat-container');
const streamingCheckbox = document.getElementById('streaming-checkbox');
let conversation = [];
var accumulatedCost = 0;

// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = "gemini_" + name + "=" + (value ? encodeURIComponent(value) : "") + expires + "; path=/";
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = "gemini_" + name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}

// Retrieve API key from cookie on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedApiKey = getCookie('apiKey');
    apiKeyInput.value = savedApiKey || '';
    apiKeyInput.placeholder = savedApiKey ? '' : 'Write your API key here';
    addInitialMessage();
    loadModelMessage(); // Load the model message from cookie
});

// Save API key when input changes
apiKeyInput.addEventListener('input', () => {
    setCookie('apiKey', apiKeyInput.value, 7); // Save for 7 days
});

sendBtn.addEventListener('click', sendPrompt);

function addInitialMessage() {
    const initialMessage = document.createElement('div');
    initialMessage.className = 'message bot-message';
    initialMessage.innerText = 'Please write your Gemini API key at the bottom left field to use this page.';
    initialMessage.id = 'initial-message';
    chatContainer.appendChild(initialMessage);
}

async function sendPrompt() {
    const apiKey = apiKeyInput.value.trim();
    const userMessage = userMessageInput.value.trim();
    const modelMessage = modelMessageInput.value.trim();
    const model = modelSelect.value;
    const temperature = parseFloat(temperatureInput.value.trim());
    const streamingEnabled = streamingCheckbox.checked;

    if (!apiKey) {
        alert('API key is required.');
        return;
    }

    // Clear input boxes after reading values
    userMessageInput.value = '';
    modelMessageInput.value = '';

    // Handle user message
    if (userMessage) {
        const userMessageObj = { role: 'user', content: userMessage };
        addMessageToChat(userMessageObj, 'user-message');
        conversation.push(userMessageObj);
    }

    // Handle model message
    if (modelMessage) {
        const modelMessageObj = { role: 'model', content: modelMessage };
        addMessageToChat(modelMessageObj, 'model-message');
        conversation.push(modelMessageObj);
        saveModelMessage(); // Save model message to cookie
    }

    const responseDiv = document.createElement('div');
    responseDiv.className = 'message bot-message';
    responseDiv.innerText = 'Loading...';
    chatContainer.appendChild(responseDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const startTime = Date.now();

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/${model}:streamGenerateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [
                    { role: 'model', parts: [{ text: modelMessage }] },
                    { role: 'user', parts: [{ text: userMessage }] }
                ]
            })
        });

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        const data = await response.json();
        if (response.ok) {
            let story = '';
            let totalTokens = 0;
            data.forEach(item => {
                if (item.candidates && item.candidates[0] && item.candidates[0].content && item.candidates[0].content.parts) {
                    item.candidates[0].content.parts.forEach(part => {
                        story += part.text;
                    });
                }
                if (item.usageMetadata) {
                    totalTokens = item.usageMetadata.totalTokenCount;
                }
            });

            displayResponse(story, responseDiv, totalTokens, model, duration);
            const initialMessage = document.getElementById('initial-message');
            if (initialMessage) initialMessage.remove();
        } else {
            responseDiv.innerText = 'Error: ' + (data.error.message || 'Unknown error');
        }
    } catch (error) {
        responseDiv.innerText = 'Error: ' + error.message;
    }
}

function addMessageToChat(message, className) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + className;
    messageDiv.innerText = message.content;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function displayResponse(content, responseDiv, totalTokens, model, duration) {
    responseDiv.innerHTML = content;
    const tokenInfo = document.createElement('div');
    tokenInfo.className = 'token-info';
    tokenInfo.innerText = `Total tokens used: ${totalTokens}, Time taken: ${duration} seconds, Model: ${model}`;
    responseDiv.appendChild(tokenInfo);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Function to save the value of model-message in a cookie
function saveModelMessage() {
    const modelMessage = modelMessageInput.value;
    setCookie('modelMessage', modelMessage, 7); // Save for 7 days
}

// Function to load the value of model-message from a cookie
function loadModelMessage() {
    const modelMessage = getCookie('modelMessage');
    if (modelMessage) {
        modelMessageInput.value = modelMessage;
    }
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', function () {
    loadModelMessage(); // Load the message when the page loads
    modelMessageInput.addEventListener('input', saveModelMessage); // Save the message when modified
});
