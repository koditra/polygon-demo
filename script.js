import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180/build/three.module.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const stardanceLogo = document.getElementById("stardance-logo");

const rocketStartX = -5;

let launchStarted = false;
let launching = false;
let launchSpeed = 0;

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
camera.position.setZ(17);


const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

const boxTexture = textureLoader.load("joseph.png");
const donutTexture = textureLoader.load("nebula.jpg");
const rocketBodyTexture = textureLoader.load("rocketbody.jpeg");
const metalTexture = textureLoader.load("metal.avif");


const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: boxTexture });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


const donut_geo = new THREE.TorusGeometry(10, 3, 16, 100);
const donut_tex = new THREE.MeshBasicMaterial({ map: donutTexture });
const donut = new THREE.Mesh(donut_geo, donut_tex);
scene.add(donut);


const rocket = new THREE.Group();


const body = new THREE.Mesh(
  new THREE.CylinderGeometry(1, 1, 6, 32),
  new THREE.MeshBasicMaterial({ map: rocketBodyTexture })
);


const nose = new THREE.Mesh(
  new THREE.ConeGeometry(1, 2, 32),
  new THREE.MeshBasicMaterial({ map: metalTexture })
);
nose.position.y = 4;


const engine = new THREE.Mesh(
  new THREE.CylinderGeometry(0.6, 0.8, 1, 32),
  new THREE.MeshBasicMaterial({ map: metalTexture })
);
engine.position.y = -3.5;


const fin1 = new THREE.Mesh(
  new THREE.BoxGeometry(0.2, 1.5, 1),
  new THREE.MeshBasicMaterial({ color: 0x909090 })
);
fin1.position.set(1, -2, 0);


const fin2 = fin1.clone();
fin2.position.set(-1, -2, 0);


const fin3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1.5, 0.2),
  new THREE.MeshBasicMaterial({ color: 0x909090 })
);
fin3.position.set(0, -2, 1);


const fin4 = fin3.clone();
fin4.position.set(0, -2, -1);


rocket.add(body, nose, engine, fin1, fin2, fin3, fin4);

rocket.position.set(rocketStartX, 0, 20);
scene.add(rocket);


const flame = new THREE.Group();


const outerFlame = new THREE.Mesh(
  new THREE.ConeGeometry(0.5, 2, 16),
  new THREE.MeshBasicMaterial({ color: 0xff6b00 })
);
outerFlame.rotation.x = Math.PI;
outerFlame.position.y = -4.8;


const innerFlame = new THREE.Mesh(
  new THREE.ConeGeometry(0.25, 1.2, 16),
  new THREE.MeshBasicMaterial({ color: 0xffff66 })
);
innerFlame.rotation.x = Math.PI;
innerFlame.position.y = -4.4;


flame.add(outerFlame, innerFlame);
rocket.add(flame);


const initialRocketY = 0;


function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  donut.rotation.x += 0.01;
  donut.rotation.y += 0.01;
  rocket.rotation.y += 0.003;

  if (!launching && !launchStarted) {
    rocket.position.y = initialRocketY + Math.sin(time * 1.5) * 0.4;
    rocket.rotation.z = Math.sin(time) * 0.05;
  }

  if (!launching) {
    outerFlame.scale.y = 0.8 + Math.random() * 0.4;
    innerFlame.scale.y = 0.8 + Math.random() * 0.4;
    outerFlame.rotation.z = Math.sin(time) * 0.05;
    innerFlame.rotation.z = Math.cos(time) * 0.05;
  }

  if (launchStarted && !launching) {
    rocket.position.x = rocketStartX + Math.sin(Date.now() * 0.05) * 0.1;
  }

  if (launching) {
    launchSpeed += 0.1;
    launchSpeed = Math.min(launchSpeed, 1);  
    rocket.position.y += launchSpeed;
    
    outerFlame.scale.y = 2;
    innerFlame.scale.y = 1.6;
  }

  if (launching && rocket.position.y > 40) {
    launching = false;
    document.body.style.overflow = "";
  }

  renderer.render(scene, camera);
}


function add_star() {
  const star_geometry = new THREE.SphereGeometry(0.25, 24, 24);  // Fixed: Better sphere quality
  const star_material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(star_geometry, star_material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(200));

  star.position.set(x, y, z);
  scene.add(star);
}


function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  cube.rotation.y += 0.01;
  cube.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002; 
  camera.rotation.y = t * -0.0002; 

  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;

  const atBottom = scrollY + windowHeight >= pageHeight - 10;

  if (!launchStarted && atBottom) {
    launchStarted = true;
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      launchSpeed = 0;
      launching = true;

      setTimeout(() => {
        stardanceLogo.classList.add("show");
      }, 1200);

      setTimeout(() => {
        stardanceLogo.classList.remove("show");
      }, 3200);
    }, 500);
  }
}


document.body.onscroll = moveCamera;
moveCamera();


Array(200).fill().forEach(add_star);
animate();


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});


//this makes it only run if elements exist
const checks = document.querySelectorAll(".check");
checks.forEach((check, index) => {
  const key = `project-${index}`;
  
  const saved = localStorage.getItem(key);
  if (saved !== null) {
    check.checked = saved === "true";
  }

  check.addEventListener("change", () => {
    localStorage.setItem(key, check.checked);
  });
});

window.history.scrollRestoration = "manual";

window.addEventListener("load", () => {
  window.scrollTo(0, 0);
});
