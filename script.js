// Set up the scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create floor
const floorGeometry = new THREE.PlaneGeometry(100, 100);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Create walls
const wallGeometry = new THREE.BoxGeometry(50, 10, 1);
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 });

const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
wall1.position.set(0, 5, -25);
scene.add(wall1);

const wall2 = wall1.clone();
wall2.position.set(0, 5, 25);
scene.add(wall2);

const wall3 = wall1.clone();
wall3.rotation.y = Math.PI / 2;
wall3.position.set(-25, 5, 0);
scene.add(wall3);

const wall4 = wall3.clone();
wall4.position.set(25, 5, 0);
scene.add(wall4);

// Player movement
const controls = { forward: false, backward: false, left: false, right: false };
document.addEventListener("keydown", (event) => {
    if (event.key === "w") controls.forward = true;
    if (event.key === "s") controls.backward = true;
    if (event.key === "a") controls.left = true;
    if (event.key === "d") controls.right = true;
});

document.addEventListener("keyup", (event) => {
    if (event.key === "w") controls.forward = false;
    if (event.key === "s") controls.backward = false;
    if (event.key === "a") controls.left = false;
    if (event.key === "d") controls.right = false;
});

// Add a creepy monster sprite
const textureLoader = new THREE.TextureLoader();
const monsterTexture = textureLoader.load("monster.png"); // Add a scary image
const monsterMaterial = new THREE.SpriteMaterial({ map: monsterTexture });
const monster = new THREE.Sprite(monsterMaterial);
monster.scale.set(5, 5, 1);
monster.position.set(0, 3, -10);
scene.add(monster);

// Random jumpscare logic
function triggerJumpScare() {
    const jumpscareSound = document.getElementById("jumpscareSound");
    jumpscareSound.play();
    monster.position.set(camera.position.x, camera.position.y, camera.position.z - 2);
    setTimeout(() => {
        monster.position.set(0, -100, 0); // Hide monster after scare
    }, 1000);
}

setInterval(() => {
    if (Math.random() < 0.1) { // 10% chance every few seconds
        triggerJumpScare();
    }
}, 5000);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Movement logic
    const speed = 0.1;
    if (controls.forward) camera.position.z -= speed;
    if (controls.backward) camera.position.z += speed;
    if (controls.left) camera.position.x -= speed;
    if (controls.right) camera.position.x += speed;

    renderer.render(scene, camera);
}

animate();
