// ══════════════════════════════════════════════════════════════════
// AARONAUTICS ORBIT — FLIGHT
// Proximity lock-on, landing sequence, hyperwarp trigger.
// (mechanically split from the original single orbit.js; original source: lines 379-438)
// ══════════════════════════════════════════════════════════════════
'use strict';

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
