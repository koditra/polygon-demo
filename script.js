import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180/build/three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const canvas = document.querySelector('#bg');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

scene.background = new THREE.Color(0x050505);
camera.position.setZ(5.5);

const loader = new THREE.TextureLoader();

const boxTexture = loader.load('./assets/joseph.png');
const donutTexture = loader.load('./assets/nebula.jpg');
const metalTexture = loader.load('./assets/metal.avif');

const addMesh = (parent, geometry, material) => {
    const mesh = new THREE.Mesh(geometry, material);
    parent.add(mesh);
    return mesh;
};

// Main cube
const cube = addMesh(
    scene,
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ map: boxTexture })
);

// Nebula ring
const ring = addMesh(
    scene,
    new THREE.TorusGeometry(8.5, 1.8, 16, 100),
    new THREE.MeshBasicMaterial({ map: donutTexture })
);

ring.rotation.x = Math.PI / 2;
ring.position.z = -2;

// Orb
const orb = new THREE.Group();

const core = addMesh(
    orb,
    new THREE.IcosahedronGeometry(2.3, 0),
    new THREE.MeshBasicMaterial({
        map: boxTexture,
        transparent: true,
        opacity: 0.95
    })
);

core.position.y = 0.3;

const shell = addMesh(
    orb,
    new THREE.SphereGeometry(2.9, 32, 32),
    new THREE.MeshBasicMaterial({
        color: 0xffb347,
        transparent: true,
        opacity: 0.18
    })
);

shell.position.y = 0.3;

const metalBand = addMesh(
    orb,
    new THREE.TorusGeometry(3.1, 0.18, 16, 120),
    new THREE.MeshBasicMaterial({
        map: metalTexture,
        transparent: true,
        opacity: 0.9
    })
);

metalBand.rotation.x = Math.PI / 2;
metalBand.position.z = 0.7;

const glowRing = addMesh(
    orb,
    new THREE.TorusGeometry(4.2, 0.08, 16, 160),
    new THREE.MeshBasicMaterial({
        color: 0xcfffec,
        transparent: true,
        opacity: 0.7
    })
);

glowRing.rotation.y = Math.PI / 2;
glowRing.position.z = 1.2;

orb.position.set(-4, 0, 88);
scene.add(orb);

// Stars
for (let i = 0; i < 180; i++) {
    const star = addMesh(
        scene,
        new THREE.SphereGeometry(0.25, 24, 24),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    );

    star.position.set(
        THREE.MathUtils.randFloatSpread(200),
        THREE.MathUtils.randFloatSpread(200),
        THREE.MathUtils.randFloatSpread(200)
    );
}

// Animation
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    ring.rotation.x += 0.008;
    ring.rotation.y += 0.008;

    cube.rotation.y += 0.01;
    cube.rotation.z += 0.01;

    orb.position.y = Math.sin(time * 1.3) * 0.8;
    orb.position.z = 77 + Math.sin(time * 0.8) * 1.2;

    orb.rotation.y = time * 0.6;
    orb.rotation.x = Math.sin(time * 0.7) * 0.5;

    core.rotation.y += 0.012;
    metalBand.rotation.z += 0.008;

    renderer.render(scene, camera);
}

// Camera scrolling
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;

    camera.position.z = 5.5 + t * -0.028;
    camera.position.x = t * -0.0008;
    camera.rotation.y = t * -0.0007;
}

document.body.addEventListener('scroll', moveCamera);
window.addEventListener('scroll', moveCamera);

moveCamera();
animate();

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Save checkbox progress
document.querySelectorAll('.check').forEach((check, index) => {
    const key = `project-${index}`;

    const saved = localStorage.getItem(key);

    if (saved !== null) {
        check.checked = saved === 'true';
    }

    check.addEventListener('change', () => {
        localStorage.setItem(key, check.checked);
    });
});

// Surprise screen
const surpriseScreen = document.querySelector('#surprise-screen');

function checkBottom() {
    const scrollBottom = window.scrollY + window.innerHeight;
    const pageBottom = document.documentElement.scrollHeight;
    const atBottom = scrollBottom >= pageBottom - 2;

    surpriseScreen.classList.toggle('visible', atBottom);
}

window.addEventListener('scroll', checkBottom);
window.addEventListener('resize', checkBottom);

// Start at the top
window.history.scrollRestoration = 'manual';

window.addEventListener('load', () => {
    window.scrollTo(0, 0);
    checkBottom();
});
