/* ============================================
   GPT Explorer v2 (multi-message) — script.js
   v2026: new models, cost tracking, improved UI
   ============================================ */

const MODELS = [
  { id: 'gpt-4o',         label: 'gpt-4o',           in: 2.50,  out: 10.00 },
  { id: 'gpt-4o-mini',    label: 'gpt-4o-mini ★',    in: 0.15,  out: 0.60  },
  { id: 'o1',             label: 'o1 (reasoning)',    in: 15.00, out: 60.00 },
  { id: 'o1-mini',        label: 'o1-mini',           in: 1.10,  out: 4.40  },
  { id: 'o3-mini',        label: 'o3-mini (new)',     in: 1.10,  out: 4.40  },
  { id: 'gpt-4-turbo',    label: 'gpt-4-turbo',      in: 10.00, out: 30.00 },
  { id: 'gpt-4',          label: 'gpt-4 (classic)',   in: 30.00, out: 60.00 },
  { id: 'gpt-3.5-turbo',  label: 'gpt-3.5-turbo',    in: 0.50,  out: 1.50  },
];

const apiKeyEl      = document.getElementById('api-key');
const modelSel      = document.getElementById('model-select');
const tempEl        = document.getElementById('temperature');
const sendBtn       = document.getElementById('send-btn');
const chatEl        = document.getElementById('chat-container');
const streamChk     = document.getElementById('streaming-checkbox');
const userMsgEl     = document.getElementById('user-message');
const sysMsgEl      = document.getElementById('system-message-v2');
const totalCostEl   = document.getElementById('total-cost');
const modelPriceEl  = document.getElementById('model-pricing');
const msgCountEl    = document.getElementById('msg-count');

let conversation = [];
let accumulatedCost = 0;
let msgCount = 0;

/* ---- Build model selector ---- */
function buildModelSelector() {
  MODELS.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id; opt.textContent = m.label;
    modelSel.appendChild(opt);
  });
  updatePricingLabel();
}

const NO_TEMP_MODELS = new Set(['o1', 'o1-mini', 'o3-mini']);

function updatePricingLabel() {
  const m = MODELS.find(x => x.id === modelSel.value);
  if (m) modelPriceEl.textContent = `$${m.in}/$${m.out} per 1M tokens`;
  const noTemp = NO_TEMP_MODELS.has(modelSel.value);
  tempEl.disabled = noTemp;
  tempEl.style.opacity = noTemp ? '0.4' : '1';
  tempEl.title = noTemp ? 'Temperature not supported for this model' : '';
  const lbl = tempEl.closest('.label-input')?.querySelector('label');
  if (lbl) lbl.style.opacity = noTemp ? '0.4' : '1';
}

/* ---- Calendar background ---- */
(function() {
  const cv=document.getElementById('bg-canvas');
  if(!cv) return;
  const cx=cv.getContext('2d');
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

/* ---- Cookies ---- */
function setCookie(n,v,d){const dt=new Date();dt.setTime(dt.getTime()+d*864e5);document.cookie=n+'='+(v?encodeURIComponent(v):'')+'; expires='+dt.toUTCString()+'; path=/';}
function getCookie(n){const eq=n+'=',ca=document.cookie.split(';');for(let c of ca){c=c.trim();if(c.indexOf(eq)===0)return decodeURIComponent(c.substring(eq.length));}return null;}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded',()=>{
  buildModelSelector();
  const k=getCookie('gpt_apiKey'); if(k){apiKeyEl.value=k;apiKeyEl.placeholder='API key saved';}
  addBotMsg('Enter API key, compose a user message (and optionally a system message), then click Send.');
});

apiKeyEl.addEventListener('input',()=>setCookie('gpt_apiKey',apiKeyEl.value,14));
modelSel.addEventListener('change',updatePricingLabel);

/* ---- Send ---- */
sendBtn.addEventListener('click', sendPrompt);
userMsgEl.addEventListener('keydown', e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendPrompt();} });

async function sendPrompt() {
  const apiKey = apiKeyEl.value.trim();
  const userMsg = userMsgEl.value.trim();
  const sysMsg  = sysMsgEl.value.trim();
  const model   = modelSel.value;
  const temp    = parseFloat(tempEl.value)||0.7;
  const stream  = streamChk.checked;

  if (!apiKey) { showAlert('Please enter your OpenAI API key.'); return; }
  if (!userMsg && !sysMsg) { showAlert('Type a user or system message.'); return; }
  const useTemp = !NO_TEMP_MODELS.has(model);

  userMsgEl.value = ''; sysMsgEl.value = '';

  if (sysMsg) {
    const obj = { role: 'system', content: sysMsg };
    addMsgBubble('⚙ System: ' + sysMsg, 'system-message');
    conversation.push(obj);
  }
  if (userMsg) {
    addMsgBubble(userMsg, 'user-message');
    conversation.push({ role: 'user', content: userMsg });
  }

  const resDiv = addBotMsg('…');
  chatEl.scrollTop = chatEl.scrollHeight;
  const t0 = Date.now();

  if (stream) await streamResp(apiKey, model, temp, resDiv, t0);
  else await fetchResp(apiKey, model, temp, resDiv, t0);
}

async function fetchResp(apiKey, model, temp, div, t0) {
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
      body:JSON.stringify({model,messages:conversation,...(useTemp&&{temperature:temp})})
    });
    const dur=((Date.now()-t0)/1000).toFixed(2);
    const data=await res.json();
    if(res.ok){
      const bot=data.choices[0].message.content;
      conversation.push({role:'assistant',content:bot});
      renderContent(bot,div,data.usage,model,dur);
      msgCount++;msgCountEl.textContent=msgCount;
    } else { div.textContent='Error: '+(data.error?.message||'Unknown'); div.style.color='#f87171'; }
  } catch(e){ div.textContent='Network error: '+e.message; div.style.color='#f87171'; }
}

async function streamResp(apiKey, model, temp, div, t0) {
  try {
    const res=await fetch('https://api.openai.com/v1/chat/completions',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},
      body:JSON.stringify({model,messages:conversation,...(useTemp&&{temperature:temp}),stream:true})
    });
    if(!res.body) throw new Error('No body');
    const reader=res.body.getReader(),dec=new TextDecoder();
    let content='',pT=0,cT=0;
    div.textContent='';
    while(true){
      const{done,value}=await reader.read(); if(done)break;
      const chunks=dec.decode(value,{stream:true}).split('\n\n').filter(Boolean);
      for(const chunk of chunks){
        if(chunk.trim()==='data: [DONE]'){
          const dur=((Date.now()-t0)/1000).toFixed(2);
          conversation.push({role:'assistant',content});
          renderContent(content,div,{prompt_tokens:pT,completion_tokens:cT},model,dur);
          msgCount++;msgCountEl.textContent=msgCount;
          return;
        }
        if(chunk.startsWith('data:')){
          try{
            const p=JSON.parse(chunk.slice(5));
            content+=p.choices[0].delta.content||'';
            div.textContent=content;
            if(p.usage){pT=p.usage.prompt_tokens;cT=p.usage.completion_tokens;}
            chatEl.scrollTop=chatEl.scrollHeight;
          }catch{}
        }
      }
    }
  } catch(e){ div.textContent='Stream error: '+e.message; div.style.color='#f87171'; }
}

function renderContent(content, div, usage, model, duration) {
  div.innerHTML='';
  const boldRe=/\*\*(.*?)\*\*/g, codeRe=/```(\w+)?\n?([\s\S]*?)```/g;
  let last=0, match;
  while((match=codeRe.exec(content))!==null){
    if(match.index>last){const sp=document.createElement('span');sp.innerHTML=content.substring(last,match.index).replace(boldRe,'<strong>$1</strong>').replace(/\n/g,'<br>');div.appendChild(sp);}
    const blk=document.createElement('div');blk.className='code-block';
    const pre=document.createElement('pre');pre.textContent=match[2];blk.appendChild(pre);div.appendChild(blk);
    addCopyBtn(div,match[2]);
    last=codeRe.lastIndex;
  }
  if(last<content.length){const sp=document.createElement('span');sp.innerHTML=content.substring(last).replace(boldRe,'<strong>$1</strong>').replace(/\n/g,'<br>');div.appendChild(sp);}
  if(usage&&(usage.prompt_tokens>0||usage.completion_tokens>0)){
    const cost=calcCost(usage.prompt_tokens,usage.completion_tokens,model);
    accumulatedCost+=cost;totalCostEl.textContent='$'+accumulatedCost.toFixed(4);
    const info=document.createElement('div');info.className='token-info';
    info.textContent=`⏱ ${duration}s · ↑${usage.prompt_tokens} ↓${usage.completion_tokens} tokens · $${cost.toFixed(5)} · total $${accumulatedCost.toFixed(4)}`;
    div.appendChild(info);
  }
  addCopyBtn(div,content,'Copy all');
  chatEl.scrollTop=chatEl.scrollHeight;
}

function calcCost(pt,ct,model){
  const m=MODELS.find(x=>x.id===model); if(!m)return 0;
  return (pt*m.in/1e6)+(ct*m.out/1e6);
}

function addBotMsg(text){
  const d=document.createElement('div');d.className='message bot-message';d.textContent=text;
  chatEl.appendChild(d);chatEl.scrollTop=chatEl.scrollHeight;return d;
}
function addMsgBubble(text,cls){
  const d=document.createElement('div');d.className='message '+cls;d.textContent=text;
  chatEl.appendChild(d);chatEl.scrollTop=chatEl.scrollHeight;
}
function addCopyBtn(parent,text,label='Copy'){
  const w=document.createElement('div');w.className='copy-btn-container';
  const b=document.createElement('button');b.className='copy-btn';b.textContent=label;
  b.onclick=()=>navigator.clipboard.writeText(text).then(()=>{b.textContent='Copied!';setTimeout(()=>b.textContent=label,2000);});
  w.appendChild(b);parent.appendChild(w);
}
function showAlert(msg){const d=addBotMsg('⚠ '+msg);d.style.color='#fbbf24';}
