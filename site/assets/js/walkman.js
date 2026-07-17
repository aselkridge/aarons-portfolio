// Aaronautics — Walkman WM-F2078 · real WebGL preview
// Three.js r169 (loaded via importmap CDN). PBR + RoomEnvironment + soft shadow.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const DRACO_PATH = 'assets/vendor/draco/';   // self-hosted decoder, no CDN
const MODEL = 'assets/models/walkman.glb';

const stage = document.getElementById('stage');
const loadEl = document.getElementById('load');
const loadPct = document.getElementById('load-pct');
const loadMsg = document.getElementById('load-msg');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(stage.clientWidth, stage.clientHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
stage.appendChild(renderer.domElement);

const scene = new THREE.Scene();

// image-based lighting so the metal/plastic PBR reads richly (no external HDR file)
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

const camera = new THREE.PerspectiveCamera(34, stage.clientWidth / stage.clientHeight, 0.1, 100);
camera.position.set(2.6, 1.7, 3.4);

// ── lighting rig: warm key, cool fill, blue rim ────────────────────────────
const key = new THREE.DirectionalLight(0xfff2e0, 2.6);
key.position.set(4, 6.5, 4);
key.castShadow = true;
key.shadow.mapSize.set(2048, 2048);
key.shadow.bias = -0.0003;
key.shadow.normalBias = 0.02;
const sc = key.shadow.camera;
sc.near = 0.5; sc.far = 30; sc.left = sc.bottom = -5; sc.right = sc.top = 5;
scene.add(key);

const fill = new THREE.DirectionalLight(0x9fb8ff, 0.7);
fill.position.set(-5, 2.5, 1.5);
scene.add(fill);

const rim = new THREE.DirectionalLight(0x74d0ff, 2.1);
rim.position.set(-2.5, 3.5, -5);
scene.add(rim);

scene.add(new THREE.HemisphereLight(0x8899bb, 0x0a0908, 0.25));

// ── shadow-catching ground ─────────────────────────────────────────────────
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(40, 40),
  new THREE.ShadowMaterial({ opacity: 0.42 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// ── controls ────────────────────────────────────────────────────────────────
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;
controls.minDistance = 1.8;
controls.maxDistance = 8;
controls.maxPolarAngle = Math.PI * 0.52;
controls.autoRotate = !reduce;
controls.autoRotateSpeed = 0.6;

let idleTimer;
controls.addEventListener('start', () => { controls.autoRotate = false; clearTimeout(idleTimer); });
controls.addEventListener('end', () => {
  clearTimeout(idleTimer);
  if (!reduce) idleTimer = setTimeout(() => { controls.autoRotate = true; }, 3500);
});

// ── load model ───────────────────────────────────────────────────────────────
const draco = new DRACOLoader().setDecoderPath(DRACO_PATH);
const loader = new GLTFLoader().setDRACOLoader(draco);

let model = null;

loader.load(
  MODEL,
  (gltf) => {
    model = gltf.scene;
    model.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (o.material) o.material.envMapIntensity = 1.1;
      }
    });

    // recenter to origin, scale to a consistent framing, seat on the ground
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const target = 2.4;                     // desired largest dimension in world units
    const s = target / Math.max(size.x, size.y, size.z);
    model.scale.setScalar(s);
    model.position.set(-center.x * s, -box.min.y * s, -center.z * s);

    // slight lean so it presents like a display piece, not a floorplan
    model.rotation.y = -0.5;

    scene.add(model);

    const fitBox = new THREE.Box3().setFromObject(model);
    const fitCenter = fitBox.getCenter(new THREE.Vector3());
    controls.target.set(0, fitCenter.y, 0);
    controls.update();

    loadMsg.textContent = 'SIGNAL ACQUIRED';
    loadPct.textContent = '100';
    requestAnimationFrame(() => {
      loadEl.classList.add('done');
      stage.classList.add('ready');
    });
  },
  (e) => {
    if (e.lengthComputable) {
      const p = Math.min(99, Math.round((e.loaded / e.total) * 100));
      loadPct.textContent = String(p);
      if (p > 60) loadMsg.textContent = 'DECODING GEOMETRY';
    }
  },
  (err) => {
    console.error(err);
    loadMsg.textContent = 'TELEMETRY LOST — RETRY';
    loadPct.textContent = '!!';
  }
);

// ── click the deck to toggle music (diegetic nod) ────────────────────────────
const ray = new THREE.Raycaster();
const ptr = new THREE.Vector2();
let downXY = null;
renderer.domElement.addEventListener('pointerdown', (e) => { downXY = [e.clientX, e.clientY]; });
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!downXY || !model) return;
  const moved = Math.hypot(e.clientX - downXY[0], e.clientY - downXY[1]);
  downXY = null;
  if (moved > 6) return;                    // was a drag, not a click
  const r = renderer.domElement.getBoundingClientRect();
  ptr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
  ptr.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  ray.setFromCamera(ptr, camera);
  if (ray.intersectObject(model, true).length && window.AAudio) window.AAudio.toggle();
});

// ── resize ────────────────────────────────────────────────────────────────────
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}
addEventListener('resize', resize);

// ── render loop ───────────────────────────────────────────────────────────────
renderer.setAnimationLoop(() => {
  controls.update();
  renderer.render(scene, camera);
});
