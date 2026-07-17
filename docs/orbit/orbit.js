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
  var w=innerWidth,h=innerHeight,R=Math.random,cel=(themeId==='sword'),i;
  function skyFill(c,w,h,stops){
    if(cel){ for(var k=0;k<stops.length;k++){ var y0=h*stops[k][1], y1=k<stops.length-1? h*stops[k+1][1] : h;
        c.fillStyle=stops[k][0]; c.fillRect(0,y0-1,w,y1-y0+2); } }
    else { var g=c.createLinearGradient(0,0,0,h);
      stops.forEach(function(sp){ g.addColorStop(Math.min(1,sp[1]),sp[0]); });
      c.fillStyle=g; c.fillRect(0,0,w,h); }
  }
  function dust(c,n,maxY,col){ c.globalAlpha=.55; c.fillStyle=col||'#dfe9ff';
    for(var k=0;k<n;k++) c.fillRect((k*113)%w,(k*59)%maxY,1.2,1.2); c.globalAlpha=1; }

  /* ── MISSION · hero over the city ── */
  if(kind==='hero'){
    var b1=[],b2=[]; for(i=0;i<Math.ceil(w/46)+2;i++) b1.push({x:i*46,wd:26+R()*18,ht:40+R()*110});
    for(i=0;i<Math.ceil(w/30)+2;i++) b2.push({x:i*30,wd:18+R()*12,ht:20+R()*70});
    var lit=[]; for(i=0;i<70;i++) lit.push({x:R()*w,y:R()*0.16,ph:R()*6.28});
    return { paint:function(c,w,h,t){
      skyFill(c,w,h,[['#1a1030',0],['#3d1d4a',0.42],['#8a3a3c',0.68],['#d97742',0.85],['#1c0f14',0.96]]);
      var halo=c.createRadialGradient(w*0.5,h*0.72,10,w*0.5,h*0.72,w*0.42);
      halo.addColorStop(0,'rgba(255,190,110,.5)'); halo.addColorStop(1,'transparent');
      c.fillStyle=halo; c.fillRect(0,0,w,h);
      for(i=0;i<4;i++){ c.globalAlpha=0.10; c.fillStyle='#f8d9b0';
        var cy=h*(0.3+i*0.09), off=((t*(6+i*3))%(w+400))-200;
        c.beginPath(); c.ellipse(off,cy,150+i*40,10+i*3,0,0,7); c.fill(); }
      c.globalAlpha=1;
      var fx2=w*0.18, fy=h*0.22+Math.sin(t*0.7)*6, S=Math.min(w,h)/560;
      c.fillStyle='#0d0a10';
      c.beginPath(); c.arc(fx2,fy,7*S,0,7); c.fill();
      c.beginPath(); c.moveTo(fx2-6*S,fy+6*S); c.lineTo(fx2+6*S,fy+6*S);
      c.lineTo(fx2+4*S,fy+42*S); c.lineTo(fx2+1*S,fy+42*S); c.lineTo(fx2,fy+30*S);
      c.lineTo(fx2-1*S,fy+42*S); c.lineTo(fx2-4*S,fy+42*S); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(fx2-6*S,fy+8*S); c.lineTo(fx2-16*S,fy+22*S); c.lineTo(fx2-13*S,fy+24*S); c.lineTo(fx2-5*S,fy+14*S); c.fill();
      c.beginPath(); c.moveTo(fx2+6*S,fy+8*S); c.lineTo(fx2+16*S,fy+22*S); c.lineTo(fx2+13*S,fy+24*S); c.lineTo(fx2+5*S,fy+14*S); c.fill();
      c.beginPath(); c.moveTo(fx2-7*S,fy+7*S);
      var k; for(k=0;k<=6;k++){ c.lineTo(fx2-7*S-k*6*S, fy+7*S+k*9*S+Math.sin(t*3+k)*4*S); }
      for(k=6;k>=0;k--){ c.lineTo(fx2-7*S-k*6*S+10*S, fy+10*S+k*10*S+Math.sin(t*3+k+1)*4*S); }
      c.closePath(); c.fill();
      c.fillStyle='#120b16'; b2.forEach(function(b){ c.fillRect(b.x,h-b.ht-h*0.06,b.wd,b.ht+h*0.06); });
      c.fillStyle='#0a060d'; b1.forEach(function(b){ c.fillRect(b.x,h-b.ht,b.wd,b.ht);
        if(cel){ c.strokeStyle='#1c1220'; c.lineWidth=2; c.strokeRect(b.x,h-b.ht,b.wd,b.ht); } });
      lit.forEach(function(L){ if(Math.sin(t*0.9+L.ph)>-0.2){ c.globalAlpha=0.75; c.fillStyle='#ffd9a0';
        c.fillRect(L.x, h-8-L.y*260, 1.6,1.6); } });
      c.globalAlpha=1; } };
  }

  /* ── ALPHAFORGE · neon grid city (drift-by coupe cameo) ── */
  if(kind==='city'){
    var rows=[[],[]];
    for(i=0;i<Math.ceil(w/54)+2;i++) rows[0].push({x:i*54-20,wd:34+R()*16,ht:90+R()*180});
    for(i=0;i<Math.ceil(w/38)+2;i++) rows[1].push({x:i*38-10,wd:24+R()*12,ht:50+R()*110});
    var NC=['#ff2d78','#74d0ff','#9affea','#ffd36a','#c9a8ff'], neon=[];
    for(i=0;i<16;i++) neon.push({x:R()*w,y:h*0.5+R()*h*0.3,wd:20+R()*46,ht:5+R()*10,col:NC[i%NC.length],ph:R()*6.28});
    var rain=[]; for(i=0;i<70;i++) rain.push({x:R()*w,y:R()*h,sp:340+R()*300});
    return { paint:function(c,w,h,t){
      skyFill(c,w,h,[['#070812',0],['#141334',0.45],['#3a1d55',0.72],['#0c0a18',0.86],['#050508',0.94]]);
      dust(c,30,h*0.4,'#c9d6ea');
      var hz=c.createLinearGradient(0,h*0.55,0,h*0.86); hz.addColorStop(0,'transparent'); hz.addColorStop(1,'rgba(120,60,180,.25)');
      c.fillStyle=hz; c.fillRect(0,h*0.55,w,h*0.31);
      c.fillStyle='#0d0c1c'; rows[1].forEach(function(b){ c.fillRect(b.x,h*0.86-b.ht,b.wd,b.ht); });
      rows[0].forEach(function(b){ c.fillStyle='#070610'; c.fillRect(b.x,h*0.9-b.ht,b.wd,b.ht+h*0.1);
        if(cel){ c.strokeStyle='#1a1830'; c.lineWidth=2; c.strokeRect(b.x,h*0.9-b.ht,b.wd,b.ht+h*0.1); }
        c.fillStyle='rgba(255,220,140,.5)';
        for(var yy=h*0.9-b.ht+8; yy<h*0.9-6; yy+=13) for(var xx=b.x+5; xx<b.x+b.wd-4; xx+=10)
          if(((xx*7+yy*13)|0)%5<2) c.fillRect(xx,yy,3.4,4.6); });
      neon.forEach(function(n){ var a=0.55+0.45*Math.sin(t*3+n.ph); if((((t*2+n.ph)|0)%7)===0) a*=0.3;
        c.globalAlpha=a; c.fillStyle=n.col; c.fillRect(n.x,n.y,n.wd,n.ht);
        c.globalAlpha=a*0.3; c.fillRect(n.x-3,n.y-3,n.wd+6,n.ht+6); });
      c.globalAlpha=1;
      c.fillStyle='#03030a'; c.fillRect(0,h*0.9,w,h*0.1);
      var ct=t%11;                                   /* the coupe */
      if(ct<4.4){ var cx2=-170+(ct/4.4)*(w+340), cy2=h*0.935+Math.sin(ct*22)*0.8;
        c.save(); c.translate(cx2,cy2);
        c.fillStyle='#0a0a0e'; c.beginPath();
        c.moveTo(-52,0); c.lineTo(-46,-13); c.lineTo(-20,-15); c.lineTo(-10,-24); c.lineTo(26,-24);
        c.lineTo(38,-14); c.lineTo(52,-11); c.lineTo(52,0); c.closePath(); c.fill();
        if(cel){ c.strokeStyle='#000'; c.lineWidth=2; c.stroke(); }
        c.fillStyle='#e8e6df'; c.fillRect(-10,-24,36,6);
        c.fillStyle='#0a0a0e'; c.beginPath(); c.arc(-30,1,8,0,7); c.fill(); c.beginPath(); c.arc(32,1,8,0,7); c.fill();
        c.globalAlpha=0.7; var hl=c.createLinearGradient(52,-8,170,4);
        hl.addColorStop(0,'rgba(255,240,190,.8)'); hl.addColorStop(1,'transparent');
        c.fillStyle=hl; c.beginPath(); c.moveTo(52,-11); c.lineTo(170,-2); c.lineTo(170,10); c.lineTo(52,-2); c.closePath(); c.fill();
        c.globalAlpha=1; c.restore(); }
      if(!cel){ c.strokeStyle='rgba(160,200,255,.28)'; c.lineWidth=1;
        rain.forEach(function(r2){ r2.y+=r2.sp/60; if(r2.y>h){r2.y=-20;r2.x=R()*w;}
          c.beginPath(); c.moveTo(r2.x,r2.y); c.lineTo(r2.x-2,r2.y-14); c.stroke(); }); }
    } };
  }

  /* ── LIFE · forest canopy (bus-stop cameo) ── */
  if(kind==='forest'){
    var h1=ridge(w,h,h*0.55,40,18), h2=ridge(w,h,h*0.7,50,14), h3=ridge(w,h,h*0.85,30,10);
    var flies=[]; for(i=0;i<26;i++) flies.push({x:R()*w,y:h*0.45+R()*h*0.5,ph:R()*6.28});
    return { paint:function(c,w,h,t){
      skyFill(c,w,h,[['#06170f',0],['#0b2b18',0.5],['#0a2413',0.78],['#03110a',0.92]]);
      dust(c,26,h*0.4,'#dff4e8');
      drawRidge(c,h1,h,'#0a2013'); drawRidge(c,h2,h,'#06160c'); drawRidge(c,h3,h,'#030d07');
      c.globalAlpha=0.08+0.03*Math.sin(t*0.8); c.fillStyle='#9fd8bb'; c.fillRect(0,h*0.62,w,h*0.16); c.globalAlpha=1;
      /* bus stop, big gentle spirit + kid */
      var bx=w*0.74, by=h*0.9, breathe=Math.sin(t*0.8)*1.5;
      c.fillStyle='#030b06';
      c.fillRect(bx+70,by-62,4,62); c.fillRect(bx-14,by-66,92,6);           /* shelter */
      c.beginPath(); c.ellipse(bx+16,by-27,27,30+breathe,0,Math.PI,0);      /* spirit dome */
      c.lineTo(bx+43,by); c.lineTo(bx-11,by); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(bx+3,by-53-breathe); c.lineTo(bx+8,by-68-breathe); c.lineTo(bx+14,by-54-breathe); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(bx+19,by-54-breathe); c.lineTo(bx+25,by-68-breathe); c.lineTo(bx+30,by-53-breathe); c.closePath(); c.fill();
      c.fillRect(bx-30,by-22,7,22);                                          /* the kid */
      c.beginPath(); c.arc(bx-26.5,by-26,5,0,7); c.fill();
      flies.forEach(function(f){ var a=0.25+0.55*Math.max(0,Math.sin(t*1.6+f.ph));
        c.globalAlpha=a; c.fillStyle='#c8ffb0';
        c.beginPath(); c.arc(f.x+Math.sin(t*0.7+f.ph)*24, f.y+Math.cos(t*0.5+f.ph)*14, 1.7,0,7); c.fill(); });
      c.globalAlpha=1; } };
  }

  /* ── CRAFT · open water (sloop cameo) ── */
  if(kind==='ocean'){
    return { paint:function(c,w,h,t){
      skyFill(c,w,h,[['#060d1e',0],['#0b1c38',0.45],['#0a2440',0.55],['#04101f',0.9]]);
      dust(c,34,h*0.4);
      c.fillStyle='#e8ecf4'; c.beginPath(); c.arc(w*0.72,h*0.24,26,0,7); c.fill();
      c.fillStyle='#c9cfdd'; c.beginPath(); c.arc(w*0.72-8,h*0.24-6,7,0,7); c.fill();
      for(i=0;i<24;i++){ var y=h*0.52+i*((h*0.45)/24);
        c.globalAlpha=0.14+0.1*Math.sin(t*1.2+i); c.strokeStyle= i%3? '#3d6a96':'#86b8dd'; c.lineWidth=1.4;
        c.beginPath();
        for(var x=0;x<=w;x+=26) c.lineTo(x, y+Math.sin(x*0.014+t*(0.7+i*0.05)+i)*3.2);
        c.stroke(); }
      c.globalAlpha=1;
      var sh=c.createLinearGradient(0,h*0.5,0,h);
      sh.addColorStop(0,'rgba(232,236,244,.16)'); sh.addColorStop(1,'transparent');
      c.fillStyle=sh; c.fillRect(w*0.66,h*0.5,w*0.12,h*0.5);
      /* the sloop crossing the horizon */
      var bx=w+140-((t*13)%(w+300)), by=h*0.515+Math.sin(t*0.9)*1.6;
      c.save(); c.translate(bx,by); c.rotate(Math.sin(t*0.9)*0.02);
      c.fillStyle='#0a1526';
      c.beginPath(); c.moveTo(-46,0); c.lineTo(46,0); c.lineTo(38,10) ; c.lineTo(-38,10); c.closePath(); c.fill();  /* hull */
      c.beginPath(); c.moveTo(46,0); c.quadraticCurveTo(58,-6,56,-14); c.lineTo(52,-4); c.closePath(); c.fill();     /* prow curl */
      c.beginPath(); c.arc(56,-15,3,0,7); c.fill();                                                                  /* figurehead */
      c.fillRect(-16,-34,3,34); c.fillRect(14,-28,3,28);                                                             /* masts */
      c.beginPath(); c.moveTo(-14,-33); c.quadraticCurveTo(4,-26,-14,-6); c.closePath(); c.fill();                   /* sails */
      c.beginPath(); c.moveTo(16,-27); c.quadraticCurveTo(30,-20,16,-4); c.closePath(); c.fill();
      c.beginPath(); c.moveTo(-16,-34); c.lineTo(-26,-30+Math.sin(t*5)*1.5); c.lineTo(-16,-28); c.closePath(); c.fill(); /* pennant */
      if(cel){ c.strokeStyle='#000'; c.lineWidth=1.6; c.strokeRect(-16,-34,3,34); }
      c.restore(); } };
  }

  /* ── NOTES · the lot (cypher cameo) ── */
  if(kind==='graffiti'){
    var TC=['#ff2d78','#74d0ff','#ffd36a','#7cff9b','#c9a8ff','#ff7a3c'], gtags=[];
    for(i=0;i<12;i++) gtags.push({x:R()*w,wd:50+R()*110,ht:20+R()*30,col:TC[i%TC.length],row:i%3});
    return { paint:function(c,w,h,t){
      skyFill(c,w,h,[['#1c0f2e',0],['#4a1e3c',0.5],['#8a3a2c',0.76],['#160b12',0.88],['#0a0609',0.95]]);
      dust(c,20,h*0.3,'#ffd9c0');
      var wy=h*0.62;
      c.fillStyle='#1f1728'; c.fillRect(0,wy,w,h*0.28);
      c.fillStyle='#2e2338'; c.fillRect(0,wy-5,w,6);
      if(cel){ c.strokeStyle='#241c28'; c.lineWidth=1.6;
        for(var yy=wy;yy<wy+h*0.28;yy+=16){ c.beginPath(); c.moveTo(0,yy); c.lineTo(w,yy); c.stroke(); } }
      gtags.forEach(function(g){ var gy=wy+16+g.row*((h*0.28-44)/3);
        c.globalAlpha=0.85; c.fillStyle=g.col;
        c.beginPath(); c.ellipse(g.x,gy+g.ht/2,g.wd/2,g.ht/2,0,0,7); c.fill();
        c.globalAlpha=0.28; c.fillStyle='#000';
        c.beginPath(); c.ellipse(g.x+4,gy+g.ht/2+4,g.wd/2,g.ht/2,0,0,7); c.fill(); });
      c.globalAlpha=1;
      c.fillStyle='#0a0609'; c.fillRect(0,h*0.9,w,h*0.1);
      var beat=Math.pow(Math.max(0,Math.sin(t*4.6)),3);
      var sx=w*0.44,sy=h*0.9;
      c.globalAlpha=0.2*beat; c.fillStyle='#ffd36a'; c.beginPath(); c.arc(sx,sy-60,90+beat*30,0,7); c.fill(); c.globalAlpha=1;
      for(var k2=0;k2<3;k2++){ var sw2=54-k2*8, sh2=32, yy2=sy-(k2+1)*sh2-k2*2;
        c.fillStyle='#0c0810'; c.fillRect(sx-sw2/2,yy2,sw2,sh2);
        if(cel){ c.strokeStyle='#000'; c.lineWidth=2; c.strokeRect(sx-sw2/2,yy2,sw2,sh2); }
        c.fillStyle='#1c1420'; c.beginPath(); c.arc(sx,yy2+sh2/2,(sh2/2-5)*(1+beat*0.14),0,7); c.fill(); }
      var my=h*0.9, nod=Math.sin(t*4.6)*3;
      c.fillStyle='#070409';
      c.fillRect(w*0.28-11,my-64+nod,22,64);
      c.beginPath(); c.arc(w*0.28,my-73+nod,12,0,7); c.fill();
      c.fillStyle='#8a8f98'; c.beginPath(); c.arc(w*0.28+4,my-73+nod,8,0,7); c.fill();
      c.fillStyle='#070409';
      c.beginPath(); c.moveTo(w*0.28+9,my-52+nod); c.lineTo(w*0.28+26,my-64+nod); c.lineTo(w*0.28+28,my-60+nod); c.lineTo(w*0.28+11,my-47+nod); c.closePath(); c.fill();
      for(var p3=0;p3<3;p3++){ var px4=w*0.62+p3*46, nod2=Math.sin(t*4.6+p3+1)*3;
        c.fillStyle='#070409';
        c.fillRect(px4-11,my-60+nod2,22,60); c.beginPath(); c.arc(px4,my-69+nod2,11,0,7); c.fill();
        c.fillStyle='#ffd36a'; c.font='bold 13px sans-serif'; c.textAlign='center'; c.fillText('W',px4,my-32+nod2); }
      c.strokeStyle='rgba(255,220,150,.25)'; c.lineWidth=1;
      c.beginPath(); c.moveTo(0,wy-40); c.quadraticCurveTo(w*0.5,wy+10,w,wy-46); c.stroke();
      for(var L2=0;L2<14;L2++){ var lx=w*L2/14+18, ly=wy-40+Math.sin(L2/14*Math.PI)*46;
        c.globalAlpha=0.5+0.5*Math.sin(t*2+L2); c.fillStyle='#ffd9a0'; c.beginPath(); c.arc(lx,ly+4,2,0,7); c.fill(); }
      c.globalAlpha=1; } };
  }

  /* ── hidden world · high desert (lone swordsman cameo) ── */
  var d1=ridge(w,h,h*0.72,26,7), d2=ridge(w,h,h*0.85,20,5);
  return { paint:function(c,w,h,t){
    skyFill(c,w,h,[['#2a0e2e',0],['#7a2440',0.4],['#c65a2e',0.62],['#1c0a12',0.9]]);
    dust(c,18,h*0.3,'#ffd9c0');
    c.fillStyle='#ffb44a'; c.beginPath(); c.arc(w*0.5,h*0.66,52,Math.PI,0); c.fill();
    drawRidge(c,d1,h,'#2a1210');
    /* the swordsman walks the ridge */
    var sx2=((t*9)%(w+140))-70, sy2=h*0.705, step=Math.sin(t*6);
    c.fillStyle='#0d0505';
    c.beginPath(); c.arc(sx2,sy2-34,5.5,0,7); c.fill();
    c.fillRect(sx2-3.5,sy2-30,7,17);
    c.beginPath(); c.moveTo(sx2-2,sy2-13); c.lineTo(sx2-2-5*step,sy2); c.lineTo(sx2-5*step,sy2); c.lineTo(sx2,sy2-13); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(sx2+2,sy2-13); c.lineTo(sx2+2+5*step,sy2); c.lineTo(sx2+4+5*step,sy2); c.lineTo(sx2+4,sy2-13); c.closePath(); c.fill();
    c.save(); c.translate(sx2,sy2-28); c.rotate(-0.7);
    c.fillRect(0,-2,20,2.6); c.fillRect(16,-4,3,7); c.restore();            /* sword on back */
    for(var k3=0;k3<2;k3++){ c.beginPath(); c.moveTo(sx2-4,sy2-37);         /* headband tails */
      c.quadraticCurveTo(sx2-13-k3*4, sy2-38+Math.sin(t*5+k3)*3, sx2-19-k3*5, sy2-34+Math.sin(t*5+k3+1)*3);
      c.lineTo(sx2-18-k3*5, sy2-32); c.quadraticCurveTo(sx2-11-k3*4, sy2-35, sx2-4, sy2-34); c.closePath(); c.fill(); }
    drawRidge(c,d2,h,'#180a09');
    c.globalAlpha=0.05+0.03*Math.sin(t); c.fillStyle='#ffdcb0';
    c.fillRect(0,h*0.6+Math.sin(t*0.6)*10,w,26); c.globalAlpha=1; } };
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
var hangarEl=null, hangarXY=null, rocketHidden=false;
function shipSwap(toId){
  if(themeId===toId||state==='hangar') return;
  if(!fine||state!=='free'){ applyTheme(toId); return; }
  state='hangar'; setLock(null);
  $('c-stat').textContent='● HANGAR';
  hangarEl=document.createElement('div'); hangarEl.className='hangar';
  hangarEl.innerHTML='<div class="hbody"><div class="hdoor l"></div><div class="hdoor r"></div><div class="hlab">AARONAUTICS HANGAR · SHIP EXCHANGE</div></div>';
  document.body.appendChild(hangarEl);
  hangarXY={x:W/2,y:H/2};
  requestAnimationFrame(function(){ hangarEl.classList.add('show'); });
  Sound.warp();
  setTimeout(function(){ hangarEl.classList.add('open'); },420);              // doors open
  setTimeout(function(){ rocketHidden=true; hangarEl.classList.remove('open'); Sound.thump(); },1600); // parked, doors shut
  setTimeout(function(){ applyTheme(toId); },2050);                           // swap behind closed doors
  setTimeout(function(){ hangarEl.classList.add('open'); rocketHidden=false; rx=hangarXY.x; ry=hangarXY.y; Sound.pew(); },2500);
  setTimeout(function(){ hangarEl.classList.remove('open'); hangarEl.classList.remove('show');
    state='free'; $('c-stat').textContent='● ONLINE';
    var he=hangarEl; hangarEl=null; setTimeout(function(){ he.remove(); },500); },3250);
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
    } else if(state==='hangar'&&hangarXY){
      rx+=(hangarXY.x-rx)*0.12; ry+=(hangarXY.y-ry)*0.12; ra*=0.88;
    }
    if(rollT>0) rollT=Math.max(0,rollT-dt/0.7);
    var rollOff=(1-rollT)*Math.PI*2*(rollT>0?1:0);
    rocket.style.transform='translate('+rx+'px,'+ry+'px) rotate('+(ra+(rollT>0?rollOff:0))+'rad)';
    rocket.style.opacity = (state==='warp'||state==='station'||rocketHidden)?'0':'1';
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
