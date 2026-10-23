/* =========================================================
   Grow the Tree: "Build it yourself" workshop
   A guided flow for building an Opportunity Solution Tree
   for your own product. Autosaves in this browser
   (localStorage), with named saved versions you can restore.
   The tree is meant to keep changing: opportunities and
   solutions can fail, and you loop back and try again.
   ========================================================= */
const Workshop = (()=>{
  const KEY='ost-workshop-v1', VKEY='ost-workshop-versions';
  const uid=()=>Math.random().toString(36).slice(2,9);
  const blank=()=>({step:0, cycle:1, product:'', customer:'', trio:'', business:'', behavior:'', metric:'', outcome:'', checks:{},
    cadence:{day:'Tuesday', time:'10:00', length:'30', recruit:'', who:''},
    moments:['','',''], opps:[], targetId:null, scores:{}, oa:{}, sols:[], asms:[], tests:{}, log:[], flash:null, savedAt:null, backupAt:null});
  /* bring older saves up to the current data model */
  function normalize(d){
    d=Object.assign(blank(), d||{});
    d.oa=d.oa||{}; d.log=d.log||[]; d.cycle=d.cycle||1;
    if(d.targetId && (d.decision || (d.assess && Object.keys(d.assess).length)) && !d.oa[d.targetId]) d.oa[d.targetId]=Object.assign({}, d.assess||{}, {decision:d.decision||''});
    delete d.assess; delete d.decision;
    d.opps.forEach(o=>{ o.status=o.status||''; });
    d.sols.forEach(s=>{ if(s.oppId==null) s.oppId=d.targetId||''; s.status=s.status||''; });
    return d;
  }
  let W = normalize(store.get(KEY));
  let showVersions=false;
  const save=()=>{ W.savedAt=new Date().toISOString(); const ok=store.set(KEY,W); markSaved(ok); return ok; };
  const getPath=(o,p)=>p.split('.').reduce((a,k)=>a==null?a:a[k],o);
  const setPath=(o,p,v)=>{const ks=p.split('.');let a=o;ks.slice(0,-1).forEach(k=>{if(a[k]==null)a[k]={};a=a[k]});a[ks[ks.length-1]]=v;};
  const riskLabel=id=>(RISKS.find(r=>r.id===id)||{}).label||'';
  const target=()=>W.opps.find(o=>o.id===W.targetId && o.status!=='failed');
  const oaOf=id=>W.oa[id]||{};
  const decision=()=>W.targetId?(oaOf(W.targetId).decision||''):'';
  const liveOpps=()=>W.opps.filter(o=>o.text.trim()&&o.status!=='failed');
  const failedOpps=()=>W.opps.filter(o=>o.text.trim()&&o.status==='failed');
  const targetSols=()=>W.sols.filter(s=>s.oppId===W.targetId && s.text.trim());
  const liveSols=()=>targetSols().filter(s=>s.status!=='failed');
  const liveAsms=()=>W.asms.filter(a=>a.text.trim()&&liveSols().some(s=>s.id===a.solId));
  const sc=id=>{const s=W.scores[id]||{};return {size:+s.size||3, market:+s.market||3, company:+s.company||3, customer:+s.customer||3};};
  const total=id=>{const s=sc(id);return s.size+s.market+s.company+s.customer;};
  const riskScore=a=>(+a.imp||2)*(4-(+a.ev||1));
  const IMP={3:'High',2:'Medium',1:'Low'}, EV={1:'None',2:'Some',3:'Strong'};
  const RES={pass:'✅ Passed',fail:'❌ Failed',mixed:'➖ Inconclusive'};
  const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday'];
  const S={opps:4, assess:5, oa:6, sols:7, risks:8, tests:9, summary:10, interviews:2};
  const fmtDate=iso=>{try{return new Date(iso).toLocaleString([], {dateStyle:'medium', timeStyle:'short'})}catch(e){return iso}};
  const logIt=(kind,text)=>W.log.unshift({t:new Date().toISOString(), kind, cycle:W.cycle, text});

  /* ---------- small builders ---------- */
  function F(label, key, small, o={}){
    const v=esc(getPath(W,key)||'');
    const input = o.multi ? `<textarea data-bind="${key}" placeholder="${esc(o.ph||'')}">${v}</textarea>` : `<input type="text" data-bind="${key}" value="${v}" placeholder="${esc(o.ph||'')}">`;
    return `<label class="field"><span>${o.num?`<i class="qnum">${o.num}</i>`:''}${label}</span>${small?`<small>${small}</small>`:''}${input}${o.lint?`<div data-lint="${o.lint}"></div>`:''}</label>`;
  }
  function CK(key, text){ return `<label><input type="checkbox" data-bind="checks.${key}" ${W.checks[key]?'checked':''}> <span>${text}</span></label>`; }
  function guard(cond, msg, toStep, btn){ return cond ? '' : `<div class="callout stop"><b>Not yet</b>${msg}<div class="actions" style="justify-content:flex-start;margin-top:8px"><button class="btn small" data-act="goto" data-to="${toStep}">${btn}</button></div></div>`; }
  function opt(v, label, cur){ return `<option value="${esc(v)}" ${String(v)===String(cur)?'selected':''}>${esc(label)}</option>`; }
  const btnTo=(step,label,ghost)=>`<button class="btn small${ghost?' ghost':''}" data-act="goto" data-to="${step}">${label}</button>`;
  const behaviorText=()=>W.behavior.trim()||'[the behavior from your outcome]';

  /* ---------- steps ---------- */
  const STEPS=[
    {id:'context', label:'Context', done:()=>W.product.trim()&&W.customer.trim(), render:()=>`
      <div class="eyebrow">Step 1 · Context</div><h2>Start with your context</h2>
      <p class="lead">Do this with your <b>product trio</b> (product manager, designer and tech lead) if you can. Discovery works best when the people who decide what to build do it together.</p>
      ${F('What product or area does your team own?','product','For example "the checkout flow of our grocery app" or "onboarding for new admins".')}
      ${F('Who are the customers you serve?','customer','Be specific: "first-time home buyers in their 30s", not "everyone".')}
      ${F('Who\'s in your trio?','trio','Names and roles. If a role is missing, who could fill in?')}`},

    {id:'outcome', label:'Outcome', done:()=>W.outcome.trim(), render:()=>`
      <div class="eyebrow">Step 2 · The root</div><h2>Find your outcome</h2>
      <p class="lead">The outcome sits at the root of your tree. Work through these questions to turn what you've been asked to do into a <b>product outcome</b>: a change in customer behavior your team can move directly.</p>
      ${F('What has leadership asked your team to achieve?','business','This is often a business outcome, like revenue, retention or growth. Write it down the way you heard it.',{num:1,multi:true})}
      ${F('What do customers do in your product that drives that result?','behavior','Describe a behavior, for example "publish next week\'s schedule" or "practice on 4+ days a week". If customers did more of it, would the business result follow?',{num:2,ph:'e.g. complete a weekly grocery order'})}
      ${F('How would you measure that behavior?','metric','Choose a number you can track every week or two, and note today\'s value if you know it.',{num:3,ph:'e.g. % of active customers who order weekly (today: 22%)'})}
      ${F('Draft your product outcome','outcome','Template: Increase [metric] from [today] to [target] by [date].',{num:4,multi:true,lint:'outcome',ph:'e.g. Increase weekly ordering customers from 22% to 30% by the end of Q2'})}
      <div class="q">Check your outcome</div>
      <div class="checklist">
        ${CK('o1','It describes a change in customer behavior, not a feature we\'ll ship')}
        ${CK('o2','Our team can influence it directly, without waiting on other teams')}
        ${CK('o3','We can measure it today, or soon')}
        ${CK('o4','If it moves, the business result is likely to follow')}
        ${CK('o5','We\'ve agreed on it with leadership. Outcomes are negotiated, not just handed down.')}
      </div>
      <div class="callout remind"><b>Too big?</b>If your outcome feels out of reach, it's probably still a business outcome. Keep asking "what customer behavior drives this?" until you reach something your trio can move within a quarter.</div>`},

    {id:'interviews', label:'Interviews', done:()=>W.checks.i1||W.cadence.recruit.trim(), render:()=>`
      <div class="eyebrow">Step 3 · Continuous discovery</div><h2>Set up weekly customer interviews</h2>
      <div class="callout remind"><b>Discovery is a habit, not a phase.</b>Talk to customers every week, not just at the start of a project. Your outcome tells you who to talk to and what to listen for.</div>
      <div class="row">
        <label class="field"><span>Day</span><select data-bind="cadence.day">${DAYS.map(d=>opt(d,d,W.cadence.day)).join('')}</select></label>
        <label class="field"><span>Time</span><input type="time" data-bind="cadence.time" value="${esc(W.cadence.time)}"></label>
        <label class="field"><span>Length</span><select data-bind="cadence.length">${['30','45','60'].map(m=>opt(m,m+' min',W.cadence.length)).join('')}</select></label>
      </div>
      ${F('How will you recruit, every week?','cadence.recruit','Automate it so it happens without anyone having to think about it: an in-app prompt, a handoff from support or sales, or a list of customers who agreed to talk.',{multi:true})}
      ${F('Who joins each interview?','cadence.who','Ideally the whole trio. Take turns asking questions and taking notes.')}
      <div class="q">Your interview opener</div>
      <div class="opener" data-live="opener">"Tell me about the last time you ${esc(behaviorText())}."</div>
      <ul class="tips">
        <li>Follow up with: "What happened next?", "What was hard about that?", "What did you do about it?"</li>
        <li>Ask for <b>specific stories</b>, not opinions or predictions about the future.</li>
        <li>Don't pitch your ideas. Listen for needs, pain points and desires.</li>
        <li>Fill in an <b>interview snapshot</b> right after each interview: a memorable quote, quick facts, the opportunities you heard, and a sketch of their story.</li>
      </ul>
      <div class="checklist">
        ${CK('i1','We\'ve booked our first interview')}
        ${CK('i2','Recruiting runs automatically, or someone owns it')}
        ${CK('i3','We have an interview snapshot template ready')}
      </div>
      <div class="actions" style="justify-content:flex-start"><button class="btn ghost" data-act="ics">📅 Download weekly calendar invite</button></div>`},

    {id:'map', label:'Experience map', done:()=>W.moments.filter(m=>m.trim()).length>=2, render:()=>`
      <div class="eyebrow">Step 4 · Structure</div><h2>Map the customer's experience</h2>
      <p class="lead">Opportunities are easier to organize when you know the customer's journey. Walk through how a customer would <b>${esc(behaviorText())}</b> from start to finish, and name the key moments. These become the top-level branches of your opportunity space.</p>
      <div class="items">${W.moments.map((m,i)=>`<div class="item opp"><div class="item-head"><input type="text" data-bind="moments.${i}" value="${esc(m)}" placeholder="Moment ${i+1}, e.g. ${['Deciding what to cook','Getting the ingredients','Cooking the meal','Sharing the result'][i]||'…'}"><button class="x" data-act="delMoment" data-i="${i}" aria-label="Remove moment">✕</button></div></div>`).join('')}</div>
      ${W.moments.length<7?`<div class="actions" style="justify-content:flex-start;margin-top:-6px"><button class="btn ghost small" data-act="addMoment">+ Add a moment</button></div>`:''}
      <div class="callout"><b>Example</b>Forkful's map: Deciding what to cook → Getting the ingredients → Cooking the meal. Draw it from real interview stories, not just from how your product works. You can come back and change it as you learn.</div>`},

    {id:'opps', label:'Opportunities', done:()=>liveOpps().length>=3, render:()=>{
      const ms=W.moments.map((m,i)=>({i,m:m.trim()})).filter(x=>x.m);
      const mSel=(cur,attr)=>`<select ${attr}>${opt('','Which moment?',cur)}${ms.map(x=>opt(x.i,x.m,cur)).join('')}</select>`;
      const live=W.opps.filter(o=>o.status!=='failed'), failed=W.opps.filter(o=>o.status==='failed');
      return `
      <div class="eyebrow">Step 5 · Opportunities${W.cycle>1?` · Cycle ${W.cycle}`:''}</div><h2>Capture opportunities</h2>
      <div class="callout remind"><b>Pull these from your interview snapshots.</b>Opportunities should come from what customers actually told you, not from what you assume. Haven't interviewed anyone this week? <button class="linkbtn" data-act="goto" data-to="${S.interviews}">Check your interview plan</button>.</div>
      <p class="lead">An opportunity is a customer <b>need, pain point or desire</b>, written from their point of view. Solutions and company goals don't belong here yet.</p>
      <div class="addbox">
        <textarea id="newOpp" placeholder='"I never know which shift I&#39;m working until the night before."'></textarea>
        <div id="newOppLint"></div>
        <div class="row">${mSel('', 'id="newOppMoment"')}<button class="btn" data-act="addOpp">Add opportunity</button></div>
      </div>
      <div class="items">${live.map(o=>`<div class="item opp">
        <div class="item-head"><textarea data-list="opps" data-id="${o.id}" data-prop="text">${esc(o.text)}</textarea><button class="x" data-act="delOpp" data-id="${o.id}" aria-label="Delete">✕</button></div>
        <div data-lint-opp="${o.id}"></div>
        <div class="row" style="margin-top:6px">${mSel(o.moment, `data-list="opps" data-id="${o.id}" data-prop="moment" data-rerender`)}
          <div class="chips" style="margin:0;align-items:center">${o.id===W.targetId?'<span class="chip on">🎯 Current target</span>':''}<button class="btn ghost small" data-act="failOpp" data-id="${o.id}">✗ Mark as failed</button></div></div>
      </div>`).join('')||'<p class="muted">No open opportunities yet. Add one above.</p>'}</div>
      <p class="muted" style="font-size:.88rem">Aim for at least three opportunities under a moment, so you have options to compare. If one is too big to act on, break it into smaller child opportunities.</p>
      ${failed.length?`<div class="q">Failed opportunities (kept for learning)</div><div class="items">${failed.map(o=>failedOppCard(o)).join('')}</div>`:''}
      ${liveOpps().length>=2?`<div class="actions" style="justify-content:flex-start">${btnTo(S.assess,'Reassess and choose a target →')}</div>`:''}`;}},

    {id:'assess', label:'Assess', done:()=>!!target(), render:()=>{
      const opps=liveOpps();
      const ranked=opps.slice().sort((a,b)=>total(b.id)-total(a.id));
      const F4=[['size','Sizing','How many customers have this, and how often?'],['market','Market','Table stakes, or a chance to stand out from competitors?'],['company','Company','Does it fit our strategy, vision and strengths?'],['customer','Customer','How much do customers care about it?']];
      const failed=failedOpps();
      return `
      <div class="eyebrow">Step 6 · Assess before you solve</div><h2>Compare your opportunities</h2>
      <div class="callout stop"><b>Don't jump to solutions yet.</b>A great idea for the wrong opportunity is still wasted effort. Assess your opportunities and compare them against each other before you pick one to work on.</div>
      ${guard(opps.length>=2,'Add at least two open opportunities so you have something to compare.',S.opps,'Add opportunities')}
      ${opps.length>=2?`
      <div class="riskgrid">${F4.map(f=>`<div class="riskcard" style="background:var(--opp-bg);border-color:var(--opp)"><b>${f[1]} factors</b>${f[2]}</div>`).join('')}</div>
      <div class="q">Ranking</div>
      <div class="items" style="gap:4px">${ranked.map((o,i)=>`<div class="muted" style="font-size:.9rem"><span class="rank-badge" style="background:var(--opp)">${i+1}</span>${esc(o.text)} · <b>${total(o.id)}/20</b>${o.id===W.targetId?' 🎯':''}</div>`).join('')}</div>
      <div class="items">${opps.map(o=>{const s=sc(o.id);return `<div class="item opp">
        <div><b>${esc(o.text)}</b></div>
        ${F4.map(f=>`<div class="score-row"><span title="${esc(f[2])}">${f[1]}</span><input type="range" min="1" max="5" value="${s[f[0]]}" data-bind="scores.${o.id}.${f[0]}" data-score="${o.id}" data-rerender aria-label="${f[1]} for ${esc(o.text)}"><output>${s[f[0]]}</output></div>`).join('')}
        <div class="total"><span>Total: <b data-total="${o.id}">${total(o.id)}</b> / 20</span>
          <label class="radio"><input type="radio" name="target" value="${o.id}" data-act="target" ${o.id===W.targetId?'checked':''}> Make this my target 🎯</label></div>
      </div>`;}).join('')}</div>
      <p class="muted" style="font-size:.88rem">Scores start a conversation; they aren't a formula. If the numbers disagree with your gut, talk about why. Work on one target opportunity at a time, and remember you can always come back and choose another.</p>`:''}
      ${failed.length?`<div class="q">Failed opportunities</div><div class="items">${failed.map(o=>failedOppCard(o)).join('')}</div>`:''}`;}},

    {id:'oa', label:'Opportunity assessment', done:()=>!!decision()&&decision()!=='nogo', render:()=>{
      const t=target();
      const Q=[
        ['Exactly what problem will this solve?','Your value proposition.'],
        ['For whom do we solve that problem?','Your target market or customer segment.'],
        ['How big is the opportunity?','Market size, or how many of your customers it affects.'],
        ['What alternatives are out there?','Competitors, workarounds, and doing nothing.'],
        ['Why are we best suited to pursue this?','Your differentiator.'],
        ['Why now?','The market window or timing.'],
        ['How will we get this to market?','Go-to-market strategy.'],
        ['How will we measure success?','Metrics, and how this moves your outcome.'],
        ['What factors are critical to success?','Must-have requirements.'],
        ['Given all of the above, what\'s the recommendation?','Go, not yet, or no-go.']
      ];
      const dec=decision();
      return `
      <div class="eyebrow">Step 7 · Opportunity assessment</div><h2>Stress-test your target</h2>
      ${guard(!!t,'Choose a target opportunity first.',S.assess,'Assess opportunities')}
      ${t?`
      <div class="callout remind"><b>🎯 Target opportunity</b>${esc(t.text)}</div>
      <p class="lead">Before generating solutions, run your target through Marty Cagan's <b>opportunity assessment</b>. If you can't answer these questions yet, that tells you what to learn in your next interviews.</p>
      ${Q.map((q,i)=>F(q[0],`oa.${t.id}.q${i+1}`,q[1],{num:i+1,multi:true})).join('')}
      <div class="q">Decision</div>
      <div class="checklist">
        ${[['go','Go: we understand this opportunity well enough to explore solutions'],['notyet','Not yet: we need more discovery first'],['nogo','No-go: this opportunity isn\'t worth pursuing right now']].map(([v,l])=>`<label><input type="radio" name="decision" value="${v}" data-bind="oa.${t.id}.decision" data-rerender ${dec===v?'checked':''}> <span>${l}</span></label>`).join('')}
      </div>
      ${dec==='go'?`<div class="callout okc"><b>Good to go</b>Move on to generating solutions for this opportunity.<div class="actions" style="justify-content:flex-start;margin-top:8px">${btnTo(S.sols,'Generate solutions →')}</div></div>`:''}
      ${dec==='notyet'?`<div class="callout remind"><b>Not yet</b>Plan your next interviews around this opportunity to fill the gaps, then come back and finish the assessment.<div class="actions" style="justify-content:flex-start;margin-top:8px">${btnTo(S.interviews,'Plan interviews',true)}</div></div>`:''}
      ${dec==='nogo'?`<div class="callout stop"><b>Mark this opportunity as failed</b>That's a good result: you learned it before building anything. Write down why, so the learning stays on the tree. Then go back, add new opportunities from your latest interviews, and choose a new target.
        <div style="margin-top:10px">${F('Why is it a no-go? What did you learn?',`oa.${t.id}.why`,'',{multi:true})}</div>
        <div class="actions" style="justify-content:flex-start;margin-top:0"><button class="btn small" data-act="failTarget">✗ Mark as failed and revisit opportunities</button></div></div>`:''}`:''}`;}},

    {id:'sols', label:'Solutions', done:()=>liveSols().length>=3, render:()=>{
      const t=target(); const live=liveSols(), all=targetSols(); const n=live.length; const dec=decision();
      const allFailed = all.length>0 && live.length===0;
      return `
      <div class="eyebrow">Step 8 · Solutions${W.cycle>1?` · Cycle ${W.cycle}`:''}</div><h2>Generate solutions</h2>
      ${guard(!!t,'Choose and assess a target opportunity before generating solutions.',S.assess,'Assess opportunities')}
      ${t?`
      ${!dec?`<div class="callout stop"><b>Assess first</b>You haven't finished the opportunity assessment for this target yet. <div class="actions" style="justify-content:flex-start;margin-top:8px">${btnTo(S.oa,'Run the opportunity assessment')}</div></div>`:''}
      ${dec==='nogo'?`<div class="callout stop"><b>Heads up</b>Your opportunity assessment said no-go. <div class="actions" style="justify-content:flex-start;margin-top:8px">${btnTo(S.oa,'Mark it as failed and pick another')}</div></div>`:''}
      ${dec==='notyet'?`<div class="callout remind"><b>Heads up</b>Your assessment said "not yet". It's fine to sketch ideas, but keep interviewing to close the gaps.</div>`:''}
      <div class="callout remind"><b>🎯 How might we help customers with…</b>"${esc(t.text)}"</div>
      ${allFailed?`<div class="callout stop"><b>Every solution so far has failed</b>That's useful learning. Generate new ideas below, or if ideas keep failing for the same reason, the problem may be the opportunity itself.
        <div class="actions" style="justify-content:flex-start;margin-top:8px"><button class="btn small ghost" data-act="failTarget">✗ Mark the opportunity as failed and revisit</button></div></div>`:''}
      <p class="lead">Generate lots of ideas, alone first and then together. Then keep at least <b>three</b> to explore, so you compare options instead of deciding "whether or not" to build a single one.</p>
      <div class="addbox"><div class="item-head"><input type="text" id="newSol" placeholder="Describe an idea in a sentence"><button class="btn" data-act="addSol">Add</button></div></div>
      <div class="items">${live.map(s=>`<div class="item sol"><div class="item-head"><input type="text" data-list="sols" data-id="${s.id}" data-prop="text" value="${esc(s.text)}"><button class="x" data-act="delSol" data-id="${s.id}" aria-label="Delete">✕</button></div>
        <div class="chips">${s.status==='validated'?'<span class="chip pass">✓ Validated</span>':''}
          <button class="btn ghost small" data-act="failSol" data-id="${s.id}">✗ Mark as failed</button>
          <button class="btn ghost small" data-act="validSol" data-id="${s.id}">${s.status==='validated'?'Undo validated':'✓ Mark as validated'}</button></div></div>`).join('')}</div>
      <div class="lint show ${n>=3?'ok':'warn'}">${n>=3?`${n} solutions to compare and contrast. Nice.`:`${n} of 3: add ${3-n} more so you can compare and contrast.`}</div>
      ${all.filter(s=>s.status==='failed').length?`<div class="q" style="margin-top:16px">Failed solutions (kept for learning)</div><div class="items">${all.filter(s=>s.status==='failed').map(s=>`<div class="item sol failed">
        <div class="item-head"><input type="text" value="${esc(s.text)}" disabled><button class="btn ghost small" data-act="restoreSol" data-id="${s.id}">Restore</button></div>
        <label class="field" style="margin:6px 0 0"><small>What did you learn?</small><input type="text" data-list="sols" data-id="${s.id}" data-prop="failNote" value="${esc(s.failNote||'')}" placeholder="Why it failed, and what that tells you"></label></div>`).join('')}</div>`:''}`:''}`;}},

    {id:'risks', label:'Four risks', done:()=>liveAsms().length>=4, render:()=>{
      const sols=liveSols();
      const RQ={value:'Will customers buy it or choose to use it? What do they need to want or believe?',usab:'Can users figure out how to use it? Where might they get stuck?',feas:'Can our engineers build it with the time, skills and technology we have?',viab:'Does it work for the rest of the business: sales, marketing, finance, legal, support and ethics?'};
      return `
      <div class="eyebrow">Step 9 · Assumptions</div><h2>Surface the four big risks</h2>
      ${guard(sols.length>0,'Add solutions for your target opportunity first.',S.sols,'Generate solutions')}
      ${sols.length?`
      <p class="lead">For each solution, list what has to be true for it to work. Marty Cagan groups these into <b>four big risks</b>. Cover all four before anyone builds anything for real.</p>
      <div class="riskgrid">${RISKS.map(r=>`<div class="riskcard"><b>${r.label}</b>${RQ[r.id]}</div>`).join('')}</div>
      <p class="muted" style="font-size:.88rem">Tip: map each solution out step by step, then ask "what has to be true?" at every step.</p>
      <div class="addbox">
        <textarea id="newAsmText" placeholder="What has to be true? e.g. Customers will trust us with their bank details"></textarea>
        <div class="row">
          <select id="newAsmSol" aria-label="Solution">${sols.map(s=>opt(s.id,s.text,W._lastSol)).join('')}</select>
          <select id="newAsmRisk" aria-label="Risk">${RISKS.map(r=>opt(r.id,r.label+' risk','')).join('')}</select>
        </div>
        <div class="row">
          <select id="newAsmImp" aria-label="Importance">${[3,2,1].map(v=>opt(v,'Importance: '+IMP[v],3)).join('')}</select>
          <select id="newAsmEv" aria-label="Evidence">${[1,2,3].map(v=>opt(v,'Evidence: '+EV[v],1)).join('')}</select>
          <button class="btn" data-act="addAsm">Add assumption</button>
        </div>
      </div>
      ${sols.map(s=>{const list=W.asms.filter(a=>a.solId===s.id); const have=new Set(list.filter(a=>a.text.trim()).map(a=>a.risk)); const missing=RISKS.filter(r=>!have.has(r.id));
        return `<div style="margin-bottom:16px"><h4 style="font-size:1rem;margin-bottom:2px">💡 ${esc(s.text)}</h4>
        <div class="chips">${RISKS.map(r=>`<span class="chip ${have.has(r.id)?'on':'missing'}">${have.has(r.id)?'✓ ':''}${r.label}</span>`).join('')}</div>
        ${missing.length?`<div class="lint show warn">Not covered yet: ${missing.map(r=>r.label).join(', ')}.</div>`:`<div class="lint show ok">All four risks covered.</div>`}
        <div class="items" style="margin-top:8px">${list.map(a=>{const r=(W.tests[a.id]||{}).result;return `<div class="item asm">
          <div class="item-head"><input type="text" data-list="asms" data-id="${a.id}" data-prop="text" value="${esc(a.text)}"><button class="x" data-act="delAsm" data-id="${a.id}" aria-label="Delete">✕</button></div>
          ${r?`<div class="chips"><span class="chip ${r==='pass'?'pass':r==='fail'?'fail':''}">Test: ${RES[r]}</span></div>`:''}
          <div class="row" style="margin-top:6px">
            <select data-list="asms" data-id="${a.id}" data-prop="risk" data-rerender aria-label="Risk">${RISKS.map(r=>opt(r.id,r.label,a.risk)).join('')}</select>
            <select data-list="asms" data-id="${a.id}" data-prop="imp" aria-label="Importance">${[3,2,1].map(v=>opt(v,'Importance: '+IMP[v],a.imp)).join('')}</select>
            <select data-list="asms" data-id="${a.id}" data-prop="ev" aria-label="Evidence">${[1,2,3].map(v=>opt(v,'Evidence: '+EV[v],a.ev)).join('')}</select>
          </div></div>`;}).join('')}</div></div>`;}).join('')}`:''}`;}},

    {id:'tests', label:'Tests', done:()=>Object.values(W.tests).some(t=>t&&(t.method||'').trim()&&(t.success||'').trim()), render:()=>{
      const asms=liveAsms().sort((a,b)=>riskScore(b)-riskScore(a));
      const HOW={value:'Try a fake-door test, a concierge test, a one-question survey about past behavior, or look at data on what customers already do.',usab:'Try a clickable prototype with 5 target customers. Give them a task and watch where they struggle.',feas:'Ask an engineer to run a short spike or build a feasibility prototype.',viab:'Walk the stakeholders who own this risk (legal, finance, sales, support…) through a prototype.'};
      const solName=id=>(W.sols.find(s=>s.id===id)||{}).text||'';
      const top=asms.slice(0,3), rest=asms.slice(3);
      return `
      <div class="eyebrow">Step 10 · Testing</div><h2>Test your riskiest assumptions</h2>
      ${guard(asms.length>0,'List some assumptions for your solutions first.',S.risks,'Surface risks')}
      ${asms.length?`
      <p class="lead">Here is your assumption map, ranked by <b>importance × lack of evidence</b>. Plan tests for the riskiest ones first, run them, then record what happened. Each result changes the tree.</p>
      ${top.map((a,i)=>{const t=W.tests[a.id]||{};return `<div class="item asm" style="margin-bottom:14px">
        <div style="margin-bottom:8px"><span class="rank-badge">${i+1}</span><b>${esc(a.text)}</b>
          <div class="chips"><span class="chip on">${riskLabel(a.risk)}</span><span class="chip">Importance: ${IMP[a.imp]}</span><span class="chip">Evidence: ${EV[a.ev]}</span><span class="chip">💡 ${esc(solName(a.solId))}</span></div></div>
        <div class="callout risk" style="margin-bottom:10px"><b>Test ideas for ${riskLabel(a.risk).toLowerCase()} risk</b>${HOW[a.risk]}</div>
        ${F('What will you do?','tests.'+a.id+'.method','Keep it small and fast.',{multi:true,lint:'test-'+a.id})}
        <div class="row">
          ${F('With whom, and how many?','tests.'+a.id+'.who','')}
          ${F('By when?','tests.'+a.id+'.by','',{ph:'e.g. next Friday'})}
        </div>
        ${F('What result counts as success?','tests.'+a.id+'.success','Decide this <b>before</b> you run the test, so you can\'t move the goalposts.',{ph:'e.g. at least 8 of 20 people show up',lint:'succ-'+a.id})}
        <div class="q" style="margin:4px 0 6px">Result</div>
        <div class="seg">${[['','Not run yet'],['pass','✅ Passed'],['fail','❌ Failed'],['mixed','➖ Inconclusive']].map(([v,l])=>`<label><input type="radio" name="res-${a.id}" value="${v}" data-bind="tests.${a.id}.result" data-rerender ${(t.result||'')===v?'checked':''}> ${l}</label>`).join('')}</div>
        ${t.result?F('What did you learn?','tests.'+a.id+'.learned','',{multi:true,ph:'What happened, and what does it mean for the idea?'}):''}
        ${t.result==='fail'?`<div class="callout stop"><b>The assumption didn't hold</b>Pick your next move: drop this solution and work on the others (or generate new ones), change the idea and test again, or, if it shows the opportunity itself is wrong, revisit the opportunity.
          <div class="actions" style="justify-content:flex-start;margin-top:8px">
            <button class="btn small" data-act="failSol" data-id="${a.solId}" data-asm="${a.id}">✗ Mark "${esc(solName(a.solId)).slice(0,40)}" as failed</button>
            <button class="btn small ghost" data-act="failTarget" data-asm="${a.id}">Revisit the opportunity</button>
          </div></div>`:''}
        ${t.result==='pass'?`<div class="callout okc"><b>It held up</b>${+a.ev===3?'Recorded as strong evidence. The next riskiest assumption is now at the top.':'Record it as strong evidence so the next riskiest assumption moves to the top.'}
          ${+a.ev!==3?`<div class="actions" style="justify-content:flex-start;margin-top:8px"><button class="btn small" data-act="strongEv" data-id="${a.id}">Record strong evidence</button></div>`:''}</div>`:''}
        ${t.result==='mixed'?`<div class="callout remind"><b>Inconclusive</b>That usually means the test was too big or the success criteria were vague. Tighten it and run it again.</div>`:''}
      </div>`;}).join('')}
      ${rest.length?`<div class="q">Lower-risk assumptions (test later)</div><div class="items" style="gap:4px">${rest.map((a,i)=>{const r=(W.tests[a.id]||{}).result;return `<div class="muted" style="font-size:.9rem"><span class="rank-badge" style="opacity:.6">${i+4}</span>${esc(a.text)} · ${riskLabel(a.risk)}${r?` · ${RES[r]}`:''}</div>`;}).join('')}</div>`:''}
      <div class="actions" style="justify-content:flex-start">${btnTo(S.sols,'← Back to solutions',true)}${btnTo(S.summary,'Wrap up this cycle →')}</div>`:''}`;}},

    {id:'summary', label:'Your tree', done:()=>false, render:()=>{
      const t=target(); const nTests=Object.values(W.tests).filter(x=>x&&(x.method||'').trim()).length;
      const failedS=W.sols.filter(s=>s.status==='failed').length;
      return `
      <div class="eyebrow">Step 11 · Keep it growing · Cycle ${W.cycle}</div><h2>Your Opportunity Solution Tree</h2>
      <div class="recap" style="margin:0 0 16px;max-width:none">
        <div><span>Outcome</span><b style="text-align:right">${esc(W.outcome)||'—'}</b></div>
        <div><span>Open opportunities</span><b>${liveOpps().length}${failedOpps().length?` <span class="muted">(+${failedOpps().length} failed)</span>`:''}</b></div>
        <div><span>Current target</span><b style="text-align:right">${t?esc(t.text):'—'}</b></div>
        <div><span>Solutions for target</span><b>${liveSols().length}${failedS?` <span class="muted">(${failedS} failed overall)</span>`:''}</b></div>
        <div><span>Assumptions</span><b>${W.asms.filter(a=>a.text.trim()).length}</b></div>
        <div><span>Tests planned</span><b>${nTests}</b></div>
      </div>
      <h3 style="font-size:1.15rem;margin-bottom:6px">🔁 Start the next discovery cycle</h3>
      <p class="muted" style="margin:0 0 8px">The tree is never finished. Each week, take what you learned from interviews and tests back into the tree, then go round again:</p>
      <div class="loop">
        ${btnTo(S.interviews,'1. Interview',true)}<span class="arrow">→</span>${btnTo(S.opps,'2. Add / revisit opportunities',true)}<span class="arrow">→</span>${btnTo(S.assess,'3. Reassess',true)}<span class="arrow">→</span>${btnTo(S.sols,'4. Solutions',true)}<span class="arrow">→</span>${btnTo(S.tests,'5. Test',true)}
      </div>
      <div class="actions" style="justify-content:flex-start;margin-top:0"><button class="btn" data-act="newCycle">Save and start cycle ${W.cycle+1} →</button></div>
      <div class="callout remind" style="margin-top:16px"><b>📅 Your next customer interview</b>Every ${esc(W.cadence.day)} at ${esc(W.cadence.time)}.</div>
      ${W.log.length?`<div class="q">Learning log</div><div class="log">${W.log.slice(0,30).map(l=>`<div class="${l.kind}"><small class="muted">${fmtDate(l.t)} · cycle ${l.cycle}</small><br>${esc(l.text)}</div>`).join('')}</div>`:''}
      <div class="q">Export</div>
      <div class="actions" style="justify-content:flex-start;margin-top:0">
        <button class="btn" data-act="md">⬇ Download as Markdown</button>
        <button class="btn ghost" data-act="json">Download a backup file</button>
        <label class="btn ghost" style="cursor:pointer">Load a backup file<input type="file" accept="application/json,.json" data-act="import" hidden></label>
        <button class="btn ghost" data-act="print">Print</button>
        <button class="btn ghost" data-act="ics">📅 Interview invite</button>
      </div>
      <p class="muted" style="font-size:.85rem;margin-top:14px">Your work autosaves in this browser, and you can save named versions with the 💾 button at the top. Download a backup file to move it to another device or share it with your trio. <button class="linkbtn" data-act="reset">Start over</button></p>`;}}
  ];

  function failedOppCard(o){
    return `<div class="item opp failed">
      <div class="item-head"><input type="text" value="${esc(o.text)}" disabled><button class="btn ghost small" data-act="restoreOpp" data-id="${o.id}">Restore</button></div>
      <label class="field" style="margin:6px 0 0"><small>Why it failed / what you learned</small><input type="text" data-list="opps" data-id="${o.id}" data-prop="failNote" value="${esc(o.failNote||'')}" placeholder="What did you learn?"></label>
    </div>`;
  }

  /* ---------- tree ---------- */
  function treeData(){
    const out=W.outcome.trim();
    const opps=W.opps.filter(o=>o.text.trim());
    if(!out && !opps.length) return null;
    const short=s=>{s=String(s||'').trim(); return esc(s.length>70?s.slice(0,67)+'…':s);};
    const moments=W.moments.map((m,i)=>({i,text:m.trim()})).filter(m=>m.text);
    const testNode=a=>{const t=W.tests[a.id]; const r=t.result; return {text:(r==='pass'?'✅ ':r==='fail'?'❌ ':r==='mixed'?'➖ ':'Test: ')+short(t.method), cls:r==='fail'?'failed':r==='pass'?'passed':''};};
    const kid=o=>{const isT=o.id===W.targetId && o.status!=='failed';
      return {text:short(o.text), target:isT, cls:o.status==='failed'?'failed':'',
        sols:W.sols.filter(s=>s.oppId===o.id&&s.text.trim()).map(s=>({text:short(s.text), cls:s.status==='failed'?'failed':s.status==='validated'?'passed':'',
          tests:W.asms.filter(a=>a.solId===s.id&&W.tests[a.id]&&(W.tests[a.id].method||'').trim()).map(testNode)}))};};
    return {
      outcome: out?short(out):'<i>Your outcome</i>',
      parents: moments.map(m=>({text:short(m.text), kids:opps.filter(o=>String(o.moment)===String(m.i)).map(kid)})),
      parking: opps.filter(o=>!moments.some(m=>String(m.i)===String(o.moment))).map(o=>(o.id===W.targetId?'🎯 ':'')+(o.status==='failed'?'✗ ':'')+short(o.text)),
      parkingLabel:'Not yet placed under a moment'
    };
  }
  const EMPTY='Your tree will grow here as you work through the steps.';
  const updateTree=()=>refreshTreePanel(treeData(),EMPTY);

  /* ---------- lints ---------- */
  function lintHTML(m){ return (m||[]).map(([k,t])=>`<div class="lint show ${k}">${t}</div>`).join(''); }
  function lintOutcome(t){
    if(!t.trim()) return null; const m=[];
    if(/\b(launch|ship|release|build|deliver|implement|roll ?out|redesign|create|add)\w*/i.test(t)) m.push(['warn','This sounds like an <b>output</b> (something you ship). Rephrase it as the change in customer behavior you want to see.']);
    if(/\b(revenue|arr|mrr|profit|sales|market share|valuation|bookings)\b/i.test(t)) m.push(['warn','This looks like a <b>business outcome</b>. Which customer behavior drives it? Your trio can move that more directly.']);
    if(!/\d/.test(t)) m.push(['warn','Add a number and a time frame so you can tell whether you\'re making progress, for example "from 22% to 30% by the end of Q2".']);
    if(!m.length) m.push(['ok','This reads like a product outcome. Check it against the list below.']);
    return m;
  }
  function lintOpp(t){
    if(!t.trim()) return null; const m=[];
    if(/\b(we need|we want|our (revenue|users|customers|business)|increase|decrease|reduce churn|conversion|retention|engagement|upsell|revenue)\b/i.test(t)) m.push(['warn','This sounds like a <b>company need</b>. Reframe it from the customer\'s point of view: what do <i>they</i> need, want or struggle with?']);
    else if(/\b(add|build|create|feature|button|integrat\w*|dashboard|notification|app should|should have|a way to|automat\w*)\b/i.test(t)) m.push(['warn','This might be a <b>solution in disguise</b>. Ask "why would they want that?" The answer is the opportunity.']);
    else if(!/^\s*["“']?\s*(i|i'm|i’m|i've|my|me|when|we|it's|there's)\b/i.test(t)) m.push(['warn','Tip: write it in the customer\'s voice ("I…", "When I…") to keep it grounded in their experience.']);
    return m;
  }
  function lintAll(){
    const ws=document.getElementById('ws'); if(!ws) return;
    const o=ws.querySelector('[data-lint="outcome"]'); if(o) o.innerHTML=lintHTML(lintOutcome(W.outcome));
    ws.querySelectorAll('[data-lint-opp]').forEach(el=>{const x=W.opps.find(p=>p.id===el.dataset.lintOpp); el.innerHTML=lintHTML(x?lintOpp(x.text):null);});
    const n=ws.querySelector('#newOpp'), nl=ws.querySelector('#newOppLint'); if(n&&nl) nl.innerHTML=lintHTML(lintOpp(n.value));
    ws.querySelectorAll('[data-lint^="test-"]').forEach(el=>{const id=el.dataset.lint.slice(5); const t=(W.tests[id]||{}).method||'';
      el.innerHTML = /\bwould you\b|\bwill you\b|\bdo you think\b/i.test(t) ? lintHTML([['warn','People are bad at predicting what they\'ll do. Ask about past behavior, or watch what they actually do.']]) : '';});
    ws.querySelectorAll('[data-lint^="succ-"]').forEach(el=>{const id=el.dataset.lint.slice(5); const t=W.tests[id]||{};
      el.innerHTML = (t.method||'').trim() && !(t.success||'').trim() ? lintHTML([['warn','Set your success criteria before you run the test.']]) : '';});
    const op=ws.querySelector('[data-live="opener"]'); if(op) op.textContent=`"Tell me about the last time you ${behaviorText()}."`;
  }

  /* ---------- saved versions ---------- */
  const versions=()=>store.get(VKEY)||[];
  const snapshot=()=>{const d=JSON.parse(JSON.stringify(W)); delete d.flash; return d;};
  function saveVersion(name){
    const list=versions();
    const v={id:uid(), name:name||`Cycle ${W.cycle} · ${STEPS[W.step].label}`, t:new Date().toISOString(), data:snapshot()};
    list.unshift(v); if(list.length>40) list.length=40;
    if(!store.set(VKEY,list)){ toast('Couldn\'t save: this browser\'s storage is full. Download a backup file instead.'); return null; }
    return v;
  }
  function versionsPanel(){
    const list=versions();
    return `<div class="versions">
      <div class="total" style="margin:0 0 6px"><b style="font-size:1rem">🕘 Saved versions</b><button class="x" data-act="toggleVersions" aria-label="Close">✕</button></div>
      ${list.length?list.map(v=>{const d=v.data||{};const no=(d.opps||[]).filter(o=>o.text&&o.text.trim()).length, ns=(d.sols||[]).filter(s=>s.text&&s.text.trim()).length;
        return `<div class="ver"><div class="vmeta"><input type="text" value="${esc(v.name)}" data-ver="${v.id}" aria-label="Version name"><small>${fmtDate(v.t)} · ${no} opportunities · ${ns} solutions</small></div>
          <button class="btn ghost small" data-act="restoreVer" data-id="${v.id}">Restore</button>
          <button class="btn ghost small" data-act="dlVer" data-id="${v.id}">Download</button>
          <button class="x" data-act="delVer" data-id="${v.id}" aria-label="Delete version">✕</button></div>`;}).join('')
        :'<p class="muted" style="margin:0;font-size:.9rem">No saved versions yet. Click 💾 Save version to keep a snapshot of your tree you can come back to.</p>'}
      <p class="muted" style="font-size:.8rem;margin:8px 0 0">Versions are stored in this browser. Restoring a version saves your current tree as a version first, so nothing is lost.</p>
    </div>`;
  }
  function hasContent(d){ d=d||W; return !!((d.outcome||'').trim() || (d.opps||[]).some(o=>(o.text||'').trim())); }
  function needsBackup(){
    if(!hasContent()) return false;
    if(!W.backupAt) return true;
    return (new Date(W.savedAt||0) - new Date(W.backupAt)) > 24*3600*1000;
  }
  function downloadBackup(){
    W.backupAt=new Date().toISOString(); save();
    const name=`grow-the-tree-${(W.product||'workshop').replace(/[^\w-]+/g,'-').toLowerCase().slice(0,40)}-${W.backupAt.slice(0,10)}.json`;
    download(name, JSON.stringify(snapshot(),null,2), 'application/json');
    toast('⬇ Backup downloaded. Upload it from the home page to continue later.');
  }
  function markSaved(ok){
    const el=document.getElementById('savedState'); if(!el) return;
    el.textContent = ok===false ? '⚠ Couldn\'t autosave' : `✓ Autosaved ${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`;
  }
  function toast(msg){
    document.querySelectorAll('.toast').forEach(t=>t.remove());
    const t=document.createElement('div'); t.className='toast'; t.setAttribute('role','status'); t.textContent=msg;
    document.body.appendChild(t); setTimeout(()=>t.remove(),2800);
  }

  /* ---------- state changes ---------- */
  function failTarget(note){
    const t=target(); if(!t) return;
    t.status='failed'; t.failNote=note||oaOf(t.id).why||t.failNote||'';
    logIt('fail',`Opportunity failed: "${t.text}"${t.failNote?` (${t.failNote})`:''}`);
    W.targetId=null;
    W.flash={step:S.opps, text:`<b>"${esc(t.text)}" is marked as failed and kept on the tree for learning.</b>Now revisit the opportunity space: add new opportunities from your latest interviews, then reassess and pick a new target. After that, generate new solutions and repeat.`};
    save(); goStep(S.opps);
  }
  function failSol(id, asmId){
    const s=W.sols.find(x=>x.id===id); if(!s) return;
    const learned=asmId?((W.tests[asmId]||{}).learned||''):'';
    const asm=asmId?W.asms.find(a=>a.id===asmId):null;
    s.status='failed'; s.failNote=learned || (asm?`Test failed: ${asm.text}`:s.failNote||'');
    logIt('fail',`Solution failed: "${s.text}"${s.failNote?` (${s.failNote})`:''}`);
    W.flash={step:S.sols, text:`<b>"${esc(s.text)}" is marked as failed.</b>Keep comparing the remaining solutions, or generate new ones for the same opportunity. If ideas keep failing for the same reason, revisit the opportunity itself.`};
    save(); goStep(S.sols);
  }

  /* ---------- render ---------- */
  function render(keep){
    const st=STEPS[W.step];
    setHud(`Workshop · Step ${W.step+1} of ${STEPS.length}`, (W.product.trim()?('🌱 '+W.product.trim()).slice(0,34)+' · ':'')+`Cycle ${W.cycle}`, STEPS.length, W.step);
    const y=window.scrollY;
    const next=STEPS[W.step+1];
    const flash = W.flash && W.flash.step===W.step ? `<div class="callout remind flash"><button class="x" data-act="dismissFlash" aria-label="Dismiss">✕</button>${W.flash.text}</div>` : '';
    app.innerHTML=`<div class="grid"><section class="card" id="ws">
      <div class="wsbar">
        <span class="saved" id="savedState">${W.savedAt?`✓ Autosaved ${new Date(W.savedAt).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}`:'Autosaves as you type'}</span>
        <button class="btn small" data-act="saveVersion" title="Save a named snapshot (Ctrl/⌘+S)">💾 Save version</button>
        <button class="btn ghost small" data-act="toggleVersions">🕘 Versions (${versions().length})</button>
        <button class="btn ghost small" data-act="json" title="Download a backup file you can upload later to continue">⬇ Backup</button>
      </div>
      ${needsBackup()?`<div class="lint show warn backup-nudge">⚠ <b>${W.backupAt?'Your last backup is out of date.':'Not backed up yet.'}</b> Your tree lives only in this browser. Download a backup file so you can continue later from the home page, even if your browser data is cleared. <button class="linkbtn" data-act="json">Download backup now</button></div>`:''}
      ${showVersions?versionsPanel():''}
      <nav class="stepnav" aria-label="Workshop steps">${STEPS.map((s,i)=>`<button data-step="${i}" class="${i===W.step?'on':''} ${s.done()?'done':''}">${i+1}. ${s.label}</button>`).join('')}</nav>
      ${flash}
      ${st.render()}
      <div class="actions">
        ${W.step>0?'<button class="btn ghost" data-nav="-1">← Back</button>':'<button class="btn ghost" data-act="home">← Home</button>'}
        ${next?`<button class="btn" data-nav="1">Next: ${next.label} →</button>`:''}
      </div>
    </section>${treePanel(treeData(),EMPTY,'Your tree','noanim ws')}</div>`;
    lintAll(); requestAnimationFrame(fitTree);
    const on=app.querySelector('.stepnav .on'); if(on) on.scrollIntoView({block:'nearest',inline:'center'});
    if(keep) window.scrollTo(0,y); else window.scrollTo({top:0,behavior:'smooth'});
  }
  function goStep(n){
    const to=Math.max(0,Math.min(STEPS.length-1,n));
    if(W.flash && W.flash.step!==to) W.flash=null;
    W.step=to; save(); render();
  }

  /* ---------- events (delegated) ---------- */
  function onInput(e){
    if(VIEW!=='workshop') return;
    const el=e.target;
    if(el.id==='newOpp'){ lintAll(); return; }
    if(el.dataset.ver){ const list=versions(); const v=list.find(x=>x.id===el.dataset.ver); if(v){v.name=el.value; store.set(VKEY,list);} return; }
    if(el.dataset.bind){
      let v = el.type==='checkbox' ? el.checked : el.value;
      if(el.type==='radio' && !el.checked) return;
      const prev=getPath(W, el.dataset.bind);
      setPath(W, el.dataset.bind, v);
      if(el.type==='range'){ el.nextElementSibling.textContent=v; const t=app.querySelector(`[data-total="${el.dataset.score}"]`); if(t) t.textContent=total(el.dataset.score); }
      if(e.type==='change' && /^tests\..+\.result$/.test(el.dataset.bind) && v && v!==prev){
        const a=W.asms.find(x=>x.id===el.dataset.bind.split('.')[1]);
        if(a) logIt(v==='pass'?'pass':v==='fail'?'fail':'info', `Test ${v==='pass'?'passed':v==='fail'?'failed':'was inconclusive'}: "${a.text}"`);
      }
      if(e.type==='change' && /^oa\..+\.decision$/.test(el.dataset.bind) && v && v!==prev){
        const o=W.opps.find(x=>x.id===el.dataset.bind.split('.')[1]);
        if(o) logIt(v==='go'?'pass':v==='nogo'?'fail':'info', `Opportunity assessment for "${o.text}": ${{go:'Go',notyet:'Not yet',nogo:'No-go'}[v]}`);
      }
    } else if(el.dataset.list){
      const it=W[el.dataset.list].find(x=>x.id===el.dataset.id); if(!it) return;
      it[el.dataset.prop]=el.value;
    } else return;
    save(); lintAll(); updateTree();
    if(e.type==='change' && el.hasAttribute('data-rerender')) render(true);
  }
  app.addEventListener('input', e=>{ if(e.target.type==='radio') return; onInput(e); });
  app.addEventListener('change', e=>{
    if(VIEW!=='workshop') return;
    const el=e.target;
    if(el.dataset.act==='target'){ W.targetId=el.value; logIt('info',`New target opportunity: "${(W.opps.find(o=>o.id===el.value)||{}).text||''}"`); save(); render(true); return; }
    if(el.dataset.act==='import'){ importJSON(el.files[0]); return; }
    if(el.type==='checkbox'||el.type==='radio'||el.tagName==='SELECT'||el.type==='range') onInput(e);
  });
  app.addEventListener('click', e=>{
    if(VIEW!=='workshop') return;
    const b=e.target.closest('button'); if(!b) return;
    if(b.dataset.step!=null) return goStep(+b.dataset.step);
    if(b.dataset.nav) return goStep(W.step + +b.dataset.nav);
    const a=b.dataset.act; if(!a) return;
    const val=id=>{const x=document.getElementById(id); return x?x.value:'';};
    const find=(list,id)=>W[list].find(x=>x.id===id);
    switch(a){
      case 'home': go('home'); break;
      case 'goto': goStep(+b.dataset.to); break;
      case 'dismissFlash': W.flash=null; save(); render(true); break;
      case 'saveVersion': { const v=saveVersion(); if(v){ showVersions=true; toast(`💾 Saved "${v.name}"`); render(true); } break; }
      case 'toggleVersions': showVersions=!showVersions; render(true); break;
      case 'restoreVer': { const v=versions().find(x=>x.id===b.dataset.id); if(!v) break;
        if(!window.confirm(`Restore "${v.name}"? Your current tree will be saved as a version first.`)) break;
        saveVersion(`Before restoring "${v.name}"`); W=normalize(JSON.parse(JSON.stringify(v.data))); save(); toast(`Restored "${v.name}"`); render(); break; }
      case 'dlVer': { const v=versions().find(x=>x.id===b.dataset.id); if(v) download(`ost-${v.name.replace(/[^\w-]+/g,'-').toLowerCase()}.json`, JSON.stringify(v.data,null,2), 'application/json'); break; }
      case 'delVer': { if(!window.confirm('Delete this saved version?')) break; store.set(VKEY, versions().filter(x=>x.id!==b.dataset.id)); render(true); break; }
      case 'addMoment': W.moments.push(''); save(); render(true); break;
      case 'delMoment': { const i=+b.dataset.i; W.moments.splice(i,1);
        W.opps.forEach(o=>{ if(o.moment==='' || o.moment==null) return; const m=+o.moment; if(m===i) o.moment=''; else if(m>i) o.moment=String(m-1); });
        save(); render(true); break; }
      case 'addOpp': { const t=val('newOpp').trim(); if(!t){document.getElementById('newOpp').focus();break;}
        W.opps.push({id:uid(), text:t, moment:val('newOppMoment'), status:''}); if(W.cycle>1) logIt('info',`New opportunity: "${t}"`); save(); render(true); document.getElementById('newOpp').focus({preventScroll:true}); break; }
      case 'delOpp': if(!window.confirm('Delete this opportunity? To keep it on the tree for learning, mark it as failed instead.')) break;
        W.opps=W.opps.filter(o=>o.id!==b.dataset.id); if(W.targetId===b.dataset.id) W.targetId=null; save(); render(true); break;
      case 'failOpp': { const o=find('opps',b.dataset.id); if(!o) break; if(o.id===W.targetId){ failTarget(); break; }
        o.status='failed'; logIt('fail',`Opportunity failed: "${o.text}"`); save(); render(true); break; }
      case 'restoreOpp': { const o=find('opps',b.dataset.id); if(!o) break; o.status=''; logIt('info',`Opportunity restored: "${o.text}"`); save(); render(true); break; }
      case 'failTarget': failTarget(b.dataset.asm?((W.tests[b.dataset.asm]||{}).learned||'Failed during assumption testing'):''); break;
      case 'addSol': { const t=val('newSol').trim(); if(!t){document.getElementById('newSol').focus();break;}
        W.sols.push({id:uid(), text:t, oppId:W.targetId, status:''}); if(W.cycle>1||W.sols.some(s=>s.status==='failed')) logIt('info',`New solution: "${t}"`); save(); render(true); document.getElementById('newSol').focus({preventScroll:true}); break; }
      case 'delSol': if(!window.confirm('Delete this solution and its assumptions? To keep it for learning, mark it as failed instead.')) break;
        W.asms.filter(x=>x.solId===b.dataset.id).forEach(x=>delete W.tests[x.id]);
        W.sols=W.sols.filter(s=>s.id!==b.dataset.id); W.asms=W.asms.filter(x=>x.solId!==b.dataset.id); save(); render(true); break;
      case 'failSol': failSol(b.dataset.id, b.dataset.asm); break;
      case 'restoreSol': { const s=find('sols',b.dataset.id); if(!s) break; s.status=''; logIt('info',`Solution restored: "${s.text}"`); save(); render(true); break; }
      case 'validSol': { const s=find('sols',b.dataset.id); if(!s) break; s.status = s.status==='validated'?'':'validated'; if(s.status) logIt('pass',`Solution validated: "${s.text}"`); save(); render(true); break; }
      case 'addAsm': { const t=val('newAsmText').trim(); if(!t){document.getElementById('newAsmText').focus();break;}
        const solId=val('newAsmSol'); W._lastSol=solId;
        W.asms.push({id:uid(), solId, risk:val('newAsmRisk'), text:t, imp:val('newAsmImp'), ev:val('newAsmEv')}); save(); render(true);
        document.getElementById('newAsmText').focus({preventScroll:true}); break; }
      case 'delAsm': W.asms=W.asms.filter(x=>x.id!==b.dataset.id); delete W.tests[b.dataset.id]; save(); render(true); break;
      case 'strongEv': { const x=find('asms',b.dataset.id); if(!x) break; x.ev='3'; logIt('pass',`Strong evidence recorded: "${x.text}"`); save(); render(true); break; }
      case 'newCycle': { saveVersion(`End of cycle ${W.cycle}`); W.cycle++; logIt('info',`Started cycle ${W.cycle}`);
        W.flash={step:S.opps, text:`<b>Cycle ${W.cycle} has started.</b>Your tree from the previous cycle is saved as a version. Add what you learned from this week's interviews and tests: new opportunities, re-shaped branches, failed ideas. Then reassess, generate solutions and test again.`};
        toast(`💾 Saved "End of cycle ${W.cycle-1}"`); goStep(S.opps); break; }
      case 'ics': downloadICS(); break;
      case 'md': download(`opportunity-solution-tree.md`, toMarkdown(), 'text/markdown'); break;
      case 'json': downloadBackup(); render(true); break;
      case 'print': window.print(); break;
      case 'reset': if(confirmReset()){ reset(); render(); } break;
    }
  });
  app.addEventListener('keydown', e=>{
    if(VIEW!=='workshop' || e.key!=='Enter') return;
    const map={newSol:'addSol'}; const act=map[e.target.id];
    if(act){ e.preventDefault(); app.querySelector(`[data-act="${act}"]`).click(); }
    if(e.target.id==='newOpp' && !e.shiftKey){ e.preventDefault(); app.querySelector('[data-act="addOpp"]').click(); }
  });
  document.addEventListener('keydown', e=>{
    if(VIEW==='workshop' && (e.metaKey||e.ctrlKey) && e.key.toLowerCase()==='s'){ e.preventDefault(); app.querySelector('[data-act="saveVersion"]')?.click(); }
  });

  /* ---------- files ---------- */
  function download(name, text, type){
    const blob=new Blob([text],{type}); const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function importJSON(file){
    if(!file) return;
    const r=new FileReader();
    r.onload=()=>{
      let d=null;
      try{ d=JSON.parse(r.result); if(d && d.data && Array.isArray(d.data.opps)) d=d.data; }catch(e){ d=null; }
      if(!d || typeof d!=='object' || !Array.isArray(d.opps)){ alert('That file doesn\'t look like a Grow the Tree backup. Look for the .json file you downloaded with "⬇ Backup".'); return; }
      if(hasContent()) saveVersion('Before loading a backup file');
      W=normalize(d); W.backupAt=W.backupAt||new Date().toISOString(); save();
      VIEW='workshop'; showVersions=false;
      toast(`📂 Welcome back${W.product?' to "'+W.product+'"':''}. Picking up at step ${W.step+1}: ${STEPS[W.step].label}`);
      render();
    };
    r.readAsText(file);
  }
  function downloadICS(){
    const idx={Monday:1,Tuesday:2,Wednesday:3,Thursday:4,Friday:5}[W.cadence.day]||2;
    const [hh,mm]=(W.cadence.time||'10:00').split(':').map(Number);
    const d=new Date(); d.setHours(hh,mm,0,0);
    let add=(idx-d.getDay()+7)%7; d.setDate(d.getDate()+add); if(d<new Date()) d.setDate(d.getDate()+7);
    const end=new Date(d.getTime()+(+W.cadence.length||30)*60000);
    const p=n=>String(n).padStart(2,'0');
    const loc=x=>`${x.getFullYear()}${p(x.getMonth()+1)}${p(x.getDate())}T${p(x.getHours())}${p(x.getMinutes())}00`;
    const utc=new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d+/,'');
    const escI=s=>String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
    const desc=`Weekly customer interview (continuous discovery).\nOpener: "Tell me about the last time you ${behaviorText()}."\nFollow-ups: What happened next? What was hard about that? What did you do about it?\nAfter: fill in an interview snapshot and add opportunities to the tree.${W.cadence.who?`\nAttendees: ${W.cadence.who}`:''}`;
    const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Grow the Tree//EN','BEGIN:VEVENT',`UID:${uid()}-${Date.now()}@growthetree`,`DTSTAMP:${utc}`,`DTSTART:${loc(d)}`,`DTEND:${loc(end)}`,'RRULE:FREQ=WEEKLY',
      `SUMMARY:${escI('Customer interview'+(W.product?' · '+W.product:''))}`,`DESCRIPTION:${escI(desc)}`,'END:VEVENT','END:VCALENDAR'].join('\r\n');
    download('weekly-customer-interview.ics', ics, 'text/calendar');
  }
  function toMarkdown(){
    const L=[]; const st=s=>s==='failed'?' ❌ FAILED':s==='validated'?' ✅ VALIDATED':'';
    L.push(`# Opportunity Solution Tree${W.product?' · '+W.product:''}`,'', `_Cycle ${W.cycle} · exported ${fmtDate(new Date().toISOString())}_`,'');
    if(W.customer) L.push(`**Customers:** ${W.customer}  `);
    if(W.trio) L.push(`**Trio:** ${W.trio}  `);
    L.push('', '## Outcome', `**Product outcome:** ${W.outcome||'(not set)'}  `);
    if(W.business) L.push(`**Business outcome it drives:** ${W.business}  `);
    if(W.metric) L.push(`**Metric:** ${W.metric}`);
    L.push('', '## Continuous discovery', `- Weekly interviews: ${W.cadence.day} at ${W.cadence.time} (${W.cadence.length} min)`);
    if(W.cadence.recruit) L.push(`- Recruiting: ${W.cadence.recruit}`);
    if(W.cadence.who) L.push(`- Attendees: ${W.cadence.who}`);
    L.push(`- Opener: "Tell me about the last time you ${behaviorText()}."`, '', '## Opportunities');
    const ms=W.moments.map((m,i)=>({i,m:m.trim()})).filter(x=>x.m);
    const line=o=>`- ${o.text}${o.id===W.targetId&&o.status!=='failed'?' **🎯 TARGET**':''}${st(o.status)} (score ${total(o.id)}/20)${o.failNote?` · _${o.failNote}_`:''}`;
    ms.forEach(x=>{ L.push(`### ${x.m}`); W.opps.filter(o=>o.text.trim()&&String(o.moment)===String(x.i)).forEach(o=>L.push(line(o))); L.push(''); });
    const un=W.opps.filter(o=>o.text.trim()&&!ms.some(x=>String(x.i)===String(o.moment)));
    if(un.length){ L.push('### Not yet placed'); un.forEach(o=>L.push(line(o))); L.push(''); }
    const qs=['What problem will this solve?','For whom?','How big is the opportunity?','What alternatives exist?','Why are we best suited?','Why now?','How will we get it to market?','How will we measure success?','What factors are critical to success?','Recommendation'];
    W.opps.filter(o=>o.text.trim()&&(W.oa[o.id]||W.sols.some(s=>s.oppId===o.id))).forEach(o=>{
      const a=W.oa[o.id]||{};
      L.push(`## ${o.text}${st(o.status)}`);
      if(Object.keys(a).length){
        L.push('', '**Opportunity assessment**');
        qs.forEach((q,i)=>{ const v=(a['q'+(i+1)]||'').trim(); if(v) L.push(`${i+1}. **${q}** ${v}`); });
        if(a.decision) L.push('', `**Decision:** ${{go:'Go',notyet:'Not yet',nogo:'No-go'}[a.decision]}${a.why?` · ${a.why}`:''}`);
      }
      const sols=W.sols.filter(s=>s.oppId===o.id&&s.text.trim());
      if(sols.length){ L.push('', '**Solutions**');
        sols.forEach(s=>{
          L.push(`- **${s.text}**${st(s.status)}${s.failNote?` · _${s.failNote}_`:''}`);
          W.asms.filter(x=>x.solId===s.id&&x.text.trim()).forEach(x=>{
            L.push(`  - [${riskLabel(x.risk)}] ${x.text} (importance: ${IMP[x.imp]}, evidence: ${EV[x.ev]})`);
            const t=W.tests[x.id]; if(t&&(t.method||'').trim()) L.push(`    - **Test:** ${t.method}${t.who?` · With: ${t.who}`:''}${t.by?` · By: ${t.by}`:''}${t.success?` · Success: ${t.success}`:''}${t.result?` · **Result: ${RES[t.result]}**`:''}${t.learned?` · Learned: ${t.learned}`:''}`);
          });
        });
      }
      L.push('');
    });
    if(W.log.length){ L.push('## Learning log'); W.log.forEach(l=>L.push(`- ${fmtDate(l.t)} (cycle ${l.cycle}): ${l.text}`)); L.push(''); }
    L.push('---','_Made with Grow the Tree, a learning tool inspired by Teresa Torres\'s Continuous Discovery Habits and Marty Cagan\'s Inspired._');
    return L.join('\n');
  }

  function reset(){ W=blank(); save(); showVersions=false; }
  function info(){ return {product:W.product.trim(), cycle:W.cycle, step:STEPS[W.step].label, opps:W.opps.filter(o=>o.text.trim()).length,
    savedAt:W.savedAt?fmtDate(W.savedAt):'', versions:versions().length}; }
  return { open:()=>render(), info, loadFile:importJSON, hasSaved:()=>{const s=store.get(KEY); return !!(s && (s.product||s.outcome||(s.opps&&s.opps.length)));}, reset };
})();
