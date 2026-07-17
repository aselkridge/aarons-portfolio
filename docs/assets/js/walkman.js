// Aaronautics — Walkman WM-F2078 on the mission desk
// Three.js r169 (bundled/self-hosted). PBR + IBL, pressable 3D transport,
// four-aesthetic theme switch. Music via the Spotify iFrame API (window.AAudio).
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const DRACO_PATH = 'assets/vendor/draco/';
const MODEL = 'assets/models/walkman.glb';

const stage = document.getElementById('stage');
const loadEl = document.getElementById('load');
const loadPct = document.getElementById('load-pct');
const loadMsg = document.getElementById('load-msg');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── themes (from the approved brief descriptions) ────────────────────────────
const THEMES = [
  { id:'bebop',  name:'ANIME · BEBOP',        accent:'#ff7a3c', bg:['#16171c','#0c0c0f','#0a0908'],
    key:0xfff2e0, keyI:2.6, rim:0x74d0ff, rimI:2.1, fill:0x9fb8ff, grain:.09, scan:.34, expo:1.05 },
  { id:'retro',  name:'RETRO · APOLLO',       accent:'#ffb44a', bg:['#1d1710','#120d07','#090604'],
    key:0xffd6a0, keyI:2.9, rim:0xff9a3c, rimI:1.5, fill:0xffcf9a, grain:.13, scan:.62, expo:1.02 },
  { id:'modern', name:'MODERN · GLASS',       accent:'#e9edf2', bg:['#1b1d20','#141619','#0d0e10'],
    key:0xffffff, keyI:2.2, rim:0xbfd4ff, rimI:1.3, fill:0xcfd8e6, grain:.03, scan:.0,  expo:1.1 },
  { id:'future', name:'FUTURISTIC · EXPANSE', accent:'#74d0ff', bg:['#0b1420','#081019','#04080e'],
    key:0xdff0ff, keyI:2.2, rim:0x3aa0ff, rimI:2.7, fill:0x6fb4ff, grain:.05, scan:.2,  expo:1.08 },
];
let themeIdx = 0;

// ── renderer ─────────────────────────────────────────────────────────────────
const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true, powerPreference:'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(stage.clientWidth, stage.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(34, stage.clientWidth/stage.clientHeight, 0.1, 100);
camera.position.set(2.6, 1.7, 3.4);

// ── lighting rig (theme-driven) ──────────────────────────────────────────────
const key = new THREE.DirectionalLight(0xfff2e0, 2.6);
key.position.set(4, 6.5, 4);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.bias = -0.0003; key.shadow.normalBias = 0.02;
Object.assign(key.shadow.camera, { near:0.5, far:30, left:-5, right:5, top:5, bottom:-5 });
scene.add(key);
const fill = new THREE.DirectionalLight(0x9fb8ff, 0.7); fill.position.set(-5, 2.5, 1.5); scene.add(fill);
const rim  = new THREE.DirectionalLight(0x74d0ff, 2.1); rim.position.set(-2.5, 3.5, -5); scene.add(rim);
scene.add(new THREE.HemisphereLight(0x8899bb, 0x0a0908, 0.25));

// ── the desk (visible surface + shadow catcher) ──────────────────────────────
const desk = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.MeshStandardMaterial({ color:0x0e0f12, roughness:0.55, metalness:0.35, envMapIntensity:0.5 })
);
desk.rotation.x = -Math.PI/2; desk.receiveShadow = true; scene.add(desk);

// ── controls ─────────────────────────────────────────────────────────────────
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.06;
controls.enablePan = false; controls.minDistance = 1.8; controls.maxDistance = 8;
controls.maxPolarAngle = Math.PI * 0.52;
controls.autoRotate = !reduce; controls.autoRotateSpeed = 0.6;
let idleTimer;
controls.addEventListener('start', () => { controls.autoRotate = false; clearTimeout(idleTimer); });
controls.addEventListener('end', () => { clearTimeout(idleTimer); if (!reduce) idleTimer = setTimeout(()=>{controls.autoRotate=true;}, 3500); });

// ── pressable 3D transport panel ─────────────────────────────────────────────
const keyGroup = new THREE.Group();
const keyMeshes = [];
const KEY_DEFS = [
  { action:'prev', glyph:'◄◄' },
  { action:'play', glyph:'►'  },
  { action:'stop', glyph:'■'  },
  { action:'next', glyph:'►►' },
];
function glyphTexture(glyph){
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d');
  x.clearRect(0,0,128,128);
  x.fillStyle = '#efece6'; x.font = 'bold 62px "Space Mono", monospace';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(glyph, 64, 70);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}
function buildTransport(baseY, frontZ){
  const kw = 0.16, kh = 0.06, kd = 0.13, gap = 0.045;
  const total = KEY_DEFS.length*kw + (KEY_DEFS.length-1)*gap;
  // base plate
  const plate = new THREE.Mesh(
    new THREE.BoxGeometry(total+0.12, 0.03, kd+0.1),
    new THREE.MeshStandardMaterial({ color:0x161513, roughness:0.5, metalness:0.7, envMapIntensity:0.8 })
  );
  plate.position.set(0, baseY+0.015, frontZ); plate.castShadow = plate.receiveShadow = true;
  keyGroup.add(plate);
  KEY_DEFS.forEach((def, i) => {
    const mat = new THREE.MeshStandardMaterial({ color:0x2a2723, roughness:0.4, metalness:0.55, envMapIntensity:0.9 });
    const top = new THREE.MeshStandardMaterial({ color:0x201d1a, roughness:0.35, metalness:0.5,
      map:glyphTexture(def.glyph), envMapIntensity:0.9 });
    // box faces: [+x,-x,+y,-y,+z,-z] — glyph on +y (top)
    const k = new THREE.Mesh(new THREE.BoxGeometry(kw, kh, kd), [mat,mat,top,mat,mat,mat]);
    const x = -total/2 + kw/2 + i*(kw+gap);
    k.position.set(x, baseY+0.03+kh/2, frontZ);
    k.castShadow = true;
    k.userData = { action:def.action, restY:k.position.y, t:0 };
    keyMeshes.push(k); keyGroup.add(k);
  });
  scene.add(keyGroup);
}
function pressKey(mesh){
  mesh.userData.t = 1;                      // animate down→up in the loop
  const act = mesh.userData.action;
  if (window.AAudio && window.AAudio[act]) window.AAudio[act]();
}

// ── load model ───────────────────────────────────────────────────────────────
const draco = new DRACOLoader().setDecoderPath(DRACO_PATH);
const loader = new GLTFLoader().setDRACOLoader(draco);
let model = null;

loader.load(MODEL, (gltf) => {
  model = gltf.scene;
  model.traverse((o) => { if (o.isMesh){ o.castShadow = o.receiveShadow = true; if (o.material) o.material.envMapIntensity = 1.1; } });
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const target = 2.2, s = target / Math.max(size.x, size.y, size.z);
  model.scale.setScalar(s);
  model.position.set(-center.x*s, -box.min.y*s, -center.z*s);
  model.rotation.y = -0.5;
  scene.add(model);
  const fit = new THREE.Box3().setFromObject(model);
  const fc = fit.getCenter(new THREE.Vector3());
  controls.target.set(0, fc.y, 0); controls.update();

  buildTransport(0, fit.max.z + 0.16);      // panel on the desk, in front of the deck

  loadMsg.textContent = 'SIGNAL ACQUIRED'; loadPct.textContent = '100';
  requestAnimationFrame(() => { loadEl.classList.add('done'); stage.classList.add('ready'); });
  applyTheme(themeIdx);
}, (e) => {
  if (e.lengthComputable){ const p = Math.min(99, Math.round(e.loaded/e.total*100));
    loadPct.textContent = String(p); if (p > 60) loadMsg.textContent = 'DECODING GEOMETRY'; }
}, (err) => { console.error(err); loadMsg.textContent = 'TELEMETRY LOST — RETRY'; loadPct.textContent = '!!'; });

// ── raycast: press 3D keys, or click the deck to toggle ──────────────────────
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
let downXY = null;
renderer.domElement.addEventListener('pointerdown', (e) => { downXY = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!downXY) return;
  const moved = Math.hypot(e.clientX-downXY[0], e.clientY-downXY[1]); downXY = null;
  if (moved > 6) return;
  const r = renderer.domElement.getBoundingClientRect();
  ptr.x = ((e.clientX-r.left)/r.width)*2-1; ptr.y = -((e.clientY-r.top)/r.height)*2+1;
  ray.setFromCamera(ptr, camera);
  const hitKey = ray.intersectObjects(keyMeshes, false)[0];
  if (hitKey){ pressKey(hitKey.object); return; }
  if (model && ray.intersectObject(model, true).length && window.AAudio) window.AAudio.toggle();
});

// test hook: screen positions of the 3D keys (used by the headless verifier)
window.__keyScreenPos = () => keyMeshes.map(k => {
  const v = k.position.clone().project(camera);
  const r = renderer.domElement.getBoundingClientRect();
  return { action:k.userData.action, x:(v.x*0.5+0.5)*r.width+r.left, y:(-v.y*0.5+0.5)*r.height+r.top };
});

// ── theme switch ─────────────────────────────────────────────────────────────
const root = document.documentElement;
function applyTheme(i){
  themeIdx = (i + THEMES.length) % THEMES.length;
  const t = THEMES[themeIdx];
  key.color.set(t.key); key.intensity = t.keyI;
  rim.color.set(t.rim); rim.intensity = t.rimI;
  fill.color.set(t.fill);
  renderer.toneMappingExposure = t.expo;
  // play-key LED tint
  const led = keyMeshes.find(k => k.userData.action === 'play');
  if (led) led.material[2].emissive = new THREE.Color(t.accent);
  // DOM: accent, background, overlays, label
  root.style.setProperty('--accent', t.accent);
  root.style.setProperty('--bg1', t.bg[0]); root.style.setProperty('--bg2', t.bg[1]); root.style.setProperty('--bg3', t.bg[2]);
  root.style.setProperty('--grain-o', String(t.grain)); root.style.setProperty('--scan-o', String(t.scan));
  const label = document.getElementById('theme-name'); if (label) label.textContent = t.name;
}
window.AAscene = { cycle:(d)=>applyTheme(themeIdx + d), setTheme:(id)=>{ const i = THEMES.findIndex(x=>x.id===id); if(i>=0) applyTheme(i); } };

// ── resize + loop ─────────────────────────────────────────────────────────────
function resize(){ const w = stage.clientWidth, h = stage.clientHeight; camera.aspect = w/h; camera.updateProjectionMatrix(); renderer.setSize(w, h); }
addEventListener('resize', resize);

renderer.setAnimationLoop(() => {
  controls.update();
  // key press bounce + play LED
  const playing = !!(window.AAudio && window.AAudio.isPlaying && window.AAudio.isPlaying());
  for (const k of keyMeshes){
    if (k.userData.t > 0){ k.userData.t = Math.max(0, k.userData.t - 0.12);
      k.position.y = k.userData.restY - Math.sin(k.userData.t*Math.PI)*0.02; }
    if (k.userData.action === 'play'){ const m = k.material[2];
      m.emissiveIntensity = playing ? 0.9 : 0.0; }
  }
  renderer.render(scene, camera);
});
