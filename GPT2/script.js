const systemMessageInput = document.getElementById('system-message');
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
    document.cookie = name + "=" + (value ? encodeURIComponent(value) : "") + expires + "; path=/";
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
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
    loadSystemMessage(); // Load the system message from cookie
});

// Save API key when input changes
apiKeyInput.addEventListener('input', () => {
    setCookie('apiKey', apiKeyInput.value, 7); // Save for 7 days
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
    const userMessage = userMessageInput.value.trim();
    const systemMessage = systemMessageInput.value.trim();
    const model = modelSelect.value;
    const temperature = parseFloat(temperatureInput.value.trim());
    const streamingEnabled = streamingCheckbox.checked;

    if (!apiKey) {
        alert('API key is required.');
        return;
    }

    // Clear input boxes after reading values
    userMessageInput.value = '';
    systemMessageInput.value = '';

    // Handle user message
    if (userMessage) {
        const userMessageObj = { role: 'user', content: userMessage };
        addMessageToChat(userMessageObj, 'user-message');
        conversation.push(userMessageObj);
    }

    // Handle system message
    if (systemMessage) {
        const systemMessageObj = { role: 'system', content: systemMessage };
        addMessageToChat(systemMessageObj, 'system-message');
        conversation.push(systemMessageObj);
        saveSystemMessage(); // Save system message to cookie
    }

    // Ensure there's at least a dot if no user message is provided
    //if (!userMessage && !systemMessage) {
    //    conversation.push({ role: 'user', content: '.' });
    //}

    const responseDiv = document.createElement('div');
    responseDiv.className = 'message bot-message';
    responseDiv.innerText = 'Loading...';
    chatContainer.appendChild(responseDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const startTime = Date.now();

    if (streamingEnabled) {
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
                    temperature: temperature,
                    stream: true
                })
            });

            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let content = '';
            let promptTokens = 0;
            let completionTokens = 0;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });

                // Split the chunk into individual data events
                const dataEvents = chunk.split('\n\n').filter(Boolean);

                for (const dataEvent of dataEvents) {
                    if (dataEvent.trim() === 'data: [DONE]') {
                        // End of stream
                        const endTime = Date.now();
                        const duration = ((endTime - startTime) / 1000).toFixed(2);
                        const botMessage = { role: 'assistant', content: content };
                        conversation.push(botMessage);
                        displayResponse(content, responseDiv, { prompt_tokens: promptTokens, completion_tokens: completionTokens }, model, duration);
                        const initialMessage = document.getElementById('initial-message');
                        if (initialMessage) initialMessage.remove();
                        return;
                    }

                    if (dataEvent.startsWith('data:')) {
                        const data = JSON.parse(dataEvent.slice(5)); // Remove 'data:'
                        const chunkContent = data.choices[0].delta.content || '';
                        content += chunkContent;
                        responseDiv.innerText = content;
                        chatContainer.scrollTop = chatContainer.scrollHeight;

                        if (data.usage) {
                            promptTokens = data.usage.prompt_tokens;
                            completionTokens = data.usage.completion_tokens;
                        }
                    }
                }
            }
        } catch (error) {
            responseDiv.innerText = 'Error: ' + error.message;
        }
    } else {
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

    if (usage && (usage.prompt_tokens > 0 || usage.completion_tokens > 0)) {
        const tokenInfo = document.createElement('div');
        tokenInfo.className = 'token-info';

        const cost = calculateCost(usage.prompt_tokens, usage.completion_tokens, model);
        accumulatedCost += cost;
        if (cost > 0) {
            tokenInfo.innerText = `Time: ${duration}s, Prompt tokens: ${usage.prompt_tokens}, Completion tokens: ${usage.completion_tokens}, model: ${model}, response cost: ${cost.toFixed(4)}c, accumulated cost: ${accumulatedCost.toFixed(2)}c`;
            copyBtnContainer.appendChild(tokenInfo);
        }
    }

    responseDiv.appendChild(copyBtnContainer);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function calculateCost(promptTokens, completionTokens, model) {
    let cost = 0;
    if (model === 'gpt-4') {
        cost = ((promptTokens * 30 / 1000000) + (completionTokens * 60 / 1000000)) * 100;
    } else if (model === 'gpt-4-turbo') {
        cost = ((promptTokens * 10 / 1000000) + (completionTokens * 30 / 1000000)) * 100;
    } else if (model === 'gpt-4o') {
        cost = ((promptTokens * 5 / 1000000) + (completionTokens * 15 / 1000000)) * 100;
    } else if (model === 'gpt-3.5-turbo') {
        cost = ((promptTokens * 0.5 / 1000000) + (completionTokens * 1.5 / 1000000)) * 100;
    }
    return cost;
}

// Function to save the value of system-message in a cookie
function saveSystemMessage() {
    const systemMessage = systemMessageInput.value;
    setCookie('systemMessage', systemMessage, 7); // Save for 7 days
}

// Function to load the value of system-message from a cookie
function loadSystemMessage() {
    const systemMessage = getCookie('systemMessage');
    if (systemMessage) {
        systemMessageInput.value = systemMessage;
    }
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', function () {
    loadSystemMessage(); // Load the message when the page loads
    systemMessageInput.addEventListener('input', saveSystemMessage); // Save the message when modified
});
