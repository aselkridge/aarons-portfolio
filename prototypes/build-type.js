const fs = require('fs');
const dir = '/tmp/claude-0/-home-user-aarons-portfolio/fe31668a-38bf-5bd9-861b-46e1ed920f44/scratchpad';
const FS = dir + '/node_modules/@fontsource';
const b64 = p => fs.readFileSync(p).toString('base64');

const fonts = {
  anton:    b64(`${FS}/anton/files/anton-latin-400-normal.woff2`),
  os400:    b64(`${FS}/oswald/files/oswald-latin-400-normal.woff2`),
  os500:    b64(`${FS}/oswald/files/oswald-latin-500-normal.woff2`),
  os700:    b64(`${FS}/oswald/files/oswald-latin-700-normal.woff2`),
  mono400:  b64(`${FS}/space-mono/files/space-mono-latin-400-normal.woff2`),
  mono700:  b64(`${FS}/space-mono/files/space-mono-latin-700-normal.woff2`),
};

const face = (fam, wght, key, style='normal') =>
`@font-face{font-family:'${fam}';font-style:${style};font-weight:${wght};font-display:swap;src:url(data:font/woff2;base64,${fonts[key]}) format('woff2')}`;

const faces = [
  face('Anton',400,'anton'),
  face('Oswald',400,'os400'),
  face('Oswald',500,'os500'),
  face('Oswald',700,'os700'),
  face('Space Mono',400,'mono400'),
  face('Space Mono',700,'mono700'),
].join('\n');

const html = `<style>
${faces}
:root{
  --ink:#efece6; --paper:#0a0908; --dim:#8f8a82; --line:rgba(239,236,230,.18);
  --anton:'Anton',Impact,sans-serif;
  --os:'Oswald','Arial Narrow',sans-serif;
  --mono:'Space Mono',ui-monospace,monospace;
}
*{box-sizing:border-box;margin:0;padding:0}
html,body{height:100%}
body{background:var(--paper);color:var(--ink);overflow:hidden;font-family:var(--os);
  filter:contrast(1.06) brightness(1.02)}
.stage{position:fixed;inset:0;display:flex;flex-direction:column;justify-content:space-between;
  padding:clamp(20px,4vw,52px);opacity:0;animation:boot 1.2s ease .1s forwards}
@keyframes boot{to{opacity:1}}

/* film grain + vignette + scanlines */
.grain{position:fixed;inset:-50%;z-index:40;pointer-events:none;opacity:.10;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  animation:grain .6s steps(3) infinite}
@keyframes grain{0%{transform:translate(0,0)}33%{transform:translate(-6%,4%)}66%{transform:translate(4%,-5%)}100%{transform:translate(0,0)}}
.vig{position:fixed;inset:0;z-index:41;pointer-events:none;
  background:radial-gradient(130% 100% at 50% 45%,transparent 40%,rgba(0,0,0,.7) 100%)}
.scan{position:fixed;inset:0;z-index:42;pointer-events:none;opacity:.5;mix-blend-mode:multiply;
  background:repeating-linear-gradient(0deg,rgba(0,0,0,.18) 0 1px,transparent 1px 3px)}

/* top bar */
.top{display:flex;justify-content:space-between;align-items:baseline;z-index:2}
.sys{font-family:var(--os);font-weight:500;font-size:clamp(11px,1.3vw,13px);letter-spacing:.34em;text-transform:uppercase}
.sys b{font-weight:700}
.timer{font-family:var(--mono);font-weight:700;font-size:clamp(12px,1.5vw,15px);letter-spacing:.1em;font-variant-numeric:tabular-nums}

/* hero block */
.hero{position:relative;flex:1;display:flex;flex-direction:column;justify-content:center;z-index:2}
.ghost{position:absolute;top:50%;left:50%;transform:translate(-50%,-58%);z-index:0;
  font-family:var(--anton);font-size:clamp(9rem,34vw,30rem);line-height:.8;letter-spacing:-.02em;
  color:transparent;-webkit-text-stroke:1.5px rgba(239,236,230,.10);white-space:nowrap;
  font-variant-numeric:tabular-nums;user-select:none}
.session{font-family:var(--os);font-weight:500;letter-spacing:.5em;text-transform:uppercase;
  font-size:clamp(11px,1.6vw,15px);color:var(--dim);margin-bottom:clamp(10px,1.6vh,20px);z-index:2}
h1{font-family:var(--anton);font-weight:400;text-transform:uppercase;z-index:2;
  font-size:clamp(3.2rem,15.5vw,15rem);line-height:.82;letter-spacing:.005em;
  text-shadow:0 6px 40px rgba(0,0,0,.6)}
.rule{height:2px;background:var(--ink);width:min(560px,80vw);margin:clamp(14px,2.4vh,30px) 0;z-index:2;
  transform-origin:left;animation:wipe 1s ease .5s both}
@keyframes wipe{from{transform:scaleX(0)}to{transform:scaleX(1)}}
.crawl{font-family:var(--os);font-weight:400;font-size:clamp(1rem,1.9vw,1.5rem);line-height:1.5;
  max-width:44ch;color:#d7d2c8;z-index:2}
.crawl b{color:var(--ink);font-weight:700}

/* bottom signoff */
.bottom{display:flex;justify-content:space-between;align-items:flex-end;z-index:2;gap:20px}
.tags{font-family:var(--mono);font-size:clamp(9px,1.1vw,11px);letter-spacing:.14em;color:var(--dim);text-transform:uppercase;line-height:1.9}
.signoff{font-family:var(--anton);text-transform:uppercase;text-align:right;line-height:.86;
  font-size:clamp(1.4rem,5vw,4rem);letter-spacing:.01em}
.signoff small{display:block;font-family:var(--mono);font-size:.2em;letter-spacing:.3em;color:var(--dim);margin-top:.6em}
.cursor{display:inline-block;width:.5em;height:1em;background:var(--ink);margin-left:.06em;vertical-align:-8%;animation:blink 1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}

@media(prefers-reduced-motion:reduce){.grain{animation:none}.rule{animation:none}.cursor{animation:none}}
</style>

<div class="grain"></div><div class="vig"></div><div class="scan"></div>

<div class="stage">
  <div class="top">
    <div class="sys">◈ <b>AARONAUTICS</b> — FLIGHT SYSTEMS</div>
    <div class="timer" id="timer">SESSION 51:130 : 00</div>
  </div>

  <div class="hero">
    <div class="ghost" aria-hidden="true">51&middot;130</div>
    <div class="session">Session 01 — The Work</div>
    <h1>Aaronautics<span class="cursor"></span></h1>
    <div class="rule"></div>
    <p class="crawl">The builder, adrift in the spaceship <b>AARONAUTICS</b>, will work freely — without fear — creating new systems and dreams by <b>breaking the traditional</b>.</p>
  </div>

  <div class="bottom">
    <div class="tags">
      TYPE&nbsp;01 · ANTON — DISPLAY<br>
      TYPE&nbsp;02 · OSWALD — TEXT<br>
      TYPE&nbsp;03 · SPACE MONO — DATA
    </div>
    <div class="signoff">See you,<br>space cowboy…<small>type identity · bebop cut</small></div>
  </div>
</div>

<script>
(function(){
  var t=document.getElementById("timer"),s=0;
  var reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
  function tick(){s++;var mm=String(Math.floor(s/60)).padStart(2,"0"),ss=String(s%60).padStart(2,"0");
    t.textContent="SESSION 51:130 : "+ss;}
  if(!reduce) setInterval(tick,1000);
})();
</script>`;

fs.writeFileSync(dir + '/type-identity.html', html);
console.log('WROTE type-identity.html · ' + (html.length/1024).toFixed(0) + ' KB');
