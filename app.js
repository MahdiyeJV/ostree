/* =========================================================
   Grow the Tree: core (home, game, tree rendering)
   ========================================================= */
const app = document.getElementById('app');
const $ = (h)=>{const t=document.createElement('template');t.innerHTML=h.trim();return t.content.firstElementChild;};
const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const store = {
  get(k){try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
};
let VIEW = 'home';
let G = null; // game state

/* ---------- theme ---------- */
(function(){
  const root=document.documentElement;
  let saved=null; try{saved=localStorage.getItem('ost-theme')}catch(e){}
  if(saved) root.setAttribute('data-theme',saved);
  document.getElementById('themeBtn').onclick=()=>{
    const cur=root.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    const next=cur==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('ost-theme',next)}catch(e){}
  };
  document.getElementById('homeBtn').onclick=()=>go('home');
})();

/* ---------- HUD ---------- */
function setHud(left, right, segments, now){
  document.getElementById('levelPill').textContent = left||'';
  document.getElementById('scorePill').textContent = right||'';
  const p=document.getElementById('progress'); p.innerHTML='';
  p.style.display = segments ? '' : 'none';
  for(let i=0;i<(segments||0);i++){const s=document.createElement('span'); if(i<now) s.className='done'; else if(i===now) s.className='now'; p.appendChild(s);}
}

/* ---------- generic tree ---------- */
// data: {outcome, parking:[str], parents:[{text, kids:[{text,target,sols:[{text,tests:[str]}]}]}]}
function renderTree(d, emptyMsg){
  if(!d || !d.outcome) return `<div class="treeempty">${emptyMsg||'Your tree is just a seed.<br>Finish a level to watch it grow.'}</div>`;
  let h = `<div class="tree"><div class="node outcome">${d.outcome}</div>`;
  const parents=(d.parents||[]).filter(p=>p.text);
  if(parents.length){
    h += `<ul>${parents.map(p=>{
      const kids=(p.kids||[]);
      return `<li><div class="node opp parent">${p.text}</div>${kids.length?`<ul>${kids.map(k=>{
        const sols=(k.sols||[]);
        return `<li><div class="node opp${k.target?' target':''}${k.cls?' '+k.cls:''}">${k.text}</div>${sols.length?`<ul>${sols.map(s=>{
          const tests=(s.tests||[]).map(t=>typeof t==='string'?{text:t}:t);
          return `<li><div class="node sol${s.cls?' '+s.cls:''}">${s.text}</div>${tests.length?`<ul>${tests.map(t=>`<li><div class="node test${t.cls?' '+t.cls:''}">${t.text}</div></li>`).join('')}</ul>`:''}</li>`;
        }).join('')}</ul>`:''}</li>`;
      }).join('')}</ul>`:''}</li>`;
    }).join('')}</ul>`;
  }
  h += `</div>`;
  if(d.parking && d.parking.length){
    h += `<div class="parking"><div class="label">${d.parkingLabel||'Opportunities found (not yet structured)'}</div>${d.parking.map(t=>`<div class="node opp">${t}</div>`).join('')}</div>`;
  }
  return h;
}
function treePanel(d, emptyMsg, title='Your tree', cls=''){
  return `<aside class="card treepanel ${cls}" aria-label="Opportunity solution tree">
    <h3>${title}</h3>
    <div class="legend"><span style="--c:var(--outcome)">Outcome</span><span style="--c:var(--opp)">Opportunity</span><span style="--c:var(--sol)">Solution</span><span style="--c:var(--test)">Assumption test</span>${cls.includes('ws')?'<span class="lg-failed">Failed</span>':''}</div>
    <div class="treescroll"><div class="treefit">${renderTree(d, emptyMsg)}</div></div>
  </aside>`;
}
/* scale the tree to fit its panel (down to 50%), then scroll */
function fitTree(){
  document.querySelectorAll('.treescroll').forEach(sc=>{
    const fitEl=sc.querySelector('.treefit'); const tree=sc.querySelector('.tree'); if(!fitEl) return;
    fitEl.style.transform=''; fitEl.style.width=''; fitEl.style.marginLeft=''; sc.style.height='';
    if(!tree) return;
    const avail=sc.clientWidth, w=Math.max(tree.scrollWidth, fitEl.scrollWidth), h=fitEl.scrollHeight;
    const k=Math.max(.5, Math.min(1, avail/w));
    fitEl.style.transform=`scale(${k})`;
    fitEl.style.width = w+'px';
    fitEl.style.marginLeft = (w*k<avail) ? ((avail-w*k)/2)+'px' : '0';
    sc.style.height=(h*k+12)+'px';
    const t=sc.querySelector('.target')||sc.querySelector('.outcome');
    if(w*k>avail && t){ const r=t.getBoundingClientRect(), sr=sc.getBoundingClientRect(); sc.scrollLeft += (r.left+r.width/2)-(sr.left+sr.width/2); }
  });
}
addEventListener('resize', fitTree);
function refreshTreePanel(d, emptyMsg){
  const fit=document.querySelector('.treepanel .treefit'); if(!fit) return;
  fit.innerHTML=renderTree(d, emptyMsg); requestAnimationFrame(fitTree);
}

/* ---------- routing ---------- */
function go(view, arg){
  VIEW=view;
  window.scrollTo({top:0,behavior:'smooth'});
  if(view==='home') return home();
  if(view==='game') { startGame(arg); return renderGame(); }
  if(view==='workshop') return Workshop.open();
}

/* ---------- home ---------- */
function home(){
  setHud('', '', 0, 0);
  const best = store.get('ost-best')||{};
  const hasW = Workshop.hasSaved();
  app.innerHTML = `
  <section class="card hero">
    <div class="eyebrow">Continuous discovery, one branch at a time</div>
    <h2>Can you grow a healthy<br>Opportunity Solution Tree?</h2>
    <p>An Opportunity Solution Tree connects the work your team does to the outcome you're trying to move. Practice on a scenario, then build one for your own product.</p>
    <div class="steps">
      <div class="step" style="--c:var(--outcome);--cb:var(--outcome-bg)"><b>Outcome</b><span>The customer behavior change you're aiming for</span></div>
      <div class="step" style="--c:var(--opp);--cb:var(--opp-bg)"><b>Opportunities</b><span>Needs, pains and desires you hear in interviews</span></div>
      <div class="step" style="--c:var(--sol);--cb:var(--sol-bg)"><b>Solutions</b><span>Ideas that address one target opportunity</span></div>
      <div class="step" style="--c:var(--test);--cb:var(--test-bg)"><b>Assumption tests</b><span>Quick tests of the riskiest assumptions</span></div>
    </div>
  </section>

  <h2 class="section-title">🎮 Practice with a scenario</h2>
  <div class="scen-grid">
    ${SCENARIOS.map(s=>{
      const max=buildLevels(s).reduce((a,l)=>a+levelMax(l),0);
      return `<div class="card scen">
        <div class="emoji" aria-hidden="true">${s.emoji}</div>
        <div class="tag">${s.tag}</div>
        <h3>${s.name}</h3>
        <p>${s.blurb}</p>
        ${best[s.id]!=null?`<div class="best">Best score: ${best[s.id]} / ${max}</div>`:''}
        <div><button class="btn" data-play="${s.id}">Play ${s.name} →</button></div>
      </div>`;}).join('')}
  </div>

  <h2 class="section-title">🌱 Build it yourself</h2>
  <div class="card builder-cta">
    <div>
      <h3>Grow the tree for your own product</h3>
      <p>A guided workshop for your real work. You'll frame an outcome, set up weekly customer interviews, map opportunities, assess them before choosing solutions, and plan tests for Marty Cagan's four risks.</p>
      ${hasW?(()=>{const i=Workshop.info();return `<div class="lastsession">🕘 <b>Your last session in this browser:</b> ${i.product?esc(i.product)+' · ':''}cycle ${i.cycle} · step "${esc(i.step)}" · ${i.opps} opportunities${i.savedAt?` · saved ${esc(i.savedAt)}`:''}${i.versions?` · ${i.versions} saved versions`:''}</div>`;})():''}
    </div>
    <div class="actions" style="margin:0">
      ${hasW?`<button class="btn ghost" id="wsNew">Start over</button>`:''}
      <button class="btn" id="wsOpen">${hasW?'Continue your last session':'Start workshop'} →</button>
    </div>
  </div>
  <div class="card resume" id="resume">
    <div>
      <h3>📂 Continue a previous session</h3>
      <p>${hasW?'Want to open a different tree, or one a teammate sent you?':'Cleared your browser, switched device, or got a tree from a teammate?'} Upload your <b>backup file</b> (<code>.json</code>) to pick up exactly where you left off.</p>
      <p class="muted" style="font-size:.85rem;margin-top:6px">No backup file? In the workshop, click <b>⬇ Backup</b> at the top to download one. Your tree is stored only in this browser, so the file is how you get it back if browser data is cleared.</p>
    </div>
    <label class="dropzone" id="dropzone">
      <input type="file" accept="application/json,.json" id="resumeFile" hidden>
      <span class="dz-icon" aria-hidden="true">⬆</span>
      <b>Upload backup file</b>
      <small>or drop it here</small>
    </label>
  </div>
  <div class="card oss">
    <div>
      <h3>🛠️ Open source: make it your own</h3>
      <p>The code is free to use and adapt under the MIT license. Fork it on GitHub to add scenarios from your own industry (they're all in <code>content.js</code>), translate it, tailor the workshop to your team's process, or suggest improvements.</p>
    </div>
    <div class="actions" style="margin:0"><a class="btn ghost" href="https://github.com/MahdiyeJV/ostree" target="_blank" rel="noopener">View on GitHub ↗</a></div>
  </div>`;
  app.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>go('game', b.dataset.play));
  document.getElementById('wsOpen').onclick=()=>go('workshop');
  const n=document.getElementById('wsNew'); if(n) n.onclick=()=>{ if(confirmReset()) { Workshop.reset(); go('workshop'); } };
  const fileIn=document.getElementById('resumeFile'), dz=document.getElementById('dropzone');
  fileIn.onchange=()=>{ if(fileIn.files[0]) Workshop.loadFile(fileIn.files[0]); };
  ['dragenter','dragover'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault(); dz.classList.add('over');}));
  ['dragleave','drop'].forEach(ev=>dz.addEventListener(ev,e=>{e.preventDefault(); dz.classList.remove('over');}));
  dz.addEventListener('drop',e=>{ const f=e.dataTransfer.files[0]; if(f) Workshop.loadFile(f); });
}
function confirmReset(){ return window.confirm('Start a new workshop? This clears the tree saved in this browser. If you want to keep it, open the workshop and click ⬇ Backup first.'); }

/* ---------- game ---------- */
function startGame(id){
  const sc = SCENARIOS.find(s=>s.id===id) || SCENARIOS[0];
  const levels = buildLevels(sc);
  G = {sc, levels, level:0, score:0, perLevel:{}, solutions:[], done:false, max:levels.reduce((a,l)=>a+levelMax(l),0)};
}
function gameHud(){
  setHud(G.done?`${G.sc.name} · Complete`:`${G.sc.name} · Level ${G.level+1} of ${G.levels.length}`, `${G.score} / ${G.max} pts`, G.levels.length, G.done?G.levels.length:G.level);
}
function addScore(id, pts){ G.score+=pts; G.perLevel[id]=(G.perLevel[id]||0)+pts; gameHud(); }
function gameTreeData(){
  const sc=G.sc, L=G.done?G.levels.length:G.level;
  if(L<1) return null;
  const d={outcome:sc.treeOutcome, parking:[], parents:[]};
  if(L===2) d.parking=sc.parking;
  if(L>=3) d.parents=sc.parents.map(p=>({text:p.text, kids:sc.structure.filter(c=>c.a===p.id).map(k=>{
    const isT = L>=4 && k.short===sc.targetShort;
    return {text:k.short, target:isT, sols: (isT&&L>=5) ? G.solutions.map(s=>({text:s, tests: s===sc.testedShort ? (L>=9?[sc.testShort]: L>=7?['Leap of faith: '+sc.leapShort]:[]) : []})) : []};
  })}));
  return d;
}
function renderGame(){
  gameHud();
  window.scrollTo({top:0,behavior:'smooth'});
  if(G.done) return finishGame();
  const lv = G.levels[G.level];
  app.innerHTML = `<div class="grid"><section class="card" id="play"></section>${treePanel(gameTreeData())}</div>`;
  const play = document.getElementById('play');
  play.innerHTML = `<div class="eyebrow">${lv.eyebrow}</div><h2>${lv.title}</h2>
    ${G.level===0?`<div class="scenario">${G.sc.intro} Build an Opportunity Solution Tree, one layer at a time.</div>`:''}
    <p class="lead">${lv.lead}</p><div id="body"></div>
    <div class="habit">💡 ${lv.habit}</div>`;
  const body = play.querySelector('#body');
  ({choice:playChoice, sort:playSort, multi:playMulti})[lv.type](lv, body);
  requestAnimationFrame(fitTree);
}
function nextBtn(container){
  const last = G.level===G.levels.length-1;
  const a = $(`<div class="actions"><button class="btn">${last?'See your tree 🌳':'Next level →'}</button></div>`);
  a.querySelector('button').onclick=()=>{ if(last) G.done=true; else G.level++; renderGame(); };
  container.appendChild(a);
  a.querySelector('button').focus({preventScroll:true});
}
function fb(kind, title, text){ return `<div class="feedback show ${kind}" role="status"><b>${title}</b>${text}</div>`; }

function playChoice(lv, body){
  let attempts=0, finished=false;
  body.innerHTML = `<div class="q">${lv.q}</div><div class="opts"></div><div class="fbx"></div>`;
  const opts = body.querySelector('.opts'), fbx = body.querySelector('.fbx');
  lv.options.forEach(o=>{
    const bars = o.bars ? `<div class="bars">${Object.entries(o.bars).map(([k,v])=>`<span>${k}</span><div class="bar"><i style="width:${v}%"></i></div>`).join('')}</div>` : '';
    const b = $(`<button class="opt"><span>${o.text}</span>${o.meta?`<span class="meta">${o.meta}</span>`:''}${bars}</button>`);
    b.onclick=()=>{
      if(finished || b.disabled) return;
      attempts++;
      if(o.v==='correct'){
        const pts = attempts===1? lv.points : attempts===2? Math.round(lv.points/2) : 0;
        addScore(lv.id, pts); finished=true;
        b.classList.add('correct');
        opts.querySelectorAll('.opt').forEach(x=>x.disabled=true);
        fbx.innerHTML = fb('good', pts? `Spot on! +${pts}`:'Got there!', o.why);
        nextBtn(body);
      } else {
        b.classList.add(o.v==='partial'?'partial':'wrong'); b.disabled=true;
        fbx.innerHTML = fb(o.v==='partial'?'partial':'bad', o.v==='partial'?'Close, but not the best choice.':'Not quite.', o.why + ' <i>Try again.</i>');
      }
    };
    opts.appendChild(b);
  });
}
function playSort(lv, body){
  let i=0, wrong=false;
  const cards=lv.cards;
  function show(){
    if(i>=cards.length){
      body.innerHTML = fb('good', `Level complete: ${G.perLevel[lv.id]||0} / ${levelMax(lv)} pts`, lv.done||'');
      nextBtn(body); return;
    }
    wrong=false;
    const c=cards[i];
    body.innerHTML = `<div class="counter">Card ${i+1} of ${cards.length}</div><div class="sortcard">${c.text}</div><div class="buckets"></div><div class="fbx"></div>`;
    const bk=body.querySelector('.buckets'), fbx=body.querySelector('.fbx');
    lv.buckets.forEach(bu=>{
      const b=$(`<button class="bucket">${bu.label}${bu.hint?`<small>${bu.hint}</small>`:''}</button>`);
      b.onclick=()=>{
        if(b.disabled) return;
        if(bu.id===c.a){
          b.classList.add('correct');
          bk.querySelectorAll('.bucket').forEach(x=>x.disabled=true);
          if(!wrong) addScore(lv.id, lv.pointsEach);
          fbx.innerHTML = fb('good', wrong?'That\'s it.':`Correct! +${lv.pointsEach}`, c.why);
          const a=$(`<div class="actions"><button class="btn">${i===cards.length-1?'Finish level':'Next card →'}</button></div>`);
          a.querySelector('button').onclick=()=>{i++;show();};
          fbx.appendChild(a); a.querySelector('button').focus({preventScroll:true});
        } else {
          wrong=true; b.classList.add('wrong'); b.disabled=true;
          fbx.innerHTML = fb('bad','Not quite.','Think about whose point of view it\'s from, and what it\'s really describing. Try another option.');
        }
      };
      bk.appendChild(b);
    });
  }
  show();
}
function playMulti(lv, body){
  const sel=new Set();
  body.innerHTML = `<div class="q">Selected: <span id="cnt">0</span> / ${lv.pick}</div><div class="opts"></div><div class="fbx"></div><div class="actions"><button class="btn" id="submit" disabled>Lock in my three</button></div>`;
  const opts=body.querySelector('.opts'), cnt=body.querySelector('#cnt'), submit=body.querySelector('#submit'), fbx=body.querySelector('.fbx');
  const btns=lv.options.map((o,idx)=>{
    const b=$(`<button class="opt" aria-pressed="false"><span>${o.text}</span></button>`);
    b.onclick=()=>{
      if(b.disabled) return;
      if(sel.has(idx)){sel.delete(idx);b.classList.remove('sel');b.setAttribute('aria-pressed','false');}
      else if(sel.size<lv.pick){sel.add(idx);b.classList.add('sel');b.setAttribute('aria-pressed','true');}
      cnt.textContent=sel.size; submit.disabled=sel.size!==lv.pick;
    };
    opts.appendChild(b); return b;
  });
  submit.onclick=()=>{
    let good=0;
    btns.forEach((b,idx)=>{
      const o=lv.options[idx]; b.disabled=true;
      if(sel.has(idx)){ b.classList.remove('sel'); b.classList.add(o.ok?'correct':'wrong'); if(o.ok) good++; }
      else if(o.ok) b.classList.add('partial');
      b.insertAdjacentHTML('beforeend', `<span class="meta">${o.ok?'✓ ':'✗ '}${o.why}</span>`);
    });
    addScore(lv.id, good*lv.pointsEach);
    const tested=G.sc.testedShort;
    let sols=lv.options.filter((o,idx)=>sel.has(idx)&&o.ok).map(o=>o.short);
    if(!sols.includes(tested)) sols=[tested,...sols];
    for(const p of lv.options.filter(o=>o.ok).map(o=>o.short)){ if(sols.length>=3) break; if(!sols.includes(p)) sols.push(p); }
    G.solutions=sols.slice(0,3);
    submit.parentElement.remove();
    fbx.innerHTML = fb(good===lv.pick?'good':good>0?'partial':'bad', `${good} of ${lv.pick} address the target · +${good*lv.pointsEach}`,
      good===lv.pick ? 'Every pick connects to your target opportunity. That\'s the tree keeping you honest.' :
      `Ideas outlined in amber also fit the target. Your trio filled the remaining slots with them, including the ${G.sc.testedLong}, which you'll test next.`);
    nextBtn(body);
  };
}
function finishGame(){
  const pct=G.score/G.max;
  const best=store.get('ost-best')||{}; if(best[G.sc.id]==null || G.score>best[G.sc.id]){best[G.sc.id]=G.score; store.set('ost-best',best);}
  const rank = pct>=.9?'🌳 Mighty Oak: you think like a continuous discovery coach.':pct>=.75?'🌲 Sturdy Pine: strong discovery habits.':pct>=.5?'🌿 Growing Sapling: the fundamentals are taking root.':'🌱 Seedling: replay to grow deeper roots.';
  const others=SCENARIOS.filter(s=>s.id!==G.sc.id);
  app.innerHTML = `<div class="grid"><section class="card hero" style="padding:26px 20px">
      <div class="eyebrow">${G.sc.name} · Tree complete</div>
      <div class="score-big">${G.score}<span style="font-size:1.2rem;color:var(--muted)"> / ${G.max}</span></div>
      <div class="rank">${rank}</div>
      <div class="recap">${G.levels.map(l=>`<div><span>${l.title}</span><b>${G.perLevel[l.id]||0}/${levelMax(l)}</b></div>`).join('')}</div>
      <p style="margin-top:16px">An OST is never "done". Keep interviewing every week, and keep re-shaping the tree as you learn.</p>
      <div class="actions" style="justify-content:center">
        <button class="btn ghost" id="again">Replay</button>
        ${others.map(s=>`<button class="btn ghost" data-play="${s.id}">Try ${s.name}</button>`).join('')}
        <button class="btn" id="toWs">Build my own tree →</button>
      </div>
    </section>${treePanel(gameTreeData())}</div>`;
  document.getElementById('again').onclick=()=>go('game', G.sc.id);
  app.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>go('game', b.dataset.play));
  document.getElementById('toWs').onclick=()=>go('workshop');
  requestAnimationFrame(fitTree);
}
