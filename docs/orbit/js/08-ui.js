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
    $('bay-ship').innerHTML=shipSVG(toId); con.classList.remove('ship-in'); },1950);
  setTimeout(function(){ con.classList.add('bay-open','ship-out'); Sound.pew(); },2300); // doors open, new ship launches
  setTimeout(function(){ con.classList.remove('baying','bay-open','ship-in','ship-out');
    state='free'; $('c-stat').textContent='● ONLINE'; },3150);
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
},500);
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
helpBtn.addEventListener('click', function(e){ e.stopPropagation(); setHelp(!helpPop.classList.contains('on')); });
document.addEventListener('pointerdown', function(e){
  if(helpPop.classList.contains('on') && !e.target.closest('.navrow')) setHelp(false);
});
addEventListener('keydown', function(e){ if(e.key==='Escape') setHelp(false); });

/* touch: FIRE button + hint copy + start minimized on small screens */
$('fireb').addEventListener('pointerdown', function(e){ e.preventDefault(); Sound.unlock(); Music.autostart(); if(state==='free') fire(); });
if(!fine){
  $('hint').innerHTML='◐ <b>Drag to fly</b> · FIRE shoots · tap a planet to dock · <a href="../">Walkman ↗</a>';
}
if(!fine||innerWidth<720){ $('console').classList.add('min'); $('player').classList.add('min'); }

