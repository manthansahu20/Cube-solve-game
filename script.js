//////////////////////////////
//  SETUP SCENE, CAMERA
//////////////////////////////
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1, 1000
);
camera.position.set(5, 5, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);


//////////////////////////////
//  CREATE 27 CUBIES
//////////////////////////////
const cubies = [];
const size = 0.9;

function createCubie(x, y, z) {
    const geom = new THREE.BoxGeometry(size, size, size);

    const mats = [
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Right
        new THREE.MeshBasicMaterial({ color: 0xffa500 }), // Left
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Top
        new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Bottom
        new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Front
        new THREE.MeshBasicMaterial({ color: 0xffffff })  // Back
    ];

    const cube = new THREE.Mesh(geom, mats);
    cube.position.set(x, y, z);
    scene.add(cube);
    return cube;
}

for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            cubies.push(createCubie(x, y, z));
        }
    }
}


//////////////////////////////
// FACE ROTATION FUNCTION
//////////////////////////////
function rotateFace(face) {
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

    let angle = 0;
    const interval = setInterval(() => {
        const rot = 0.1;
        angle += rot;
        layer.forEach(c => c.rotateOnWorldAxis(axis, rot));
        if (angle >= Math.PI / 2) clearInterval(interval);
    }, 20);
}


//////////////////////////////
// RENDER LOOP
//////////////////////////////
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
