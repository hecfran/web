/* ============================================
   GPT Explorer v2026 — script.js
   Upgraded: new models, better UI, cost tracking
   ============================================ */

/* ---- MODEL CATALOGUE (Feb 2026 pricing) ---- */
const MODELS = [
  { id: 'gpt-4o',          label: 'gpt-4o',           in: 2.50,  out: 10.00 },
  { id: 'gpt-4o-mini',     label: 'gpt-4o-mini ★',    in: 0.15,  out: 0.60  },
  { id: 'o1',              label: 'o1 (reasoning)',    in: 15.00, out: 60.00 },
  { id: 'o1-mini',         label: 'o1-mini',           in: 1.10,  out: 4.40  },
  { id: 'o3-mini',         label: 'o3-mini (new)',     in: 1.10,  out: 4.40  },
  { id: 'gpt-4-turbo',     label: 'gpt-4-turbo',      in: 10.00, out: 30.00 },
  { id: 'gpt-4',           label: 'gpt-4 (classic)',   in: 30.00, out: 60.00 },
  { id: 'gpt-3.5-turbo',   label: 'gpt-3.5-turbo',    in: 0.50,  out: 1.50  },
];

/* ---- DOM REFS ---- */
const systemMsgEl   = document.getElementById('system-message');
const apiKeyEl      = document.getElementById('api-key');
const promptEl      = document.getElementById('prompt');
const modelSel      = document.getElementById('model-select');
const tempEl        = document.getElementById('temperature');
const sendBtn       = document.getElementById('send-btn');
const chatEl        = document.getElementById('chat-container');
const streamChk     = document.getElementById('streaming-checkbox');
const totalCostEl   = document.getElementById('total-cost');
const modelPriceEl  = document.getElementById('model-pricing');
const msgCountEl    = document.getElementById('msg-count');

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

/* Models that do NOT support temperature parameter */
const NO_TEMP_MODELS = new Set(['o1', 'o1-mini', 'o3-mini']);

function updatePricingLabel() {
  const m = MODELS.find(x => x.id === modelSel.value);
  if (m) modelPriceEl.textContent = `$${m.in}/$${m.out} per 1M tokens`;
  // Disable temperature for reasoning models
  const noTemp = NO_TEMP_MODELS.has(modelSel.value);
  tempEl.disabled = noTemp;
  tempEl.title = noTemp ? 'Temperature not supported for this model' : '';
  tempEl.style.opacity = noTemp ? '0.4' : '1';
  const tempLabel = tempEl.closest('.label-input')?.querySelector('label');
  if (tempLabel) tempLabel.style.opacity = noTemp ? '0.4' : '1';
}

/* ---- CALENDAR BACKGROUND ---- */
(function() {
  const cv = document.getElementById('bg-canvas');
  if (!cv) return;
  const cx = cv.getContext('2d');
  const C=14,G=3,S=C+G;
  const GR=['rgba(22,27,34,0)','rgba(14,68,41,.7)','rgba(0,109,50,.8)','rgba(38,166,65,.9)','rgba(57,211,83,1)'];
  let cols,rows,cells=[],streaks=[],W,H,frame=0;
  function resize(){W=cv.width=window.innerWidth;H=cv.height=window.innerHeight;cols=Math.ceil(W/S)+2;rows=Math.ceil(H/S)+2;buildCells();buildStreaks();}
  function buildCells(){cells=[];for(let c=0;c<cols;c++)for(let r=0;r<rows;r++)cells.push({x:c*S,y:r*S,level:Math.random()<.35?0:Math.floor(Math.random()*4)+1,op:Math.random()*.4+.1,ph:Math.random()*Math.PI*2,sp:.003+Math.random()*.004,col:c,row:r});}
  function buildStreaks(){streaks=[];for(let c=0;c<cols;c++)streaks.push({col:c,row:Math.random()*rows,speed:.04+Math.random()*.12,len:4+Math.floor(Math.random()*8),active:Math.random()<.6});}
  function draw(){
    cx.clearRect(0,0,W,H);frame++;
    if(frame%120===0)streaks.forEach(s=>{if(!s.active&&Math.random()<.3){s.active=true;s.row=-s.len;s.speed=.04+Math.random()*.12;}});
    streaks.forEach(s=>{if(s.active){s.row+=s.speed;if(s.row>rows+s.len)s.active=false;}});
    const sm={};streaks.forEach(s=>{if(s.active)sm[s.col]=s.row;});
    cells.forEach(cell=>{
      let lv=cell.level,al=cell.op;
      const sk=sm[cell.col];
      if(sk!==undefined){const d=sk-cell.row;const tail=cell.col%3===0?12:8;if(d>=0&&d<tail){const t=1-d/tail;if(d<1.5){lv=4;al=1;}else{lv=Math.max(lv,Math.round(t*4));al=Math.max(al,t*.9);}}}
      if(lv>0){cell.ph+=cell.sp;al=Math.min(1,al+Math.sin(cell.ph)*.15);}
      cx.globalAlpha=al;cx.fillStyle=GR[lv];cx.beginPath();cx.roundRect(cell.x,cell.y,C,C,2);cx.fill();
    });
    cx.globalAlpha=1;requestAnimationFrame(draw);
  }
  resize();draw();window.addEventListener('resize',resize);
})();

/* ---- COOKIES ---- */
function setCookie(name, value, days) {
  const d = new Date(); d.setTime(d.getTime() + days*24*60*60*1000);
  document.cookie = name+'='+(value?encodeURIComponent(value):'')+'; expires='+d.toUTCString()+'; path=/';
}
function getCookie(name) {
  const eq = name+'=', ca = document.cookie.split(';');
  for (let c of ca) {
    c = c.trim();
    if (c.indexOf(eq)===0) return decodeURIComponent(c.substring(eq.length));
  }
  return null;
}

/* ---- INIT ---- */
document.addEventListener('DOMContentLoaded', () => {
  buildModelSelector();
  const savedKey = getCookie('gpt_apiKey');
  if (savedKey) { apiKeyEl.value = savedKey; apiKeyEl.placeholder = 'API key saved'; }
  const savedSys = getCookie('gpt_systemMsg');
  if (savedSys) systemMsgEl.value = savedSys;
  addBotMessage('Enter your OpenAI API key below, set an optional system prompt, then type your first message.');
});

apiKeyEl.addEventListener('input', () => setCookie('gpt_apiKey', apiKeyEl.value, 14));
systemMsgEl.addEventListener('input', () => setCookie('gpt_systemMsg', systemMsgEl.value, 14));
modelSel.addEventListener('change', updatePricingLabel);

promptEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendPrompt(); }
});
sendBtn.addEventListener('click', sendPrompt);

/* ---- SEND ---- */
async function sendPrompt() {
  const apiKey = apiKeyEl.value.trim();
  const prompt = promptEl.value.trim() || '.';
  const model  = modelSel.value;
  const temp   = parseFloat(tempEl.value) || 0.7;
  const stream = streamChk.checked;
  const sysMsg = systemMsgEl.value.trim();

  if (!apiKey) { showAlert('Please enter your OpenAI API key.'); return; }
  // Check if temperature is supported for selected model
  const useTemp = !NO_TEMP_MODELS.has(model);

  // Lock system message on first send
  if (sysMsg && !systemMessageLocked) {
    conversation.unshift({ role: 'system', content: sysMsg });
    systemMessageLocked = true;
    systemMsgEl.style.display = 'none';
    addSystemBubble(sysMsg);
  } else if (!systemMessageLocked) {
    systemMsgEl.style.display = 'none';
  }

  addUserBubble(prompt);
  conversation.push({ role: 'user', content: prompt });
  promptEl.value = '';

  const responseDiv = addBotMessage('…');
  chatEl.scrollTop = chatEl.scrollHeight;

  const t0 = Date.now();

  if (stream) {
    await streamResponse(apiKey, model, temp, responseDiv, t0);
  } else {
    await fetchResponse(apiKey, model, temp, responseDiv, t0);
  }
}

/* ---- FETCH (non-streaming) ---- */
async function fetchResponse(apiKey, model, temp, responseDiv, t0) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages: conversation, ...(useTemp && { temperature: temp }) })
    });
    const duration = ((Date.now() - t0) / 1000).toFixed(2);
    const data = await res.json();
    if (res.ok) {
      const botMsg = data.choices[0].message.content;
      conversation.push({ role: 'assistant', content: botMsg });
      renderBotContent(botMsg, responseDiv, data.usage, model, duration);
      msgCount++; msgCountEl.textContent = msgCount;
    } else {
      responseDiv.textContent = 'Error: ' + (data.error?.message || 'Unknown error');
      responseDiv.style.color = '#f87171';
    }
  } catch (e) {
    responseDiv.textContent = 'Network error: ' + e.message;
    responseDiv.style.color = '#f87171';
  }
}

/* ---- STREAM ---- */
async function streamResponse(apiKey, model, temp, responseDiv, t0) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ model, messages: conversation, ...(useTemp && { temperature: temp }), stream: true })
    });
    if (!res.body) throw new Error('No response body');
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let content = '', pTokens = 0, cTokens = 0;

    responseDiv.textContent = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunks = decoder.decode(value, { stream: true }).split('\n\n').filter(Boolean);
      for (const chunk of chunks) {
        if (chunk.trim() === 'data: [DONE]') {
          const duration = ((Date.now() - t0) / 1000).toFixed(2);
          conversation.push({ role: 'assistant', content });
          renderBotContent(content, responseDiv, { prompt_tokens: pTokens, completion_tokens: cTokens }, model, duration);
          msgCount++; msgCountEl.textContent = msgCount;
          return;
        }
        if (chunk.startsWith('data:')) {
          try {
            const parsed = JSON.parse(chunk.slice(5));
            content += parsed.choices[0].delta.content || '';
            responseDiv.textContent = content;
            if (parsed.usage) { pTokens = parsed.usage.prompt_tokens; cTokens = parsed.usage.completion_tokens; }
            chatEl.scrollTop = chatEl.scrollHeight;
          } catch {}
        }
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

  // Stats row
  if (usage && (usage.prompt_tokens > 0 || usage.completion_tokens > 0)) {
    const cost = calcCost(usage.prompt_tokens, usage.completion_tokens, model);
    accumulatedCost += cost;
    totalCostEl.textContent = '$' + accumulatedCost.toFixed(4);

    const info = document.createElement('div');
    info.className = 'token-info';
    info.textContent = `⏱ ${duration}s · ↑${usage.prompt_tokens} ↓${usage.completion_tokens} tokens · $${cost.toFixed(5)} · total $${accumulatedCost.toFixed(4)}`;
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
