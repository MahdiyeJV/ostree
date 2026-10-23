/* =========================================================
   Grow the Tree: "Build it yourself" workshop
   A guided flow for building an Opportunity Solution Tree
   for your own product. Saved in this browser (localStorage).
   ========================================================= */
const Workshop = (()=>{
  const KEY='ost-workshop-v1';
  const uid=()=>Math.random().toString(36).slice(2,9);
  const blank=()=>({step:0, product:'', customer:'', trio:'', business:'', behavior:'', metric:'', outcome:'', checks:{},
    cadence:{day:'Tuesday', time:'10:00', length:'30', recruit:'', who:''},
    moments:['','',''], opps:[], targetId:null, scores:{}, assess:{}, decision:'', sols:[], asms:[], tests:{}});
  let W = Object.assign(blank(), store.get(KEY)||{});
  const save=()=>store.set(KEY,W);
  const getPath=(o,p)=>p.split('.').reduce((a,k)=>a==null?a:a[k],o);
  const setPath=(o,p,v)=>{const ks=p.split('.');let a=o;ks.slice(0,-1).forEach(k=>{if(a[k]==null)a[k]={};a=a[k]});a[ks[ks.length-1]]=v;};
  const riskLabel=id=>(RISKS.find(r=>r.id===id)||{}).label||'';
  const target=()=>W.opps.find(o=>o.id===W.targetId);
  const sc=id=>{const s=W.scores[id]||{};return {size:+s.size||3, market:+s.market||3, company:+s.company||3, customer:+s.customer||3};};
  const total=id=>{const s=sc(id);return s.size+s.market+s.company+s.customer;};
  const riskScore=a=>(+a.imp||2)*(4-(+a.ev||1));
  const IMP={3:'High',2:'Medium',1:'Low'}, EV={1:'None',2:'Some',3:'Strong'};
  const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday'];

  /* ---------- small builders ---------- */
  function F(label, key, small, o={}){
    const v=esc(getPath(W,key)||'');
    const input = o.multi ? `<textarea data-bind="${key}" placeholder="${esc(o.ph||'')}">${v}</textarea>` : `<input type="text" data-bind="${key}" value="${v}" placeholder="${esc(o.ph||'')}">`;
    return `<label class="field"><span>${o.num?`<i class="qnum">${o.num}</i>`:''}${label}</span>${small?`<small>${small}</small>`:''}${input}${o.lint?`<div data-lint="${o.lint}"></div>`:''}</label>`;
  }
  function CK(key, text){ return `<label><input type="checkbox" data-bind="checks.${key}" ${W.checks[key]?'checked':''}> <span>${text}</span></label>`; }
  function guard(cond, msg, toStep, btn){ return cond ? '' : `<div class="callout stop"><b>Not yet</b>${msg}<div class="actions" style="justify-content:flex-start;margin-top:8px"><button class="btn small" data-act="goto" data-to="${toStep}">${btn}</button></div></div>`; }
  function opt(v, label, cur){ return `<option value="${esc(v)}" ${String(v)===String(cur)?'selected':''}>${esc(label)}</option>`; }
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
      <div class="callout"><b>Example</b>Forkful's map: Deciding what to cook → Getting the ingredients → Cooking the meal. Draw it from real interview stories, not just from how your product works.</div>`},

    {id:'opps', label:'Opportunities', done:()=>W.opps.filter(o=>o.text.trim()).length>=3, render:()=>{
      const ms=W.moments.map((m,i)=>({i,m:m.trim()})).filter(x=>x.m);
      const mSel=(cur,attr)=>`<select ${attr}>${opt('','Which moment?',cur)}${ms.map(x=>opt(x.i,x.m,cur)).join('')}</select>`;
      return `
      <div class="eyebrow">Step 5 · Opportunities</div><h2>Capture opportunities</h2>
      <div class="callout remind"><b>Pull these from your interview snapshots.</b>Opportunities should come from what customers actually told you, not from what you assume. Haven't interviewed anyone this week? <button class="linkbtn" data-act="goto" data-to="2">Check your interview plan</button>.</div>
      <p class="lead">An opportunity is a customer <b>need, pain point or desire</b>, written from their point of view. Solutions and company goals don't belong here yet.</p>
      <div class="addbox">
        <textarea id="newOpp" placeholder='"I never know which shift I&#39;m working until the night before."'></textarea>
        <div id="newOppLint"></div>
        <div class="row">${mSel('', 'id="newOppMoment"')}<button class="btn" data-act="addOpp">Add opportunity</button></div>
      </div>
      <div class="items">${W.opps.map(o=>`<div class="item opp">
        <div class="item-head"><textarea data-list="opps" data-id="${o.id}" data-prop="text">${esc(o.text)}</textarea><button class="x" data-act="delOpp" data-id="${o.id}" aria-label="Remove">✕</button></div>
        <div data-lint-opp="${o.id}"></div>
        <div style="margin-top:6px">${mSel(o.moment, `data-list="opps" data-id="${o.id}" data-prop="moment" data-rerender`)}</div>
      </div>`).join('')||'<p class="muted">No opportunities yet. Add your first one above.</p>'}</div>
      <p class="muted" style="font-size:.88rem">Aim for at least three opportunities under a moment, so you have options to compare. If one is too big to act on, break it into smaller child opportunities.</p>`;}},

    {id:'assess', label:'Assess', done:()=>!!target(), render:()=>{
      const opps=W.opps.filter(o=>o.text.trim());
      const ranked=opps.slice().sort((a,b)=>total(b.id)-total(a.id));
      const F4=[['size','Sizing','How many customers have this, and how often?'],['market','Market','Table stakes, or a chance to stand out from competitors?'],['company','Company','Does it fit our strategy, vision and strengths?'],['customer','Customer','How much do customers care about it?']];
      return `
      <div class="eyebrow">Step 6 · Assess before you solve</div><h2>Compare your opportunities</h2>
      <div class="callout stop"><b>Don't jump to solutions yet.</b>A great idea for the wrong opportunity is still wasted effort. Assess your opportunities and compare them against each other before you pick one to work on.</div>
      ${guard(opps.length>=2,'Add at least two opportunities so you have something to compare.',4,'Add opportunities')}
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
      <p class="muted" style="font-size:.88rem">Scores start a conversation; they aren't a formula. If the numbers disagree with your gut, talk about why. Work on one target opportunity at a time, and remember you can always come back and choose another.</p>`:''}`;}},

    {id:'oa', label:'Opportunity assessment', done:()=>!!W.decision, render:()=>{
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
      const fbk={go:['ok','Good to go. Move on to generating solutions.'],notyet:['warn','Not yet: plan your next interviews around this opportunity to fill the gaps, then come back.'],nogo:['warn','No-go: pick a different target in the previous step. Learning that now, before building anything, is a win.']};
      return `
      <div class="eyebrow">Step 7 · Opportunity assessment</div><h2>Stress-test your target</h2>
      ${guard(!!t,'Choose a target opportunity first.',5,'Assess opportunities')}
      ${t?`
      <div class="callout remind"><b>🎯 Target opportunity</b>${esc(t.text)}</div>
      <p class="lead">Before generating solutions, run your target through Marty Cagan's <b>opportunity assessment</b>. If you can't answer these questions yet, that tells you what to learn in your next interviews.</p>
      ${Q.map((q,i)=>F(q[0],'assess.q'+(i+1),q[1],{num:i+1,multi:true})).join('')}
      <div class="q">Decision</div>
      <div class="checklist">
        ${[['go','Go: we understand this opportunity well enough to explore solutions'],['notyet','Not yet: we need more discovery first'],['nogo','No-go: pick a different target']].map(([v,l])=>`<label><input type="radio" name="decision" value="${v}" data-bind="decision" data-rerender ${W.decision===v?'checked':''}> <span>${l}</span></label>`).join('')}
      </div>
      ${W.decision?`<div class="lint show ${fbk[W.decision][0]}">${fbk[W.decision][1]}</div>`:''}`:''}`;}},

    {id:'sols', label:'Solutions', done:()=>W.sols.filter(s=>s.text.trim()).length>=3, render:()=>{
      const t=target(); const n=W.sols.filter(s=>s.text.trim()).length;
      return `
      <div class="eyebrow">Step 8 · Solutions</div><h2>Generate solutions</h2>
      ${guard(!!t,'Choose and assess a target opportunity before generating solutions.',5,'Assess opportunities')}
      ${t?`
      ${W.decision==='nogo'?`<div class="callout stop"><b>Heads up</b>Your opportunity assessment said no-go. Consider choosing a different target first.</div>`:''}
      ${W.decision==='notyet'?`<div class="callout remind"><b>Heads up</b>Your assessment said "not yet". It's fine to sketch ideas, but keep interviewing to close the gaps.</div>`:''}
      <div class="callout remind"><b>🎯 How might we help customers with…</b>"${esc(t.text)}"</div>
      <p class="lead">Generate lots of ideas, alone first and then together. Then keep at least <b>three</b> to explore, so you compare options instead of deciding "whether or not" to build a single one.</p>
      <div class="addbox"><div class="item-head"><input type="text" id="newSol" placeholder="Describe an idea in a sentence"><button class="btn" data-act="addSol">Add</button></div></div>
      <div class="items">${W.sols.map(s=>`<div class="item sol"><div class="item-head"><input type="text" data-list="sols" data-id="${s.id}" data-prop="text" value="${esc(s.text)}"><button class="x" data-act="delSol" data-id="${s.id}" aria-label="Remove">✕</button></div></div>`).join('')}</div>
      <div class="lint show ${n>=3?'ok':'warn'}">${n>=3?`${n} solutions to compare and contrast. Nice.`:`${n} of 3: add ${3-n} more so you can compare and contrast.`}</div>`:''}`;}},

    {id:'risks', label:'Four risks', done:()=>W.asms.filter(a=>a.text.trim()).length>=4, render:()=>{
      const sols=W.sols.filter(s=>s.text.trim());
      const RQ={value:'Will customers buy it or choose to use it? What do they need to want or believe?',usab:'Can users figure out how to use it? Where might they get stuck?',feas:'Can our engineers build it with the time, skills and technology we have?',viab:'Does it work for the rest of the business: sales, marketing, finance, legal, support and ethics?'};
      return `
      <div class="eyebrow">Step 9 · Assumptions</div><h2>Surface the four big risks</h2>
      ${guard(sols.length>0,'Add solutions first.',7,'Generate solutions')}
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
        <div class="items" style="margin-top:8px">${list.map(a=>`<div class="item asm">
          <div class="item-head"><input type="text" data-list="asms" data-id="${a.id}" data-prop="text" value="${esc(a.text)}"><button class="x" data-act="delAsm" data-id="${a.id}" aria-label="Remove">✕</button></div>
          <div class="row" style="margin-top:6px">
            <select data-list="asms" data-id="${a.id}" data-prop="risk" data-rerender aria-label="Risk">${RISKS.map(r=>opt(r.id,r.label,a.risk)).join('')}</select>
            <select data-list="asms" data-id="${a.id}" data-prop="imp" aria-label="Importance">${[3,2,1].map(v=>opt(v,'Importance: '+IMP[v],a.imp)).join('')}</select>
            <select data-list="asms" data-id="${a.id}" data-prop="ev" aria-label="Evidence">${[1,2,3].map(v=>opt(v,'Evidence: '+EV[v],a.ev)).join('')}</select>
          </div></div>`).join('')}</div></div>`;}).join('')}`:''}`;}},

    {id:'tests', label:'Tests', done:()=>Object.values(W.tests).some(t=>t&&t.method&&t.method.trim()&&t.success&&t.success.trim()), render:()=>{
      const asms=W.asms.filter(a=>a.text.trim()&&W.sols.some(s=>s.id===a.solId)).sort((a,b)=>riskScore(b)-riskScore(a));
      const HOW={value:'Try a fake-door test, a concierge test, a one-question survey about past behavior, or look at data on what customers already do.',usab:'Try a clickable prototype with 5 target customers. Give them a task and watch where they struggle.',feas:'Ask an engineer to run a short spike or build a feasibility prototype.',viab:'Walk the stakeholders who own this risk (legal, finance, sales, support…) through a prototype.'};
      const solName=id=>(W.sols.find(s=>s.id===id)||{}).text||'';
      const top=asms.slice(0,3), rest=asms.slice(3);
      return `
      <div class="eyebrow">Step 10 · Testing</div><h2>Plan your assumption tests</h2>
      ${guard(asms.length>0,'List some assumptions first.',8,'Surface risks')}
      ${asms.length?`
      <p class="lead">Here is your assumption map, ranked by <b>importance × lack of evidence</b>. Plan tests for the riskiest ones first. They're your leaps of faith.</p>
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
      </div>`;}).join('')}
      ${rest.length?`<div class="q">Lower-risk assumptions (test later)</div><div class="items" style="gap:4px">${rest.map((a,i)=>`<div class="muted" style="font-size:.9rem"><span class="rank-badge" style="opacity:.6">${i+4}</span>${esc(a.text)} · ${riskLabel(a.risk)}</div>`).join('')}</div>`:''}`:''}`;}},

    {id:'summary', label:'Your tree', done:()=>false, render:()=>{
      const t=target(); const nTests=Object.values(W.tests).filter(x=>x&&x.method&&x.method.trim()).length;
      return `
      <div class="eyebrow">Step 11 · Keep it growing</div><h2>Your Opportunity Solution Tree</h2>
      <div class="recap" style="margin:0 0 16px;max-width:none">
        <div><span>Outcome</span><b style="text-align:right">${esc(W.outcome)||'—'}</b></div>
        <div><span>Opportunities</span><b>${W.opps.filter(o=>o.text.trim()).length}</b></div>
        <div><span>Target</span><b style="text-align:right">${t?esc(t.text):'—'}</b></div>
        <div><span>Solutions</span><b>${W.sols.filter(s=>s.text.trim()).length}</b></div>
        <div><span>Assumptions</span><b>${W.asms.filter(a=>a.text.trim()).length}</b></div>
        <div><span>Tests planned</span><b>${nTests}</b></div>
      </div>
      <div class="callout remind"><b>📅 Your next customer interview</b>Every ${esc(W.cadence.day)} at ${esc(W.cadence.time)}. Bring what you learn back to the tree each week: add opportunities, re-shape branches, and update your tests. The tree is never finished.</div>
      <div class="actions" style="justify-content:flex-start">
        <button class="btn" data-act="md">⬇ Download as Markdown</button>
        <button class="btn ghost" data-act="json">Save a backup file</button>
        <label class="btn ghost" style="cursor:pointer">Load a backup<input type="file" accept="application/json,.json" data-act="import" hidden></label>
        <button class="btn ghost" data-act="print">Print</button>
        <button class="btn ghost" data-act="ics">📅 Interview invite</button>
      </div>
      <p class="muted" style="font-size:.85rem;margin-top:14px">Your work is saved only in this browser. Download a backup to move it to another device or share it with your trio. <button class="linkbtn" data-act="reset">Start over</button></p>`;}}
  ];

  /* ---------- tree ---------- */
  function treeData(){
    const out=W.outcome.trim();
    const opps=W.opps.filter(o=>o.text.trim());
    if(!out && !opps.length) return null;
    const short=s=>{s=String(s||'').trim(); return esc(s.length>70?s.slice(0,67)+'…':s);};
    const moments=W.moments.map((m,i)=>({i,text:m.trim()})).filter(m=>m.text);
    const kid=o=>{const isT=o.id===W.targetId; return {text:short(o.text), target:isT,
      sols:isT?W.sols.filter(s=>s.text.trim()).map(s=>({text:short(s.text), tests:W.asms.filter(a=>a.solId===s.id&&W.tests[a.id]&&(W.tests[a.id].method||'').trim()).map(a=>'Test: '+short(W.tests[a.id].method))})):[]};};
    return {
      outcome: out?short(out):'<i>Your outcome</i>',
      parents: moments.map(m=>({text:short(m.text), kids:opps.filter(o=>String(o.moment)===String(m.i)).map(kid)})),
      parking: opps.filter(o=>!moments.some(m=>String(m.i)===String(o.moment))).map(o=>(o.id===W.targetId?'🎯 ':'')+short(o.text)),
      parkingLabel:'Not yet placed under a moment'
    };
  }
  const updateTree=()=>refreshTreePanel(treeData(),'Your tree will grow here as you work through the steps.');

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

  /* ---------- render ---------- */
  function render(keep){
    const st=STEPS[W.step];
    setHud(`Workshop · Step ${W.step+1} of ${STEPS.length}`, W.product.trim()?('🌱 '+W.product.trim()).slice(0,40):'', STEPS.length, W.step);
    const y=window.scrollY;
    const next=STEPS[W.step+1];
    app.innerHTML=`<div class="grid"><section class="card" id="ws">
      <nav class="stepnav" aria-label="Workshop steps">${STEPS.map((s,i)=>`<button data-step="${i}" class="${i===W.step?'on':''} ${s.done()?'done':''}">${i+1}. ${s.label}</button>`).join('')}</nav>
      ${st.render()}
      <div class="actions">
        ${W.step>0?'<button class="btn ghost" data-nav="-1">← Back</button>':'<button class="btn ghost" data-act="home">← Home</button>'}
        ${next?`<button class="btn" data-nav="1">Next: ${next.label} →</button>`:''}
      </div>
    </section>${treePanel(treeData(),'Your tree will grow here as you work through the steps.','Your tree','noanim')}</div>`;
    lintAll(); requestAnimationFrame(fitTree);
    const on=app.querySelector('.stepnav .on'); if(on) on.scrollIntoView({block:'nearest',inline:'center'});
    if(keep) window.scrollTo(0,y); else window.scrollTo({top:0,behavior:'smooth'});
  }
  function goStep(n){ W.step=Math.max(0,Math.min(STEPS.length-1,n)); save(); render(); }

  /* ---------- events (delegated) ---------- */
  function onInput(e){
    if(VIEW!=='workshop') return;
    const el=e.target;
    if(el.id==='newOpp'){ lintAll(); return; }
    if(el.dataset.bind){
      let v = el.type==='checkbox' ? el.checked : el.value;
      if(el.type==='radio' && !el.checked) return;
      setPath(W, el.dataset.bind, v);
      if(el.type==='range'){ el.nextElementSibling.textContent=v; const t=app.querySelector(`[data-total="${el.dataset.score}"]`); if(t) t.textContent=total(el.dataset.score); }
    } else if(el.dataset.list){
      const it=W[el.dataset.list].find(x=>x.id===el.dataset.id); if(!it) return;
      it[el.dataset.prop]=el.value;
    } else return;
    save(); lintAll(); updateTree();
    if(e.type==='change' && el.hasAttribute('data-rerender')) render(true);
  }
  app.addEventListener('input', onInput);
  app.addEventListener('change', e=>{
    if(VIEW!=='workshop') return;
    const el=e.target;
    if(el.dataset.act==='target'){ W.targetId=el.value; save(); render(true); return; }
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
    switch(a){
      case 'home': go('home'); break;
      case 'goto': goStep(+b.dataset.to); break;
      case 'addMoment': W.moments.push(''); save(); render(true); break;
      case 'delMoment': { const i=+b.dataset.i; W.moments.splice(i,1);
        W.opps.forEach(o=>{ if(o.moment==='' || o.moment==null) return; const m=+o.moment; if(m===i) o.moment=''; else if(m>i) o.moment=String(m-1); });
        save(); render(true); break; }
      case 'addOpp': { const t=val('newOpp').trim(); if(!t){document.getElementById('newOpp').focus();break;}
        W.opps.push({id:uid(), text:t, moment:val('newOppMoment')}); save(); render(true); document.getElementById('newOpp').focus({preventScroll:true}); break; }
      case 'delOpp': W.opps=W.opps.filter(o=>o.id!==b.dataset.id); if(W.targetId===b.dataset.id) W.targetId=null; save(); render(true); break;
      case 'addSol': { const t=val('newSol').trim(); if(!t){document.getElementById('newSol').focus();break;}
        W.sols.push({id:uid(), text:t}); save(); render(true); document.getElementById('newSol').focus({preventScroll:true}); break; }
      case 'delSol': W.sols=W.sols.filter(s=>s.id!==b.dataset.id); W.asms=W.asms.filter(x=>x.solId!==b.dataset.id); save(); render(true); break;
      case 'addAsm': { const t=val('newAsmText').trim(); if(!t){document.getElementById('newAsmText').focus();break;}
        const solId=val('newAsmSol'); W._lastSol=solId;
        W.asms.push({id:uid(), solId, risk:val('newAsmRisk'), text:t, imp:val('newAsmImp'), ev:val('newAsmEv')}); save(); render(true);
        document.getElementById('newAsmText').focus({preventScroll:true}); break; }
      case 'delAsm': W.asms=W.asms.filter(x=>x.id!==b.dataset.id); delete W.tests[b.dataset.id]; save(); render(true); break;
      case 'ics': downloadICS(); break;
      case 'md': download(`opportunity-solution-tree.md`, toMarkdown(), 'text/markdown'); break;
      case 'json': download(`ost-backup.json`, JSON.stringify(W,null,2), 'application/json'); break;
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

  /* ---------- files ---------- */
  function download(name, text, type){
    const blob=new Blob([text],{type}); const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function importJSON(file){
    if(!file) return;
    const r=new FileReader();
    r.onload=()=>{ try{ const d=JSON.parse(r.result); if(typeof d!=='object'||!Array.isArray(d.opps)) throw 0; W=Object.assign(blank(), d); save(); render(); }catch(e){ alert('That file doesn\'t look like a Grow the Tree backup.'); } };
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
    const L=[]; const t=target();
    L.push(`# Opportunity Solution Tree${W.product?' · '+W.product:''}`,'');
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
    const line=o=>`- ${o.text}${o.id===W.targetId?' **🎯 TARGET**':''} (score ${total(o.id)}/20)`;
    ms.forEach(x=>{ L.push(`### ${x.m}`); W.opps.filter(o=>o.text.trim()&&String(o.moment)===String(x.i)).forEach(o=>L.push(line(o))); L.push(''); });
    const un=W.opps.filter(o=>o.text.trim()&&!ms.some(x=>String(x.i)===String(o.moment)));
    if(un.length){ L.push('### Not yet placed'); un.forEach(o=>L.push(line(o))); L.push(''); }
    if(t){
      L.push(`## Opportunity assessment: ${t.text}`);
      const qs=['What problem will this solve?','For whom?','How big is the opportunity?','What alternatives exist?','Why are we best suited?','Why now?','How will we get it to market?','How will we measure success?','What factors are critical to success?','Recommendation'];
      qs.forEach((q,i)=>{ const a=(W.assess['q'+(i+1)]||'').trim(); if(a) L.push(`${i+1}. **${q}** ${a}`); });
      if(W.decision) L.push('', `**Decision:** ${{go:'Go',notyet:'Not yet',nogo:'No-go'}[W.decision]}`);
      L.push('', '## Solutions');
      W.sols.filter(s=>s.text.trim()).forEach(s=>{
        L.push(`### ${s.text}`);
        W.asms.filter(a=>a.solId===s.id&&a.text.trim()).forEach(a=>{
          L.push(`- [${riskLabel(a.risk)}] ${a.text} (importance: ${IMP[a.imp]}, evidence: ${EV[a.ev]})`);
          const x=W.tests[a.id]; if(x&&(x.method||'').trim()) L.push(`  - **Test:** ${x.method}${x.who?` · With: ${x.who}`:''}${x.by?` · By: ${x.by}`:''}${x.success?` · Success: ${x.success}`:''}`);
        });
        L.push('');
      });
    }
    L.push('---','_Made with Grow the Tree, a learning game inspired by Teresa Torres\'s Continuous Discovery Habits and Marty Cagan\'s Inspired._');
    return L.join('\n');
  }

  function reset(){ W=blank(); save(); }
  return { open:()=>render(), hasSaved:()=>{const s=store.get(KEY); return !!(s && (s.product||s.outcome||(s.opps&&s.opps.length)));}, reset };
})();
