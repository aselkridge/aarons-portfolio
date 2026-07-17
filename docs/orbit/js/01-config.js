// ══════════════════════════════════════════════════════════════════
// AARONAUTICS ORBIT — CONFIG
// Themes, stations/sun/ronin data, tiny shared helpers ($ , color math).
// (mechanically split from the original single orbit.js; original source: lines 6-8, 10-59)
// ══════════════════════════════════════════════════════════════════
'use strict';

var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
var fine = matchMedia('(hover:hover)').matches;
var $ = function(id){ return document.getElementById(id); };

/* ══════════ THEMES ══════════ */
var THEMES = {
  sword:{ cls:'t-sword', accent:'#ff7a3c', accent2:'#ffd36a', star:'#ffe9cf', starDensity:6500,
          bg:['#1a1310','#110b08','#080605'], grain:.09, scan:.30, mood:'jazz',   wpn:'cannon',
          bolt:'#ffb44a', rockFill:'#7a7061', rockLine:'#241c12' },
  roci:{ cls:'t-roci', accent:'#74d0ff', accent2:'#9affea', star:'#dbeeff', starDensity:4200,
          bg:['#081019','#060b14','#04070d'], grain:.04, scan:.12, mood:'ambient', wpn:'pdc',
          bolt:'#86dcff', rockFill:'#8b939e', rockLine:'#1a1f26' }
};
var themeId = 'sword';
function T(){ return THEMES[themeId]; }

/* ══════════ STATIONS ══════════ */
/* The MISSION is the sun — the thing everything else orbits. */
var SUN_STATION = { id:'mission', name:'Mission', color:'#ffb44a', num:'01', r:60,
  env:'hero', envlab:'UPPER ATMOSPHERE',
  eyebrow:'THE CORE · EVERYTHING ORBITS THIS', title:'Built to be more than one thing.',
  body:['This is the flagship — the point of view, not the résumé. Aeronautics engineer by degree, automation builder by trade, poet and father by nature. The through-line isn\'t a job title; it\'s the range itself.','Aaronautics is a place to interface with that range — not a page to scroll. Everything in this system orbits this one idea.'],
  tags:['point of view','the mission','more than one thing'] };
var STATIONS = [
  { id:'alphaforge', name:'AlphaForge', tag:'the proof', color:'#74d0ff', r:18, type:'ringed', orbit:0.44, speed:0.040, a0:1.1,
    env:'city', envlab:'NEON GRID',
    eyebrow:'STATION 02 · THE PROOF', title:'Nine GTM builds.',
    body:['The proof behind the mission — nine go-to-market builds from the Clay-led AlphaForge cohort. Each one: the problem, what got built, and the number that moved.','Wiring in the real Clay tables next — this station will read like a launch manifest, 001 through 009.'],
    tags:['clay','go-to-market','9 builds','001 – 009'], soon:true },
  { id:'life', name:'Life', tag:'the human', color:'#7cff9b', r:16, type:'mooned', orbit:0.57, speed:0.031, a0:2.4,
    env:'forest', envlab:'CANOPY',
    eyebrow:'STATION 03 · THE HUMAN', title:'Reading, watching, listening, eating.',
    body:['The relatable frequency — anime and hip-hop, the food, the conversation-starters. The stuff that makes a person, not a profile.'],
    tags:['anime','hip-hop','food','the bronx'], soon:true },
  { id:'craft', name:'Craft', tag:'no ROI attached', color:'#c9a8ff', r:16, type:'gas', orbit:0.70, speed:0.024, a0:3.5,
    env:'ocean', envlab:'OPEN WATER',
    eyebrow:'STATION 04 · THE ARTIST', title:'Made with no ROI attached.',
    body:['Poetry, drawings, physics for its own sake. The work that exists because it had to, not because it converted.'],
    tags:['poetry','drawing','physics'], soon:true },
  { id:'notes', name:'Notes', tag:'writing + video', color:'#ffd36a', r:16, type:'cratered', orbit:0.83, speed:0.018, a0:4.6,
    env:'graffiti', envlab:'THE LOT',
    eyebrow:'STATION 05 · THE SIGNAL', title:'Fatherhood, the Bronx, the build.',
    body:['Writing and video — fatherhood, becoming a husband, renovating a home, and explaining GTM to a community that was never handed the map.'],
    tags:['fatherhood','the bronx','building a home','gtm for us'], soon:true }
];

/* ══════════ METRICS ══════════ */
var W,H,CX,CY,unit;
function metrics(){ W=innerWidth; H=innerHeight; CX=W/2; CY=H/2; unit=Math.min(W,H)/2 - Math.min(W,H)*0.06; }
metrics();
function cl(v){ return Math.max(0,Math.min(255,v|0)); }
function hex(c){ c=c.replace('#',''); return [parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)]; }
function shade(c,n){ var p=hex(c); return 'rgb('+cl(p[0]+n)+','+cl(p[1]+n)+','+cl(p[2]+n)+')'; }

