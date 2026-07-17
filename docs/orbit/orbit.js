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
var STATIONS = [
  { id:'mission', name:'Mission', tag:'the thesis', color:'#ff7a3c', r:22, type:'molten', orbit:0.30, speed:0.055, a0:0.2,
    env:'wasteland', envlab:'SCORCHED FLATS',
    eyebrow:'STATION 01 · THE THESIS', title:'Built to be more than one thing.',
    body:['This is the flagship — the point of view, not the résumé. Aeronautics engineer by degree, automation builder by trade, poet and father by nature. The through-line isn\'t a job title; it\'s the range itself.','Aaronautics is a place to interface with that range — not a page to scroll.'],
    tags:['point of view','the mission','more than one thing'] },
  { id:'alphaforge', name:'AlphaForge', tag:'the proof', color:'#74d0ff', r:18, type:'ringed', orbit:0.44, speed:0.040, a0:1.1,
    env:'shipyard', envlab:'ORBITAL YARD',
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
    env:'desert', envlab:'HIGH DESERT',
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

/* ══════════ BUILD SYSTEM DOM ══════════ */
var system=$('system');
STATIONS.forEach(function(s,si){
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
  if(!fine) el.addEventListener('click', function(){ if(state==='free') beginWarp(s); });
  s.el=el; s.orb=el.querySelector('.orb'); s.a=s.a0; s.num='0'+(si+1);
  system.appendChild(el);
  var ring=document.createElement('div'); ring.className='sun-orbit'; s.oring=ring;
  system.insertBefore(ring, system.firstChild);
});
function sizeOrbits(){ STATIONS.forEach(function(s){
  s.oring.style.width=(s.orbit*unit*2)+'px'; s.oring.style.height=(s.orbit*unit*2*0.62)+'px'; }); }
function paintPlanets(){ STATIONS.forEach(function(s){ s.orb.style.background = themeId==='sword'? s.gradCel : s.gradReal; }); }
sizeOrbits(); paintPlanets();

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
var warpOrigin=null, warpT=0, activeStation=null;

/* ══════════ INPUT ══════════ */
addEventListener('pointermove', function(e){ mx=e.clientX; my=e.clientY; });
addEventListener('pointerdown', function(e){
  Sound.unlock(); Music.autostart();
  if(e.target.closest('.hud')||e.target.closest('.panel')||e.target.closest('#boot')) return;
  if(!fine) return;                       // touch: planets handle taps directly
  if(state!=='free') return;
  if(lockStation){ beginLanding(lockStation); }
  else fire();
});
addEventListener('keydown', function(e){
  if(e.key===' '&&state==='free'&&fine){ e.preventDefault(); fire(); }
  if(e.key==='Escape') closeStation();
});

/* ══════════ WEAPONS ══════════ */
function setWeapon(w){ weapon=w;
  $('w-cannon').classList.toggle('on',w==='cannon');
  $('w-pdc').classList.toggle('on',w==='pdc');
  Sound.blip(w==='cannon'?600:980); }
$('w-cannon').addEventListener('click',function(){ setWeapon('cannon'); });
$('w-pdc').addEventListener('click',function(){ setWeapon('pdc'); });

function noseDir(){ return { x:Math.sin(ra), y:-Math.cos(ra) }; }
function spawnProj(kind,delay){
  setTimeout(function(){
    if(state!=='free') return;
    var d=noseDir(), sp = kind==='cannon'?760:980;
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
function spawnAsteroid(tier,x,y){
  var r = tier===3? 26+Math.random()*13 : tier===2? 15+Math.random()*8 : 8+Math.random()*5;
  var edge=Math.floor(Math.random()*4), px,py;
  if(x===undefined){
    px = edge===0? -60 : edge===1? W+60 : Math.random()*W;
    py = edge===2? -60 : edge===3? H+60 : Math.random()*H;
  } else { px=x; py=y; }
  var ang=Math.atan2(CY-py,CX-px)+(Math.random()-0.5)*1.6;
  var sp=14+Math.random()*38+(3-tier)*10;
  asteroids.push({ x:px,y:py, vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp,
    r:r, tier:tier, rot:Math.random()*6.28, vr:(Math.random()-0.5)*1.4, verts:rockVerts(9+Math.floor(Math.random()*4),r) });
}
function burst(x,y,col,n,sp){
  for(var i=0;i<n;i++){ var a=Math.random()*6.28, v=(0.3+Math.random()*0.7)*(sp||160);
    particles.push({x:x,y:y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:0.5+Math.random()*0.5,r:1+Math.random()*2.6,col:col}); }
}
function killAsteroid(i){
  var a=asteroids[i]; asteroids.splice(i,1);
  var reward = a.tier===3?500 : a.tier===2?300 : 150;
  bounty += reward;
  $('bounty').textContent='₩ '+bounty.toLocaleString();
  floats.push({x:a.x,y:a.y,txt:'+₩'+reward,life:1});
  burst(a.x,a.y,T().accent,a.tier*6,180);
  Sound.boom(a.tier===3);
  if(a.tier>1){ spawnAsteroid(a.tier-1,a.x+6,a.y); spawnAsteroid(a.tier-1,a.x-6,a.y); }
}

/* ══════════ LOCK-ON ══════════ */
var tcTimer=null;
function updateLock(){
  if(!fine||state!=='free'){ setLock(null); return; }
  var best=null,bd=1e9;
  STATIONS.forEach(function(s){
    var d=Math.hypot(mx-(s.x+plx),my-(s.y+ply));
    if(d<s.r+52&&d<bd){ bd=d; best=s; }
  });
  setLock(best);
}
function setLock(s){
  var id=s?s.id:null;
  if(id===lockId){ if(s) lockStation=s; positionTgtbox(); return; }
  lockId=id; lockStation=s;
  STATIONS.forEach(function(st){ st.el.classList.toggle('live', !!s&&st.id===s.id); });
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
  setTimeout(function(){ system.classList.remove('warp'); state='free'; $('c-stat').textContent='● ONLINE'; },260);
}
$('close').addEventListener('click', closeStation);
panel.addEventListener('click', function(e){ if(e.target===panel||e.target===envc) closeStation(); });
function sizeEnv(){ envc.width=envc.clientWidth*devicePixelRatio; envc.height=envc.clientHeight*devicePixelRatio;
  ectx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
function fillCard(s){
  $('p-eye').textContent=s.eyebrow; $('p-eye').style.color=s.color;
  $('p-title').textContent=s.title;
  $('envlab').textContent='SURFACE · '+s.envlab;
  $('card').style.setProperty('--pc',s.color);
  var b=s.body.map(function(p){return '<p>'+p+'</p>';}).join('');
  b+='<div class="list">'+s.tags.map(function(t){return '<span>'+t+'</span>';}).join('')+'</div>';
  if(s.soon) b+='<div class="soon">◇ content in progress — real material lands here next</div>';
  $('p-body').innerHTML=b;
}

/* — environment painters — */
function ridge(w,h,base,jag,n){ var pts=[]; for(var i=0;i<=n;i++) pts.push({x:w*i/n, y:base+(Math.random()-0.5)*jag}); return pts; }
function drawRidge(c,pts,h,col){ c.fillStyle=col; c.beginPath(); c.moveTo(-10,h+10);
  pts.forEach(function(p){ c.lineTo(p.x,p.y); }); c.lineTo(pts[pts.length-1].x+10,h+10); c.closePath(); c.fill(); }
function makeEnv(kind){
  var w=innerWidth,h=innerHeight, R=Math.random;
  if(kind==='wasteland'){
    var r1=ridge(w,h,h*0.62,60,14), r2=ridge(w,h,h*0.74,90,10), r3=ridge(w,h,h*0.88,50,8);
    var embers=[]; for(var i=0;i<42;i++) embers.push({x:R()*w,y:h*0.6+R()*h*0.4,v:8+R()*22,ph:R()*6.28});
    return { paint:function(c,w,h,t){
      var g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#1a0503'); g.addColorStop(0.55,'#4a120a'); g.addColorStop(0.8,'#801f0c'); g.addColorStop(1,'#2a0a04');
      c.fillStyle=g; c.fillRect(0,0,w,h);
      var glow=c.createRadialGradient(w*0.5,h*0.8,10,w*0.5,h*0.8,w*0.5);
      glow.addColorStop(0,'rgba(255,110,30,'+(0.16+0.05*Math.sin(t*1.4))+')'); glow.addColorStop(1,'transparent');
      c.fillStyle=glow; c.fillRect(0,0,w,h);
      drawRidge(c,r1,h,'#160404'); drawRidge(c,r2,h,'#0e0302'); drawRidge(c,r3,h,'#070101');
      embers.forEach(function(e){ var y=e.y-((t*e.v)%(h*0.55)); var a=0.35+0.35*Math.sin(t*3+e.ph);
        c.globalAlpha=a; c.fillStyle='#ff9a4a'; c.beginPath(); c.arc(e.x+Math.sin(t+e.ph)*8,y,1.4,0,7); c.fill(); });
      c.globalAlpha=1; } };
  }
  if(kind==='shipyard'){
    var beams=[]; for(i=0;i<7;i++) beams.push({x:R()*w,y:h*0.25+R()*h*0.4,len:80+R()*260,vert:R()<0.4});
    var lights=[]; for(i=0;i<26;i++) lights.push({x:R()*w,y:h*0.2+R()*h*0.5,ph:R()*6.28,col:R()<0.5?'#86dcff':'#ffd36a'});
    var sparks=[];
    return { paint:function(c,w,h,t){
      var g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#04070f'); g.addColorStop(1,'#0a1526');
      c.fillStyle=g; c.fillRect(0,0,w,h);
      for(var i=0;i<40;i++){ c.globalAlpha=0.4; c.fillStyle='#c9d6ea'; c.fillRect((i*97)%w,(i*61)%(h*0.6),1.2,1.2); }
      c.globalAlpha=1; c.strokeStyle='#0d1420'; c.lineWidth=10;
      beams.forEach(function(b){ c.beginPath(); c.moveTo(b.x,b.y);
        c.lineTo(b.vert?b.x:b.x+b.len, b.vert?b.y+b.len:b.y); c.stroke(); });
      c.strokeStyle='#111c2e'; c.lineWidth=3;
      beams.forEach(function(b){ for(var k=0;k<b.len;k+=22){ c.beginPath();
        if(b.vert){ c.moveTo(b.x-8,b.y+k); c.lineTo(b.x+8,b.y+k+14);} else { c.moveTo(b.x+k,b.y-8); c.lineTo(b.x+k+14,b.y+8);} c.stroke(); }});
      lights.forEach(function(L){ var a=Math.sin(t*2+L.ph)>0.2?0.9:0.15; c.globalAlpha=a; c.fillStyle=L.col;
        c.beginPath(); c.arc(L.x,L.y,1.8,0,7); c.fill(); });
      c.globalAlpha=1;
      if(Math.random()<0.05){ var sx=beams[(Math.random()*beams.length)|0]; sparks.push({x:sx.x+R()*60,y:sx.y,n:8}); }
      for(i=sparks.length-1;i>=0;i--){ var s=sparks[i]; s.n--;
        for(var k=0;k<3;k++){ c.globalAlpha=Math.random()*0.9; c.fillStyle='#ffe9a0';
          c.fillRect(s.x+(Math.random()-0.5)*18, s.y+Math.random()*22, 1.6,1.6); }
        if(s.n<=0) sparks.splice(i,1); }
      c.globalAlpha=1; } };
  }
  if(kind==='forest'){
    var h1=ridge(w,h,h*0.55,40,18), h2=ridge(w,h,h*0.7,50,14), h3=ridge(w,h,h*0.85,30,10);
    var flies=[]; for(i=0;i<26;i++) flies.push({x:R()*w,y:h*0.45+R()*h*0.5,ph:R()*6.28,sp:6+R()*10});
    return { paint:function(c,w,h,t){
      var g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#06170f'); g.addColorStop(0.5,'#0b2b18'); g.addColorStop(1,'#03110a');
      c.fillStyle=g; c.fillRect(0,0,w,h);
      c.globalAlpha=0.5; c.fillStyle='#dff4e8';
      for(var i=0;i<26;i++) c.fillRect((i*137)%w,(i*83)%(h*0.4),1.1,1.1);
      c.globalAlpha=1;
      drawRidge(c,h1,h,'#0a2013'); drawRidge(c,h2,h,'#06160c'); drawRidge(c,h3,h,'#030d07');
      c.globalAlpha=0.08+0.03*Math.sin(t*0.8); c.fillStyle='#9fd8bb'; c.fillRect(0,h*0.62,w,h*0.16); c.globalAlpha=1;
      flies.forEach(function(f){ var a=0.25+0.55*Math.max(0,Math.sin(t*1.6+f.ph));
        c.globalAlpha=a; c.fillStyle='#c8ffb0';
        c.beginPath(); c.arc(f.x+Math.sin(t*0.7+f.ph)*24, f.y+Math.cos(t*0.5+f.ph)*14, 1.7,0,7); c.fill(); });
      c.globalAlpha=1; } };
  }
  if(kind==='ocean'){
    return { paint:function(c,w,h,t){
      var g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#060d1e'); g.addColorStop(0.45,'#0b1c38'); g.addColorStop(0.55,'#0a2440'); g.addColorStop(1,'#04101f');
      c.fillStyle=g; c.fillRect(0,0,w,h);
      c.globalAlpha=0.7; c.fillStyle='#dfe9ff';
      for(var i=0;i<34;i++) c.fillRect((i*113)%w,(i*59)%(h*0.4),1.2,1.2);
      c.globalAlpha=1;
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
      c.fillStyle=sh; c.fillRect(w*0.66,h*0.5,w*0.12,h*0.5); } };
  }
  /* desert */
  var d1=ridge(w,h,h*0.72,26,7), d2=ridge(w,h,h*0.85,20,5);
  return { paint:function(c,w,h,t){
    var g=c.createLinearGradient(0,0,0,h); g.addColorStop(0,'#2a0e2e'); g.addColorStop(0.4,'#7a2440'); g.addColorStop(0.62,'#c65a2e'); g.addColorStop(1,'#1c0a12');
    c.fillStyle=g; c.fillRect(0,0,w,h);
    c.globalAlpha=0.6; c.fillStyle='#ffd9c0';
    for(var i=0;i<18;i++) c.fillRect((i*151)%w,(i*47)%(h*0.3),1.2,1.2);
    c.globalAlpha=1;
    c.fillStyle='#ffb44a'; c.beginPath(); c.arc(w*0.5,h*0.66,52,Math.PI,0); c.fill();
    drawRidge(c,d1,h,'#2a1210'); drawRidge(c,d2,h,'#180a09');
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
$('b-sword').addEventListener('click', function(){ applyTheme('sword'); });
$('b-roci').addEventListener('click', function(){ applyTheme('roci'); });
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

  /* ship */
  var rocket=$('rocket');
  if(fine){
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
    rocket.style.transform='translate('+rx+'px,'+ry+'px) rotate('+ra+'rad)';
    rocket.style.opacity = (state==='warp'||state==='station')?'0':'1';
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
      if(themeId==='sword'){ fctx.fillStyle=T().rockFill; fctx.fill();
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

/* ══════════ RESIZE / BOOT / DEEP LINK ══════════ */
addEventListener('resize', function(){ metrics(); sizeCanvases(); sizeOrbits(); initStars(); if(envScene) sizeEnv(); });
var boot=$('boot');
setTimeout(function(){ boot.classList.add('gone'); },1900);
boot.addEventListener('click', function(){ boot.classList.add('gone'); });
addEventListener('load', function(){
  Music.init();
  var hsh=location.hash.slice(1), s=STATIONS.filter(function(x){return x.id===hsh;})[0];
  if(s) setTimeout(function(){ system.classList.add('warp'); openStation(s); }, 600);
});
applyTheme('sword');

/* headless test hook */
window.__orbit = {
  state:function(){ return { state:state, theme:themeId, weapon:weapon, asteroids:asteroids.length,
    projectiles:projectiles.length, bounty:bounty, lock:lockId, stations:STATIONS.map(function(s){return {id:s.id,x:s.x+plx,y:s.y+ply,r:s.r};}) }; },
  fire:fire, land:function(id){ var s=STATIONS.filter(function(x){return x.id===id;})[0]; if(s) beginLanding(s); }
};
})();
