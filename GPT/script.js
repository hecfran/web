const apiKeyInput = document.getElementById('api-key');
const promptInput = document.getElementById('prompt');
const modelSelect = document.getElementById('model-select');
const temperatureInput = document.getElementById('temperature');
const sendBtn = document.getElementById('send-btn');
const chatContainer = document.getElementById('chat-container');
let conversation = [];

// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Retrieve API key from cookie on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedApiKey = getCookie('apiKey');
    apiKeyInput.value = savedApiKey || '';
    apiKeyInput.placeholder = savedApiKey ? '' : 'Write your API key here';
    addInitialMessage();
});

// Save API key when input changes
apiKeyInput.addEventListener('input', () => {
    setCookie('apiKey', apiKeyInput.value, 7); // Save for 7 days
});

promptInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        sendPrompt();
    }
});

sendBtn.addEventListener('click', sendPrompt);

function addInitialMessage() {
    const initialMessage = document.createElement('div');
    initialMessage.className = 'message bot-message';
    initialMessage.innerText = 'Please write your private OpenAI key at the bottom left field to use this page.';
    initialMessage.id = 'initial-message';
    chatContainer.appendChild(initialMessage);
}

async function sendPrompt() {
    const apiKey = apiKeyInput.value.trim();
    const prompt = promptInput.value.trim();
    const model = modelSelect.value;
    const temperature = parseFloat(temperatureInput.value.trim());

    if (!apiKey) {
        alert('API key is required.');
        return;
    }

    if (!prompt) return;

    const userMessage = { role: 'user', content: prompt };
    addMessageToChat(userMessage, 'user-message');
    conversation.push(userMessage);
    promptInput.value = '';

    const responseDiv = document.createElement('div');
    responseDiv.className = 'message bot-message';
    responseDiv.innerText = 'Loading...';
    chatContainer.appendChild(responseDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const startTime = Date.now();

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: conversation,
                temperature: temperature
            })
        });

        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        const data = await response.json();
        if (response.ok) {
            const botMessage = { role: 'assistant', content: data.choices[0].message.content };
            conversation.push(botMessage);
            displayResponse(botMessage.content, responseDiv, data.usage, model, duration);
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

function displayResponse(content, responseDiv, usage, model, duration) {
    responseDiv.innerHTML = ''; // Clear loading text
    const originalContent = content;
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const boldTextRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
        const beforeCode = content.substring(lastIndex, match.index);
        const code = match[2];

        if (beforeCode) {
            responseDiv.appendChild(document.createTextNode(beforeCode.replace(boldTextRegex, '<strong>$1</strong>')));
            responseDiv.appendChild(document.createElement('br'));
        }

        const codeElement = document.createElement('div');
        codeElement.className = 'code-block';

        const preElement = document.createElement('pre');
        preElement.textContent = code;

        codeElement.appendChild(preElement);
        responseDiv.appendChild(codeElement);

        // Add a copy button under the code block
        const copyBtnContainer = document.createElement('div');
        copyBtnContainer.className = 'copy-btn-container';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerText = 'Copy';
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(code).then(() => {
                copyBtn.innerText = 'Copied!';
                setTimeout(() => {
                    copyBtn.innerText = 'Copy';
                }, 2000);
            });
        });
        copyBtnContainer.appendChild(copyBtn);

        responseDiv.appendChild(copyBtnContainer);

        lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < content.length) {
        const remainingText = content.substring(lastIndex).replace(boldTextRegex, '<strong>$1</strong>').replace(/\n/g, '<br>');
        responseDiv.innerHTML += remainingText;
    }

    // Add a copy button under the response
    const copyBtnContainer = document.createElement('div');
    copyBtnContainer.className = 'copy-btn-container';
    
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerText = 'Copy';
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(originalContent).then(() => {
            copyBtn.innerText = 'Copied!';
            setTimeout(() => {
                copyBtn.innerText = 'Copy';
            }, 2000);
        });
    });
    copyBtnContainer.appendChild(copyBtn);

    if (usage) {
        const tokenInfo = document.createElement('div');
        tokenInfo.className = 'token-info';
        
        const cost = calculateCost(usage.prompt_tokens, usage.completion_tokens, model);
        
        tokenInfo.innerText = `Time: ${duration}s, Prompt tokens: ${usage.prompt_tokens}, Completion tokens: ${usage.completion_tokens}, Cost: ${cost.toFixed(6)}c`;
        copyBtnContainer.appendChild(tokenInfo);
    }

    responseDiv.appendChild(copyBtnContainer);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function calculateCost(promptTokens, completionTokens, model) {
    let cost = 0;
    if (model === 'gpt-4o') {
        cost = ((promptTokens * 5 / 1000000) + (completionTokens * 15 / 1000000)) * 100;
    } else if (model === 'gpt-3.5-turbo') {
        cost = ((promptTokens * 0.5 / 1000000) + (completionTokens * 1.5 / 1000000)) * 100;
    }
    return cost;
}
