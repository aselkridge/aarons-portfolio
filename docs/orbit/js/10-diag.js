// ══════════════════════════════════════════════════════════════════
// AARONAUTICS ORBIT — DIAGNOSTIC OVERLAY (temporary, delete once the
// canvas/DOM offset bug is root-caused)
// Only activates with ?diag=1 in the URL — invisible to everyone else.
// Shows, live, where the browser SAYS things are (getBoundingClientRect,
// i.e. real on-screen pixels) next to where the game's own math THINKS
// they are (rx/ry, s.x+plx/s.y+ply) for the ship and the first planet,
// plus the raw viewport/canvas numbers that could cause the two to
// disagree (devicePixelRatio, visualViewport, canvas buffer vs rect).
// If shipDiff/planetDiff are ~0 on a machine where shots still look
// wrong, the bug is downstream of these numbers (e.g. the canvas paint
// itself); if they're NOT ~0, this is the smoking gun and shows exactly
// which value is off.
// ══════════════════════════════════════════════════════════════════
'use strict';
if(/[?&]diag=1\b/.test(location.search)){
  var diagEl=document.createElement('div');
  diagEl.id='diagOverlay';
  diagEl.style.cssText='position:fixed;top:8px;left:8px;z-index:99999;background:rgba(0,0,0,.85);'+
    'color:#7fffb0;font:11px/1.5 ui-monospace,Menlo,Consolas,monospace;padding:10px 12px;'+
    'border-radius:6px;white-space:pre;max-width:92vw;max-height:90vh;overflow:auto;';
  var diagText=document.createElement('div');
  var diagBtn=document.createElement('div');
  diagBtn.textContent='[copy diagnostic]';
  diagBtn.style.cssText='pointer-events:auto;cursor:pointer;color:#9be2ff;text-decoration:underline;margin-top:6px;';
  diagEl.appendChild(diagText); diagEl.appendChild(diagBtn);
  document.body.appendChild(diagEl);

  function diagRead(){
    var vv=window.visualViewport;
    var rocketEl=$('rocket'), rr=rocketEl.getBoundingClientRect();
    var shipActual={x:rr.left+rr.width/2, y:rr.top+rr.height/2};
    var fxr=fx.getBoundingClientRect(), scr=sc.getBoundingClientRect();
    var s0=STATIONS[0], s0r=s0.el.getBoundingClientRect();
    var planetActual={x:s0r.left+s0r.width/2, y:s0r.top+s0r.height/2};
    var planetLogical={x:s0.x+plx, y:s0.y+ply};
    return {
      innerWidth:innerWidth, innerHeight:innerHeight, devicePixelRatio:devicePixelRatio,
      visualViewport: vv? {width:+vv.width.toFixed(1),height:+vv.height.toFixed(1),scale:vv.scale,
        offsetLeft:+vv.offsetLeft.toFixed(1),offsetTop:+vv.offsetTop.toFixed(1)} : 'unsupported',
      scrollXY:[scrollX,scrollY],
      fxRect:{left:+fxr.left.toFixed(1),top:+fxr.top.toFixed(1),width:+fxr.width.toFixed(1),height:+fxr.height.toFixed(1)},
      fxBuffer:{width:fx.width,height:fx.height},
      starsRect:{left:+scr.left.toFixed(1),top:+scr.top.toFixed(1),width:+scr.width.toFixed(1),height:+scr.height.toFixed(1)},
      shipLogical:{x:+rx.toFixed(1),y:+ry.toFixed(1)},
      shipActual:{x:+shipActual.x.toFixed(1),y:+shipActual.y.toFixed(1)},
      shipDiff:{x:+(shipActual.x-rx).toFixed(1), y:+(shipActual.y-ry).toFixed(1)},
      planetName:s0.name,
      planetLogical:{x:+planetLogical.x.toFixed(1),y:+planetLogical.y.toFixed(1)},
      planetActual:{x:+planetActual.x.toFixed(1),y:+planetActual.y.toFixed(1)},
      planetDiff:{x:+(planetActual.x-planetLogical.x).toFixed(1), y:+(planetActual.y-planetLogical.y).toFixed(1)},
      mouse:{x:mx,y:my}
    };
  }

  function diagFmt(d){
    return 'DIAG — add ?diag=1 to load this, safe to ignore/remove otherwise\n\n'+
      'innerWidth x innerHeight: '+d.innerWidth+' x '+d.innerHeight+'\n'+
      'devicePixelRatio: '+d.devicePixelRatio+'\n'+
      'visualViewport: '+JSON.stringify(d.visualViewport)+'\n'+
      'scroll: '+d.scrollXY.join(',')+'\n'+
      '#fx rect: '+JSON.stringify(d.fxRect)+'\n'+
      '#fx buffer (w x h attr): '+d.fxBuffer.width+' x '+d.fxBuffer.height+'\n'+
      '#stars rect: '+JSON.stringify(d.starsRect)+'\n\n'+
      '--- ship ---\n'+
      'logical (rx,ry):        '+d.shipLogical.x+', '+d.shipLogical.y+'\n'+
      'actual on-screen center: '+d.shipActual.x+', '+d.shipActual.y+'\n'+
      'DIFF (actual - logical): '+d.shipDiff.x+', '+d.shipDiff.y+'   <-- should be ~0,0\n\n'+
      '--- planet ['+d.planetName+'] ---\n'+
      'logical (s.x+plx,s.y+ply): '+d.planetLogical.x+', '+d.planetLogical.y+'\n'+
      'actual on-screen center:   '+d.planetActual.x+', '+d.planetActual.y+'\n'+
      'DIFF (actual - logical):   '+d.planetDiff.x+', '+d.planetDiff.y+'   <-- should be ~0,0\n\n'+
      '--- mouse (clientX/Y) ---\n'+
      d.mouse.x+', '+d.mouse.y;
  }

  diagBtn.addEventListener('click', function(){
    var txt=diagFmt(diagRead());
    if(navigator.clipboard&&navigator.clipboard.writeText) navigator.clipboard.writeText(txt).catch(function(){});
    console.log(txt);
    diagBtn.textContent='[copied + printed to console]';
    setTimeout(function(){ diagBtn.textContent='[copy diagnostic]'; },1500);
  });
  setInterval(function(){ diagText.textContent=diagFmt(diagRead()); },200);
}
