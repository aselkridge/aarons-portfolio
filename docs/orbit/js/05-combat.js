// ══════════════════════════════════════════════════════════════════
// AARONAUTICS ORBIT — COMBAT
// Global fire/pointer input, weapons, asteroids (incl. gold), aim/projectile spawn.
// (mechanically split from the original single orbit.js; original source: lines 284-378)
// ══════════════════════════════════════════════════════════════════
'use strict';

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

