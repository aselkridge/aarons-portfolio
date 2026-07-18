// ══════════════════════════════════════════════════════════════════
// AARONAUTICS ORBIT — MAIN
// The per-frame render loop (ship/stars/fx/warp/HUD) + resize/boot/deep-link + test hook.
// (mechanically split from the original single orbit.js; original source: lines 836-1032, 1053-1071)
// ══════════════════════════════════════════════════════════════════
'use strict';

/* ══════════ MAIN LOOP ══════════ */
var last=0;
var lastDPR=devicePixelRatio;
function loop(t){
  var dt=Math.min(0.05,(t-last)/1000)||0.016; last=t;

  /* Defend against the viewport/DPR drifting out from under us without a
     'resize' event firing — the classic trigger is dragging the browser
     window to a display with a different pixel density (e.g. a Retina
     MacBook screen <-> an external monitor). When that happens, the ship
     (a DOM element that tracks the live cursor directly) stays correct,
     but the fx/star canvases keep their OLD pixel-buffer size and get
     silently stretched/shifted by the browser to fit their new on-screen
     box — so anything drawn on them (shots, thrust lines, asteroids) ends
     up rendered in a different physical spot than the ship next to it.
     Checking this every frame is cheap (a few reads) and only does real
     work on the rare frame where something actually changed. */
  if(innerWidth!==W || innerHeight!==H || devicePixelRatio!==lastDPR){
    metrics(); sizeCanvases(); sizeOrbits(); sunMetrics(); initStars();
    if(envScene) sizeEnv();
    lastDPR = devicePixelRatio;
  }

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

  /* speed lines (anime, fast flight) — must visibly trail FROM the ship,
     not float disconnected in the background. */
  if(themeId==='sword'&&fine&&state==='free'&&shipSpeed>620&&!reduce){
    var sl=Math.min(1,(shipSpeed-620)/900);
    fctx.globalAlpha=0.28*sl; fctx.strokeStyle='#efece6'; fctx.lineWidth=1.6;
    for(i=0;i<10;i++){ var ang=ra-Math.PI/2+Math.PI+(Math.random()-0.5)*0.9;
      var ddd=14+Math.random()*20;                    // start right at the hull
      fctx.beginPath(); fctx.moveTo(rx+Math.cos(ang)*ddd, ry+Math.sin(ang)*ddd);
      fctx.lineTo(rx+Math.cos(ang)*(ddd+50+90*sl), ry+Math.sin(ang)*(ddd+50+90*sl)); fctx.stroke(); }
    fctx.globalAlpha=1;
  }

  /* plasma/ion exhaust plume (Expanse theme) — deliberately NOT a fast-flight-
     only cue like the anime speed lines. A real drive burns continuously, so
     this is always on at a low idle glow and simply brightens/lengthens with
     speed, rather than switching on past a threshold. */
  if(themeId==='roci'&&fine&&state==='free'&&!reduce){
    var ed={x:-Math.sin(ra),y:Math.cos(ra)};       // opposite of noseDir() — the engine faces aft
    var eang=Math.atan2(ed.y,ed.x);
    var ex=rx+ed.x*15, ey=ry+ed.y*15;              // nozzle, just behind the hull
    var thrustP=Math.min(1,shipSpeed/700);
    var inten=0.32+0.68*thrustP;                   // idle burn even at rest; brighter/longer in flight
    var plen=16+inten*58;
    fctx.save(); fctx.translate(ex,ey); fctx.rotate(eang);
    var grad=fctx.createLinearGradient(0,0,plen,0);
    grad.addColorStop(0,'rgba(226,246,255,'+(0.85*inten).toFixed(2)+')');
    grad.addColorStop(0.4,'rgba(116,208,255,'+(0.55*inten).toFixed(2)+')');
    grad.addColorStop(1,'rgba(116,208,255,0)');
    fctx.fillStyle=grad;
    var pw=5+inten*3;
    fctx.beginPath(); fctx.moveTo(0,-pw); fctx.lineTo(plen,0); fctx.lineTo(0,pw); fctx.closePath(); fctx.fill();
    fctx.restore();
    if(Math.random()<0.55*inten){                  // sparse embers peeling off the plume
      var jig=eang+(Math.random()-0.5)*0.5, esp=40+70*inten;
      particles.push({x:ex,y:ey,vx:Math.cos(jig)*esp,vy:Math.sin(jig)*esp,
        life:0.22+Math.random()*0.28,r:0.8+Math.random()*1.5,col:Math.random()<0.5?'#e2f6ff':'#74d0ff'});
    }
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
      /* sun — uses SUN_STATION.r, the sun's real rendered radius (computed
         in sunMetrics() from its actual DOM size), instead of the old
         min(W,H)*0.052 guess that had nothing to do with how big the sun
         actually draws on screen. Reaction is a dedicated sizzle (the sun
         scorches/evaporates a shot), not the generic spark burst. */
      if(!dead&&Math.hypot(P.x-(SUN_STATION.x+plx),P.y-(SUN_STATION.y+ply))<SUN_STATION.r+9){
        sunBurst(P.x,P.y);
        SUN_STATION.el.classList.remove('sizzling'); void SUN_STATION.el.offsetWidth; SUN_STATION.el.classList.add('sizzling');
        Sound.sizzle(); dead=true;
        $('target').textContent=SUN_STATION.name.toUpperCase()+' · SCORCHED';
      }
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
