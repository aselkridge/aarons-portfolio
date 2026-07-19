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
  sword:{ cls:'t-sword', accent:'#f0a63c', accent2:'#ffd36a', star:'#ffe9cf', starDensity:6500,
          bg:['#1a1310','#110b08','#080605'], grain:.09, scan:.30, mood:'jazz',   wpn:'cannon',
          bolt:'#f0a63c', rockFill:'#7a7061', rockLine:'#241c12' },
  roci:{ cls:'t-roci', accent:'#4fb8e8', accent2:'#9affea', star:'#dbeeff', starDensity:4200,
          bg:['#081019','#060b14','#04070d'], grain:.04, scan:.12, mood:'ambient', wpn:'pdc',
          bolt:'#4fb8e8', rockFill:'#8b939e', rockLine:'#1a1f26' }
};
var themeId = 'sword';
function T(){ return THEMES[themeId]; }

/* ══════════ STATIONS ══════════ */
/* The MISSION is the sun — the thing everything else orbits. */
var SUN_STATION = { id:'mission', name:'Mission', color:'#ffb44a', num:'01', r:60,
  env:'hero', envlab:'UPPER ATMOSPHERE',
  eyebrow:'THE CORE · EVERYTHING ORBITS THIS', title:'The tech is the byproduct. The people are the point.',
  body:['An engineer and artist from the Bronx who builds technology that serves people — not the other way around.','Speed from paper to product isn\'t progress if nobody asks whether it should ship at all. I want to be the person who asks those questions before the build starts — who challenges ideas, and helps move the best solutions forward.','Lead Automation Analyst · AI-native GTM architect. I design the orchestration layer where agents, iPaaS, enrichment, and CRM come together so a rep sees one tool instead of five.'],
  tags:['the bronx','engineer + artist','should we build this?'] };
var STATIONS = [
  { id:'alphaforge', name:'AlphaForge', tag:'the proof', color:'#74d0ff', r:18, type:'ringed', orbit:0.44, speed:0.040, a0:1.1,
    env:'city', envlab:'NEON GRID',
    eyebrow:'STATION 02 · THE PROOF', title:'I built the whole machine, then chose not to send yet.',
    body:['The proof behind the mission — a real go-to-market system built end to end in AlphaForge, Clay\'s GTM engineering cohort: 199 schools sourced, 51 disqualified on real checks, 148 qualified, 40 verified head-of-school contacts at ~93% reachability.','Then, with the entire outbound machine ready, I held the send — because the first email real people ever get from you matters more than a deadline. Judgment over volume. That\'s the whole thesis.'],
    tags:['clay','199 → 148 → 40','the held send','judgment over volume'] },
  { id:'life', name:'Life', tag:'the human', color:'#7cff9b', r:16, type:'mooned', orbit:0.57, speed:0.031, a0:2.4,
    env:'forest', envlab:'CANOPY',
    eyebrow:'STATION 03 · THE HUMAN', title:'Multidimensional by design.',
    body:['The relatable frequency — anime and hip-hop, games and grilling, physics and fatherhood. The stuff that makes a person, not a profile.','Tune through the channels: what I\'m watching, playing, listening to, eating, and thinking about.'],
    tags:['anime','games','music','food','physics'] },
  { id:'craft', name:'Oromugai', tag:'the infinite living word', color:'#c9a8ff', r:16, type:'gas', orbit:0.70, speed:0.024, a0:3.5,
    env:'ocean', envlab:'THE LOOP',
    eyebrow:'STATION 04 · THE FORM', title:'Oromugai. Eight syllables. One line.',
    body:['An original poetic form: one line, exactly eight syllables, built to hold meaning that feels larger than its size. Pronounced OH-roh-MOO-guy — rhymes with samurai.','A coined word inspired by Òrò (Yorùbá: word, speech), Mugen (Japanese: infinite — yes, also that Mugen), Aiyé (Yorùbá: world, life), and the Ouroboros, the serpent that loops forever. Together: The Infinite Living Word.'],
    tags:['òrò','mugen','aiyé','ouroboros','8 beats of infinity'] },
  { id:'notes', name:'Notes', tag:'writing + teaching', color:'#ffd36a', r:16, type:'cratered', orbit:0.83, speed:0.018, a0:4.6,
    env:'graffiti', envlab:'THE LOT',
    eyebrow:'STATION 05 · THE SIGNAL', title:'Essays, lessons, transmissions.',
    body:['Writing and teaching — systems thinking, GTM for people who were never handed the map, fatherhood, the build. First transmissions are live below; video lessons are on the roadmap.'],
    tags:['essays','teaching','gtm for us','the build'] }
];

/* ══════════ METRICS ══════════ */
var W,H,CX,CY,unit;
function metrics(){ W=innerWidth; H=innerHeight; CX=W/2; CY=H/2; unit=Math.min(W,H)/2 - Math.min(W,H)*0.06; }
metrics();
function cl(v){ return Math.max(0,Math.min(255,v|0)); }
function hex(c){ c=c.replace('#',''); return [parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)]; }
function shade(c,n){ var p=hex(c); return 'rgb('+cl(p[0]+n)+','+cl(p[1]+n)+','+cl(p[2]+n)+')'; }

