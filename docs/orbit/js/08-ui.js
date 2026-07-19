// ══════════════════════════════════════════════════════════════════
// AARONAUTICS ORBIT — UI
// Theme/ship apply (incl. hangar-bay swap trigger) + minimize/chip panel behavior.
// (mechanically split from the original single orbit.js; original source: lines 794-835, 1033-1052)
// ══════════════════════════════════════════════════════════════════
'use strict';

/* ══════════ THEME APPLY ══════════ */
var root=document.documentElement;
function applyTheme(id){
  themeId=id; var t=T();
  document.body.className='t-'+ (id==='sword'?'sword':'roci');
  $('ship-sword').style.display = id==='sword'?'':'none';
  $('ship-roci').style.display  = id==='roci' ?'':'none';
  $('b-sword').classList.toggle('on', id==='sword');
  $('b-roci').classList.toggle('on', id==='roci');
  root.style.setProperty('--accent',t.accent); root.style.setProperty('--accent2',t.accent2);
  root.style.setProperty('--bg1',t.bg[0]); root.style.setProperty('--bg2',t.bg[1]); root.style.setProperty('--bg3',t.bg[2]);
  root.style.setProperty('--grain-o',String(t.grain)); root.style.setProperty('--scan-o',String(t.scan));
  paintPlanets(); initStars(); setWeapon(t.wpn);
  $('tgtbox').classList.remove('on'); $('titlecard').classList.remove('on');
  Music.onTheme();
  Sound.blip(id==='roci'?520:880);
}
function shipSVG(id){ var g=$('ship-'+(id==='sword'?'sword':'roci')); return '<svg viewBox="0 0 40 44">'+g.innerHTML+'</svg>'; }
function shipSwap(toId){
  if(themeId===toId||state==='hangar') return;
  if(!fine||state!=='free'){ applyTheme(toId); return; }
  state='hangar'; setLock(null);
  var con=$('console');
  if(con.classList.contains('min')) con.classList.remove('min');   // must be open to watch it
  $('c-stat').textContent='● HANGAR';
  $('bay-ship').innerHTML=shipSVG(themeId);          // current ship pulls in
  con.classList.add('baying');                        // bay visible, doors closed
  Sound.warp();
  setTimeout(function(){ con.classList.add('bay-open'); },260);          // doors part
  setTimeout(function(){ con.classList.add('ship-in'); },520);           // ship descends & parks
  setTimeout(function(){ con.classList.remove('bay-open'); Sound.thump(); },1500); // doors shut over it
  setTimeout(function(){ applyTheme(toId);                               // reskin everything behind closed doors
    con.classList.add('baying');                                        // (applyTheme leaves classes; ensure bay stays)
    $('bay-ship').innerHTML=shipSVG(toId); },1950);                     // new ship sits PARKED (ship-in stays on)
  /* Outbound must mirror the inbound stagger: doors first, THEN the ship
     moves. The old version fired bay-open and ship-out on the same tick —
     the ship's fade finished before the doors were even half open, so the
     bay always looked empty. */
  setTimeout(function(){ con.classList.add('bay-open'); },2300);         // doors part, revealing the parked ship
  setTimeout(function(){ con.classList.add('ship-out'); con.classList.remove('ship-in'); Sound.pew(); },2850); // now it launches, in full view
  setTimeout(function(){ con.classList.remove('baying','bay-open','ship-in','ship-out');
    state='free'; $('c-stat').textContent='● ONLINE'; },3700);
}
$('b-sword').addEventListener('click', function(){ shipSwap('sword'); });
$('b-roci').addEventListener('click', function(){ shipSwap('roci'); });
$('snd').addEventListener('click', function(){ var on=Sound.toggle(); this.textContent=on?'sfx on':'sfx off'; });


/* ══════════ MINIMIZABLE PANELS + TOUCH UI ══════════ */
function zap(el){ el.classList.remove('zap'); void el.offsetWidth; el.classList.add('zap'); Sound.blip(themeId==='sword'?440:660); }
function toggleMin(el){ zap(el); setTimeout(function(){ el.classList.toggle('min'); },170); }
$('c-mz').addEventListener('click', function(e){ e.stopPropagation(); toggleMin($('console')); });
$('c-chip').addEventListener('click', function(){ toggleMin($('console')); });
(function(){ var b=document.querySelectorAll('.player .mz');
  for(var i=0;i<b.length;i++) b[i].addEventListener('click', function(e){ e.stopPropagation(); toggleMin($('player')); }); })();
$('p-chip').addEventListener('click', function(e){ if(e.target.closest('button')) return; toggleMin($('player')); });
/* chip data mirrors */
setInterval(function(){
  $('chip-bounty').textContent='₩ '+bounty.toLocaleString();
  $('chip-tgt').textContent=$('target').textContent.replace('— ','').replace(' —','');
  $('imm-bounty').textContent='₩ '+bounty.toLocaleString();
},500);

/* ══════════ IMMERSIVE / CLEAR MODE (Phase 2 Stage 3 station + Stage 4 flight) ══════════
   Two independent body classes (only one is ever relevant at a time, since
   you can't be docked and freely flying simultaneously) drive what the CSS
   hides. #imm-handle is the one guaranteed, always-clickable way back in
   either mode; station mode additionally lets you click the bare scene
   (wired in 07-environments.js, since that's where the panel's click
   handler already lives). */
var immHintT=null;
function immFlash(msg){
  var h=$('imm-hint'); h.textContent=msg; h.classList.add('show');
  clearTimeout(immHintT); immHintT=setTimeout(function(){ h.classList.remove('show'); },2200);
}
function exitImmersive(){
  document.body.classList.remove('imm-station','imm-flight');
}
$('imm-handle').addEventListener('click', exitImmersive);
$('imm-btn').addEventListener('click', function(){
  if(state!=='free') return;
  // clicks fire your weapon while flying, so the scene can't double as a
  // restore gesture here — only the persistent handle gets you back.
  document.body.classList.add('imm-flight'); immFlash('Tap the ◈ below to bring the controls back'); Sound.blip(themeId==='sword'?520:760);
});

/* ══════════ NEXT-REWARD MILESTONE ══════════ */
/* Gold asteroids (the main reward trigger) spawn every REWARD_STEP woolongs
   of bounty, per checkBounty() in 03-progress.js — this just surfaces that
   same cadence as a visible countdown/progress bar so it's never a mystery
   when the next reward is coming. */
var REWARD_STEP=2500, bhHud=$('bounty-hud'), bhLab=$('bh-next-lab'), bhBar=$('bh-bar-fill');
var immWrap=$('imm-bounty-wrap'), immBar=$('imm-bar-fill');
function updateNextReward(){
  var goldLive = typeof asteroids!=='undefined' && asteroids.some(function(a){ return a.gold; });
  if(goldLive){
    bhLab.textContent='◈ SIGNAL LIVE — crack the gold asteroid';
    bhBar.style.width='100%'; immBar.style.width='100%';
    bhHud.classList.add('signal'); immWrap.classList.add('signal');
  }else{
    immWrap.classList.remove('signal');
    var into=bounty%REWARD_STEP, remain=REWARD_STEP-into;
    bhLab.textContent='NEXT SIGNAL · ₩'+remain.toLocaleString()+' TO GO';
    bhBar.style.width=((into/REWARD_STEP)*100)+'%'; immBar.style.width=((into/REWARD_STEP)*100)+'%';
    bhHud.classList.remove('signal');
  }
}
setInterval(updateNextReward,500);
/* ══════════ INSTRUCTIONS POPOVER ══════════ */
/* The hint sentence used to sit permanently in the bottom-left corner,
   colliding with the "See you, space cowboy" signoff (which is
   position:fixed and ignores that flow entirely). Now it only shows on
   demand, next to the station nav links. */
var helpBtn=$('help-btn'), helpPop=$('hint');
function setHelp(on){
  helpBtn.classList.toggle('on',on); helpBtn.setAttribute('aria-expanded',String(on));
  helpPop.classList.toggle('on',on);
}
helpBtn.addEventListener('click', function(e){ e.stopPropagation(); setLog(false); setHelp(!helpPop.classList.contains('on')); });
document.addEventListener('pointerdown', function(e){
  if(helpPop.classList.contains('on') && !e.target.closest('.navrow')) setHelp(false);
});

/* ══════════ REWARDS LOG ══════════ */
/* The log is the reward collection, nothing else — categorized facts/quotes
   /stats earned through play (see earnFromCategory in 03-progress.js),
   grouped under one tab per category. "New" is tracked PER ENTRY
   (Progress.d.rwSeen): an earned entry stays lit — bold, bright, NEW chip,
   counted on the button badge AND on its category tab — until it's actually
   clicked and read in the log, not merely until the panel is opened. Once
   opened, the log stays open until explicitly closed via the ✕. */
var logBtn=$('log-btn'), logPanel=$('logpanel'), logTab='pilot', logBadge=$('log-badge');
function unseenIn(cat){
  var pool=(rewardPool()[cat])||[], n=0;
  pool.forEach(function(_,i){ var id=cat+':'+i; if(Progress.d.rw[id]&&!Progress.d.rwSeen[id]) n++; });
  return n;
}
function updateLogButton(){
  var n=Progress.d.rwNew||0;
  logBadge.textContent=n?String(n):'';
  logBtn.classList.toggle('hasnew',n>0);
}
function markLogNew(){
  updateLogButton();
  logBtn.classList.remove('bump'); void logBtn.offsetWidth; logBtn.classList.add('bump');   // re-trigger the bounce
  if(logPanel.classList.contains('on')) renderLog();   // panel already open: counts/entries update live
}
window.markLogNew=markLogNew;
var TAB_LABEL={pilot:'Pilot',career:'Career',random:'Fun',quotes:'Wisdom'};
function renderLog(){
  var R=rewardPool(), tabs=$('log-tabs'), list=$('log-list');
  /* Viewing a tab IS seeing its rewards — the player already read each one
     on the big reveal when they earned it, so just looking at the list is
     enough to clear that category's NEW state (tab chip + button badge).
     We capture which entries were fresh BEFORE clearing so this first
     view still renders them lit — you can spot what's new — and they
     settle to normal styling from the next render on. */
  var freshIds={};
  (R[logTab]||[]).forEach(function(_,i){ var id=logTab+':'+i;
    if(Progress.d.rw[id]&&!Progress.d.rwSeen[id]){ freshIds[id]=1; Progress.d.rwSeen[id]=1; } });
  var cleared=Object.keys(freshIds).length;
  if(cleared){
    Progress.d.rwNew=Math.max(0,(Progress.d.rwNew||0)-cleared);
    Progress.save(); updateLogButton();
  }
  tabs.innerHTML='';
  Object.keys(REWARD_META).forEach(function(cat){
    var pool=R[cat]||[], got=pool.filter(function(_,i){ return Progress.d.rw[cat+':'+i]; }).length;
    var fresh=unseenIn(cat);   // active tab was just cleared above, so its chip is gone
    var b=document.createElement('button'); b.type='button';
    b.className='log-tab'+(cat===logTab?' on':'');
    b.innerHTML='<span></span><i>'+got+'/'+pool.length+'</i>'+(fresh?'<em class="tab-new">'+fresh+'</em>':'');
    b.querySelector('span').textContent=TAB_LABEL[cat];
    b.addEventListener('click', function(e){ e.stopPropagation(); logTab=cat; renderLog(); Sound.blip(700); });
    tabs.appendChild(b);
  });
  var pool=R[logTab]||[];
  var earned=[];
  pool.forEach(function(txt,i){ var id=logTab+':'+i, t=Progress.d.rw[id]; if(t) earned.push({id:id,txt:txt,t:t}); });
  earned.sort(function(a,b){ return b.t-a.t; });   // newest first
  if(!earned.length){
    list.innerHTML='<div class="log-empty">Nothing collected here yet — crack gold asteroids and down saucers to earn rewards.</div>';
    return;
  }
  list.innerHTML='';
  earned.forEach(function(e){
    var fresh=!!freshIds[e.id];   // lit on this first view only
    var it=document.createElement('div'); it.className='log-item'+(fresh?' unseen':'');
    it.innerHTML='<div class="ld"></div>'+(fresh?'<span class="lnew">NEW</span>':'')+'<i class="lex">⤢</i>';
    it.querySelector('.ld').textContent=e.txt;
    it.addEventListener('click', function(){
      openRewardModal(REWARD_META[logTab].kicker, REWARD_META[logTab].label, e.txt, logTab);
    });
    list.appendChild(it);
  });
}
/* ══════════ REWARD SIGNAL MODAL ══════════ */
/* Every reward-earning moment (gold asteroid crack, saucer kill) calls
   openRewardPicker() — it's the main event now, not a background toast.
   The player picks a category, revealReward() marks + saves + shows it big.
   Re-opening an already-earned entry from the ◈ LOG skips the picker and
   goes straight to openRewardModal() (view-only, nothing to (re-)earn). */
var rewardModal=$('rewardmodal'), rmKicker=$('rm-kicker'), rmLabel=$('rm-label'), rmText=$('rm-text'),
    rmPickerGrid=$('rm-picker-grid');
/* picker labels spell out what each channel actually IS — a first-time
   player has no idea what "Pilot" vs "Random" means otherwise. */
var CAT_LABEL={pilot:'About the Pilot',career:'Career Wins',random:'Fun Facts',quotes:'Wisdom'};
var CAT_SUB={pilot:'who Aaron is',career:'the numbers',random:'off-duty',quotes:'words to fly by'};
function renderPickerGrid(){
  var R=rewardPool();
  rmPickerGrid.innerHTML='';
  Object.keys(REWARD_META).forEach(function(cat){
    var pool=R[cat]||[], got=pool.filter(function(_,i){ return Progress.d.rw[cat+':'+i]; }).length;
    var b=document.createElement('button'); b.type='button'; b.className='rm-pick';
    b.innerHTML='<span class="rp-lab"></span><span class="rp-sub"></span><span class="rp-count"></span>';
    b.querySelector('.rp-lab').textContent=CAT_LABEL[cat];
    b.querySelector('.rp-sub').textContent=CAT_SUB[cat];
    b.querySelector('.rp-count').textContent=got+'/'+pool.length;
    b.addEventListener('click', function(){ revealReward(cat); });
    rmPickerGrid.appendChild(b);
  });
}
/* ── per-category character in the reveal ──
   Each channel gets its own typographic voice (CSS: .rewardmodal.cat-*):
   quotes = script/wisdom, career = bold with numbers blown up for impact,
   random = rounded and playful, pilot = technical dossier. Career text is
   HTML-escaped and its numbers wrapped in .rm-num for the big-stat pop. */
function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function setRevealBody(cat,text){
  ['pilot','career','random','quotes'].forEach(function(c){ rewardModal.classList.remove('cat-'+c); });
  if(cat) rewardModal.classList.add('cat-'+cat);
  if(cat==='career'){
    rmText.innerHTML=esc(text).replace(/(₩?\d[\d,.]*(?:%|×|x\b)?)/g,'<b class="rm-num">$1</b>');
  } else if(cat==='quotes'){
    /* Frame the quote with a matched PAIR of decorative marks (CSS ::before/
       ::after on .rm-quote) and move the attribution onto its own quiet
       line below. The plain quotation marks inside the data text are
       stripped — the decorative pair replaces them rather than stacking. */
    var m=text.match(/^([\s\S]*[”"])\s*[—–-]+\s*([\s\S]+)$/);
    var q=(m?m[1]:text).replace(/^[\s“”"']+/,'').replace(/[\s“”"']+$/,'');
    var a=m?m[2].trim():'';
    rmText.innerHTML='<span class="rm-quote"></span>'+(a?'<span class="rm-attr"></span>':'');
    rmText.querySelector('.rm-quote').textContent=q;
    if(a) rmText.querySelector('.rm-attr').textContent=a;
  } else rmText.textContent=text;
}
/* While the picker is up you MUST choose a category — it can't be dismissed
   by an accidental click (backdrop, ✕, or Escape all do nothing in picking
   mode). This is because the picker opens the instant a gold asteroid is
   cracked, right in the middle of a rapid click-to-shoot burst: without
   this, one of those in-flight clicks lands on the backdrop and dismisses
   the reward before it's picked, so the crack is wasted. `rewardArmed` adds
   a short guard so a click landing on the modal the same instant it opens
   can't auto-resolve it before the player even registers the picker. */
var rewardArmed=false, armTimer=null;
function openRewardPicker(){
  renderPickerGrid();
  rewardModal.classList.add('on','picking');
  rewardArmed=false;
  clearTimeout(armTimer); armTimer=setTimeout(function(){ rewardArmed=true; },380);
  Sound.blip(themeId==='sword'?880:660);
}
window.openRewardPicker=openRewardPicker;
function revealReward(cat){
  if(!rewardArmed) return;   // ignore clicks that land before the picker settles
  var r=earnFromCategory(cat);
  if(!r) return;
  rewardModal.classList.remove('picking');
  rmKicker.textContent=REWARD_META[cat].kicker; rmLabel.textContent=REWARD_META[cat].label;
  setRevealBody(cat,r.txt);
  Sound.blip(themeId==='sword'?1180:980);
}
function openRewardModal(kicker,label,text,cat){   // view an already-earned entry from the log
  rewardModal.classList.remove('picking');
  rmKicker.textContent=kicker; rmLabel.textContent=label;
  setRevealBody(cat,text);
  rewardModal.classList.add('on');
}
window.openRewardModal=openRewardModal;
function closeRewardModal(){ rewardModal.classList.remove('on','picking'); }
/* the ✕ and backdrop only dismiss the REVEAL view — never the picker (which
   requires an actual category choice). */
function isPicking(){ return rewardModal.classList.contains('picking'); }
$('rm-close').addEventListener('click', function(){ if(!isPicking()) closeRewardModal(); });
rewardModal.addEventListener('pointerdown', function(e){ if(e.target===rewardModal && !isPicking()) closeRewardModal(); });
function setLog(on){
  if(on) renderLog();
  // NOTE: opening the log no longer clears the "new" state wholesale —
  // each entry stays lit (and counted, on the button badge and its tab)
  // until it is individually clicked and read. See renderLog's item click.
  logBtn.classList.toggle('on',on); logBtn.setAttribute('aria-expanded',String(on));
  logPanel.classList.toggle('on',on);
}
logBtn.addEventListener('click', function(e){ e.stopPropagation(); setHelp(false); setLog(!logPanel.classList.contains('on')); });
$('log-close').addEventListener('click', function(){ setLog(false); });

/* ══════════ CONTACT CARD ══════════ */
var contactWrap=$('contactwrap');
function setContact(on){ contactWrap.classList.toggle('on',on); }
$('sign').addEventListener('click', function(){ setContact(true); Sound.blip(themeId==='sword'?440:660); });
$('contact-close').addEventListener('click', function(){ setContact(false); });
contactWrap.addEventListener('pointerdown', function(e){ if(e.target===contactWrap) setContact(false); });

addEventListener('keydown', function(e){ if(e.key==='Escape'){ setHelp(false); setContact(false); setLog(false); if(!isPicking()) closeRewardModal(); } });

/* touch: FIRE button + hint copy + start minimized on small screens */
$('fireb').addEventListener('pointerdown', function(e){ e.preventDefault(); Sound.unlock(); Music.autostart(); if(state==='free') fire(); });
if(!fine){
  $('hint').innerHTML='◐ <b>Drag to fly</b> · FIRE shoots · tap a planet to dock · <a href="../">Walkman ↗</a>';
}
if(!fine||innerWidth<720){ $('console').classList.add('min'); $('player').classList.add('min'); }

