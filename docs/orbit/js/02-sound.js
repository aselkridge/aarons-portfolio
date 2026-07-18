// ══════════════════════════════════════════════════════════════════
// AARONAUTICS ORBIT — SOUND
// Synth SFX (Sound) and the music player engine (Music).
// (mechanically split from the original single orbit.js; original source: lines 60-135)
// ══════════════════════════════════════════════════════════════════
'use strict';

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
    sizzle:function(){ if(!on||!ctx)return; var t=ctx.currentTime,n=ctx.sampleRate*0.22,b=ctx.createBuffer(1,n,ctx.sampleRate),d=b.getChannelData(0);
      for(var i=0;i<n;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/n,1.6);
      var s=ctx.createBufferSource();s.buffer=b;var f=ctx.createBiquadFilter();f.type='highpass';f.frequency.value=2200;
      var g=ctx.createGain();g.gain.value=0.14;s.connect(f);f.connect(g);g.connect(ctx.destination);s.start();
      var o=ctx.createOscillator(),g2=ctx.createGain();o.type='sawtooth';o.frequency.setValueAtTime(1800,t);o.frequency.exponentialRampToValueAtTime(280,t+0.2);
      o.connect(g2);g2.connect(ctx.destination);env(g2,0.05,0.2);o.start(t);o.stop(t+0.22); },
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

