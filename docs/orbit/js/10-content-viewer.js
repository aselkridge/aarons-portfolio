// ══════════════════════════════════════════════════════════════════
// AARONAUTICS ORBIT — CONTENT VIEWER
// Flexible content renderer for different section layouts (blog, poem,
// gallery, table, etc). Built reusably for both the station panel and
// Phase 4's Ground Control computer screen display.
// ══════════════════════════════════════════════════════════════════
'use strict';

/* ══════════ CONTENT VIEWER ══════════ */
var ContentViewer=(function(){
  /* Section types and their render functions */
  var renderers={
    blog:function(sec){ return renderBlog(sec); },
    poem:function(sec){ return renderPoem(sec); },
    gallery:function(sec){ return renderGallery(sec); },
    table:function(sec){ return renderTable(sec); },
    patch:function(sec){ return renderPatch(sec); },
    dispatch:function(sec){ return renderDispatch(sec); }
  };
  /* Stage 5 artifacts render per-theme (brief §9): warm = analog materials,
     cool = light + glass. themeId is the shared runtime global. */
  function cool(){ return typeof themeId!=='undefined' && themeId==='roci'; }

  function renderBlog(sec){
    var html='';
    if(sec.body) html+=(sec.body||[]).map(function(p){ return '<p>'+p+'</p>'; }).join('');
    if(sec.tags) html+='<div class="list">'+sec.tags.map(function(t){ return '<span>'+t+'</span>'; }).join('')+'</div>';
    if(sec.soon) html+='<div class="soon">◇ content in progress — real material lands here next</div>';
    return html;
  }

  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  function renderPoem(sec){
    // The Oromugai parchment treatment — each poem is one 8-syllable line on an
    // aged manuscript "sheet" (CSS paper + foxing + grain), with the real
    // illustrated ouroboros wax seal and, on the hero sheet, the quill/inkwell
    // (multiply-blended, in its own bottom-right zone so it never collides with
    // the text at any width — the mobile-safe layout). Kept deliberately short
    // per card (one line + a small meta) so text and art share the sheet cleanly
    // on a narrow dock or a phone. Real Oromugais drop into sec.poems unchanged.
    var html='';
    if(sec.intro) html+='<p class="poem-intro">'+esc(sec.intro)+'</p>';
    (sec.poems||[]).forEach(function(p,i){
      var hero=(p.hero!==undefined)?p.hero:(i===0);
      var num=p.n||('#'+('0'+(i+1)).slice(-2));
      html+='<figure class="poem-sheet'+(hero?' hero':'')+'">';
      html+='<figcaption class="poem-eye">Oromugai ∞ · '+esc(num)+'</figcaption>';
      html+='<blockquote class="poem-line">'+esc(p.line||'')+'</blockquote>';
      html+='<div class="poem-foot"><img class="poem-seal" src="assets/wax_seal.png" alt="Oromugai seal — an ouroboros">'+
            '<span class="poem-meta">'+esc(p.meta||'8 syllables · one breath')+'</span></div>';
      if(hero) html+='<img class="poem-quill" src="assets/quill.png" alt="" aria-hidden="true">';
      html+='</figure>';
    });
    if(sec.soon) html+='<div class="soon">◇ more transmissions incoming</div>';
    return html;
  }

  function renderGallery(sec){
    // Gallery: grid of images with optional captions
    var html='<div class="gallery-grid">';
    (sec.items||[]).forEach(function(item){
      html+='<div class="gallery-item">';
      html+='<img src="'+item.src+'" alt="'+(item.alt||'')+'">';
      if(item.caption) html+='<div class="gallery-caption">'+item.caption+'</div>';
      html+='</div>';
    });
    html+='</div>';
    return html;
  }

  /* ── MISSION · crew patch (warm) / holo insignia (cool) ──
     Same markup both themes; CSS (body.t-sword/.t-roci .patch) flips the
     material — embroidery vs light. The logo mark sits at the center. */
  function renderPatch(sec){
    var html='<div class="patch-wrap">';
    html+='<div class="patch-kick">'+esc(sec.kick||'◆ MISSION · THE THESIS')+'</div>';
    html+='<div class="patch"><img src="../assets/brand/mark-transparent.png" alt="Aaronautics mark">'+
          '<div class="pt-nm">'+esc(sec.pname||'MISSION 001')+'</div>'+
          '<div class="pt-est">'+esc(sec.pest||'EST. THE BRONX')+'</div></div>';
    html+='<div class="patch-banner">'+esc(sec.banner||'MORE THAN ONE THING')+'</div>';
    if(sec.meta) html+='<div class="patch-meta">'+esc(sec.meta)+'</div>';
    html+='</div>';
    return html;
  }

  /* ── NOTES · typed telex dispatch (warm) / transmission log (cool) ──
     One card per essay tab; the perforated telex edge only exists warm. */
  function renderDispatch(sec){
    var html='<div class="nt-card">';
    if(!cool()) html+='<div class="nt-perf"></div>';
    html+='<div class="nt-in">';
    html+='<div class="nt-head"><span class="nt-no">'+(cool()?'◆ TRANSMISSION':'◆ FIELD DISPATCH')+' · No. '+esc(sec.n||'01')+'</span><span class="nt-yr">'+esc(sec.yr||'2026')+'</span></div>';
    html+='<div class="nt-title">'+esc(sec.title||sec.k)+'</div>';
    html+='<div class="nt-body">'+(sec.body||[]).map(function(p){ return '<p>'+esc(p)+'</p>'; }).join('')+'</div>';
    html+='</div></div>';
    if(sec.soon) html+='<div class="soon">◇ more dispatches incoming</div>';
    return html;
  }

  /* ── riffled artifact items (blueprint builds / life cards) — one item at a
     time inside the floating window, driven by the riffle controls in
     07-environments.js. Returns the HTML for a single item. ── */
  function renderBuildItem(item,i,total){
    var pad=function(n){ return ('0'+n).slice(-2); };
    var html='<div class="bp-card'+(item.playable?' playable':'')+'"><div class="bp-in">';
    html+='<div class="bp-head"><span class="bp-no">BUILD '+pad(i+1)+' / '+pad(total)+'</span>'+
          '<span class="bp-stamp'+(item.held?' held':'')+(item.playable?' pulse':'')+'">'+esc(item.stamp||(item.held?'HELD ON PURPOSE':'SHIPPED'))+'</span></div>';
    html+='<div class="bp-title">'+esc(item.title)+'</div>';
    html+='<div class="bp-desc">'+esc(item.desc||'')+'</div>';
    if(item.metrics&&item.metrics.length){
      html+='<div class="bp-mx">'+item.metrics.map(function(m){ return '<div><b>'+esc(m.v)+'</b><i>'+esc(m.l)+'</i></div>'; }).join('')+'</div>';
    }
    if(item.note) html+='<div class="bp-note">'+esc(item.note)+'</div>';
    html+='</div></div>';
    return html;
  }
  function renderLifeItem(item,i){
    if(cool()){
      var bars=[5,10,7,13,8,11,4,9,6,10].map(function(v){ return '<i style="height:'+v*2+'px"></i>'; }).join('');
      return '<div class="lf-med"><div class="lm-top">'+
        '<div class="lm-art">'+esc(item.ph||'[ art ]')+'</div>'+
        '<div><div class="lm-lab">'+esc(item.lab||'NOW PLAYING')+'</div><div class="lm-t">'+esc(item.cap)+'</div><div class="lm-s">'+esc(item.sub||'')+'</div></div>'+
        '</div><div class="lm-eq">'+bars+'</div></div>';
    }
    return '<div class="lf-pol'+(i%2?' alt':'')+'">'+
      '<div class="lf-ph">'+esc(item.ph||'[ photo ]')+'</div>'+
      '<div class="lf-cap"><b>'+esc(item.cap)+'</b><span>'+esc(item.sub||'')+'</span></div></div>';
  }

  function renderTable(sec){
    // Data table with headers and rows
    if(!sec.rows || !sec.rows.length) return '';
    var html='<div class="table-wrap"><table class="data-table">';
    if(sec.headers){
      html+='<thead><tr>';
      sec.headers.forEach(function(h){ html+='<th>'+h+'</th>'; });
      html+='</tr></thead>';
    }
    html+='<tbody>';
    sec.rows.forEach(function(row){
      html+='<tr>';
      (Array.isArray(row)?row:[row]).forEach(function(cell){
        html+='<td>'+(typeof cell==='object'?cell.text:cell)+'</td>';
      });
      html+='</tr>';
    });
    html+='</tbody></table></div>';
    if(sec.tags) html+='<div class="list">'+sec.tags.map(function(t){ return '<span>'+t+'</span>'; }).join('')+'</div>';
    return html;
  }

  return {
    render: function(sec){
      if(!sec) return '';
      var type=sec.type||'blog';
      var renderer=renderers[type];
      if(!renderer){
        console.warn('Unknown content type: '+type);
        renderer=renderers.blog;
      }
      return renderer(sec);
    },
    registerType: function(name,fn){
      renderers[name]=fn;
    },
    /* one riffled item (builds/life) — used by the floating-window riffle */
    renderItem: function(type,item,i,total){
      if(type==='builds') return renderBuildItem(item,i,total);
      if(type==='life')   return renderLifeItem(item,i);
      return '';
    }
  };
})();
