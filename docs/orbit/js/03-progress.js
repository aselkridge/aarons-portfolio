// ══════════════════════════════════════════════════════════════════
// AARONAUTICS ORBIT — PROGRESS
// Achievements/localStorage progress, toasts, the center banner, pilot facts.
// (mechanically split from the original single orbit.js; original source: lines 136-187)
// ══════════════════════════════════════════════════════════════════
'use strict';

/* ══════════ PROGRESS / ACHIEVEMENTS / TOASTS ══════════ */
var Progress=(function(){
  var d={ach:{},visited:{},ronin:0,gold:0,saucers:0};
  try{ var raw=localStorage.getItem('aa_progress'); if(raw) d=Object.assign(d,JSON.parse(raw)); }catch(e){}
  function save(){ try{ localStorage.setItem('aa_progress',JSON.stringify(d)); }catch(e){} }
  return { d:d, save:save,
    award:function(id,title,desc){ if(d.ach[id]) return false;
      d.ach[id]=1; save(); toast('ACHIEVEMENT','◈ '+title,desc); Sound.blip(1180); return true; } };
})();
/* small right-side stack — minor milestones + facts (capped at 3, auto-dismiss) */
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
function factDrop(){
  var F=window.ORBIT_FACTS||[]; if(!F.length) return;
  toast('TRANSMISSION ◈ INCOMING','ABOUT THE PILOT',F[(Math.random()*F.length)|0]);
}
var prevBounty=0;
function checkBounty(){
  if(bounty>=5000) Progress.award('b5k','BOUNTY HEAD ₩5,000','The name starts to circulate.');
  if(bounty>=25000) Progress.award('b25k','BOUNTY HEAD ₩25,000','Posters are going up.');
  if(bounty>=100000){ if(Progress.award('b100k','MOST WANTED ₩100,000','See you, space cowboy…'))
    banner('◈ BOUNTY BOARD','MOST WANTED','Your poster is up across the system.'); }
  if(Math.floor(bounty/2500)>Math.floor(prevBounty/2500) && !asteroids.some(function(a){return a.gold;})){
    spawnAsteroid(2,undefined,undefined,true);
    banner('◈ SIGNAL DETECTED','GOLD ASTEROID INBOUND','Crack it for a transmission.'); }
  if(bounty>=20000 && !Progress.d.ronin) unlockRonin(false);
  prevBounty=bounty;
}

