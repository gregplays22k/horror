// Initialize Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("gameCanvas") });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set up basic lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 5, 0);
scene.add(light);

// Create floor
const floorGeometry = new THREE.PlaneGeometry(50, 50);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Create walls
const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x444444 });
const createWall = (x, z, rotation) => {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(50, 10, 1), wallMaterial);
    wall.position.set(x, 5, z);
    wall.rotation.y = rotation;
    scene.add(wall);
};
createWall(0, -25, 0);
createWall(0, 25, 0);
createWall(-25, 0, Math.PI / 2);
createWall(25, 0, Math.PI / 2);

// Add escape door
const doorGeometry = new THREE.BoxGeometry(5, 8, 1);
const doorMaterial = new THREE.MeshBasicMaterial({ color: 0x5555ff });
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(20, 4, -20);
scene.add(door);

// Create monster sprite
const textureLoader = new THREE.TextureLoader();
const monsterTexture = textureLoader.load("monster.png"); // Scary image
const monsterMaterial = new THREE.SpriteMaterial({ map: monsterTexture });
const monster = new THREE.Sprite(monsterMaterial);
monster.scale.set(5, 5, 1);
monster.position.set(0, -100, 0); // Hidden at start
scene.add(monster);

// Player movement controls
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

// Jump scare function
function triggerJumpScare() {
    const jumpscareSound = document.getElementById("jumpscareSound");
    jumpscareSound.play();
    monster.position.set(camera.position.x, camera.position.y, camera.position.z - 2);
    setTimeout(() => {
        monster.position.set(0, -100, 0); // Hide monster after scare
    }, 1500);
}

// Random jump scares
setInterval(() => {
    if (Math.random() < 0.2) { // 20% chance every few seconds
        triggerJumpScare();
    }
}, 5000);

// Escape mechanic
let hasKey = false;
const keyGeometry = new THREE.BoxGeometry(1, 1, 1);
const keyMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const key = new THREE.Mesh(keyGeometry, keyMaterial);
key.position.set(-15, 1, -10);
scene.add(key);

// Collision detection
function checkCollisions() {
    const distanceToKey = camera.position.distanceTo(key.position);
    if (distanceToKey < 2) {
        hasKey = true;
        scene.remove(key);
        alert("You found the key! Now find the exit!");
    }

    const distanceToDoor = camera.position.distanceTo(door.position);
    if (distanceToDoor < 3 && hasKey) {
        alert("You escaped! Game Over.");
        window.location.reload();
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Movement logic
    const speed = 0.1;
    if (controls.forward) camera.position.z -= speed;
    if (controls.backward) camera.position.z += speed;
    if (controls.left) camera.position.x -= speed;
    if (controls.right) camera.position.x += speed;

    checkCollisions();
    renderer.render(scene, camera);
}

animate();
