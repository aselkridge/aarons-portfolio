// ══════════════════════════════════════════════════════════════════
// AARONAUTICS ORBIT — ENVIRONMENTS
// Station side-panel (sections/content) + all per-planet painted scenes (makeEnv).
// (mechanically split from the original single orbit.js; original source: lines 439-793)
// ══════════════════════════════════════════════════════════════════
'use strict';

/* ══════════ STATION PANEL + ENVIRONMENTS ══════════ */
var panel=$('panel'), envc=$('envc'), ectx=envc.getContext('2d'), envScene=null, envRAF=null;
function openStation(s){
  fillCard(s);
  if(location.hash.slice(1)!==s.id) history.replaceState(null,'','#'+s.id);
  envScene=makeEnv(s.env);
  sizeEnv();
  panel.classList.add('open');
  document.body.classList.remove('imm-station');   // always start a fresh visit un-immersed
  state='station'; $('c-stat').textContent='● SURFACE';
  $('loc').textContent=s.name.toUpperCase()+' · '+s.envlab; navHere(s.id);
  Progress.d.visited[s.id]=1; Progress.save();
  if(s.id==='ronin'){ RONIN.name='Ronin'; Progress.award('ronin_visit','THE LONE ROAD','You walked the dunes.'); }
  if(['mission','alphaforge','life','craft','notes'].every(function(k){return Progress.d.visited[k];}))
    Progress.award('tourist','SYSTEM TOURIST','Every station visited.');
  warpStreaks=[];
  (function envLoop(t){ if(!envScene) return;
    envScene.paint(ectx, envc.clientWidth, envc.clientHeight, (t||0)/1000);
    envRAF=requestAnimationFrame(envLoop); })(0);
}
function closeStation(){
  if(state!=='station') return;
  panel.classList.remove('open');
  $('cwin').classList.remove('show');
  document.body.classList.remove('imm-station');
  history.replaceState(null,'',location.pathname);
  cancelAnimationFrame(envRAF); envScene=null;
  $('loc').textContent='SYSTEM MAP'; navHere(null);
  setTimeout(function(){ system.classList.remove('warp'); state='free'; $('c-stat').textContent='● ONLINE'; },260);
}
$('close').addEventListener('click', closeStation);
/* clicking the bare scene HIDES the floating window (enjoy the view); if it's
   already hidden, a scene click lifts off. ESC / ✕ always lift off. Immersive
   mode (Stage 3) takes priority — a scene click there just restores the rail
   + window rather than lifting off, matching #imm-handle's behavior. */
function hideWindow(){ $('cwin').classList.remove('show'); }
panel.addEventListener('click', function(e){
  if(e.target===panel||e.target===envc){
    if(document.body.classList.contains('imm-station')){ document.body.classList.remove('imm-station'); return; }
    if($('cwin').classList.contains('show')) hideWindow(); else closeStation();
  }
});
$('panel-imm-btn').addEventListener('click', function(){
  document.body.classList.add('imm-station'); immFlash('Tap anywhere to bring the controls back'); Sound.blip(themeId==='sword'?520:760);
});
function sizeEnv(){ envc.width=envc.clientWidth*devicePixelRatio; envc.height=envc.clientHeight*devicePixelRatio;
  ectx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
var SECTIONS={
  mission:[
    {k:'Why “Aaronautics”', body:['Aaron + aeronautics — the aerospace degree that started it, bent into a name. The site is a machine you operate, because a list of jobs could never hold the whole picture.']},
    {k:'The road here', body:['Aerospace engineering at the University at Buffalo — orbital dynamics, propulsion, biomimicry research, design thinking. Then nearly five years as an Apple Genius, turning scary black boxes into things people could actually use. Then fintech, then ed-tech, then five years building an automation function from nothing: first hire, three promotions, frameworks that didn\'t exist until they did.','The through-line the whole way: technical depth combined with genuine care for the people on the other side of the build.']},
    {k:'Lantern', body:['Co-founded Lantern — digital citizenship and AI literacy for PreK–12. Raising kids who can use the tools and still think for themselves. Not fear, not hype — clarity.','Four branches, one standard: AI ethics, digital citizenship, building AI, building automation.']},
    {k:'Now', body:['Building automations by day, building this world by night. Raising a family in the Bronx. Writing the map for people who were never handed one.']}
  ],
  alphaforge:[
    {k:'The held send', body:['The final build: a complete outbound system for Lantern — sourcing, cleaning, scoring, segmenting, and a fully assembled 40-email send with three tiers of verified personalization. Every email ready. And I didn\'t hit send.','These were real heads of school in the city I want to build in. The first email they ever get from me matters more than a deadline. So I built the machine carefully, got the experience right on my end first, and chose restraint over speed. The whole system, ready, held on purpose.']},
    {k:'The classifier', body:['An AI enrichment claimed 30 of my 40 contacts had "public writing" I could reference. Reading closely: only 13 were real external work — the other 17 were welcome letters on the schools\' own homepages. Referencing those would have made the outreach look less researched, not more.','The fix wasn\'t more AI. One deterministic rule — is the piece on their own domain, or an outside one? — separated real thought leadership from homepage blurbs, every time, without wavering. More than half the "personalization" would have been embarrassing. A simple rule caught what the model couldn\'t.']},
    {k:'Fragile signal', body:['The thesis that kept proving itself across every build: structural data (headcount, domain, industry) tends to be reliable. Inferential data — AI judgments, private signals, confidence self-reports — tends to be sparse or silently wrong. "It ran" tells you nothing.','So: score on what a column actually returns, not what you asked it to return. Keep scoring deterministic; save AI for genuinely ambiguous judgment. And never let AI explain AI without evidence in between.']},
    {k:'Clay tables', body:['The actual working tables behind all of this — sourcing, enrichment waterfall, scoring columns, segment routing.'], soon:true}
  ],
  life:[
    {k:'Watching', body:['All-time hall of fame: Initial D (the one true GOAT), Cowboy Bebop, Samurai Champloo, Afro Samurai, Mob Psycho 100. Style, soul, and mastery over raw power — though the power helps.','Currently caught up on: Solo Leveling, JJK, Bleach TYBW, Kaiju No. 8, Demon Slayer, Hunter x Hunter, Shangri-La Frontier, Wind Breaker, Hell\'s Paradise, Wistoria, Dan Da Dan, MASHLE, and more.','Next up on the must-watch list: Naruto, Death Note, Gintama, Blue Lock, Baki Hanma, Kengan Ashura, Cyberpunk: Edgerunners, Lord of Mysteries, Project K, Noblesse, Re:Zero, Super Cube.']},
    {k:'Playing', body:['PS5 + Switch 2. Open-world RPGs (Horizon, God of War, Jedi, samurai anything), Pokémon since forever, all things Mario, Zelda, Smash, Mario Kart, Star Fox, Donkey Kong.','Racing games, Ace Combat, Astro Bot, Jak and Daxter, Ratchet & Clank, Spyro, Crash, Hogwarts Legacy, Spider-Man, Cyberpunk, GTA, Watch Dogs, Lego games, Flower — and Journey, which is a religious experience disguised as a video game.']},
    {k:'Listening', body:['Hip-hop first — then the jazz, funk, and soul it was built from. Sampling lineage is the family tree of modern music, and tracing it is half the fun. House and R&B in heavy rotation too.','Cares about the artists getting paid, not just played.']},
    {k:'Eating + grilling', body:['Bronx spots and home plates worth talking about. The grill is a laboratory.'], soon:true},
    {k:'Fatherhood + marriage', body:['Lessons from the two builds that matter most. No shortcuts, no hacks — just what\'s actually working, written down honestly.'], soon:true},
    {k:'Physics + space', body:['Still studies physics for the love of it — no credit, no curriculum. Orbital mechanics, the strangeness of the universe, and what nature already engineered before we got here (biomimicry never left).']},
    {k:'Everything else', body:['Backyard birding. Lego builds. Snowboarding. Tennis, football, basketball. A Skyline R34 rebuild that will happen someday. Multidimensional by design.']}
  ],
  craft:[
    {k:'How to write one', body:['1. Choose one image, thought, feeling, contradiction, or moment.','2. Write it as one line, and revise until it contains exactly eight syllables.','3. Remove words that explain more than they reveal.','4. Read it aloud in one breath. Check that it carries resonance beyond its literal length.','5. Pair it with a visual, a voice, a beat, or silence.','6. Tag it Oromugai when you share it.']},
    {k:'The roots', body:['Òrò — Yorùbá inspiration: word, speech, utterance. The power of the spoken.','Mugen — Japanese: infinite, limitless. Also the name of Samurai Champloo\'s wildest swordsman, for those who look closer.','Aiyé — Yorùbá inspiration: world, life, existence. The form stays grounded in the lived.','Ouroboros — the serpent eating its own tail. Cycles, eternity, renewal. Eight syllables, laid on its side: infinity.','Oromugai is a new coined word inspired by these roots — not a literal word in any of these languages. The blend is the point.']},
    {k:'Poems', type:'poem',
     intro:'Sample transmissions — the form, live. Aaron’s real Oromugais drop straight in here as they’re released.',
     poems:[
       {line:'One line holds more than it can say', n:'01'},
       {line:'The serpent eats its endless tail',   n:'02'},
       {line:'Eight slow beats of infinity',        n:'03'}
     ]}
  ],
  notes:[
    {k:'Fossil records', body:['On reactive systems: a tech stack built panic-by-panic isn\'t architecture — it\'s a fossil record of past panics, and the people using it are the ones living among the bones.','Reacting is natural. Sometimes necessary. The failure isn\'t reacting — it\'s never graduating from it. Structure and proactive design should be the rule; reaction the exception. Most systems have those two backward, and the job almost nobody holds is graduating a team from one to the other.']},
    {k:'The cleaning is the build', body:['What building a real data pipeline teaches you: the plan assumes clean inputs, and the inputs are never clean. The cleaning isn\'t a prep step before the real work — it IS the work, the layer nobody documents and nobody plans for.','And even after you build the gate, the mess finds a way back in around it. So don\'t build for the data you wish you had. Build for the data that\'s actually going to show up.']},
    {k:'The held send', body:['Ethics isn\'t a section at the end of the build doc. It\'s the moment you have 40 verified contacts, a finished email, a working system — and you don\'t hit send, because the experience on the other end isn\'t ready yet.','The ethical reflex is a muscle. You build it by using it when it costs you something.']},
    {k:'On deck', body:['Fatherhood and the build. GTM for people who were never handed the map. Video lessons.'], soon:true}
  ]
};
function fillCard(s){
  $('p-eye').textContent=s.eyebrow; $('p-eye').style.color=s.color;
  $('p-title').textContent=s.title;
  $('envlab').textContent='SURFACE · '+s.envlab;
  $('dock').style.setProperty('--pc',s.color);
  var secs=[{k:'Overview', body:s.body, tags:s.tags, soon:s.soon}].concat(SECTIONS[s.id]||[]);
  var nav=$('secs'); nav.innerHTML='';
  secs.forEach(function(sec,i){
    var a=document.createElement('a'); a.textContent=sec.k;
    a.addEventListener('click', function(){ selectSec(sec,a); Sound.blip(700); });
    nav.appendChild(a);
    if(i===0) selectSec(sec,a);
  });
}
/* ── slim-rail one-line description of the current tab ── */
function escH(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
function briefOf(sec){
  if(sec.desc) return escH(sec.desc);
  if(sec.intro) return escH(sec.intro);
  if(sec.body&&sec.body[0]){ var t=sec.body[0], m=t.match(/^[^.!?]*[.!?]/); t=m?m[0]:t;
    return escH(t.length>96?t.slice(0,94)+'…':t); }
  return '';
}
/* ── the floating content window: one poem at a time (riffle) or a prose card ── */
var winPoems=null, winIdx=0;
var PW_OURO='<svg class="pw-emblem" viewBox="0 0 120 60" fill="none" aria-hidden="true"><path d="M60 30 C60 9 90 9 90 30 C90 51 60 51 60 30 C60 9 30 9 30 30 C30 51 60 51 60 30 Z" stroke="#8fe0ff" stroke-width="2.6" vector-effect="non-scaling-stroke"/><circle cx="31" cy="24" r="3" fill="#8fe0ff"/></svg>';
function renderPoemOne(){
  var p=winPoems[winIdx], num=p.n||('#'+('0'+(winIdx+1)).slice(-2)),
      meta=escH(p.meta||'8 syllables · one breath'), line=escH(p.line||'');
  if(themeId==='roci'){
    // Expanse HUD future-tablet: a decoded transmission
    var wave='<div class="pw-wave">'+[5,10,4,13,7,9,3,11,6,8].map(function(v){return '<i style="height:'+v+'px"></i>';}).join('')+'</div>';
    var gauge='<svg class="pw-gauge" viewBox="0 0 62 62" fill="none"><circle cx="31" cy="31" r="25" stroke="rgba(116,208,255,.22)" stroke-width="1"/>'+
      '<circle cx="31" cy="31" r="25" stroke="#4fb8e8" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="80 200" transform="rotate(-90 31 31)"/>'+
      '<g class="pw-gspin"><circle cx="31" cy="31" r="18" stroke="rgba(116,208,255,.4)" stroke-width="1" stroke-dasharray="3 6"/></g><circle cx="31" cy="31" r="3.2" fill="#8fe0ff"/></svg>';
    $('p-body').className='cwin-body';
    $('p-body').innerHTML='<div class="pw-device"><div class="pw-screen">'+
      '<span class="pw-cb tl"></span><span class="pw-cb bl"></span><span class="pw-cb br"></span>'+
      '<div class="pw-sheen"></div>'+
      '<aside class="pw-instr">'+wave+gauge+'<div class="pw-ticks"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="pw-readout">CX 0.47<br>CY 1.02<br>Δ 0.08</div></aside>'+
      '<div class="pw-kick"><span class="k">◈ Transmission · Oromugai ∞ · '+escH(num)+'</span></div>'+
      '<div class="pw-line">'+line+'</div>'+
      '<div class="pw-foot"><div class="pw-emblem-wrap">'+PW_OURO+'</div><span class="pw-meta">'+meta+'<br><b>signal locked</b></span></div>'+
      '</div></div>';
  } else {
    // Bebop parchment sheet
    $('p-body').className='cwin-body sec-body';
    $('p-body').innerHTML='<figure class="poem-sheet hero">'+
      '<figcaption class="poem-eye">Oromugai ∞ · '+escH(num)+'</figcaption>'+
      '<blockquote class="poem-line">'+line+'</blockquote>'+
      '<div class="poem-foot"><img class="poem-seal" src="assets/wax_seal.png" alt="Oromugai seal — an ouroboros">'+
      '<span class="poem-meta">'+meta+'</span></div>'+
      '<img class="poem-quill" src="assets/quill.png" alt="" aria-hidden="true"></figure>';
  }
  $('cwin-dots').innerHTML=winPoems.map(function(_,i){return '<i class="'+(i===winIdx?'on':'')+'"></i>';}).join('');
  $('cwin-count').textContent=(winIdx+1)+' / '+winPoems.length;
}
function selectSec(sec,a){
  var links=$('secs').querySelectorAll('a');
  for(var i=0;i<links.length;i++) links[i].classList.toggle('on', links[i]===a);
  $('rail-desc').innerHTML='<b>'+escH(sec.k)+'</b> · '+briefOf(sec);
  if(sec.type==='poem' && sec.poems && sec.poems.length){
    winPoems=sec.poems; winIdx=0; renderPoemOne(); $('cwin-riffle').classList.remove('hidden');
  } else {
    winPoems=null; $('p-body').className='cwin-body sec-body cwin-card';
    $('p-body').innerHTML=ContentViewer.render(sec); $('cwin-riffle').classList.add('hidden');
  }
  $('cwin').classList.add('show');
}
$('cwin-close').addEventListener('click', hideWindow);
$('cwin-prev').addEventListener('click', function(){ if(!winPoems)return; winIdx=(winIdx-1+winPoems.length)%winPoems.length; renderPoemOne(); Sound.blip(620); });
$('cwin-next').addEventListener('click', function(){ if(!winPoems)return; winIdx=(winIdx+1)%winPoems.length; renderPoemOne(); Sound.blip(720); });
/* — environment painters — */
function ridge(w,h,base,jag,n){ var pts=[]; for(var i=0;i<=n;i++) pts.push({x:w*i/n, y:base+(Math.random()-0.5)*jag}); return pts; }
function drawRidge(c,pts,h,col){ c.fillStyle=col; c.beginPath(); c.moveTo(-10,h+10);
  pts.forEach(function(p){ c.lineTo(p.x,p.y); }); c.lineTo(pts[pts.length-1].x+10,h+10); c.closePath(); c.fill(); }
function makeEnv(kind){
  var W2=innerWidth,H2=innerHeight,R=Math.random,cel=(themeId==='sword');
  // ── shared helpers ──
  function sky(c,w,h,stops){
    if(cel){ for(var k=0;k<stops.length;k++){ var y0=h*stops[k][1], y1=k<stops.length-1?h*stops[k+1][1]:h;
      c.fillStyle=stops[k][0]; c.fillRect(0,y0-1,w,y1-y0+2); } }
    else { var g=c.createLinearGradient(0,0,0,h); stops.forEach(function(s){ g.addColorStop(Math.min(1,s[1]),s[0]); });
      c.fillStyle=g; c.fillRect(0,0,w,h); }
  }
  function stars(c,w,h,n,col){ for(var i=0;i<n;i++){ var z=((i*73)%100)/100;
    c.globalAlpha=0.3+z*0.6; c.fillStyle=col||'#dfe9ff'; c.fillRect((i*137.5)%w,(i*91.7)%(h*0.55),1+z,1+z); } c.globalAlpha=1; }
  function ink(c,lw){ if(cel){ c.strokeStyle='rgba(6,4,8,.92)'; c.lineWidth=lw||3; c.lineJoin='round'; c.stroke(); } }
  // caped hero, arms raised, absorbing energy
  function hero(c,x,y,s,t){
    c.save(); c.translate(x,y+Math.sin(t*0.8)*4*s);
    c.fillStyle=cel?'#0b0710':'rgba(6,5,10,.96)';
    // cape (billowing behind)
    c.beginPath(); c.moveTo(-7*s,-16*s);
    for(var k=0;k<=6;k++) c.lineTo((-7-k*3.2)*s, (-14+k*7)*s+Math.sin(t*3+k)*3*s);
    c.lineTo((10-6*3.2*0)*s,40*s);
    for(k=6;k>=0;k--) c.lineTo((7+k*2.2)*s+Math.sin(t*3+k)*3*s,(-10+k*8)*s);
    c.closePath(); c.fill();
    // body
    c.beginPath(); c.arc(0,-26*s,6*s,0,7); c.fill();                 // head
    c.beginPath(); c.moveTo(-8*s,-16*s); c.lineTo(8*s,-16*s);        // shoulders
    c.lineTo(5*s,6*s); c.lineTo(3*s,34*s); c.lineTo(-0.5*s,20*s);
    c.lineTo(-4*s,34*s); c.lineTo(-5*s,6*s); c.closePath(); c.fill(); ink(c,2.4*s);
    // arms raised outward, absorbing
    c.beginPath(); c.moveTo(-7*s,-14*s); c.lineTo(-20*s,-30*s); c.lineTo(-16*s,-32*s); c.lineTo(-4*s,-15*s); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(7*s,-14*s); c.lineTo(20*s,-30*s); c.lineTo(16*s,-32*s); c.lineTo(4*s,-15*s); c.closePath(); c.fill();
    c.restore();
  }
  // sleek sports coupe silhouette
  function car(c,x,y,s,dir){
    c.save(); c.translate(x,y); c.scale(dir*s,s);
    c.fillStyle=cel?'#0a0a0f':'#0c0d12';
    c.beginPath();
    c.moveTo(-54,2); c.lineTo(-50,-6); c.quadraticCurveTo(-40,-9,-30,-9);
    c.quadraticCurveTo(-20,-22,-4,-23); c.lineTo(20,-23);
    c.quadraticCurveTo(30,-22,34,-11); c.quadraticCurveTo(48,-10,52,-4);
    c.lineTo(54,2); c.closePath(); c.fill(); ink(c,2);
    c.fillStyle=cel?'#1a2030':'#22303f';                              // windows
    c.beginPath(); c.moveTo(-24,-10); c.quadraticCurveTo(-16,-20,-4,-21); c.lineTo(16,-21);
    c.quadraticCurveTo(24,-20,27,-11); c.closePath(); c.fill();
    c.fillStyle=cel?'#0a0a0f':'#0c0d12';                              // wheels
    c.beginPath(); c.arc(-34,3,9,0,7); c.fill(); c.beginPath(); c.arc(34,3,9,0,7); c.fill();
    c.restore();
  }
  // one tree (trunk + blobby canopy) — returns nothing, draws
  function tree(c,x,base,s,fill){
    c.fillStyle=fill;
    c.fillRect(x-1.6*s,base-14*s,3.2*s,16*s);
    c.beginPath();
    c.arc(x,base-20*s,9*s,0,7); c.arc(x-8*s,base-16*s,7*s,0,7); c.arc(x+8*s,base-16*s,7*s,0,7);
    c.arc(x-4*s,base-27*s,7*s,0,7); c.arc(x+5*s,base-26*s,6*s,0,7); c.fill();
  }
  function treeLine(c,w,base,s,fill,gap){ for(var x=-10;x<w+20;x+=gap) tree(c,x+((x*37)%13),base+((x*x)%9),s*(0.8+((x*7)%10)/22),fill); }
  // tall sailing ship silhouette
  function ship(c,x,y,s,t){
    c.save(); c.translate(x,y+Math.sin(t*0.9)*2*s); c.rotate(Math.sin(t*0.9)*0.02);
    c.fillStyle=cel?'#08111e':'#0a1420';
    c.beginPath(); c.moveTo(-30,0); c.quadraticCurveTo(-34,7,-24,9); c.lineTo(26,9);
    c.quadraticCurveTo(38,7,40,-4); c.quadraticCurveTo(30,-2,26,-1); c.lineTo(-24,-1); c.closePath(); c.fill(); ink(c,2*s/ s);
    c.beginPath(); c.arc(40,-6,3,0,7); c.fill();                       // figurehead
    c.fillRect(-11,-34,2.4,34); c.fillRect(13,-28,2.4,28);             // masts
    c.fillStyle=cel?'#0d1a2a':'#12263a';
    c.beginPath(); c.moveTo(-9.5,-33); c.quadraticCurveTo(10,-24,-9.5,-3); c.closePath(); c.fill(); ink(c,1.6);  // main sail
    c.beginPath(); c.moveTo(14.5,-27); c.quadraticCurveTo(30,-19,14.5,-2); c.closePath(); c.fill(); ink(c,1.6);
    c.fillStyle=cel?'#08111e':'#0a1420';
    c.beginPath(); c.moveTo(-11,-34); c.lineTo(-22,-31+Math.sin(t*5)*1.4); c.lineTo(-11,-29); c.closePath(); c.fill();
    c.restore();
  }
  // human silhouette; pose: 0 stand, 1 armUp(DJ), 2 mic(MC)
  function person(c,x,base,s,pose,t,mask){
    c.save(); c.translate(x,base); c.fillStyle=cel?'#070409':'rgba(5,4,8,.97)';
    var nod=Math.sin(t*4.6+x)*1.4;
    c.beginPath(); c.arc(0,(-46+nod)*s,6.4*s,0,7); c.fill();           // head
    if(mask){ c.fillStyle=cel?'#3a3f48':'#4a5058'; c.beginPath(); c.arc(1.5*s,(-45+nod)*s,4.2*s,-0.6,1.9); c.fill(); c.fillStyle=cel?'#070409':'rgba(5,4,8,.97)'; }
    c.beginPath(); c.moveTo(-8*s,(-40+nod)*s); c.lineTo(8*s,(-40+nod)*s); // torso
    c.lineTo(6*s,-8*s); c.lineTo(-6*s,-8*s); c.closePath(); c.fill();
    c.fillRect(-6*s,-8*s,4.4*s,8*s); c.fillRect(1.6*s,-8*s,4.4*s,8*s);  // legs
    // arms
    if(pose===1){ c.beginPath(); c.moveTo(6*s,(-38+nod)*s); c.lineTo(13*s,(-52+nod)*s); c.lineTo(16*s,(-50+nod)*s); c.lineTo(9*s,(-36+nod)*s); c.closePath(); c.fill(); }
    else if(pose===2){ c.beginPath(); c.moveTo(6*s,(-37)*s); c.lineTo(13*s,(-46)*s); c.lineTo(15*s,(-44)*s); c.lineTo(9*s,(-34)*s); c.closePath(); c.fill();
      c.fillStyle=cel?'#c9924a':'#8a6a3a'; c.beginPath(); c.arc(14.5*s,(-46)*s,2*s,0,7); c.fill(); }        // mic
    else { c.fillRect(-9*s,-38*s,3*s,26*s); c.fillRect(6*s,-38*s,3*s,26*s); }
    c.restore();
  }
  // detailed skyline layer
  function skyline(c,w,baseY,cfg){
    var x=cfg.x0||0, seed=cfg.seed||1;
    while(x<w+40){ var rnd=((x*seed*13)%97)/97; var bw=cfg.minW+rnd*cfg.varW, bh=cfg.minH+((x*seed)%cfg.varH);
      c.fillStyle=cfg.fill; c.fillRect(x,baseY-bh,bw,bh+40);
      if(cel){ c.strokeStyle=cfg.line||'rgba(0,0,0,.5)'; c.lineWidth=2; c.strokeRect(x,baseY-bh,bw,bh+40); }
      if(rnd>0.7){ c.fillStyle=cfg.fill; c.fillRect(x+bw*0.3,baseY-bh-8,3,8); }                 // antenna
      if(cfg.lights){ c.fillStyle=cfg.lights;
        for(var yy=baseY-bh+7;yy<baseY-8;yy+=11) for(var xx=x+4;xx<x+bw-4;xx+=8)
          if(((xx*7+yy*3)|0)%5<2){ c.globalAlpha=cfg.lit||0.7; c.fillRect(xx,yy,3,4); } c.globalAlpha=1; }
      x+=bw+cfg.gap;
    }
  }

  /* ═══ MISSION — the sun, hero absorbing solar energy ═══ */
  if(kind==='hero'){
    return { paint:function(c,w,h,t){
      sky(c,w,h,[['#1a0d04',0],['#3a1808',0.4],['#7a2f0c',0.66],['#e0842e',0.82],['#2a1206',0.96]]);
      // the sun, huge, low-center
      var sx=w*0.5, sy=h*0.66, sr=Math.min(w,h)*0.34;
      var halo=c.createRadialGradient(sx,sy,sr*0.2,sx,sy,sr*2.4);
      halo.addColorStop(0,'rgba(255,200,110,.55)'); halo.addColorStop(0.4,'rgba(255,150,60,.25)'); halo.addColorStop(1,'transparent');
      c.fillStyle=halo; c.fillRect(0,0,w,h);
      if(cel){ c.fillStyle='#ffb44a'; c.beginPath(); c.arc(sx,sy,sr,0,7); c.fill();
        c.fillStyle='#ffd98a'; c.beginPath(); c.arc(sx-sr*0.2,sy-sr*0.2,sr*0.7,0,7); c.fill();
        c.strokeStyle='rgba(90,40,10,.8)'; c.lineWidth=4; c.beginPath(); c.arc(sx,sy,sr,0,7); c.stroke(); }
      else { var sg=c.createRadialGradient(sx-sr*0.25,sy-sr*0.25,sr*0.1,sx,sy,sr);
        sg.addColorStop(0,'#fff6df'); sg.addColorStop(0.5,'#ffcf7a'); sg.addColorStop(1,'#e07a1e');
        c.fillStyle=sg; c.beginPath(); c.arc(sx,sy,sr,0,7); c.fill(); }
      // energy streams into the hero's hands
      var hx=w*0.5, hy=h*0.3;
      c.lineCap='round';
      for(var i=0;i<9;i++){ var a=t*2+i, off=(i-4)*10;
        c.globalAlpha=0.25+0.25*Math.sin(t*4+i); c.strokeStyle=i%2?'#ffd98a':'#fff'; c.lineWidth=1+ (i%3);
        c.beginPath(); c.moveTo(sx+off,sy-sr*0.5);
        c.quadraticCurveTo(hx+off*0.5,(hy+sy)/2, hx+(i<4?-16:16),hy-6); c.stroke(); }
      c.globalAlpha=1;
      // the hero
      hero(c,hx,hy,Math.min(w,h)/300,t);
      // faint distant clouds
      for(i=0;i<3;i++){ c.globalAlpha=0.08; c.fillStyle='#ffdcae';
        var off2=((t*(5+i*3))%(w+400))-200; c.beginPath(); c.ellipse(off2,h*(0.2+i*0.08),150,10,0,0,7); c.fill(); }
      c.globalAlpha=1;
    } };
  }

  /* ═══ ALPHAFORGE — neon city + coupe ═══ */
  if(kind==='city'){
    return { paint:function(c,w,h,t){
      sky(c,w,h,[['#070812',0],['#141334',0.4],['#3a1d55',0.66],['#160e22',0.8],['#050509',0.92]]);
      stars(c,w,h,40,'#c9d6ea');
      var hz=c.createLinearGradient(0,h*0.5,0,h*0.72); hz.addColorStop(0,'transparent'); hz.addColorStop(1,'rgba(150,70,200,.22)');
      c.fillStyle=hz; c.fillRect(0,h*0.5,w,h*0.22);
      skyline(c,w,h*0.72,{seed:3,minW:26,varW:34,minH:60,varH:150,gap:14,fill:cel?'#120c22':'#0e0b1e',line:'#241838'});          // far
      skyline(c,w,h*0.9,{seed:7,minW:38,varW:44,minH:120,varH:240,gap:20,fill:cel?'#070610':'#060510',line:'#1a1630',lights:'#ffdc8c',lit:0.55}); // near
      // neon signs
      var NC=['#ff2d78','#74d0ff','#9affea','#ffd36a'];
      for(var i=0;i<8;i++){ var nx=(i*191)%w, ny=h*0.5+((i*83)%Math.floor(h*0.28)); var a=Math.sin(t*3+i)>-0.3?0.9:0.2;
        c.globalAlpha=a; c.fillStyle=NC[i%4]; c.fillRect(nx,ny,18+ (i%3)*16,5);
        c.globalAlpha=a*0.3; c.fillRect(nx-3,ny-3,24+(i%3)*16,11); } c.globalAlpha=1;
      // street
      c.fillStyle='#03030a'; c.fillRect(0,h*0.9,w,h*0.1);
      // the coupe crossing
      var ct=t%10;
      if(ct<4.6){ var cx=-70+(ct/4.6)*(w+140); car(c,cx,h*0.94,Math.min(w,h)/620,1);
        c.globalAlpha=0.6; var beam=c.createLinearGradient(cx+30,h*0.93,cx+180,h*0.95);
        beam.addColorStop(0,'rgba(255,240,190,.7)'); beam.addColorStop(1,'transparent');
        c.fillStyle=beam; c.beginPath(); c.moveTo(cx+30,h*0.925); c.lineTo(cx+190,h*0.9); c.lineTo(cx+190,h*0.965); c.lineTo(cx+30,h*0.945); c.closePath(); c.fill(); c.globalAlpha=1; }
      if(!cel){ c.strokeStyle='rgba(160,200,255,.22)'; c.lineWidth=1;                                // rain
        for(i=0;i<60;i++){ var rx=(i*97+t*300)%w, ry=(i*53+t*380)%h; c.beginPath(); c.moveTo(rx,ry); c.lineTo(rx-2,ry-13); c.stroke(); } }
    } };
  }

  /* ═══ LIFE — forest + spirit & kid at bus stop ═══ */
  if(kind==='forest'){
    return { paint:function(c,w,h,t){
      sky(c,w,h,[['#06170f',0],['#0b2b18',0.5],['#0a2413',0.76],['#03110a',0.92]]);
      stars(c,w,h,22,'#dff4e8');
      c.globalAlpha=0.12+0.03*Math.sin(t*0.7); c.fillStyle='#9fd8bb'; c.fillRect(0,h*0.4,w,h*0.28); c.globalAlpha=1;   // god-ray haze
      treeLine(c,w,h*0.62,Math.min(w,h)/120,cel?'#0d2417':'#0c2416',66);          // far trees
      treeLine(c,w,h*0.78,Math.min(w,h)/95,cel?'#081a10':'#07160c',52);
      treeLine(c,w,h*0.98,Math.min(w,h)/70,cel?'#030d07':'#020a05',44);           // near trees
      // bus stop: shelter + big gentle spirit + kid
      var bx=w*0.72, by=h*0.9, br=Math.sin(t*0.8)*1.6;
      c.fillStyle=cel?'#020905':'#010704';
      c.fillRect(bx+60,by-70,5,70); c.fillRect(bx-20,by-74,90,7);                 // shelter
      c.beginPath(); c.moveTo(bx-12,by); c.quadraticCurveTo(bx-14,by-52-br,bx+16,by-54-br);
      c.quadraticCurveTo(bx+46,by-52-br,bx+44,by); c.closePath(); c.fill();       // spirit body (rounded)
      c.beginPath(); c.moveTo(bx+4,by-52-br); c.lineTo(bx+9,by-70-br); c.lineTo(bx+15,by-53-br); c.closePath(); c.fill();  // ears
      c.beginPath(); c.moveTo(bx+19,by-53-br); c.lineTo(bx+26,by-71-br); c.lineTo(bx+31,by-52-br); c.closePath(); c.fill();
      c.fillStyle=cel?'#c8ffb0':'#9fe6b4';                                        // eyes (soft glow)
      c.globalAlpha=0.6+0.3*Math.sin(t*2); c.beginPath(); c.arc(bx+9,by-34-br,2.4,0,7); c.arc(bx+23,by-34-br,2.4,0,7); c.fill(); c.globalAlpha=1;
      c.fillStyle=cel?'#020905':'#010704';                                        // the kid
      c.fillRect(bx-34,by-26,8,26); c.beginPath(); c.arc(bx-30,by-30,5.5,0,7); c.fill();
      // fireflies
      for(var i=0;i<24;i++){ var fx=(i*151+Math.sin(t+i)*30)%w, fy=h*0.5+((i*97)%Math.floor(h*0.42))+Math.cos(t*0.6+i)*12;
        c.globalAlpha=0.25+0.55*Math.max(0,Math.sin(t*1.6+i)); c.fillStyle='#c8ffb0'; c.beginPath(); c.arc(fx,fy,1.7,0,7); c.fill(); } c.globalAlpha=1;
    } };
  }

  /* ═══ CRAFT — ocean + sloop ═══ */
  if(kind==='ocean'){
    return { paint:function(c,w,h,t){
      sky(c,w,h,[['#060d1e',0],['#0b1c38',0.44],['#0a2440',0.54],['#04101f',0.9]]);
      stars(c,w,h,30,'#dfe9ff');
      c.fillStyle='#e8ecf4'; c.beginPath(); c.arc(w*0.74,h*0.24,26,0,7); c.fill();
      c.fillStyle='#c9cfdd'; c.beginPath(); c.arc(w*0.74-8,h*0.24-6,7,0,7); c.fill();                 // moon
      var horizon=h*0.52;
      // moon path on water
      var mp=c.createLinearGradient(0,horizon,0,h); mp.addColorStop(0,'rgba(232,236,244,.22)'); mp.addColorStop(1,'transparent');
      c.fillStyle=mp; c.fillRect(w*0.66,horizon,w*0.16,h-horizon);
      // water body
      var wg=c.createLinearGradient(0,horizon,0,h); wg.addColorStop(0,'#0a2a48'); wg.addColorStop(1,'#04101f');
      c.fillStyle=wg; c.fillRect(0,horizon,w,h-horizon);
      // layered waves (filled, not lines)
      for(var i=0;i<20;i++){ var y=horizon+8+i*((h-horizon)/20);
        c.fillStyle= i%2? 'rgba(20,60,100,.5)':'rgba(40,90,140,.4)';
        c.beginPath(); c.moveTo(0,y+6);
        for(var x=0;x<=w;x+=24) c.lineTo(x, y+Math.sin(x*0.02+t*(0.8+i*0.04)+i)*3);
        c.lineTo(w,y+6); c.closePath(); c.fill(); }
      // the sloop
      ship(c,w*0.5-((t*24)%(w+260))+ w*0.3, horizon-2, Math.min(w,h)/300, t);
    } };
  }

  /* ═══ NOTES — the lot: DJ, MC, crew, speakers ═══ */
  if(kind==='graffiti'){
    return { paint:function(c,w,h,t){
      sky(c,w,h,[['#1c0f2e',0],['#4a1e3c',0.5],['#8a3a2c',0.74],['#160b12',0.88],['#0a0609',0.94]]);
      stars(c,w,h,18,'#ffd9c0');
      // brick wall with graffiti
      var wy=h*0.55; c.fillStyle=cel?'#241726':'#1e1522'; c.fillRect(0,wy,w,h*0.35);
      if(cel){ c.strokeStyle='#2e2038'; c.lineWidth=1.4; for(var yy=wy;yy<wy+h*0.35;yy+=15){ c.beginPath(); c.moveTo(0,yy); c.lineTo(w,yy); c.stroke(); } }
      var TC=['#ff2d78','#74d0ff','#ffd36a','#7cff9b','#c9a8ff'];
      for(var i=0;i<7;i++){ var gx=(i*211)%w, gy=wy+18+((i*53)%Math.floor(h*0.24)); c.save(); c.translate(gx,gy);
        c.fillStyle=TC[i%5]; c.globalAlpha=0.9; c.font='italic 900 '+(26+(i%3)*10)+'px "Anton",sans-serif';
        c.fillText(['FLOW','BX','404','DUMILE','WU','ILL','ONE'][i%7],0,0);
        c.globalAlpha=1; c.restore(); }
      // ground
      var gy2=h*0.9; c.fillStyle='#0a0609'; c.fillRect(0,gy2,w,h*0.1);
      // speaker stack + beat glow
      var beat=Math.pow(Math.max(0,Math.sin(t*4.6)),3), sx=w*0.5;
      c.globalAlpha=0.22*beat; c.fillStyle='#ffd36a'; c.beginPath(); c.arc(sx,gy2-70,110+beat*36,0,7); c.fill(); c.globalAlpha=1;
      for(var k=0;k<3;k++){ var sw=64-k*10, sh=38, yy2=gy2-(k+1)*sh-k*2;
        c.fillStyle='#0c0810'; c.fillRect(sx-sw/2,yy2,sw,sh); if(cel){ c.strokeStyle='#000'; c.lineWidth=2; c.strokeRect(sx-sw/2,yy2,sw,sh); }
        c.fillStyle='#1c1420'; c.beginPath(); c.arc(sx,yy2+sh/2,(sh/2-5)*(1+beat*0.12),0,7); c.fill(); }
      // DJ (left, arm up), MC with mask (mid-left), crew (right)
      person(c,w*0.26,gy2,Math.min(w,h)/300,1,t,false);
      person(c,w*0.4,gy2,Math.min(w,h)/300,2,t,true);
      for(k=0;k<3;k++) person(c,w*0.66+k*Math.min(w,h)/9,gy2,Math.min(w,h)/300,0,t+k,false);
      // string lights
      c.strokeStyle='rgba(255,220,150,.25)'; c.lineWidth=1;
      c.beginPath(); c.moveTo(0,wy-30); c.quadraticCurveTo(w*0.5,wy+16,w,wy-36); c.stroke();
      for(var L=0;L<16;L++){ var lx=w*L/16+16, ly=wy-30+Math.sin(L/16*Math.PI)*46;
        c.globalAlpha=0.5+0.5*Math.sin(t*2+L); c.fillStyle='#ffd9a0'; c.beginPath(); c.arc(lx,ly,2,0,7); c.fill(); } c.globalAlpha=1;
    } };
  }

  /* ═══ hidden RONIN world — high desert + lone swordsman ═══ */
  return { paint:function(c,w,h,t){
    sky(c,w,h,[['#2a0e2e',0],['#7a2440',0.4],['#c65a2e',0.62],['#1c0a12',0.9]]);
    stars(c,w,h,14,'#ffd9c0');
    c.fillStyle=cel?'#ffb44a':'#ff9a3c'; c.beginPath(); c.arc(w*0.5,h*0.64,58,0,7); c.fill();
    // dunes
    c.fillStyle=cel?'#3a1712':'#2a1210'; c.beginPath(); c.moveTo(0,h);
    for(var x=0;x<=w;x+=30) c.lineTo(x,h*0.72+Math.sin(x*0.006+1)*24); c.lineTo(w,h); c.closePath(); c.fill();
    // the lone swordsman walking the ridge
    var sx=((t*10)%(w+140))-70, sy=h*0.72+Math.sin(sx*0.006+1)*24, s=Math.min(w,h)/300, step=Math.sin(t*6);
    c.save(); c.translate(sx,sy); c.fillStyle='#0d0505';
    c.beginPath(); c.arc(0,-34*s,5.5*s,0,7); c.fill();
    c.fillRect(-3.5*s,-30*s,7*s,17*s);
    c.beginPath(); c.moveTo(-2*s,-13*s); c.lineTo((-2-5*step)*s,0); c.lineTo(-5*step*s,0); c.lineTo(0,-13*s); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(2*s,-13*s); c.lineTo((2+5*step)*s,0); c.lineTo((4+5*step)*s,0); c.lineTo(4*s,-13*s); c.closePath(); c.fill();
    c.save(); c.translate(0,-28*s); c.rotate(-0.7); c.fillRect(0,-2*s,22*s,3*s); c.fillRect(18*s,-4.5*s,3*s,8*s); c.restore();   // sword
    for(var k=0;k<2;k++){ c.beginPath(); c.moveTo(-4*s,-37*s);
      c.quadraticCurveTo((-13-k*4)*s,(-38+Math.sin(t*5+k)*3)*s,(-19-k*5)*s,(-34+Math.sin(t*5+k+1)*3)*s);
      c.lineTo((-18-k*5)*s,-32*s); c.quadraticCurveTo((-11-k*4)*s,-35*s,-4*s,-34*s); c.closePath(); c.fill(); }
    c.restore();
    c.fillStyle=cel?'#1a0a08':'#140807'; c.beginPath(); c.moveTo(0,h);
    for(x=0;x<=w;x+=30) c.lineTo(x,h*0.86+Math.sin(x*0.008+3)*14); c.lineTo(w,h); c.closePath(); c.fill();
  } };
}

