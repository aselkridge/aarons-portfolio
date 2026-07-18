// ══════════════════════════════════════════════════════════════════
// AARONAUTICS ORBIT — PROGRESS
// Achievements/localStorage progress, toasts, the center banner, pilot facts.
// (mechanically split from the original single orbit.js; original source: lines 136-187)
// ══════════════════════════════════════════════════════════════════
'use strict';

/* ══════════ PROGRESS / ACHIEVEMENTS / TOASTS ══════════ */
var Progress=(function(){
  var d={ach:{},visited:{},gold:0,saucers:0,rw:{},rwNew:0};
  try{ var raw=localStorage.getItem('aa_progress'); if(raw) d=Object.assign(d,JSON.parse(raw)); }catch(e){}
  if(!d.rw||typeof d.rw!=='object') d.rw={};   // older saved profiles predate rewards
  function save(){ try{ localStorage.setItem('aa_progress',JSON.stringify(d)); }catch(e){} }
  return { d:d, save:save,
    award:function(id,title,desc){ if(d.ach[id]) return false;
      d.ach[id]=1; save(); toast('ACHIEVEMENT','◈ '+title,desc); Sound.blip(1180); return true; } };
})();
/* small right-side stack — minor milestones + facts (capped at 3, auto-dismiss).
   Reward toasts (onExpand passed) are click-to-expand — they're too small to
   comfortably read in the stack, so tapping one opens the full text in a
   centered modal (openRewardModal, defined in 08-ui.js). Achievement toasts
   (no onExpand) stay as plain, non-interactive pop-ups. */
function toast(kicker,title,desc,onExpand){
  var host=$('ach');
  while(host.children.length>=3) host.removeChild(host.firstChild);
  var el=document.createElement('div'); el.className='toast'+(onExpand?' rw':'');
  el.innerHTML='<div class="tk">'+kicker+'</div><div class="tt"></div>'+(desc?'<div class="td"></div>':'')+(onExpand?'<i class="tx">⤢</i>':'');
  el.querySelector('.tt').textContent=title; if(desc) el.querySelector('.td').textContent=desc;
  if(onExpand) el.addEventListener('click', onExpand);
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
/* Rewards are the collectible layer: categorized facts/quotes (data/facts.js)
   earned through play (gold asteroids, saucers). Each drop picks a random
   reward the player hasn't earned yet, shows it as a toast, and permanently
   records it in Progress.d.rw so the ◈ LOG panel can display it under its
   category tab. d.rwNew flags the log button to glow until the log is opened.
   Once every reward is earned, drops re-show random earned ones (no re-log). */
var REWARD_META={
  pilot:  {label:'ABOUT THE PILOT',     kicker:'REWARD ◈ PILOT FILE'},
  career: {label:'CAREER INTEL',        kicker:'REWARD ◈ CAREER FILE'},
  random: {label:'RANDOM TRANSMISSION', kicker:'REWARD ◈ INTERCEPTED'},
  quotes: {label:'QUOTE UNLOCKED',      kicker:'REWARD ◈ QUOTE'}
};
function rewardPool(){ return window.ORBIT_REWARDS||{}; }
function rewardDrop(){
  var R=rewardPool(), unearned=[], all=[];
  Object.keys(REWARD_META).forEach(function(cat){
    (R[cat]||[]).forEach(function(txt,i){
      var id=cat+':'+i, item={id:id,cat:cat,txt:txt};
      all.push(item);
      if(!Progress.d.rw[id]) unearned.push(item);
    });
  });
  if(!all.length) return;
  var fresh=unearned.length>0;
  var pick=(fresh?unearned:all)[(Math.random()*(fresh?unearned:all).length)|0];
  if(fresh){
    Progress.d.rw[pick.id]=Date.now();
    Progress.d.rwNew=1;
    Progress.save();
    if(window.markLogNew) markLogNew();   // defined in 08-ui.js (glow)
  }
  toast(REWARD_META[pick.cat].kicker, REWARD_META[pick.cat].label, pick.txt, function(){
    if(window.openRewardModal) window.openRewardModal(REWARD_META[pick.cat].kicker, REWARD_META[pick.cat].label, pick.txt);
  });
}
function factDrop(){ rewardDrop(); }   // legacy call sites (gold/saucer) route here
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

