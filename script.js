import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const canvas = document.querySelector('#bg');
if (!canvas) {
  console.error('Canvas element #bg not found!');
}

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
scene.background = new THREE.Color(0x050505);
camera.position.setZ(5.5);

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const boxTexture = textureLoader.load('joseph.png');
const donutTexture = textureLoader.load('nebula.jpg');
const rocketBodyTexture = textureLoader.load('rocketbody.jpeg');
const metalTexture = textureLoader.load('metal.avif');

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: boxTexture });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const ring = new THREE.Mesh(
  new THREE.TorusGeometry(8.5, 1.8, 16, 100),
  new THREE.MeshBasicMaterial({ map: donutTexture })
);
ring.rotation.x = Math.PI / 2;
ring.position.z = 1;
ring.visible = true;
scene.add(ring);

const orb = new THREE.Group();
orb.visible = true;

const core = new THREE.Mesh(
  new THREE.IcosahedronGeometry(2.3, 0),
  new THREE.MeshBasicMaterial({
    map: boxTexture,
    transparent: true,
    opacity: 0.95
  })
);
core.position.y = 0.3;
orb.add(core);

const shell = new THREE.Mesh(
  new THREE.SphereGeometry(2.9, 32, 32),
  new THREE.MeshBasicMaterial({
    color: 0xffb347,
    transparent: true,
    opacity: 0.18
  })
);
shell.position.y = 0.3;
orb.add(shell);

const metalBand = new THREE.Mesh(
  new THREE.TorusGeometry(3.1, 0.18, 16, 120),
  new THREE.MeshBasicMaterial({
    map: metalTexture,
    transparent: true,
    opacity: 0.9
  })
);
metalBand.rotation.x = Math.PI / 2;
metalBand.position.z = 0.7;
orb.add(metalBand);

const glowRing = new THREE.Mesh(
  new THREE.TorusGeometry(4.2, 0.08, 16, 160),
  new THREE.MeshBasicMaterial({
    color: 0xcfffec,
    transparent: true,
    opacity: 0.7
  })
);
glowRing.rotation.y = Math.PI / 2;
glowRing.position.z = 1.2;
orb.add(glowRing);

orb.position.set(-4, 0, 65);
scene.add(orb);

function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  ring.rotation.x += 0.008;
  ring.rotation.y += 0.008;

  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  orb.position.y = Math.sin(time * 1.3) * 0.8;
  orb.position.z = 65 + Math.sin(time * 0.8) * 1.2;
  orb.rotation.y = time * 0.6;
  orb.rotation.x = Math.sin(time * 0.7) * 0.5;

  core.rotation.y += 0.012;
  metalBand.rotation.z += 0.008;

  renderer.render(scene, camera);
}

function add_star() {
  const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
  const starMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(starGeometry, starMaterial);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
}

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  camera.position.z = 5.5 + t * -0.028;
  camera.position.x = t * -0.0008;
  camera.rotation.y = t * -0.0007;
}

document.body.onscroll = moveCamera;
moveCamera();

Array(180).fill().forEach(add_star);
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

const checks = document.querySelectorAll('.check');

checks.forEach((check, index) => {
  const key = `project-${index}`;

  const saved = localStorage.getItem(key);
  if (saved !== null) {
    check.checked = saved === 'true';
  }

  check.addEventListener('change', () => {
    localStorage.setItem(key, check.checked);
  });
});

window.history.scrollRestoration = 'manual';

window.addEventListener('load', () => {
  window.scrollTo(0, 0);
});