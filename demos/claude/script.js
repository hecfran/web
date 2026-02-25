/* ============================================
   Claude Explorer v2026 — script.js
   Anthropic Messages API cost & speed inspector
   ============================================ */

/* ---- MODEL CATALOGUE (Feb 2026 pricing, per 1M tokens) ---- */
const MODELS = [
  { id: 'claude-3-5-sonnet-20241022', label: 'claude-3-5-sonnet ★',  in: 3.00,  out: 15.00 },
  { id: 'claude-3-5-haiku-20241022',  label: 'claude-3-5-haiku',     in: 0.80,  out: 4.00  },
  { id: 'claude-3-opus-20240229',     label: 'claude-3-opus',        in: 15.00, out: 75.00 },
  { id: 'claude-3-sonnet-20240229',   label: 'claude-3-sonnet',      in: 3.00,  out: 15.00 },
  { id: 'claude-3-haiku-20240307',    label: 'claude-3-haiku',       in: 0.25,  out: 1.25  },
];

/* ---- DOM REFS ---- */
const systemMsgEl  = document.getElementById('system-message');
const apiKeyEl     = document.getElementById('api-key');
const promptEl     = document.getElementById('prompt');
const modelSel     = document.getElementById('model-select');
const maxToksEl    = document.getElementById('max-tokens');
const tempEl       = document.getElementById('temperature');
const sendBtn      = document.getElementById('send-btn');
const chatEl       = document.getElementById('chat-container');
const streamChk    = document.getElementById('streaming-checkbox');
const totalCostEl  = document.getElementById('total-cost');
const modelPriceEl = document.getElementById('model-pricing');
const msgCountEl   = document.getElementById('msg-count');

let conversation = [];
let systemMessageLocked = false;
let accumulatedCost = 0;
let msgCount = 0;

/* ---- BUILD MODEL SELECTOR ---- */
function buildModelSelector() {
  MODELS.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = m.label;
    modelSel.appendChild(opt);
  });
  updatePricingLabel();
}

function updatePricingLabel() {
  const m = MODELS.find(x => x.id === modelSel.value);
  if (m) modelPriceEl.textContent = `$${m.in}/$${m.out} per 1M tokens`;
}

/* ---- CALENDAR BACKGROUND (horizontal pulse variant) ---- */
(function () {
  const cv = document.getElementById('bg-canvas');
  if (!cv) return;
  const cx = cv.getContext('2d');
  const C = 14, G = 3, S = C + G;
  const GR = [
    'rgba(10, 18, 12, 0.0)',
    'rgba(8, 36, 20, 0.6)',
    'rgba(6, 52, 28, 0.65)',
    'rgba(12, 72, 36, 0.7)',
    'rgba(20, 90, 44, 0.75)'
  ];
  let cols, rows, cells = [], W, H;

  function resize() {
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
    cols = Math.ceil(W / S) + 2;
    rows = Math.ceil(H / S) + 2;
    buildCells();
  }

  function buildCells() {
    cells = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const lv = Math.random() < 0.35 ? 0 : Math.floor(Math.random() * 4) + 1;
        cells.push({
          x: c * S, y: r * S, level: lv,
          op: Math.random() * 0.4 + 0.1,
          ph: Math.random() * Math.PI * 2,
          sp: 0.003 + Math.random() * 0.003
        });
      }
    }
  }

  function draw() {
    cx.clearRect(0, 0, W, H);
    cells.forEach(cell => {
      let lv = cell.level, al = cell.op;
      if (lv > 0) { cell.ph += cell.sp; al = Math.min(1, al + Math.sin(cell.ph) * 0.12); }
      if (lv === 0) return;
      cx.globalAlpha = al;
      cx.fillStyle = GR[lv];
      cx.beginPath();
      if (cx.roundRect) cx.roundRect(cell.x, cell.y, C, C, 2);
      else cx.rect(cell.x, cell.y, C, C);
      cx.fill();
    });
    cx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  resize();
  draw();
  window.addEventListener('resize', resize);
})();

/* ---- COOKIES ---- */
function setCookie(name, value, days) {
  const d = new Date(); d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + (value ? encodeURIComponent(value) : '') + '; expires=' + d.toUTCString() + '; path=/';
}
function getCookie(name) {
  const eq = name + '=', ca = document.cookie.split(';');
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(eq) === 0) return decodeURIComponent(c.substring(eq.length));
  }
  return null;
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  buildModelSelector();
  const savedKey = getCookie('claude_apiKey');
  if (savedKey) { apiKeyEl.value = savedKey; apiKeyEl.placeholder = 'API key saved'; }
  const savedSys = getCookie('claude_systemMsg');
  if (savedSys) systemMsgEl.value = savedSys;
  addBotMessage('Enter your Anthropic API key, set an optional system prompt, then type your first message. API keys start with sk-ant-…');
});

apiKeyEl.addEventListener('input', () => setCookie('claude_apiKey', apiKeyEl.value, 14));
systemMsgEl.addEventListener('input', () => setCookie('claude_systemMsg', systemMsgEl.value, 14));
modelSel.addEventListener('change', updatePricingLabel);

promptEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendPrompt(); }
});
sendBtn.addEventListener('click', sendPrompt);

/* ---- SEND ---- */
async function sendPrompt() {
  const apiKey  = apiKeyEl.value.trim();
  const text    = promptEl.value.trim() || '.';
  const model   = modelSel.value;
  const maxToks = parseInt(maxToksEl.value) || 2048;
  const temp    = parseFloat(tempEl.value) ?? 1.0;
  const stream  = streamChk.checked;
  const sysMsg  = systemMsgEl.value.trim();

  if (!apiKey) { showAlert('Please enter your Anthropic API key (sk-ant-…).'); return; }

  // Lock system message on first send
  if (sysMsg && !systemMessageLocked) {
    systemMessageLocked = true;
    systemMsgEl.style.display = 'none';
    addSystemBubble(sysMsg);
  } else if (!systemMessageLocked) {
    systemMsgEl.style.display = 'none';
  }

  addUserBubble(text);
  conversation.push({ role: 'user', content: text });
  promptEl.value = '';

  const responseDiv = addBotMessage('…');
  chatEl.scrollTop = chatEl.scrollHeight;

  const t0 = Date.now();

  if (stream) {
    await streamResponse(apiKey, model, maxToks, temp, sysMsg, responseDiv, t0);
  } else {
    await fetchResponse(apiKey, model, maxToks, temp, sysMsg, responseDiv, t0);
  }
}

/* ---- BUILD REQUEST BODY ---- */
function buildBody(model, maxToks, temp, sysMsg, stream = false) {
  const body = {
    model,
    max_tokens: maxToks,
    temperature: temp,
    messages: conversation
  };
  if (sysMsg) body.system = sysMsg;
  if (stream) body.stream = true;
  return body;
}

function buildHeaders(apiKey) {
  return {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true'
  };
}

/* ---- FETCH (non-streaming) ---- */
async function fetchResponse(apiKey, model, maxToks, temp, sysMsg, responseDiv, t0) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: buildHeaders(apiKey),
      body: JSON.stringify(buildBody(model, maxToks, temp, sysMsg, false))
    });
    const duration = ((Date.now() - t0) / 1000).toFixed(2);
    const data = await res.json();
    if (res.ok) {
      const botMsg = data.content.map(b => b.text || '').join('');
      conversation.push({ role: 'assistant', content: botMsg });
      renderBotContent(botMsg, responseDiv, data.usage, model, duration);
      msgCount++; msgCountEl.textContent = msgCount;
    } else {
      responseDiv.textContent = 'Error: ' + (data.error?.message || JSON.stringify(data));
      responseDiv.style.color = '#f87171';
    }
  } catch (e) {
    responseDiv.textContent = 'Network error: ' + e.message;
    responseDiv.style.color = '#f87171';
  }
}

/* ---- STREAM ---- */
async function streamResponse(apiKey, model, maxToks, temp, sysMsg, responseDiv, t0) {
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: buildHeaders(apiKey),
      body: JSON.stringify(buildBody(model, maxToks, temp, sysMsg, true))
    });
    if (!res.body) throw new Error('No response body');

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let content = '';
    let inTokens = 0, outTokens = 0;

    responseDiv.textContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const raw = decoder.decode(value, { stream: true });
      const lines = raw.split('\n');

      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const json = line.slice(5).trim();
        if (!json || json === '[DONE]') continue;
        try {
          const ev = JSON.parse(json);
          if (ev.type === 'content_block_delta' && ev.delta?.type === 'text_delta') {
            content += ev.delta.text;
            responseDiv.textContent = content;
            chatEl.scrollTop = chatEl.scrollHeight;
          }
          if (ev.type === 'message_start' && ev.message?.usage) {
            inTokens = ev.message.usage.input_tokens;
          }
          if (ev.type === 'message_delta' && ev.usage) {
            outTokens = ev.usage.output_tokens;
          }
          if (ev.type === 'message_stop') {
            const duration = ((Date.now() - t0) / 1000).toFixed(2);
            conversation.push({ role: 'assistant', content });
            renderBotContent(content, responseDiv, { input_tokens: inTokens, output_tokens: outTokens }, model, duration);
            msgCount++; msgCountEl.textContent = msgCount;
            return;
          }
        } catch { /* skip malformed SSE lines */ }
      }
    }
  } catch (e) {
    responseDiv.textContent = 'Stream error: ' + e.message;
    responseDiv.style.color = '#f87171';
  }
}

/* ---- RENDER CONTENT ---- */
function renderBotContent(content, div, usage, model, duration) {
  div.innerHTML = '';
  const boldRe = /\*\*(.*?)\*\*/g;
  const codeRe = /```(\w+)?\n?([\s\S]*?)```/g;
  let last = 0, match;

  while ((match = codeRe.exec(content)) !== null) {
    const before = content.substring(last, match.index);
    if (before) appendText(div, before, boldRe);

    const block = document.createElement('div');
    block.className = 'code-block';
    const pre = document.createElement('pre');
    pre.textContent = match[2];
    block.appendChild(pre);
    div.appendChild(block);
    appendCopyBtn(div, match[2]);
    last = codeRe.lastIndex;
  }

  const remaining = content.substring(last);
  if (remaining) appendText(div, remaining, boldRe);

  // Stats row (Anthropic uses input_tokens / output_tokens)
  const pt = usage?.input_tokens  ?? usage?.prompt_tokens ?? 0;
  const ct = usage?.output_tokens ?? usage?.completion_tokens ?? 0;
  if (pt > 0 || ct > 0) {
    const cost = calcCost(pt, ct, model);
    accumulatedCost += cost;
    totalCostEl.textContent = '$' + accumulatedCost.toFixed(4);

    const info = document.createElement('div');
    info.className = 'token-info';
    info.textContent = `⏱ ${duration}s · ↑${pt} ↓${ct} tokens · $${cost.toFixed(5)} · total $${accumulatedCost.toFixed(4)}`;
    div.appendChild(info);
  }

  appendCopyBtn(div, content, 'Copy all');
  chatEl.scrollTop = chatEl.scrollHeight;
}

function appendText(parent, text, boldRe) {
  const span = document.createElement('span');
  span.innerHTML = text.replace(boldRe, '<strong>$1</strong>').replace(/\n/g, '<br>');
  parent.appendChild(span);
}

function appendCopyBtn(parent, text, label = 'Copy') {
  const wrap = document.createElement('div');
  wrap.className = 'copy-btn-container';
  const btn = document.createElement('button');
  btn.className = 'copy-btn';
  btn.textContent = label;
  btn.onclick = () => navigator.clipboard.writeText(text).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = label, 2000);
  });
  wrap.appendChild(btn);
  parent.appendChild(wrap);
}

/* ---- COST CALC ---- */
function calcCost(pt, ct, model) {
  const m = MODELS.find(x => x.id === model);
  if (!m) return 0;
  return (pt * m.in / 1e6) + (ct * m.out / 1e6);
}

/* ---- UI HELPERS ---- */
function addBotMessage(text) {
  const div = document.createElement('div');
  div.className = 'message bot-message';
  div.textContent = text;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
  return div;
}

function addUserBubble(text) {
  const div = document.createElement('div');
  div.className = 'message user-message';
  div.textContent = text;
  chatEl.appendChild(div);
}

function addSystemBubble(text) {
  const div = document.createElement('div');
  div.className = 'message system-message';
  div.textContent = '⚙ System: ' + text;
  chatEl.insertBefore(div, chatEl.firstChild);
}

function showAlert(msg) {
  const div = addBotMessage('⚠ ' + msg);
  div.style.color = '#fbbf24';
}
