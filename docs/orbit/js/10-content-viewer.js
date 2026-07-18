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
    table:function(sec){ return renderTable(sec); }
  };

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
    }
  };
})();
