// ══════════════════════════════════════════════════════════════════
// AARONAUTICS ORBIT — PROGRESS
// Achievements/localStorage progress, toasts, the center banner, pilot facts.
// (mechanically split from the original single orbit.js; original source: lines 136-187)
// ══════════════════════════════════════════════════════════════════
'use strict';

/* ══════════ PROGRESS / ACHIEVEMENTS / TOASTS ══════════ */
var Progress=(function(){
  var d={ach:{},visited:{},gold:0,saucers:0,rw:{},rwNew:0,rwSeen:{}};
  try{
    var raw=localStorage.getItem('aa_progress');
    if(raw){
      var saved=JSON.parse(raw);
      // rewards are session-only, same as bounty and the secret planet —
      // never restored from a previous visit, always earned fresh.
      // rwSeen tracks which earned entries have been clicked/read in the
      // ◈ LOG (per-item, driving the lit-up "unread" styling + badges).
      delete saved.rw; delete saved.rwNew; delete saved.rwSeen;
      d=Object.assign(d,saved);
    }
  }catch(e){}
  function save(){
    try{
      var out=Object.assign({},d); delete out.rw; delete out.rwNew; delete out.rwSeen;   // never persisted
      localStorage.setItem('aa_progress',JSON.stringify(out));
    }catch(e){}
  }
  return { d:d, save:save,
    award:function(id,title,desc){ if(d.ach[id]) return false;
      d.ach[id]=1; save(); toast('ACHIEVEMENT','◈ '+title,desc); Sound.blip(1180); return true; } };
})();
/* small right-side stack — achievement milestones only now (capped at 3,
   auto-dismiss). Rewards (facts/quotes/stats) no longer toast here at all —
   they're the main event, so they go straight to the big centered reward
   signal modal instead (see factDrop below). */
function toast(kicker,title,desc){
  var host=$('ach');
  while(host.children.length>=3) host.removeChild(host.firstChild);
  var el=document.createElement('div'); el.className='toast';
  el.innerHTML='<div class="tk">'+kicker+'</div><div class="tt"></div>'+(desc?'<div class="td"></div>':'');
  el.querySelector('.tt').textContent=title; if(desc) el.querySelector('.td').textContent=desc;
  host.appendChild(el);
  requestAnimationFrame(function(){ el.classList.add('show'); });
  setTimeout(function(){ el.classList.add('out');
    setTimeout(function(){ if(el.parentNode) el.remove(); },400); },5200);
}
/* one big center-top banner — MAJOR events only */
var bannerTimer=null;
function banner(kicker,title,desc){
  var host=$('banner'); host.innerHTML='';
  var el=document.createElement('div'); el.className='bnr';
  el.innerHTML='<div class="bk">'+kicker+'</div><div class="bt"></div>'+(desc?'<div class="bd"></div>':'');
  el.querySelector('.bt').textContent=title; if(desc) el.querySelector('.bd').textContent=desc;
  host.appendChild(el);
  requestAnimationFrame(function(){ el.classList.add('show'); });
  clearTimeout(bannerTimer);
  bannerTimer=setTimeout(function(){ el.classList.remove('show');
    setTimeout(function(){ if(el.parentNode) el.remove(); },500); },3600);
  Sound.blip(themeId==='sword'?659:880);
}
/* ══════════ REWARDS ══════════ */
/* Rewards are the whole point — categorized facts/stats/quotes about Aaron
   (data/facts.js) surfaced through play (gold asteroids, saucers). Every
   reward-earning moment opens the big centered reward signal modal
   (openRewardPicker, in 08-ui.js) straight to a category picker so the
   player chooses what kind of thing to learn, rather than the system
   picking for them. Whatever's revealed is recorded in Progress.d.rw for
   the rest of THIS session so the ◈ LOG panel can show it later under its
   category tab — session-only, same as bounty and the secret planet (see
   the Progress constructor above), so it's earned fresh every visit.
   d.rwNew counts how many are waiting unviewed, driving both the log
   button's glow and its numeric badge until the log is opened. */
var REWARD_META={
  pilot:  {label:'ABOUT THE PILOT', kicker:'REWARD ◈ PILOT FILE'},
  career: {label:'CAREER WINS',     kicker:'REWARD ◈ CAREER FILE'},
  random: {label:'FUN FACT',        kicker:'REWARD ◈ INTERCEPTED'},
  quotes: {label:'WISDOM',          kicker:'REWARD ◈ WORDS TO FLY BY'}
};
function rewardPool(){ return window.ORBIT_REWARDS||{}; }
/* Marks one item earned within a single category — unearned pool first,
   falling back to a random already-earned item once that category is fully
   cleared out — and returns {cat,txt} for display. Null if the category
   (or the whole reward pool) is empty. */
function earnFromCategory(cat){
  var pool=(rewardPool()[cat])||[];
  if(!pool.length) return null;
  var unearned=[];
  pool.forEach(function(txt,i){ if(!Progress.d.rw[cat+':'+i]) unearned.push(i); });
  var i = unearned.length ? unearned[(Math.random()*unearned.length)|0] : (Math.random()*pool.length)|0;
  var id=cat+':'+i;
  if(!Progress.d.rw[id]){
    Progress.d.rw[id]=Date.now();
    Progress.d.rwNew=(Progress.d.rwNew||0)+1;
    Progress.save();
    if(window.markLogNew) markLogNew();   // defined in 08-ui.js (glow + badge count)
  }
  return { cat:cat, txt:pool[i] };
}
/* Reward-earning moments (gold asteroid crack, saucer kill) call this —
   it hands straight off to the on-screen category picker. */
function factDrop(){ if(window.openRewardPicker) window.openRewardPicker(); }
var prevBounty=0;
function checkBounty(){
  if(bounty>=5000) Progress.award('b5k','BOUNTY HEAD ₩5,000','The name starts to circulate.');
  if(bounty>=25000) Progress.award('b25k','BOUNTY HEAD ₩25,000','Posters are going up.');
  if(bounty>=100000){ if(Progress.award('b100k','MOST WANTED ₩100,000','See you, space cowboy…'))
    banner('◈ BOUNTY BOARD','MOST WANTED','Your poster is up across the system.'); }
  if(Math.floor(bounty/2500)>Math.floor(prevBounty/2500) && !asteroids.some(function(a){return a.gold;})){
    spawnAsteroid(2,undefined,undefined,true);
    banner('◈ SIGNAL DETECTED','GOLD ASTEROID INBOUND','Crack it for a transmission.'); }
  if(bounty>=20000 && !RONIN.el) unlockRonin(false);
  prevBounty=bounty;
}

