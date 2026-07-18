// ══════════════════════════════════════════════════════════════════
// AARONAUTICS ORBIT — WORLD
// Builds the planets/sun/ronin DOM + orbit rings, starfield canvases, shared runtime state vars.
// (mechanically split from the original single orbit.js; original source: lines 188-283)
// ══════════════════════════════════════════════════════════════════
'use strict';

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
  // A <canvas> is a "replaced element" — position:fixed;inset:0 with no
  // explicit CSS width/height does NOT stretch it to the viewport the way
  // it would an ordinary div; it falls back to the canvas's intrinsic size,
  // which is its width/height attributes (the drawing-buffer size below).
  // At devicePixelRatio 1 that buffer size equals the viewport size, so the
  // bug is invisible; at any other DPR (any HiDPI/Retina display) the
  // canvas silently renders at native size — e.g. literally 2x the screen
  // at dpr 2 — so everything drawn on it (shots, thrust, stars) lands at
  // 2x its intended on-screen position. Setting the CSS size explicitly
  // forces the browser to actually downscale the buffer, as intended.
  [sc,fx].forEach(function(c){
    c.width=W*devicePixelRatio; c.height=H*devicePixelRatio;
    c.style.width=W+'px'; c.style.height=H+'px';
  });
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

