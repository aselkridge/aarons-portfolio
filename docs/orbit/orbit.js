// Aaronautics — ORBIT engine v3
// Two ships (SWORDFISH / ROCINANTE), weapons + asteroids + forcefields,
// landing + hyperwarp, per-planet surface environments, themed consoles & players.
(function(){
'use strict';
var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine = matchMedia('(hover:hover)').matches;
var $ = function(id){ return document.getElementById(id); };

/* ══════════ THEMES ══════════ */
var THEMES = {
  sword:{ cls:'t-sword', accent:'#ff7a3c', accent2:'#ffd36a', star:'#ffe9cf', starDensity:6500,
          bg:['#1a1310','#110b08','#080605'], grain:.09, scan:.30, mood:'jazz',   wpn:'cannon',
          bolt:'#ffb44a', rockFill:'#7a7061', rockLine:'#241c12' },
  roci:{ cls:'t-roci', accent:'#74d0ff', accent2:'#9affea', star:'#dbeeff', starDensity:4200,
          bg:['#081019','#060b14','#04070d'], grain:.04, scan:.12, mood:'ambient', wpn:'pdc',
          bolt:'#86dcff', rockFill:'#8b939e', rockLine:'#1a1f26' }
};
var themeId = 'sword';
function T(){ return THEMES[themeId]; }

/* ══════════ STATIONS ══════════ */
/* The MISSION is the sun — the thing everything else orbits. */
var SUN_STATION = { id:'mission', name:'Mission', color:'#ffb44a', num:'01', r:60,
  env:'hero', envlab:'UPPER ATMOSPHERE',
  eyebrow:'THE CORE · EVERYTHING ORBITS THIS', title:'Built to be more than one thing.',
  body:['This is the flagship — the point of view, not the résumé. Aeronautics engineer by degree, automation builder by trade, poet and father by nature. The through-line isn\'t a job title; it\'s the range itself.','Aaronautics is a place to interface with that range — not a page to scroll. Everything in this system orbits this one idea.'],
  tags:['point of view','the mission','more than one thing'] };
var STATIONS = [
  { id:'alphaforge', name:'AlphaForge', tag:'the proof', color:'#74d0ff', r:18, type:'ringed', orbit:0.44, speed:0.040, a0:1.1,
    env:'city', envlab:'NEON GRID',
    eyebrow:'STATION 02 · THE PROOF', title:'Nine GTM builds.',
    body:['The proof behind the mission — nine go-to-market builds from the Clay-led AlphaForge cohort. Each one: the problem, what got built, and the number that moved.','Wiring in the real Clay tables next — this station will read like a launch manifest, 001 through 009.'],
    tags:['clay','go-to-market','9 builds','001 – 009'], soon:true },
  { id:'life', name:'Life', tag:'the human', color:'#7cff9b', r:16, type:'mooned', orbit:0.57, speed:0.031, a0:2.4,
    env:'forest', envlab:'CANOPY',
    eyebrow:'STATION 03 · THE HUMAN', title:'Reading, watching, listening, eating.',
    body:['The relatable frequency — anime and hip-hop, the food, the conversation-starters. The stuff that makes a person, not a profile.'],
    tags:['anime','hip-hop','food','the bronx'], soon:true },
  { id:'craft', name:'Craft', tag:'no ROI attached', color:'#c9a8ff', r:16, type:'gas', orbit:0.70, speed:0.024, a0:3.5,
    env:'ocean', envlab:'OPEN WATER',
    eyebrow:'STATION 04 · THE ARTIST', title:'Made with no ROI attached.',
    body:['Poetry, drawings, physics for its own sake. The work that exists because it had to, not because it converted.'],
    tags:['poetry','drawing','physics'], soon:true },
  { id:'notes', name:'Notes', tag:'writing + video', color:'#ffd36a', r:16, type:'cratered', orbit:0.83, speed:0.018, a0:4.6,
    env:'graffiti', envlab:'THE LOT',
    eyebrow:'STATION 05 · THE SIGNAL', title:'Fatherhood, the Bronx, the build.',
    body:['Writing and video — fatherhood, becoming a husband, renovating a home, and explaining GTM to a community that was never handed the map.'],
    tags:['fatherhood','the bronx','building a home','gtm for us'], soon:true }
];

/* ══════════ METRICS ══════════ */
var W,H,CX,CY,unit;
function metrics(){ W=innerWidth; H=innerHeight; CX=W/2; CY=H/2; unit=Math.min(W,H)/2 - Math.min(W,H)*0.06; }
metrics();
function cl(v){ return Math.max(0,Math.min(255,v|0)); }
function hex(c){ c=c.replace('#',''); return [parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)]; }
function shade(c,n){ var p=hex(c); return 'rgb('+cl(p[0]+n)+','+cl(p[1]+n)+','+cl(p[2]+n)+')'; }

/* ══════════ SOUND (synth SFX) ══════════ */
var Sound=(function(){
  var ctx,humG,on=true,started=false;
  function ac(){ if(!ctx) ctx=new (window.AudioContext||window.webkitAudioContext)(); if(ctx.state==='suspended') ctx.resume(); return ctx; }
  function env(g,peak,dur){ var t=ctx.currentTime; g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(peak,t+0.012); g.gain.exponentialRampToValueAtTime(0.0001,t+dur); }
  return {
    unlock:function(){ ac(); if(started) return; started=true;
      var o=ctx.createOscillator(),o2=ctx.createOscillator(),f=ctx.createBiquadFilter(); humG=ctx.createGain();
      o.type='sine';o.frequency.value=52;o2.type='sine';o2.frequency.value=78.2;f.type='lowpass';f.frequency.value=210;
      humG.gain.value=0;o.connect(f);o2.connect(f);f.connect(humG);humG.connect(ctx.destination);o.start();o2.start();
      humG.gain.linearRampToValueAtTime(on?0.04:0,ctx.currentTime+2.5); },
    blip:function(fr){ if(!on||!ctx)return; var o=ctx.createOscillator(),g=ctx.createGain();
      o.type='triangle';o.frequency.value=fr||820;o.connect(g);g.connect(ctx.destination);env(g,0.05,0.16);o.start();o.stop(ctx.currentTime+0.2); },
    pew:function(){ if(!on||!ctx)return; var t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();
      o.type='square';o.frequency.setValueAtTime(420,t);o.frequency.exponentialRampToValueAtTime(90,t+0.14);
      o.connect(g);g.connect(ctx.destination);env(g,0.06,0.15);o.start(t);o.stop(t+0.17); },
    tick:function(){ if(!on||!ctx)return; var t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();
      o.type='square';o.frequency.setValueAtTime(950,t);o.frequency.exponentialRampToValueAtTime(500,t+0.05);
      o.connect(g);g.connect(ctx.destination);env(g,0.04,0.06);o.start(t);o.stop(t+0.08); },
    boom:function(big){ if(!on||!ctx)return; var t=ctx.currentTime,n=ctx.sampleRate*0.35,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);
      for(var i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,2);
      var s=ctx.createBufferSource();s.buffer=b;var f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=big?900:1600;
      var g=ctx.createGain();g.gain.value=big?0.22:0.12;s.connect(f);f.connect(g);g.connect(ctx.destination);s.start();
      var o=ctx.createOscillator(),g2=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(big?90:130,t);o.frequency.exponentialRampToValueAtTime(38,t+0.3);
      o.connect(g2);g2.connect(ctx.destination);env(g2,big?0.2:0.1,0.32);o.start(t);o.stop(t+0.35); },
    shieldHit:function(){ if(!on||!ctx)return; var t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();
      o.type='sine';o.frequency.setValueAtTime(1200,t);o.frequency.exponentialRampToValueAtTime(300,t+0.28);
      f.type='bandpass';f.frequency.value=900;o.connect(f);f.connect(g);g.connect(ctx.destination);env(g,0.09,0.3);o.start(t);o.stop(t+0.32); },
    thump:function(){ if(!on||!ctx)return; var t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain();
      o.type='sine';o.frequency.setValueAtTime(120,t);o.frequency.exponentialRampToValueAtTime(45,t+0.18);
      o.connect(g);g.connect(ctx.destination);env(g,0.16,0.2);o.start(t);o.stop(t+0.22); },
    warp:function(){ if(!on||!ctx)return; var t=ctx.currentTime,n=ctx.sampleRate*0.9,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);
      for(var i=0;i<n;i++) d[i]=(Math.random()*2-1)*(i/n);
      var s=ctx.createBufferSource();s.buffer=b;var f=ctx.createBiquadFilter();f.type='bandpass';
      f.frequency.setValueAtTime(200,t);f.frequency.exponentialRampToValueAtTime(3800,t+0.85);
      var g=ctx.createGain();g.gain.setValueAtTime(0.02,t);g.gain.linearRampToValueAtTime(0.16,t+0.7);g.gain.linearRampToValueAtTime(0.001,t+0.95);
      s.connect(f);f.connect(g);g.connect(ctx.destination);s.start();
      var o=ctx.createOscillator(),g2=ctx.createGain();o.type='sawtooth';o.frequency.setValueAtTime(60,t);o.frequency.exponentialRampToValueAtTime(520,t+0.85);
      var f2=ctx.createBiquadFilter();f2.type='lowpass';f2.frequency.value=700;o.connect(f2);f2.connect(g2);g2.connect(ctx.destination);
      g2.gain.setValueAtTime(0.001,t);g2.gain.linearRampToValueAtTime(0.07,t+0.7);g2.gain.linearRampToValueAtTime(0.001,t+0.95);o.start(t);o.stop(t+1); },
    toggle:function(){ on=!on; if(humG) humG.gain.value=on?0.04:0; return on; }
  };
})();

/* ══════════ MUSIC ══════════ */
var Music=(function(){
  var audio=$('audio'), idx={jazz:0,ambient:0}, playing=false, wanted=false;
  function list(){ return (window.ORBIT_TRACKS||{})[T().mood]||[]; }
  function cur(){ return list()[idx[T().mood]]; }
  function paint(){
    var t=cur();
    var titles=document.querySelectorAll('.pl-title'), artists=document.querySelectorAll('.pl-artist');
    for(var i=0;i<titles.length;i++) titles[i].textContent = t? t.title : 'no tracks';
    for(i=0;i<artists.length;i++) artists[i].textContent = t? t.artist : 'drop mp3s in /audio';
    var hp=$('hp-idx'); if(hp) hp.textContent=String(idx[T().mood]+1).padStart(2,'0')+'/'+String(list().length).padStart(2,'0');
    $('player').classList.toggle('playing', playing);
    var pb=document.querySelectorAll('.pl-play');
    for(i=0;i<pb.length;i++) pb[i].textContent = playing?'❚❚':'►';
  }
  function load(){ var t=cur(); if(!t){paint();return;} audio.src=t.file; paint(); }
  function play(){ var t=cur(); if(!t) return; if(!audio.src||audio.src.indexOf(encodeURI(t.file.split('/').pop()))<0) load();
    audio.volume=0.55; audio.play().then(function(){ playing=true; paint(); }).catch(function(){}); }
  function pause(){ audio.pause(); playing=false; paint(); }
  function step(d){ var m=T().mood, L=list(); if(!L.length) return; idx[m]=(idx[m]+d+L.length)%L.length; load(); if(playing||wanted) play(); }
  audio.addEventListener('ended', function(){ step(1); });
  return {
    init:function(){ load();
      var f=function(sel,fn){ var b=document.querySelectorAll(sel); for(var i=0;i<b.length;i++) b[i].addEventListener('click',fn); };
      f('.pl-play', function(){ wanted=true; if(playing) pause(); else play(); });
      f('.pl-next', function(){ wanted=true; step(1); });
      f('.pl-prev', function(){ wanted=true; step(-1); }); },
    autostart:function(){ if(playing||wanted) return; wanted=true; play(); },
    onTheme:function(){ load(); if(playing) play(); }
  };
})();

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

/* ══════════ BUILD SYSTEM DOM ══════════ */
var system=$('system');
function buildPlanet(s,si){
  var d=s.r*2, extra='';
  if(s.type==='ringed') extra='<div class="pring" style="--pw:'+(d*1.95)+'px;--ph:'+(d*0.6)+'px"></div>';
  if(s.type==='mooned') extra='<div class="moonwrap" style="--md:'+(d*1.75)+'px"><div class="moon"></div></div>';
  s.gradCel  = 'radial-gradient(circle at 35% 30%,'+shade(s.color,85)+' 0 24%,'+s.color+' 24.5% 62%,'+shade(s.color,-75)+' 62.5% 100%)';
  s.gradReal = 'radial-gradient(circle at 36% 32%,'+shade(s.color,70)+','+s.color+' 58%,'+shade(s.color,-80)+' 100%)';
  var el=document.createElement('div');
  el.className='planet'; el.dataset.id=s.id; el.style.setProperty('--pc',s.color);
  el.innerHTML='<div class="ring"></div><div class="shield"></div><div class="pwrap">'+extra+
    '<div class="orb '+s.type+'" style="width:'+d+'px;height:'+d+'px"></div></div>'+
    '<div class="tag"><div class="n">'+s.name+'</div><div class="d">'+s.tag+'</div></div>'+
    '<div class="dock">▶ dock &amp; enter</div>';
  if(!fine) el.addEventListener('click', function(){ if(state==='free') beginLanding(s); });
  s.el=el; s.orb=el.querySelector('.orb'); s.a=s.a0; s.num='0'+(si+2);
  system.appendChild(el);
  var ring=document.createElement('div'); ring.className='sun-orbit'; s.oring=ring;
  system.insertBefore(ring, system.firstChild);
}
STATIONS.forEach(buildPlanet);
function sizeOrbits(){ STATIONS.forEach(function(s){
  s.oring.style.width=(s.orbit*unit*2)+'px'; s.oring.style.height=(s.orbit*unit*2*0.62)+'px'; }); }
function paintPlanets(){ STATIONS.forEach(function(s){ s.orb.style.background = themeId==='sword'? s.gradCel : s.gradReal; }); }
sizeOrbits(); paintPlanets();

/* the hidden sixth world */
var RONIN={ id:'ronin', name:'???', tag:'uncharted', color:'#d8b56a', r:15, type:'cratered',
  orbit:0.95, speed:0.013, a0:Math.random()*6.28, env:'desert', envlab:'THE DUNES',
  eyebrow:'STATION ∅ · UNCHARTED', title:'The lone road.',
  body:['A world that was not on the charts. Someone walks the ridge out there — sword on his back, headband in the wind, going his own way at his own pace.','Number one is a direction, not a rank.'],
  tags:['uncharted','the long walk','#1'] };
function unlockRonin(silent){
  if(RONIN.el) return;
  Progress.d.ronin=1; Progress.save();
  STATIONS.push(RONIN); buildPlanet(RONIN, STATIONS.length-1);
  RONIN.num='∅';
  RONIN.oring.style.width=(RONIN.orbit*unit*2)+'px'; RONIN.oring.style.height=(RONIN.orbit*unit*2*0.62)+'px';
  RONIN.orb.style.background = themeId==='sword'? RONIN.gradCel : RONIN.gradReal;
  ALL.push(RONIN);
  if(!silent){ banner('◈ ANOMALY','UNCHARTED WORLD DETECTED','A sixth world just appeared on the far orbit.');
    Progress.award('ronin_found','OFF THE CHARTS','You made the far orbit appear.'); Sound.warp(); }
}
/* the sun is the Mission */
SUN_STATION.el=$('sun');
function sunMetrics(){ SUN_STATION.x=CX; SUN_STATION.y=CY; SUN_STATION.r=$('sun').offsetWidth/2||60; }
sunMetrics();
var ALL=[SUN_STATION].concat(STATIONS);
$('sun').addEventListener('click', function(){ if(state!=='free') return;
  if(fine&&lockStation===SUN_STATION) beginLanding(SUN_STATION);
  else if(fine) beginLanding(SUN_STATION);
  else beginLanding(SUN_STATION); });

/* nav strip — the fast way to travel */
(function(){
  var nav=$('stnav');
  ALL.forEach(function(s){
    var a=document.createElement('a');
    a.textContent=s.name; a.dataset.id=s.id;
    a.addEventListener('click', function(){ if(state==='free') beginWarp(s); });
    a.addEventListener('mouseenter', function(){ if(s.el) s.el.classList.add('live'); });
    a.addEventListener('mouseleave', function(){ if(s.el&&lockId!==s.id) s.el.classList.remove('live'); });
    nav.appendChild(a);
  });
})();
function navHere(id){
  var links=$('stnav').querySelectorAll('a');
  for(var i=0;i<links.length;i++) links[i].classList.toggle('here', links[i].dataset.id===id);
}

/* ══════════ CANVASES ══════════ */
var sc=$('stars'), sctx=sc.getContext('2d');
var fx=$('fx'), fctx=fx.getContext('2d');
function sizeCanvases(){
  [sc,fx].forEach(function(c){ c.width=W*devicePixelRatio; c.height=H*devicePixelRatio; });
  sctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  fctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
sizeCanvases();
var stars=[],shootStars=[];
function initStars(){ stars=[]; var n=Math.round(W*H/T().starDensity);
  for(var i=0;i<n;i++) stars.push({x:Math.random()*W,y:Math.random()*H,z:Math.random()*0.8+0.2,r:Math.random()*1.3+0.2,tw:Math.random()*6.28}); }
initStars();

/* ══════════ STATE ══════════ */
var state='free';           // free | landing | landed | warp | station
var mx=CX,my=CY, plx=0,ply=0;
var rx=CX,ry=CY,ra=-Math.PI/2, prevRx=CX,prevRy=CY, shipSpeed=0;
var lockId=null, lockStation=null;
var bounty=0;
var projectiles=[],asteroids=[],particles=[],floats=[],warpStreaks=[];
var weapon='cannon', lastShot=0;
var landTarget=null, landedAt=0;
var saucer=null, nextSaucerAt=25+Math.random()*35, gameT=0;
var warpOrigin=null, warpT=0, activeStation=null;

/* ══════════ INPUT ══════════ */
addEventListener('pointermove', function(e){ mx=e.clientX; my=e.clientY; });
addEventListener('pointerdown', function(e){
  Sound.unlock(); Music.autostart();
  if(e.target.closest('.hud')||e.target.closest('.panel')||e.target.closest('#boot')||e.target.closest('#fireb')) return;
  if(!fine){ mx=e.clientX; my=e.clientY; return; }   // touch: tap/drag = fly there; FIRE button shoots
  if(state!=='free') return;
  if(lockStation){ beginLanding(lockStation); }
  else fire();
});
var typedBuf='', rollT=0;
addEventListener('keydown', function(e){
  if(e.key===' '&&state==='free'&&fine){ e.preventDefault(); fire(); }
  if(e.key==='Escape') closeStation();
  if(e.key&&e.key.length===1&&/[a-z!]/i.test(e.key)){
    typedBuf=(typedBuf+e.key.toLowerCase()).slice(-8);
    if(themeId==='sword'&&/tank!?$/.test(typedBuf)&&typedBuf.slice(-1)==='!'){
      typedBuf='';
      $('tc-s').textContent='SESSION ∞'; $('tc-n').textContent='TANK!';
      var tc=$('titlecard'); tc.classList.add('on');
      setTimeout(function(){ tc.classList.remove('on'); },1500);
      Sound.blip(392); Sound.blip(523); setTimeout(function(){Sound.blip(659);Sound.blip(784);},120);
      Progress.award('tank','3… 2… 1… LET\'S JAM','You know the words.');
    }
  }
  if((e.key==='r'||e.key==='R')&&themeId==='roci'&&state==='free'&&rollT<=0){
    rollT=1; Sound.warp();
    Progress.award('roll','DO A BARREL ROLL','Peppy would be proud.');
  }
});

/* ══════════ WEAPONS ══════════ */
function setWeapon(w){ weapon=w;
  $('w-cannon').classList.toggle('on',w==='cannon');
  $('w-pdc').classList.toggle('on',w==='pdc');
  Sound.blip(w==='cannon'?600:980); }
$('w-cannon').addEventListener('click',function(){ setWeapon('cannon'); });
$('w-pdc').addEventListener('click',function(){ setWeapon('pdc'); });

function noseDir(){ return { x:Math.sin(ra), y:-Math.cos(ra) }; }
function aimDir(){
  // aim at the cursor; if the ship has caught up to it, fire along the nose
  var dx=mx-rx, dy=my-ry, m=Math.hypot(dx,dy);
  if(m<30) return noseDir();
  return { x:dx/m, y:dy/m };
}
function spawnProj(kind,delay){
  setTimeout(function(){
    if(state!=='free') return;
    var d=aimDir(), sp = kind==='cannon'?760:980;
    projectiles.push({ x:rx+d.x*24, y:ry+d.y*24, vx:d.x*sp, vy:d.y*sp, life:1.6, kind:kind });
    if(kind==='cannon') Sound.pew(); else Sound.tick();
  }, delay||0);
}
function fire(){
  var now=performance.now();
  if(weapon==='cannon'){ if(now-lastShot<260) return; lastShot=now; spawnProj('cannon',0); }
  else { if(now-lastShot<430) return; lastShot=now; spawnProj('pdc',0); spawnProj('pdc',75); spawnProj('pdc',150); }
}

/* ══════════ ASTEROIDS ══════════ */
function rockVerts(n,r){ var v=[]; for(var i=0;i<n;i++){ v.push(r*(0.72+Math.random()*0.5)); } return v; }
function spawnAsteroid(tier,x,y,gold){
  var ms = Math.min(W,H)<720? 0.6 : 1;   // phones: keep rocks proportional
  var r = ms*(tier===3? 15+Math.random()*8 : tier===2? 10+Math.random()*5 : 6+Math.random()*3);
  var edge=Math.floor(Math.random()*4), px,py;
  if(x===undefined){
    px = edge===0? -60 : edge===1? W+60 : Math.random()*W;
    py = edge===2? -60 : edge===3? H+60 : Math.random()*H;
  } else { px=x; py=y; }
  var ang=Math.atan2(CY-py,CX-px)+(Math.random()-0.5)*1.6;
  var sp=14+Math.random()*38+(3-tier)*10;
  asteroids.push({ x:px,y:py, vx:Math.cos(ang)*sp*(gold?0.8:1), vy:Math.sin(ang)*sp*(gold?0.8:1),
    r:gold?r*1.25:r, tier:tier, gold:!!gold, rot:Math.random()*6.28, vr:(Math.random()-0.5)*1.4,
    verts:rockVerts(9+Math.floor(Math.random()*4),gold?r*1.25:r) });
}
function burst(x,y,col,n,sp){
  for(var i=0;i<n;i++){ var a=Math.random()*6.28, v=(0.3+Math.random()*0.7)*(sp||160);
    particles.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:0.5+Math.random()*0.5,r:1+Math.random()*2.6,col:col}); }
}
function killAsteroid(i){
  var a=asteroids[i]; asteroids.splice(i,1);
  var reward = a.gold?1000 : a.tier===3?500 : a.tier===2?300 : 150;
  bounty += reward;
  $('bounty').textContent='₩ '+bounty.toLocaleString();
  floats.push({x:a.x,y:a.y,txt:'+₩'+reward.toLocaleString(),life:1});
  burst(a.x,a.y,a.gold?'#ffd36a':T().accent,a.gold?26:a.tier*6,a.gold?260:180);
  Sound.boom(a.tier===3||a.gold);
  if(a.gold){ Progress.d.gold++; Progress.save();
    Progress.award('gold','GOLD RUSH','You cracked a golden asteroid.'); factDrop(); }
  else if(a.tier>1){ spawnAsteroid(a.tier-1,a.x+6,a.y); spawnAsteroid(a.tier-1,a.x-6,a.y); }
  Progress.award('first_blood','FIRST BOUNTY','First rock cracked. The Woolongs flow.');
  checkBounty();
}

/* ══════════ LOCK-ON ══════════ */
var tcTimer=null;
function updateLock(){
  if(state!=='free'){ setLock(null); return; }
  var best=null,bd=1e9;
  ALL.forEach(function(s){
    var d=Math.hypot(mx-(s.x+plx),my-(s.y+ply));
    if(d<s.r+52&&d<bd){ bd=d; best=s; }
  });
  setLock(best);
}
function setLock(s){
  var id=s?s.id:null;
  if(id===lockId){ if(s) lockStation=s; positionTgtbox(); return; }
  lockId=id; lockStation=s;
  ALL.forEach(function(st){ st.el.classList.toggle('live', !!s&&st.id===s.id); });
  $('target').textContent = s? s.name.toUpperCase()+' · LOCKED' : '— DRIFTING —';
  var tb=$('tgtbox');
  if(s){
    Sound.blip(760);
    if(themeId==='sword'){ // anime title-card cut-in
      $('tc-s').textContent='SESSION '+s.num; $('tc-n').textContent=s.name;
      var tc=$('titlecard'); tc.classList.add('on');
      clearTimeout(tcTimer); tcTimer=setTimeout(function(){ tc.classList.remove('on'); },950);
    } else { tb.classList.add('on'); $('tgtlab').textContent=s.name.toUpperCase()+' · LOCKED'; }
  } else { tb.classList.remove('on'); $('titlecard').classList.remove('on'); }
  positionTgtbox();
}
function positionTgtbox(){
  if(themeId!=='roci'||!lockStation) return;
  var s=lockStation, sz=s.r*2+34, tb=$('tgtbox');
  tb.style.left=(s.x+plx-sz/2)+'px'; tb.style.top=(s.y+ply-sz/2)+'px';
  tb.style.width=sz+'px'; tb.style.height=sz+'px';
}

/* ══════════ LANDING ══════════ */
var landStart=null, landT=0;
function beginLanding(s){
  state='landing'; landTarget=s; landStart={x:rx,y:ry}; landT=0; setLock(null);
  $('c-stat').textContent='● DOCKING'; $('target').textContent=s.name.toUpperCase()+' · DOCKING';
}
function touchdown(){
  state='landed'; landedAt=performance.now();
  var s=landTarget;
  burst(rx,ry+10,'#cfc8ba',10,90);
  Sound.thump();
  setTimeout(function(){ beginWarp(s); },430);
}
/* ══════════ WARP ══════════ */
function beginWarp(s){
  state='warp'; warpT=0; activeStation=s;
  warpOrigin={ x:s.x+plx, y:s.y+ply };
  warpStreaks=[];
  var n=reduce?60:170;
  for(var i=0;i<n;i++) warpStreaks.push({ a:Math.random()*6.28, d:6+Math.random()*70, sp:220+Math.random()*520 });
  Sound.warp();
  system.classList.add('warp');
  $('c-stat').textContent='● WARP';
  setTimeout(function(){ openStation(s); }, reduce?350:920);
}
/* ══════════ STATION PANEL + ENVIRONMENTS ══════════ */
var panel=$('panel'), envc=$('envc'), ectx=envc.getContext('2d'), envScene=null, envRAF=null;
function openStation(s){
  fillCard(s);
  if(location.hash.slice(1)!==s.id) history.replaceState(null,'','#'+s.id);
  envScene=makeEnv(s.env);
  sizeEnv();
  panel.classList.add('open');
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
  history.replaceState(null,'',location.pathname);
  cancelAnimationFrame(envRAF); envScene=null;
  $('loc').textContent='SYSTEM MAP'; navHere(null);
  setTimeout(function(){ system.classList.remove('warp'); state='free'; $('c-stat').textContent='● ONLINE'; },260);
}
$('close').addEventListener('click', closeStation);
panel.addEventListener('click', function(e){ if(e.target===panel||e.target===envc) closeStation(); });
function sizeEnv(){ envc.width=envc.clientWidth*devicePixelRatio; envc.height=envc.clientHeight*devicePixelRatio;
  ectx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
var SECTIONS={
  mission:[
    {k:'Why “Aaronautics”', body:['Aaron + aeronautics — the aerospace degree that started it, bent into a name. The site is a machine you operate, because a list of jobs could never hold the whole picture.']},
    {k:'Now', body:['Building automations by day, building this world by night. Raising a family in the Bronx. Writing the map for people who were never handed one.'], soon:true}
  ],
  alphaforge:[
    {k:'Builds 001–009', body:['Nine go-to-market builds from the Clay-led cohort. Each one gets a manifest line: problem → what got built → the number that moved.'], soon:true},
    {k:'Numbers', body:['The tangible results, straight up.'], soon:true}
  ],
  life:[
    {k:'Reading', body:['What’s on the stack right now.'], soon:true},
    {k:'Watching', body:['Anime and films in rotation.'], soon:true},
    {k:'Listening', body:['The current rotation — hip-hop first.'], soon:true},
    {k:'Eating', body:['Bronx spots and home plates worth talking about.'], soon:true}
  ],
  craft:[
    {k:'Poems', body:['Words with no ROI attached.'], soon:true},
    {k:'Drawings', body:['Lines on paper.'], soon:true},
    {k:'Physics', body:['The universe, for the love of it.'], soon:true}
  ],
  notes:[
    {k:'Fatherhood', body:['On becoming and being a dad.'], soon:true},
    {k:'The Bronx', body:['Where the signal comes from.'], soon:true},
    {k:'The Build', body:['Renovating a home with our own hands.'], soon:true},
    {k:'GTM for us', body:['Explaining go-to-market to a community that was never handed the map.'], soon:true}
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
function selectSec(sec,a){
  var links=$('secs').querySelectorAll('a');
  for(var i=0;i<links.length;i++) links[i].classList.toggle('on', links[i]===a);
  var b=(sec.body||[]).map(function(p){return '<p>'+p+'</p>';}).join('');
  if(sec.tags) b+='<div class="list">'+sec.tags.map(function(t){return '<span>'+t+'</span>';}).join('')+'</div>';
  if(sec.soon) b+='<div class="soon">◇ content in progress — real material lands here next</div>';
  $('p-body').innerHTML=b;
}
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

/* ══════════ MAIN LOOP ══════════ */
var last=0;
function loop(t){
  var dt=Math.min(0.05,(t-last)/1000)||0.016; last=t;

  /* parallax */
  plx += ((mx-CX)*-0.018-plx)*0.06; ply += ((my-CY)*-0.018-ply)*0.06;
  if(state!=='warp'&&state!=='station') system.style.transform='translate('+plx.toFixed(1)+'px,'+ply.toFixed(1)+'px)';

  /* planets */
  STATIONS.forEach(function(s){
    if(!reduce) s.a += s.speed*dt*Math.PI;
    s.x=CX+Math.cos(s.a)*s.orbit*unit; s.y=CY+Math.sin(s.a)*s.orbit*unit*0.62;
    s.el.style.left=s.x+'px'; s.el.style.top=s.y+'px'; s.el.style.zIndex=String(100+Math.round(s.y));
  });

  /* ship — desktop cursor-follow AND mobile touch flight */
  var rocket=$('rocket');
  {
    if(state==='free'){ rx+=(mx-rx)*0.16; ry+=(my-ry)*0.16;
      var dx=mx-rx,dy=my-ry,dd=Math.hypot(dx,dy);
      if(dd>0.5) ra+=(Math.atan2(dy,dx)+Math.PI/2-ra)*0.22;
    } else if(state==='landing'&&landTarget){
      landT+=dt;
      var p=Math.min(1,landT/0.85), ease=1-Math.pow(1-p,3);
      var s=landTarget, tx=s.x+plx, ty=s.y+ply-(s.r+15);
      rx=landStart.x+(tx-landStart.x)*ease; ry=landStart.y+(ty-landStart.y)*ease;
      ra*=(1-ease);
      if(p>=1) touchdown();
    } else if(state==='landed'&&landTarget){
      rx=landTarget.x+plx; ry=landTarget.y+ply-(landTarget.r+15); ra=0;
    }
    if(rollT>0) rollT=Math.max(0,rollT-dt/0.7);
    var rollOff=(1-rollT)*Math.PI*2*(rollT>0?1:0);
    rocket.style.transform='translate('+rx+'px,'+ry+'px) rotate('+(ra+(rollT>0?rollOff:0))+'rad)';
    rocket.style.opacity = (state==='warp'||state==='station'||state==='hangar')?'0':'1';
    var fl=rocket.querySelectorAll('.flame'), fscale= state==='free'? Math.min(1,Math.hypot(mx-rx,my-ry)/55) : 0.15;
    for(var i=0;i<fl.length;i++){ fl[i].style.opacity=(0.5+Math.random()*0.5*Math.max(0.25,fscale)).toFixed(2); }
    shipSpeed = Math.hypot(rx-prevRx,ry-prevRy)/Math.max(dt,0.001); prevRx=rx; prevRy=ry;
    /* console data */
    $('coords').textContent=(((rx-plx-CX)/unit>=0?'+':'')+((rx-plx-CX)/unit).toFixed(2))+' / '+
      (((-(ry-ply-CY))/unit>=0?'+':'')+((-(ry-ply-CY))/unit).toFixed(2));
    $('vel').textContent=(shipSpeed/unit).toFixed(2)+' AU/s';
  }
  updateLock(); positionTgtbox();

  /* stars */
  sctx.clearRect(0,0,W,H);
  var ox=plx*1.6,oy=ply*1.6;
  for(i=0;i<stars.length;i++){ var st=stars[i],a=0.5+0.5*Math.sin(t*0.002*st.z+st.tw);
    sctx.globalAlpha=0.22+a*0.6*st.z; sctx.fillStyle= st.z>0.7?T().star:'#b9c2d6';
    sctx.beginPath(); sctx.arc(st.x+ox*st.z,st.y+oy*st.z,st.r,0,7); sctx.fill(); }
  sctx.globalAlpha=1;
  if(!reduce&&Math.random()<0.006) shootStars.push({x:Math.random()*W,y:Math.random()*H*0.4,vx:6+Math.random()*5,vy:2+Math.random()*2,life:1});
  for(i=shootStars.length-1;i>=0;i--){ var m=shootStars[i]; m.x+=m.vx;m.y+=m.vy;m.life-=0.018;
    sctx.globalAlpha=Math.max(0,m.life); sctx.strokeStyle='#eef4ff'; sctx.lineWidth=1.4;
    sctx.beginPath(); sctx.moveTo(m.x,m.y); sctx.lineTo(m.x-m.vx*4,m.y-m.vy*4); sctx.stroke();
    if(m.life<=0) shootStars.splice(i,1); }
  sctx.globalAlpha=1;

  /* ══ fx layer ══ */
  fctx.clearRect(0,0,W,H);

  /* speed lines (anime, fast flight) */
  if(themeId==='sword'&&fine&&state==='free'&&shipSpeed>620&&!reduce){
    var sl=Math.min(1,(shipSpeed-620)/900);
    fctx.globalAlpha=0.28*sl; fctx.strokeStyle='#efece6'; fctx.lineWidth=1.6;
    for(i=0;i<10;i++){ var ang=ra-Math.PI/2+Math.PI+(Math.random()-0.5)*0.9;
      var ddd=90+Math.random()*Math.min(W,H)*0.42;
      fctx.beginPath(); fctx.moveTo(rx+Math.cos(ang)*ddd, ry+Math.sin(ang)*ddd);
      fctx.lineTo(rx+Math.cos(ang)*(ddd+40+120*sl), ry+Math.sin(ang)*(ddd+40+120*sl)); fctx.stroke(); }
    fctx.globalAlpha=1;
  }

  if(state==='free'||state==='landing'||state==='landed'){
    /* the saucer — rare, wobbly, extremely shootable */
    gameT+=dt;
    if(!saucer&&gameT>nextSaucerAt){
      var fromLeft=Math.random()<0.5;
      saucer={ x:fromLeft?-70:W+70, vx:(fromLeft?1:-1)*(52+Math.random()*30),
               y:H*(0.18+Math.random()*0.5), ph:Math.random()*6.28 };
      banner('◈ UNIDENTIFIED CONTACT','BOGEY ON SCOPE','Shoot it down for a reward.');
    }
    if(saucer){
      saucer.x+=saucer.vx*dt;
      var sy3=saucer.y+Math.sin(gameT*2.2+saucer.ph)*14;
      if(saucer.x<-90||saucer.x>W+90){ saucer=null; nextSaucerAt=gameT+40+Math.random()*50; }
      else {
        fctx.save(); fctx.translate(saucer.x,sy3); fctx.rotate(Math.sin(gameT*3)*0.06);
        fctx.fillStyle= themeId==='sword'? '#7a8290':'#5a6270';
        fctx.beginPath(); fctx.ellipse(0,0,26,8.5,0,0,7); fctx.fill();
        if(themeId==='sword'){ fctx.strokeStyle='#14181f'; fctx.lineWidth=2.2; fctx.stroke(); }
        fctx.globalAlpha=0.85; fctx.fillStyle='#9be2ff';
        fctx.beginPath(); fctx.arc(0,-6,9,Math.PI,0); fctx.fill(); fctx.globalAlpha=1;
        fctx.fillStyle='#1c2027'; fctx.beginPath(); fctx.arc(0,-6,3.4,Math.PI,0); fctx.fill();
        for(var li=0;li<3;li++){ fctx.globalAlpha= (((gameT*4)|0)%3===li)?1:0.25;
          fctx.fillStyle=['#ff2d78','#ffd36a','#7cff9b'][li];
          fctx.beginPath(); fctx.arc(-12+li*12,3,2.2,0,7); fctx.fill(); }
        fctx.globalAlpha=1; fctx.restore();
      }
    }
    /* asteroids */
    while(asteroids.length< (fine?6:4)) spawnAsteroid(3);
    for(i=asteroids.length-1;i>=0;i--){ var A=asteroids[i];
      A.x+=A.vx*dt; A.y+=A.vy*dt; A.rot+=A.vr*dt;
      if(A.x<-110||A.x>W+110||A.y<-110||A.y>H+110){ asteroids.splice(i,1); continue; }
      fctx.save(); fctx.translate(A.x,A.y); fctx.rotate(A.rot);
      fctx.beginPath();
      for(var k=0;k<A.verts.length;k++){ var aa=k/A.verts.length*6.283;
        var px2=Math.cos(aa)*A.verts[k], py2=Math.sin(aa)*A.verts[k];
        k? fctx.lineTo(px2,py2) : fctx.moveTo(px2,py2); }
      fctx.closePath();
      if(A.gold){ var gp=0.6+0.4*Math.sin(t*0.006);
        fctx.shadowColor='#ffd36a'; fctx.shadowBlur=18*gp;
        fctx.fillStyle='#e8b84a'; fctx.fill();
        fctx.lineWidth=2.4; fctx.strokeStyle='#8a6216'; fctx.stroke();
        fctx.shadowBlur=0;
        fctx.globalAlpha=0.5*gp; fctx.fillStyle='#fff1c0';
        fctx.beginPath(); fctx.arc(-A.r*0.25,-A.r*0.25,A.r*0.4,0,7); fctx.fill(); fctx.globalAlpha=1; }
      else if(themeId==='sword'){ fctx.fillStyle=T().rockFill; fctx.fill();
        fctx.lineWidth=2.4; fctx.strokeStyle=T().rockLine; fctx.stroke();
        fctx.globalAlpha=0.25; fctx.fillStyle='#000';
        fctx.beginPath(); fctx.arc(A.r*0.28,A.r*0.3,A.r*0.55,0,7); fctx.fill(); fctx.globalAlpha=1; }
      else { var rg=fctx.createRadialGradient(-A.r*0.4,-A.r*0.4,A.r*0.15,0,0,A.r*1.15);
        rg.addColorStop(0,'#aeb6c2'); rg.addColorStop(0.55,'#59616e'); rg.addColorStop(1,'#20242c');
        fctx.fillStyle=rg; fctx.fill(); fctx.lineWidth=1; fctx.strokeStyle='rgba(255,255,255,.12)'; fctx.stroke(); }
      fctx.restore();
    }
    /* projectiles */
    for(i=projectiles.length-1;i>=0;i--){ var P=projectiles[i];
      P.x+=P.vx*dt; P.y+=P.vy*dt; P.life-=dt;
      var dead = P.life<=0||P.x<-40||P.x>W+40||P.y<-40||P.y>H+40;
      /* planet shields */
      if(!dead) for(k=0;k<STATIONS.length;k++){ var S=STATIONS[k];
        if(Math.hypot(P.x-(S.x+plx),P.y-(S.y+ply))<S.r+9){
          S.el.classList.remove('shielded'); void S.el.offsetWidth; S.el.classList.add('shielded');
          burst(P.x,P.y,'#9be2ff',6,90); Sound.shieldHit(); dead=true;
          $('target').textContent=S.name.toUpperCase()+' · SHIELDED'; break; } }
      /* sun */
      if(!dead&&Math.hypot(P.x-(CX+plx),P.y-(CY+ply))<Math.min(W,H)*0.052){ burst(P.x,P.y,'#ffd36a',5,70); dead=true; }
      /* the saucer */
      if(!dead&&saucer&&Math.hypot(P.x-saucer.x,P.y-(saucer.y+Math.sin(gameT*2.2+saucer.ph)*14))<27){
        burst(saucer.x,saucer.y,'#9be2ff',30,300); burst(saucer.x,saucer.y,'#ffd36a',16,200);
        bounty+=1500; $('bounty').textContent='₩ '+bounty.toLocaleString();
        floats.push({x:saucer.x,y:saucer.y,txt:'+₩1,500',life:1});
        Sound.boom(true);
        Progress.d.saucers++; Progress.save();
        Progress.award('saucer','SAUCER DOWN','Unidentified? Not anymore.');
        factDrop(); checkBounty();
        saucer=null; nextSaucerAt=gameT+40+Math.random()*50; dead=true; }
      /* asteroids */
      if(!dead) for(k=asteroids.length-1;k>=0;k--){ if(Math.hypot(P.x-asteroids[k].x,P.y-asteroids[k].y)<asteroids[k].r){
          killAsteroid(k); dead=true; break; } }
      if(dead){ projectiles.splice(i,1); continue; }
      var ang2=Math.atan2(P.vy,P.vx);
      fctx.save(); fctx.translate(P.x,P.y); fctx.rotate(ang2);
      fctx.shadowColor=T().bolt; fctx.shadowBlur=8;
      fctx.strokeStyle=T().bolt; fctx.lineWidth=P.kind==='cannon'?3.4:1.8;
      fctx.beginPath(); fctx.moveTo(P.kind==='cannon'?-13:-7,0); fctx.lineTo(0,0); fctx.stroke();
      fctx.restore();
    }
  }
  /* particles + floats */
  for(i=particles.length-1;i>=0;i--){ var p2=particles[i];
    p2.x+=p2.vx*dt; p2.y+=p2.vy*dt; p2.vx*=0.985; p2.vy*=0.985; p2.life-=dt;
    if(p2.life<=0){ particles.splice(i,1); continue; }
    fctx.globalAlpha=Math.max(0,p2.life)*1.4>1?1:Math.max(0,p2.life)*1.4;
    fctx.fillStyle=p2.col; fctx.beginPath(); fctx.arc(p2.x,p2.y,p2.r,0,7); fctx.fill(); }
  fctx.globalAlpha=1;
  for(i=floats.length-1;i>=0;i--){ var F=floats[i]; F.y-=34*dt; F.life-=dt*0.9;
    if(F.life<=0){ floats.splice(i,1); continue; }
    fctx.globalAlpha=Math.max(0,F.life); fctx.font='700 13px "Space Mono",monospace';
    fctx.fillStyle=T().accent2; fctx.fillText(F.txt,F.x+10,F.y); }
  fctx.globalAlpha=1;

  /* warp streaks */
  if(state==='warp'&&warpOrigin){
    warpT+=dt;
    var o=warpOrigin, prog=Math.min(1,warpT/0.95);
    for(i=0;i<warpStreaks.length;i++){ var ws=warpStreaks[i];
      ws.d += ws.sp*dt*(1+prog*5.5);
      var len=18+ws.d*0.4;
      var x1=o.x+Math.cos(ws.a)*ws.d, y1=o.y+Math.sin(ws.a)*ws.d;
      var x2=o.x+Math.cos(ws.a)*(ws.d+len), y2=o.y+Math.sin(ws.a)*(ws.d+len);
      fctx.globalAlpha=Math.min(1,0.15+prog);
      fctx.strokeStyle= i%3? '#ffffff' : T().accent;
      fctx.lineWidth= i%4? 1.4:2.4;
      fctx.beginPath(); fctx.moveTo(x1,y1); fctx.lineTo(x2,y2); fctx.stroke(); }
    fctx.globalAlpha=Math.pow(prog,3)*0.9;
    fctx.fillStyle='#eef4ff'; fctx.fillRect(0,0,W,H);
    fctx.globalAlpha=1;
  }

  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

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
/* touch: FIRE button + hint copy + start minimized on small screens */
$('fireb').addEventListener('pointerdown', function(e){ e.preventDefault(); Sound.unlock(); Music.autostart(); if(state==='free') fire(); });
if(!fine){
  $('hint').innerHTML='◐ <b>Drag to fly</b> · FIRE shoots · tap a planet to dock · <a href="../">Walkman ↗</a>';
}
if(!fine||innerWidth<720){ $('console').classList.add('min'); $('player').classList.add('min'); }

/* ══════════ RESIZE / BOOT / DEEP LINK ══════════ */
addEventListener('resize', function(){ metrics(); sizeCanvases(); sizeOrbits(); sunMetrics(); initStars(); if(envScene) sizeEnv(); });
var boot=$('boot');
setTimeout(function(){ boot.classList.add('gone'); },1900);
boot.addEventListener('click', function(){ boot.classList.add('gone'); });
addEventListener('load', function(){
  Music.init();
  var hsh=location.hash.slice(1), s=ALL.filter(function(x){return x.id===hsh;})[0];
  if(s) setTimeout(function(){ system.classList.add('warp'); openStation(s); }, 600);
});
applyTheme('sword');
if(Progress.d.ronin) unlockRonin(true);

/* headless test hook */
window.__orbit = {
  state:function(){ return { state:state, theme:themeId, weapon:weapon, asteroids:asteroids.length,
    projectiles:projectiles.length, bounty:bounty, lock:lockId, stations:STATIONS.map(function(s){return {id:s.id,x:s.x+plx,y:s.y+ply,r:s.r};}) }; },
  fire:fire, land:function(id){ var s=ALL.filter(function(x){return x.id===id;})[0]; if(s) beginLanding(s); }
};
})();
