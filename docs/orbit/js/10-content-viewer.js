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

  function renderPoem(sec){
    // Poem entries: centered text with decorative treatment
    // sec.text is the poem, sec.visual is optional image, sec.author is optional
    var html='<div class="poem-wrap">';
    if(sec.visual) html+='<div class="poem-visual" style="background-image:url('+sec.visual+')"></div>';
    html+='<div class="poem-text">' + (sec.text||'') + '</div>';
    if(sec.author) html+='<div class="poem-author">— '+sec.author+'</div>';
    html+='</div>';
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
