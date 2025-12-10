//////////////////////////////
// SETUP THREE.JS
//////////////////////////////
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(6, 6, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);


//////////////////////////////
// LIGHTS FOR GLOSSY LOOK
//////////////////////////////
const light1 = new THREE.PointLight(0xffffff, 1.2);
light1.position.set(10, 10, 10);
scene.add(light1);

const light2 = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(light2);


//////////////////////////////
// CREATE 27 CUBIES
//////////////////////////////
const cubies = [];
const cubeSize = 0.98;

function createCubie(x, y, z) {
    const geom = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    const mats = [
        new THREE.MeshPhongMaterial({ color: 0xff3d3d, shininess: 50 }), // Right
        new THREE.MeshPhongMaterial({ color: 0xff8c00, shininess: 50 }), // Left
        new THREE.MeshPhongMaterial({ color: 0x32cd32, shininess: 50 }), // Top
        new THREE.MeshPhongMaterial({ color: 0x1e90ff, shininess: 50 }), // Bottom
        new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 50 }), // Front
        new THREE.MeshPhongMaterial({ color: 0xffffff, shininess: 50 })  // Back
    ];

    const mesh = new THREE.Mesh(geom, mats);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    return mesh;
}

for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            cubies.push(createCubie(x, y, z));
        }
    }
}


//////////////////////////////
// ROTATION SYSTEM
//////////////////////////////
function rotateLayer(layer, axis) {
    let angle = 0;
    const speed = 0.15;

    const interval = setInterval(() => {
        layer.forEach(c => c.rotateOnWorldAxis(axis, speed));
        angle += speed;
        if (angle >= Math.PI / 2) clearInterval(interval);
    }, 20);
}


//////////////////////////////
// SCRAMBLE SYSTEM
//////////////////////////////
let scrambleMoves = ["U", "D", "L", "R", "F", "B"];
let scrambling = false;
let timerRunning = false;
let timerInterval;
let seconds = 0;

function updateTimer() {
    let m = String(Math.floor(seconds / 60)).padStart(2, "0");
    let s = String(seconds % 60).padStart(2, "0");
    document.getElementById("timer").textContent = `${m}:${s}`;
}

function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    timerInterval = setInterval(() => {
        seconds++;
        updateTimer();
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerRunning = false;
}

function resetTimer() {
    seconds = 0;
    updateTimer();
}

document.getElementById("scrambleBtn").onclick = () => {
    resetTimer();

    let moves = [];
    for (let i = 0; i < 20; i++) {
        moves.push(scrambleMoves[Math.floor(Math.random() * scrambleMoves.length)]);
    }

    let i = 0;
    scrambling = true;

    const interval = setInterval(() => {
        rotateFace(moves[i]);
        i++;

        if (i >= moves.length) {
            clearInterval(interval);
            scrambling = false;
            startTimer(); // start timer after scramble ends
        }
    }, 300);
};


//////////////////////////////
// FACE ROTATOR
//////////////////////////////
function rotateFace(face) {
    if (scrambling) return;

    let layer;

    if (face === "U") layer = cubies.filter(c => c.position.y > 0.5);
    if (face === "D") layer = cubies.filter(c => c.position.y < -0.5);
    if (face === "L") layer = cubies.filter(c => c.position.x < -0.5);
    if (face === "R") layer = cubies.filter(c => c.position.x > 0.5);
    if (face === "F") layer = cubies.filter(c => c.position.z > 0.5);
    if (face === "B") layer = cubies.filter(c => c.position.z < -0.5);

    const axis = {
        U: new THREE.Vector3(0, 1, 0),
        D: new THREE.Vector3(0, -1, 0),
        L: new THREE.Vector3(-1, 0, 0),
        R: new THREE.Vector3(1, 0, 0),
        F: new THREE.Vector3(0, 0, 1),
        B: new THREE.Vector3(0, 0, -1)
    }[face];

    rotateLayer(layer, axis);
}


//////////////////////////////
// ANIMATION LOOP
//////////////////////////////
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
